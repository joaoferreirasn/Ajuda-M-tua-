import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-LKfT49jh.mjs";
import { S as requireAdmin, _ as maybeAutoBlock, a as authMiddleware, d as getSettings, g as mapProfile, h as logHistory, l as getProfile, m as logAdmin, n as applyCredits, o as bumpReputation, r as asInt, w as toIso } from "./core-nF0T3C3G.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-fns-ByWw324X.js
var getAdminStats_createServerFn_handler = createServerRpc({
	id: "46a02e6b7b523392b4192bd89501a44df55a08e3128231ac4792baf9fb8cbdac",
	name: "getAdminStats",
	filename: "src/lib/app/admin-fns.ts"
}, (opts) => getAdminStats.__executeServer(opts));
var getAdminStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminStats_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const one = async (q) => {
		const rows = await sql.query(q);
		return asInt(rows[0]?.n);
	};
	return {
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
		openTickets: await one(`select count(*)::int as n from support_tickets where status = 'open'`)
	};
});
var searchAdminUsers_createServerFn_handler = createServerRpc({
	id: "fddec399236440f04bf717de3f1591a19585f9de5345bb70c1d2f9e6cb5dd4ee",
	name: "searchAdminUsers",
	filename: "src/lib/app/admin-fns.ts"
}, (opts) => searchAdminUsers.__executeServer(opts));
var searchAdminUsers = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ q: String(input?.q ?? "").trim() })).handler(searchAdminUsers_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const term = data.q ? `%${data.q.replace(/[%_]/g, "")}%` : "%";
	return (await sql`
      select * from profiles
      where is_seed = false
        and (
          username ilike ${term}
          or public_id ilike ${term}
          or coalesce(email, '') ilike ${term}
        )
      order by created_at desc
      limit 60
    `).map(mapProfile);
});
var getAdminUser_createServerFn_handler = createServerRpc({
	id: "2eba7db0452c9770f2b18d81afac2624fff3816439f0361b62014e4fb634046e",
	name: "getAdminUser",
	filename: "src/lib/app/admin-fns.ts"
}, (opts) => getAdminUser.__executeServer(opts));
var getAdminUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ userId: String(input?.userId ?? "") })).handler(getAdminUser_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const profile = await getProfile(data.userId);
	if (!profile) throw new Error("Usuário não encontrado.");
	const sql = await getSql();
	const history = await sql`
      select id, action, details, created_at from history_events
      where user_id = ${data.userId} order by created_at desc limit 40
    `;
	const txs = await sql`
      select id, amount, reason, created_at from credit_transactions
      where user_id = ${data.userId} order by created_at desc limit 40
    `;
	const reports = await sql`
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
			createdAt: toIso(row.created_at) ?? ""
		})),
		transactions: txs.map((row) => ({
			id: asInt(row.id),
			amount: asInt(row.amount),
			reason: row.reason,
			createdAt: toIso(row.created_at) ?? ""
		})),
		reports: reports.map((row) => ({
			id: asInt(row.id),
			reason: row.reason,
			status: row.status,
			createdAt: toIso(row.created_at) ?? ""
		}))
	};
});
var adminSetStatus_createServerFn_handler = createServerRpc({
	id: "c2dc40dadcb4fe936d8bf17b7dee5f403984ff2e8aa7b6efc789f6c5ca2f6d78",
	name: "adminSetStatus",
	filename: "src/lib/app/admin-fns.ts"
}, (opts) => adminSetStatus.__executeServer(opts));
var adminSetStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	userId: String(input?.userId ?? ""),
	status: String(input?.status ?? ""),
	reason: String(input?.reason ?? "").trim().slice(0, 240)
})).handler(adminSetStatus_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	if (data.userId === context.userId) throw new Error("Você não pode alterar o próprio status por aqui.");
	if (![
		"active",
		"suspicious",
		"suspended",
		"blocked"
	].includes(data.status)) throw new Error("Status inválido.");
	if (!data.reason) throw new Error("Informe o motivo.");
	const sql = await getSql();
	const until = data.status === "suspended" ? new Date(Date.now() + 6048e5).toISOString() : null;
	await sql`
      update profiles
      set status = ${data.status},
          block_reason = ${data.status === "active" ? null : data.reason},
          blocked_until = ${until}
      where user_id = ${data.userId}
    `;
	if (data.status === "blocked" || data.status === "suspended") await sql`
        insert into blocks (user_id, kind, reason, admin_user_id, ends_at)
        values (${data.userId}, ${data.status}, ${data.reason}, ${context.userId}, ${until})
      `;
	await logHistory(data.userId, data.status === "active" ? "unblock" : data.status === "suspended" ? "suspend" : "block", data.reason);
	await logAdmin(context.userId, "set_status", data.userId, `${data.status}: ${data.reason}`);
	return getProfile(data.userId);
});
var adminAdjustCredits_createServerFn_handler = createServerRpc({
	id: "283c1af89b805464838670a3e71f84d3bc2330f4b885b3dd549a6acd65da93be",
	name: "adminAdjustCredits",
	filename: "src/lib/app/admin-fns.ts"
}, (opts) => adminAdjustCredits.__executeServer(opts));
var adminAdjustCredits = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	userId: String(input?.userId ?? ""),
	amount: asInt(input?.amount),
	reason: String(input?.reason ?? "").trim().slice(0, 240)
})).handler(adminAdjustCredits_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	if (!data.amount) throw new Error("Informe um valor diferente de zero.");
	if (!data.reason) throw new Error("Informe o motivo da correção.");
	const profile = await applyCredits({
		userId: data.userId,
		amount: data.amount,
		kind: "admin_adjust",
		reason: data.reason,
		adminUserId: context.userId
	});
	await logHistory(data.userId, "credit_admin", `${data.amount} — ${data.reason}`);
	await logAdmin(context.userId, "adjust_credits", data.userId, `${data.amount} ${data.reason}`);
	return profile;
});
var listAdminReports_createServerFn_handler = createServerRpc({
	id: "45e205366cfae1a249b47a22f868e65b1975d4317902409c412dfaba4c327beb",
	name: "listAdminReports",
	filename: "src/lib/app/admin-fns.ts"
}, (opts) => listAdminReports.__executeServer(opts));
var listAdminReports = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAdminReports_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await (await getSql())`
      select r.*, a.username as reporter_name, b.username as reported_name
      from reports r
      join profiles a on a.user_id = r.reporter_user_id
      join profiles b on b.user_id = r.reported_user_id
      order by
        case r.status when 'pending' then 0 when 'reviewing' then 1 else 2 end,
        r.created_at desc
      limit 80
    `).map((row) => ({
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
		reviewedAt: toIso(row.reviewed_at)
	}));
});
var reviewReport_createServerFn_handler = createServerRpc({
	id: "c7c0324dbec250d095f1cbfa95b6a2d40997b8aff432669ab54ebe88fa1564bb",
	name: "reviewReport",
	filename: "src/lib/app/admin-fns.ts"
}, (opts) => reviewReport.__executeServer(opts));
var reviewReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	reportId: asInt(input?.reportId),
	status: String(input?.status ?? ""),
	note: String(input?.note ?? "").trim().slice(0, 400),
	suspend: Boolean(input?.suspend)
})).handler(reviewReport_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	if (![
		"reviewing",
		"confirmed",
		"rejected"
	].includes(data.status)) throw new Error("Status de denúncia inválido.");
	const sql = await getSql();
	const current = await sql`
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
		if (data.suspend) await sql`
          update profiles
          set status = 'suspended',
              block_reason = ${data.note || "Suspensão após denúncia confirmada"},
              blocked_until = now() + interval '7 days'
          where user_id = ${current[0].reported_user_id}
        `;
	}
	if (data.status === "rejected") await logHistory(current[0].reporter_user_id, "report_review", "Denúncia rejeitada");
	await logAdmin(context.userId, "review_report", current[0].reported_user_id, `${data.status} #${data.reportId}`);
	return { ok: true };
});
var listAdminQueue_createServerFn_handler = createServerRpc({
	id: "5a88cdad8325bdb94ae2c23112d475b19df5a02aada87b13040c1979b5a1d4e3",
	name: "listAdminQueue",
	filename: "src/lib/app/admin-fns.ts"
}, (opts) => listAdminQueue.__executeServer(opts));
var listAdminQueue = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAdminQueue_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await (await getSql())`
      select * from profiles
      where link is not null
      order by
        case status when 'active' then 0 when 'suspicious' then 1 else 2 end,
        helps_received asc,
        coalesce(queue_joined_at, created_at) asc
      limit 80
    `).map((row, index) => {
		const p = mapProfile(row);
		return {
			position: index + 1,
			...p
		};
	});
});
var getAdminSettings_createServerFn_handler = createServerRpc({
	id: "1949d5251fa6d69833bbe81dd773dc8eda17d4a18b902cec9e215c7b2254b247",
	name: "getAdminSettings",
	filename: "src/lib/app/admin-fns.ts"
}, (opts) => getAdminSettings.__executeServer(opts));
var getAdminSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminSettings_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return getSettings();
});
var saveAdminSettings_createServerFn_handler = createServerRpc({
	id: "7d7fc1f010f68818574a255d8f159275b3b399e22ace443171d1c62857770efd",
	name: "saveAdminSettings",
	filename: "src/lib/app/admin-fns.ts"
}, (opts) => saveAdminSettings.__executeServer(opts));
var saveAdminSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ entries: input?.entries ?? {} })).handler(saveAdminSettings_createServerFn_handler, async ({ context, data }) => {
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
		"disclaimer"
	];
	for (const [key, value] of Object.entries(data.entries)) {
		if (!allowed.includes(key)) continue;
		await sql`
        insert into app_settings (key, value, updated_at) values (${key}, ${String(value ?? "").slice(0, 600)}, now())
        on conflict (key) do update set value = excluded.value, updated_at = now()
      `;
	}
	await logAdmin(context.userId, "update_settings", null, Object.keys(data.entries).join(","));
	return getSettings();
});
var listSupportTickets_createServerFn_handler = createServerRpc({
	id: "4b578211c315ff74495fbde5e2319b7b18028fbe2f22271253aa8a0f2321dac6",
	name: "listSupportTickets",
	filename: "src/lib/app/admin-fns.ts"
}, (opts) => listSupportTickets.__executeServer(opts));
var listSupportTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSupportTickets_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await (await getSql())`
      select t.*, p.username
      from support_tickets t
      join profiles p on p.user_id = t.user_id
      order by t.created_at desc
      limit 50
    `).map((row) => ({
		id: asInt(row.id),
		userId: row.user_id,
		username: row.username,
		subject: row.subject,
		message: row.message,
		status: row.status,
		createdAt: toIso(row.created_at) ?? ""
	}));
});
var listAdminLogs_createServerFn_handler = createServerRpc({
	id: "05f7dafb8edd540023cf9ad21e68afe0300e406a2062a25caaa4a4ef903971fb",
	name: "listAdminLogs",
	filename: "src/lib/app/admin-fns.ts"
}, (opts) => listAdminLogs.__executeServer(opts));
var listAdminLogs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAdminLogs_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await (await getSql())`
      select * from admin_logs order by created_at desc limit 40
    `).map((row) => ({
		id: asInt(row.id),
		adminUserId: row.admin_user_id,
		action: row.action,
		targetUserId: row.target_user_id,
		details: row.details,
		createdAt: toIso(row.created_at) ?? ""
	}));
});
//#endregion
export { adminAdjustCredits_createServerFn_handler, adminSetStatus_createServerFn_handler, getAdminSettings_createServerFn_handler, getAdminStats_createServerFn_handler, getAdminUser_createServerFn_handler, listAdminLogs_createServerFn_handler, listAdminQueue_createServerFn_handler, listAdminReports_createServerFn_handler, listSupportTickets_createServerFn_handler, reviewReport_createServerFn_handler, saveAdminSettings_createServerFn_handler, searchAdminUsers_createServerFn_handler };
