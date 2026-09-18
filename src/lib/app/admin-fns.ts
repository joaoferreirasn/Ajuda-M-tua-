import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  applyCredits,
  asInt,
  bumpReputation,
  getProfile,
  getSettings,
  logAdmin,
  logHistory,
  mapProfile,
  maybeAutoBlock,
  requireAdmin,
  settingInt,
  toIso,
  type ProfileRow,
} from "./core";
import type { AdminStats, ReportRow } from "./types";

async function getSql() {
  const mod = await import("@/lib/db");
  return mod.getSql();
}

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const one = async (q: string) => {
      const rows = await sql.query<{ n: number }>(q);
      return asInt(rows[0]?.n);
    };
    const stats: AdminStats = {
      totalUsers: await one(`select count(*)::int as n from profiles where is_seed = false`),
      activeUsers: await one(`select count(*)::int as n from profiles where status = 'active' and is_seed = false`),
      blockedUsers: await one(`select count(*)::int as n from profiles where status in ('blocked', 'suspended')`),
      newUsers: await one(`select count(*)::int as n from profiles where is_seed = false and created_at >= now() - interval '7 days'`),
      links: await one(`select count(*)::int as n from profiles where link is not null and is_seed = false`),
      helpsDone: await one(`select count(*)::int as n from helps where status = 'completed'`),
      helpsReceived: await one(`select coalesce(sum(helps_received),0)::int as n from profiles`),
      creditsMoved: await one(`select coalesce(sum(abs(amount)),0)::int as n from credit_transactions`),
      pendingReports: await one(`select count(*)::int as n from reports where status in ('pending', 'reviewing')`),
      suspiciousUsers: await one(`select count(*)::int as n from profiles where status = 'suspicious'`),
      openTickets: await one(`select count(*)::int as n from support_tickets where status = 'open'`),
    };
    return stats;
  });

export const searchAdminUsers = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { q?: string }) => ({ q: String(input?.q ?? "").trim() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const term = data.q ? `%${data.q.replace(/[%_]/g, "")}%` : "%";
    const rows = await sql<ProfileRow>`
      select * from profiles
      where is_seed = false
        and (
          username ilike ${term}
          or public_id ilike ${term}
          or coalesce(email, '') ilike ${term}
        )
      order by created_at desc
      limit 60
    `;
    return rows.map(mapProfile);
  });

export const getAdminUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string }) => ({ userId: String(input?.userId ?? "") }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const profile = await getProfile(data.userId);
    if (!profile) throw new Error("Usuário não encontrado.");
    const sql = await getSql();
    const history = await sql<{ id: number; action: string; details: string | null; created_at: unknown }>`
      select id, action, details, created_at from history_events
      where user_id = ${data.userId} order by created_at desc limit 40
    `;
    const txs = await sql<{ id: number; amount: number; reason: string; created_at: unknown }>`
      select id, amount, reason, created_at from credit_transactions
      where user_id = ${data.userId} order by created_at desc limit 40
    `;
    const reports = await sql<{ id: number; reason: string; status: string; created_at: unknown }>`
      select id, reason, status, created_at from reports
      where reported_user_id = ${data.userId} or reporter_user_id = ${data.userId}
      order by created_at desc limit 20
    `;
    return {
      profile,
      history: history.map((row) => ({
        id: asInt(row.id),
        action: row.action,
        details: row.details,
        createdAt: toIso(row.created_at) ?? "",
      })),
      transactions: txs.map((row) => ({
        id: asInt(row.id),
        amount: asInt(row.amount),
        reason: row.reason,
        createdAt: toIso(row.created_at) ?? "",
      })),
      reports: reports.map((row) => ({
        id: asInt(row.id),
        reason: row.reason,
        status: row.status,
        createdAt: toIso(row.created_at) ?? "",
      })),
    };
  });

export const adminSetStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; status: string; reason: string }) => ({
    userId: String(input?.userId ?? ""),
    status: String(input?.status ?? ""),
    reason: String(input?.reason ?? "").trim().slice(0, 240),
  }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    if (data.userId === context.userId) throw new Error("Você não pode alterar o próprio status por aqui.");
    const allowed = ["active", "suspicious", "suspended", "blocked"];
    if (!allowed.includes(data.status)) throw new Error("Status inválido.");
    if (!data.reason) throw new Error("Informe o motivo.");
    const sql = await getSql();
    const until = data.status === "suspended" ? new Date(Date.now() + 7 * 86400_000).toISOString() : null;
    await sql`
      update profiles
      set status = ${data.status},
          block_reason = ${data.status === "active" ? null : data.reason},
          blocked_until = ${until}
      where user_id = ${data.userId}
    `;
    if (data.status === "blocked" || data.status === "suspended") {
      await sql`
        insert into blocks (user_id, kind, reason, admin_user_id, ends_at)
        values (${data.userId}, ${data.status}, ${data.reason}, ${context.userId}, ${until})
      `;
    }
    await logHistory(data.userId, data.status === "active" ? "unblock" : data.status === "suspended" ? "suspend" : "block", data.reason);
    await logAdmin(context.userId, "set_status", data.userId, `${data.status}: ${data.reason}`);
    return getProfile(data.userId);
  });

export const adminAdjustCredits = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; amount: number; reason: string }) => ({
    userId: String(input?.userId ?? ""),
    amount: asInt(input?.amount),
    reason: String(input?.reason ?? "").trim().slice(0, 240),
  }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    if (!data.amount) throw new Error("Informe um valor diferente de zero.");
    if (!data.reason) throw new Error("Informe o motivo da correção.");
    const profile = await applyCredits({
      userId: data.userId,
      amount: data.amount,
      kind: "admin_adjust",
      reason: data.reason,
      adminUserId: context.userId,
    });
    await logHistory(data.userId, "credit_admin", `${data.amount} — ${data.reason}`);
    await logAdmin(context.userId, "adjust_credits", data.userId, `${data.amount} ${data.reason}`);
    return profile;
  });

export const listAdminReports = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      reporter_user_id: string;
      reported_user_id: string;
      reason: string;
      description: string | null;
      status: ReportRow["status"];
      admin_note: string | null;
      created_at: unknown;
      reviewed_at: unknown;
      reporter_name: string;
      reported_name: string;
    }>`
      select r.*, a.username as reporter_name, b.username as reported_name
      from reports r
      join profiles a on a.user_id = r.reporter_user_id
      join profiles b on b.user_id = r.reported_user_id
      order by
        case r.status when 'pending' then 0 when 'reviewing' then 1 else 2 end,
        r.created_at desc
      limit 80
    `;
    return rows.map((row) => ({
      id: asInt(row.id),
      reporterUserId: row.reporter_user_id,
      reporterUsername: row.reporter_name,
      reportedUserId: row.reported_user_id,
      reportedUsername: row.reported_name,
      reason: row.reason,
      description: row.description,
      status: row.status,
      adminNote: row.admin_note,
      createdAt: toIso(row.created_at) ?? "",
      reviewedAt: toIso(row.reviewed_at),
    })) satisfies ReportRow[];
  });

export const reviewReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { reportId: number; status: string; note: string; suspend?: boolean }) => ({
    reportId: asInt(input?.reportId),
    status: String(input?.status ?? ""),
    note: String(input?.note ?? "").trim().slice(0, 400),
    suspend: Boolean(input?.suspend),
  }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    if (!["reviewing", "confirmed", "rejected"].includes(data.status)) {
      throw new Error("Status de denúncia inválido.");
    }
    const sql = await getSql();
    const current = await sql<{ reported_user_id: string; reporter_user_id: string }>`
      select reported_user_id, reporter_user_id from reports where id = ${data.reportId} limit 1
    `;
    if (!current[0]) throw new Error("Denúncia não encontrada.");
    await sql`
      update reports
      set status = ${data.status},
          admin_note = ${data.note || null},
          reviewed_by = ${context.userId},
          reviewed_at = now()
      where id = ${data.reportId}
    `;
    if (data.status === "confirmed") {
      await bumpReputation(current[0].reported_user_id, -10);
      await logHistory(current[0].reported_user_id, "report_review", "Denúncia confirmada");
      const settings = await getSettings();
      await maybeAutoBlock(current[0].reported_user_id, settings);
      if (data.suspend) {
        await sql`
          update profiles
          set status = 'suspended',
              block_reason = ${data.note || "Suspensão após denúncia confirmada"},
              blocked_until = now() + interval '7 days'
          where user_id = ${current[0].reported_user_id}
        `;
      }
    }
    if (data.status === "rejected") {
      await logHistory(current[0].reporter_user_id, "report_review", "Denúncia rejeitada");
    }
    await logAdmin(context.userId, "review_report", current[0].reported_user_id, `${data.status} #${data.reportId}`);
    return { ok: true };
  });

export const listAdminQueue = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<ProfileRow>`
      select * from profiles
      where link is not null
      order by
        case status when 'active' then 0 when 'suspicious' then 1 else 2 end,
        helps_received asc,
        coalesce(queue_joined_at, created_at) asc
      limit 80
    `;
    return rows.map((row, index) => {
      const p = mapProfile(row);
      return {
        position: index + 1,
        ...p,
      };
    });
  });

export const getAdminSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    return getSettings();
  });

export const saveAdminSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { entries: Record<string, string> }) => ({
    entries: input?.entries ?? {},
  }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const allowed = [
      "welcome_credits",
      "help_credit_reward",
      "receive_credit_cost",
      "referral_bonus_credits",
      "referral_bonus_reputation",
      "help_reputation_delta",
      "cycle_size",
      "max_helps_per_hour",
      "min_help_seconds",
      "max_reports_per_day",
      "max_link_updates_per_day",
      "assignment_ttl_minutes",
      "auto_block_confirmed_reports",
      "fast_complete_flag_seconds",
      "disclaimer",
    ];
    for (const [key, value] of Object.entries(data.entries)) {
      if (!allowed.includes(key)) continue;
      const v = String(value ?? "").slice(0, 600);
      await sql`
        insert into app_settings (key, value, updated_at) values (${key}, ${v}, now())
        on conflict (key) do update set value = excluded.value, updated_at = now()
      `;
    }
    await logAdmin(context.userId, "update_settings", null, Object.keys(data.entries).join(","));
    return getSettings();
  });

export const listSupportTickets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      user_id: string;
      subject: string;
      message: string;
      status: string;
      created_at: unknown;
      username: string;
    }>`
      select t.*, p.username
      from support_tickets t
      join profiles p on p.user_id = t.user_id
      order by t.created_at desc
      limit 50
    `;
    return rows.map((row) => ({
      id: asInt(row.id),
      userId: row.user_id,
      username: row.username,
      subject: row.subject,
      message: row.message,
      status: row.status,
      createdAt: toIso(row.created_at) ?? "",
    }));
  });

export const listAdminLogs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      admin_user_id: string;
      action: string;
      target_user_id: string | null;
      details: string | null;
      created_at: unknown;
    }>`
      select * from admin_logs order by created_at desc limit 40
    `;
    return rows.map((row) => ({
      id: asInt(row.id),
      adminUserId: row.admin_user_id,
      action: row.action,
      targetUserId: row.target_user_id,
      details: row.details,
      createdAt: toIso(row.created_at) ?? "",
    }));
  });
