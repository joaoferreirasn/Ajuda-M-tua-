import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  ACTION_LABELS,
  applyCredits,
  assertUsable,
  asInt,
  bumpReputation,
  countSince,
  DISCLAIMER,
  expireStaleAssignments,
  getProfile,
  getQueueInfo,
  getSettings,
  hoursAgoIso,
  loadHelpTask,
  logHistory,
  mapProfile,
  normalizeLink,
  pickNextHelpee,
  recordRate,
  reputationMeta,
  settingInt,
  toIso,
  uniqueInviteCode,
  uniquePublicId,
  validateUsername,
  type ProfileRow,
} from "./core";
import type {
  CreditTx,
  HelpTask,
  HistoryItem,
  Profile,
  QueueInfo,
  RankingRow,
} from "./types";

async function getSql() {
  const mod = await import("@/lib/db");
  return mod.getSql();
}

async function authEmail(userId: string) {
  const sql = await getSql();
  const rows = await sql.query<{ email: string | null; name: string | null }>(
    `select email, name from "user" where id = $1 limit 1`,
    [userId],
  );
  return rows[0] ?? { email: null, name: null };
}

export const getMyState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const settings = await getSettings();
    const profile = await getProfile(context.userId);
    if (profile) {
      const sql = await getSql();
      await sql`update profiles set last_active_at = now() where user_id = ${context.userId}`;
      if (profile.status === "suspended" && profile.blockedUntil) {
        const until = new Date(profile.blockedUntil).getTime();
        if (Number.isFinite(until) && until < Date.now()) {
          await sql`update profiles set status = 'active', blocked_until = null, block_reason = null where user_id = ${context.userId}`;
        }
      }
    }
    const fresh = profile ? await getProfile(context.userId) : null;
    const queue = fresh ? await getQueueInfo(context.userId, settings) : null;
    const sql = await getSql();
    let openHelp: HelpTask | null = null;
    if (fresh) {
      await expireStaleAssignments(settings);
      const open = await sql<{ id: number }>`
        select id from helps
        where helper_user_id = ${context.userId} and status in ('assigned', 'opened')
        order by assigned_at desc
        limit 1
      `;
      if (open[0]) openHelp = await loadHelpTask(asInt(open[0].id));
    }
    return {
      profile: fresh,
      queue,
      openHelp,
      disclaimer: settings.disclaimer || DISCLAIMER,
      settings: {
        cycleSize: settingInt(settings, "cycle_size", 10),
        welcomeCredits: settingInt(settings, "welcome_credits", 3),
      },
    };
  });

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { username: string; inviteCode?: string }) => ({
    username: String(input?.username ?? ""),
    inviteCode: String(input?.inviteCode ?? "").trim().toUpperCase(),
  }))
  .handler(async ({ context, data }) => {
    const existing = await getProfile(context.userId);
    if (existing) return existing;
    const username = validateUsername(data.username);
    const sql = await getSql();
    const taken = await sql<{ n: number }>`select count(*)::int as n from profiles where lower(username) = ${username.toLowerCase()}`;
    if (asInt(taken[0]?.n) > 0) throw new Error("Este nome de usuário já está em uso.");
    const settings = await getSettings();
    const welcome = Math.max(0, settingInt(settings, "welcome_credits", 3));
    const identity = await authEmail(context.userId);
    const publicId = await uniquePublicId();
    const inviteCode = await uniqueInviteCode();
    let referredBy: string | null = null;
    if (data.inviteCode) {
      const ref = await sql<{ user_id: string }>`
        select user_id from profiles
        where upper(invite_code) = ${data.inviteCode} and user_id <> ${context.userId}
        limit 1
      `;
      referredBy = ref[0]?.user_id ?? null;
      if (data.inviteCode && !referredBy) throw new Error("Código de convite inválido.");
    }
    const admins = await sql<{ n: number }>`select count(*)::int as n from profiles where is_admin = true`;
    const isAdmin = asInt(admins[0]?.n) === 0;
    try {
      await sql`
        insert into profiles (
          user_id, username, public_id, email, invite_code, referred_by_user_id,
          reputation, credits_balance, credits_earned, is_admin, status
        ) values (
          ${context.userId}, ${username}, ${publicId}, ${identity.email}, ${inviteCode}, ${referredBy},
          50, ${welcome}, ${welcome}, ${isAdmin}, 'active'
        )
      `;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
        throw new Error("Nome de usuário ou identificador já existe. Tente outro.");
      }
      throw err;
    }
    if (welcome > 0) {
      await sql`
        insert into credit_transactions (user_id, amount, balance_after, kind, reason)
        values (${context.userId}, ${welcome}, ${welcome}, 'welcome', 'Créditos iniciais de boas-vindas')
      `;
    }
    if (referredBy) {
      await sql`
        insert into invites (inviter_user_id, invitee_user_id, code, status)
        values (${referredBy}, ${context.userId}, ${data.inviteCode}, 'pending')
      `;
      await logHistory(referredBy, "invite_joined", `Novo convidado: ${username}`);
      await logHistory(context.userId, "invite_joined", `Usou o convite ${data.inviteCode}`);
    }
    await logHistory(context.userId, "signup", `Perfil criado (${publicId})`);
    await sql`insert into session_logs (user_id, user_agent) values (${context.userId}, ${"onboarding"})`;
    const created = await getProfile(context.userId);
    if (!created) throw new Error("Não foi possível criar o perfil.");
    return created;
  });

export const saveMyLink = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { link: string; description?: string }) => ({
    link: String(input?.link ?? ""),
    description: String(input?.description ?? "").trim().slice(0, 120),
  }))
  .handler(async ({ context, data }) => {
    const profile = await getProfile(context.userId);
    if (!profile) throw new Error("Conclua o cadastro do perfil primeiro.");
    await assertUsable(profile);
    const settings = await getSettings();
    const max = settingInt(settings, "max_link_updates_per_day", 4);
    const used = await countSince(context.userId, "link_update", await hoursAgoIso(24));
    if (used >= max) throw new Error("Limite de alterações de link atingido por hoje.");
    const link = normalizeLink(data.link);
    const sql = await getSql();
    const dup = await sql<{ n: number }>`
      select count(*)::int as n from profiles
      where link = ${link} and user_id <> ${context.userId}
    `;
    if (asInt(dup[0]?.n) > 0) {
      throw new Error("Este link já está cadastrado em outra conta.");
    }
    const join = profile.link ? profile.queueJoinedAt : new Date().toISOString();
    await sql`
      update profiles
      set link = ${link},
          link_description = ${data.description || null},
          link_updated_at = now(),
          queue_joined_at = coalesce(queue_joined_at, now()),
          last_active_at = now()
      where user_id = ${context.userId}
    `;
    await recordRate(context.userId, "link_update");
    await logHistory(context.userId, "link_update", link);
    void join;
    return getProfile(context.userId);
  });

export const assignHelp = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const profile = await getProfile(context.userId);
    if (!profile) throw new Error("Conclua o cadastro do perfil primeiro.");
    await assertUsable(profile);
    const settings = await getSettings();
    await expireStaleAssignments(settings);
    const sql = await getSql();
    const open = await sql<{ id: number }>`
      select id from helps
      where helper_user_id = ${context.userId} and status in ('assigned', 'opened')
      order by assigned_at desc limit 1
    `;
    if (open[0]) {
      const task = await loadHelpTask(asInt(open[0].id));
      return { task, resumed: true as const };
    }
    const max = settingInt(settings, "max_helps_per_hour", 8);
    const used = await countSince(context.userId, "help_assign", await hoursAgoIso(1));
    if (used >= max) {
      throw new Error("Você atingiu o limite de ajudas por hora. Tente novamente em instantes.");
    }
    const next = await pickNextHelpee(context.userId);
    if (!next?.link) {
      return { task: null, resumed: false as const };
    }
    try {
      const inserted = await sql<{ id: number }>`
        insert into helps (helper_user_id, helped_user_id, link, status)
        values (${context.userId}, ${next.user_id}, ${next.link}, 'assigned')
        returning id
      `;
      const id = asInt(inserted[0]?.id);
      await recordRate(context.userId, "help_assign");
      await logHistory(context.userId, "help_assigned", `Ajudar ${next.username} (${next.public_id})`);
      const task = await loadHelpTask(id);
      return { task, resumed: false as const };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
        throw new Error("Não foi possível atribuir esta pessoa. Tente novamente.");
      }
      throw err;
    }
  });

export const markHelpOpened = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { helpId: number }) => ({ helpId: asInt(input?.helpId) }))
  .handler(async ({ context, data }) => {
    if (!data.helpId) throw new Error("Tarefa inválida.");
    const sql = await getSql();
    const updated = await sql<{ id: number }>`
      update helps
      set status = 'opened', opened_at = coalesce(opened_at, now())
      where id = ${data.helpId}
        and helper_user_id = ${context.userId}
        and status in ('assigned', 'opened')
      returning id
    `;
    if (!updated[0]) throw new Error("Tarefa não encontrada ou já encerrada.");
    await logHistory(context.userId, "help_opened", `Tarefa #${data.helpId}`);
    return loadHelpTask(data.helpId);
  });

export const completeHelp = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { helpId: number }) => ({ helpId: asInt(input?.helpId) }))
  .handler(async ({ context, data }) => {
    if (!data.helpId) throw new Error("Tarefa inválida.");
    const profile = await getProfile(context.userId);
    if (!profile) throw new Error("Perfil não encontrado.");
    await assertUsable(profile);
    const settings = await getSettings();
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      helped_user_id: string;
      assigned_at: unknown;
      opened_at: unknown;
      status: string;
    }>`
      select id, helped_user_id, assigned_at, opened_at, status
      from helps
      where id = ${data.helpId} and helper_user_id = ${context.userId}
      limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("Tarefa não encontrada.");
    if (row.status === "completed") throw new Error("Esta ajuda já foi concluída.");
    if (row.status !== "assigned" && row.status !== "opened") {
      throw new Error("Esta tarefa não pode ser concluída.");
    }
    if (!row.opened_at) {
      throw new Error("Abra o link antes de confirmar a ajuda.");
    }
    const assignedAt = toIso(row.opened_at) ?? toIso(row.assigned_at);
    const elapsed = assignedAt ? (Date.now() - new Date(assignedAt).getTime()) / 1000 : 999;
    const minSeconds = settingInt(settings, "min_help_seconds", 8);
    const flagSeconds = settingInt(settings, "fast_complete_flag_seconds", 8);
    if (elapsed < minSeconds) {
      throw new Error(`Aguarde alguns segundos após abrir o link para confirmar a ajuda.`);
    }
    const done = await sql<{ id: number }>`
      update helps
      set status = 'completed',
          opened_at = coalesce(opened_at, now()),
          completed_at = now()
      where id = ${data.helpId}
        and helper_user_id = ${context.userId}
        and status in ('assigned', 'opened')
      returning id
    `;
    if (!done[0]) throw new Error("Não foi possível concluir a ajuda.");

    const reward = Math.max(0, settingInt(settings, "help_credit_reward", 1));
    const cost = Math.max(0, settingInt(settings, "receive_credit_cost", 1));
    const rep = settingInt(settings, "help_reputation_delta", 1);

    await sql`
      update profiles
      set helps_given = helps_given + 1,
          last_help_given_at = now(),
          last_active_at = now()
      where user_id = ${context.userId}
    `;
    if (reward > 0) {
      await applyCredits({
        userId: context.userId,
        amount: reward,
        kind: "help_given",
        reason: "Ajuda concluída",
        relatedHelpId: data.helpId,
      });
    }
    await bumpReputation(context.userId, elapsed < flagSeconds + 1 ? Math.max(0, rep - 1) : rep);

    const helped = await getProfile(row.helped_user_id);
    if (helped && helped.status === "active") {
      await sql`
        update profiles
        set helps_received = helps_received + 1,
            last_helped_at = now()
        where user_id = ${row.helped_user_id}
      `;
      if (cost > 0 && helped.creditsBalance >= cost) {
        await applyCredits({
          userId: row.helped_user_id,
          amount: -cost,
          kind: "help_received",
          reason: "Ajuda recebida na fila",
          relatedHelpId: data.helpId,
        });
      }
      await logHistory(row.helped_user_id, "help_received", `De ${profile.username}`);
    }

    await logHistory(context.userId, "help_completed", `Ajudou ${helped?.username ?? row.helped_user_id}`);
    await recordRate(context.userId, "help_complete");

    if (elapsed < flagSeconds) {
      await sql`
        update profiles set status = case when status = 'active' then 'suspicious' else status end
        where user_id = ${context.userId} and status = 'active'
      `;
      await logHistory(context.userId, "suspicious", "Confirmação muito rápida");
    }

    const pendingInvite = await sql<{ id: number; inviter_user_id: string }>`
      select id, inviter_user_id from invites
      where invitee_user_id = ${context.userId} and status = 'pending'
      limit 1
    `;
    if (pendingInvite[0]) {
      const bonus = settingInt(settings, "referral_bonus_credits", 2);
      const bonusRep = settingInt(settings, "referral_bonus_reputation", 5);
      await sql`update invites set status = 'rewarded', rewarded_at = now() where id = ${pendingInvite[0].id}`;
      if (bonus > 0) {
        await applyCredits({
          userId: pendingInvite[0].inviter_user_id,
          amount: bonus,
          kind: "referral",
          reason: `Indicação: ${profile.username} participou`,
        });
      }
      await bumpReputation(pendingInvite[0].inviter_user_id, bonusRep);
      await logHistory(pendingInvite[0].inviter_user_id, "invite_rewarded", profile.username);
    }

    const updated = await getProfile(context.userId);
    const queue = await getQueueInfo(context.userId, settings);
    return { profile: updated, queue };
  });

export const listMyCredits = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      amount: number;
      balance_after: number;
      kind: string;
      reason: string;
      created_at: unknown;
    }>`
      select id, amount, balance_after, kind, reason, created_at
      from credit_transactions
      where user_id = ${context.userId}
      order by created_at desc
      limit 80
    `;
    const items: CreditTx[] = rows.map((row) => ({
      id: asInt(row.id),
      amount: asInt(row.amount),
      balanceAfter: asInt(row.balance_after),
      kind: row.kind,
      reason: row.reason,
      createdAt: toIso(row.created_at) ?? "",
    }));
    return items;
  });

export const listMyHistory = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ id: number; action: string; details: string | null; created_at: unknown }>`
      select id, action, details, created_at
      from history_events
      where user_id = ${context.userId}
      order by created_at desc
      limit 100
    `;
    const items: HistoryItem[] = rows.map((row) => ({
      id: asInt(row.id),
      action: ACTION_LABELS[row.action] ?? row.action,
      details: row.details,
      createdAt: toIso(row.created_at) ?? "",
    }));
    return items;
  });

export const getRanking = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      username: string;
      public_id: string;
      helps_given: number;
      reputation: number;
      user_id: string;
    }>`
      select username, public_id, helps_given, reputation, user_id
      from profiles
      where is_seed = false and status in ('active', 'suspicious')
      order by helps_given desc, reputation desc, created_at asc
      limit 50
    `;
    const ranking: RankingRow[] = rows.map((row, index) => ({
      position: index + 1,
      username: row.username,
      publicId: row.public_id,
      helpsGiven: asInt(row.helps_given),
      reputation: asInt(row.reputation),
      reputationLevel: reputationMeta(asInt(row.reputation)).level,
      isMe: row.user_id === context.userId,
    }));
    return ranking;
  });

export const getQueueBoard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const settings = await getSettings();
    const mine = await getQueueInfo(context.userId, settings);
    const sql = await getSql();
    const rows = await sql<ProfileRow>`
      select * from profiles
      where status = 'active' and link is not null and credits_balance > 0
      order by helps_received asc, coalesce(last_helped_at, to_timestamp(0)) asc, coalesce(queue_joined_at, created_at) asc
      limit 40
    `;
    return {
      mine,
      participants: rows.map((row, index) => {
        const p = mapProfile(row);
        return {
          position: index + 1,
          username: p.isSeed ? "Participante da comunidade" : p.username,
          publicId: p.publicId,
          helpsReceived: p.helpsReceived,
          helpsGiven: p.helpsGiven,
          isMe: p.userId === context.userId,
          isSeed: p.isSeed,
        };
      }),
    };
  });

export const getInviteInfo = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const profile = await getProfile(context.userId);
    if (!profile) throw new Error("Perfil não encontrado.");
    const sql = await getSql();
    const rows = await sql<{
      username: string;
      public_id: string;
      status: string;
      created_at: unknown;
      rewarded_at: unknown;
    }>`
      select p.username, p.public_id, i.status, i.created_at, i.rewarded_at
      from invites i
      join profiles p on p.user_id = i.invitee_user_id
      where i.inviter_user_id = ${context.userId}
      order by i.created_at desc
    `;
    return {
      code: profile.inviteCode,
      publicId: profile.publicId,
      invited: rows.map((row) => ({
        username: row.username,
        publicId: row.public_id,
        status: row.status,
        createdAt: toIso(row.created_at) ?? "",
        rewardedAt: toIso(row.rewarded_at),
      })),
    };
  });

export const createReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { reportedPublicId?: string; reportedUserId?: string; reason: string; description?: string }) => ({
    reportedPublicId: String(input?.reportedPublicId ?? "").trim(),
    reportedUserId: String(input?.reportedUserId ?? "").trim(),
    reason: String(input?.reason ?? "").trim(),
    description: String(input?.description ?? "").trim().slice(0, 500),
  }))
  .handler(async ({ context, data }) => {
    const allowed = ["spam", "fraude", "link_invalido", "abuso", "irregular", "outro"];
    if (!allowed.includes(data.reason)) throw new Error("Selecione um motivo válido.");
    const profile = await getProfile(context.userId);
    if (!profile) throw new Error("Perfil não encontrado.");
    await assertUsable(profile);
    const settings = await getSettings();
    const max = settingInt(settings, "max_reports_per_day", 3);
    const used = await countSince(context.userId, "report", await hoursAgoIso(24));
    if (used >= max) throw new Error("Limite de denúncias por dia atingido.");
    const sql = await getSql();
    const targetRows = data.reportedUserId
      ? await sql<ProfileRow>`select * from profiles where user_id = ${data.reportedUserId} limit 1`
      : await sql<ProfileRow>`select * from profiles where public_id = ${data.reportedPublicId} or username = ${data.reportedPublicId} limit 1`;
    const target = targetRows[0] ? mapProfile(targetRows[0]) : null;
    if (!target) throw new Error("Usuário não encontrado.");
    if (target.userId === context.userId) throw new Error("Você não pode denunciar a si mesmo.");
    const open = await sql<{ n: number }>`
      select count(*)::int as n from reports
      where reporter_user_id = ${context.userId}
        and reported_user_id = ${target.userId}
        and status in ('pending', 'reviewing')
    `;
    if (asInt(open[0]?.n) > 0) throw new Error("Você já tem uma denúncia em andamento para esta conta.");
    await sql`
      insert into reports (reporter_user_id, reported_user_id, reason, description, status)
      values (${context.userId}, ${target.userId}, ${data.reason}, ${data.description || null}, 'pending')
    `;
    await recordRate(context.userId, "report");
    await logHistory(context.userId, "report_created", `${data.reason} → ${target.username}`);
    return { ok: true };
  });

export const createSupportTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { subject: string; message: string }) => ({
    subject: String(input?.subject ?? "").trim().slice(0, 80),
    message: String(input?.message ?? "").trim().slice(0, 1000),
  }))
  .handler(async ({ context, data }) => {
    if (data.subject.length < 3 || data.message.length < 8) {
      throw new Error("Descreva o assunto e a mensagem com um pouco mais de detalhe.");
    }
    const sql = await getSql();
    await sql`
      insert into support_tickets (user_id, subject, message)
      values (${context.userId}, ${data.subject}, ${data.message})
    `;
    await logHistory(context.userId, "support", data.subject);
    return { ok: true };
  });

export const logClientSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userAgent?: string }) => ({
    userAgent: String(input?.userAgent ?? "").slice(0, 180),
  }))
  .handler(async ({ context, data }) => {
    const recent = await countSince(context.userId, "session", await hoursAgoIso(1));
    if (recent > 8) return { ok: true };
    const sql = await getSql();
    await sql`insert into session_logs (user_id, user_agent) values (${context.userId}, ${data.userAgent || null})`;
    await recordRate(context.userId, "session");
    return { ok: true };
  });

export type MyState = {
  profile: Profile | null;
  queue: QueueInfo | null;
  openHelp: HelpTask | null;
  disclaimer: string;
  settings: { cycleSize: number; welcomeCredits: number };
};

export { DISCLAIMER, ACTION_LABELS };
