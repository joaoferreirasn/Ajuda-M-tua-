import { n as createMiddleware } from "./ssr.mjs";
import { r as getSql } from "./db-LKfT49jh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/core-nF0T3C3G.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-B40BzJxt.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server--tAsF0AV.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function randomCode(len) {
	let out = "";
	for (let i = 0; i < len; i += 1) out += ALPHA[Math.floor(Math.random() * 32)];
	return out;
}
function toIso(value) {
	if (value == null || value === "") return null;
	if (value instanceof Date) return value.toISOString();
	const s = String(value);
	const d = new Date(s);
	if (!Number.isNaN(d.getTime()) && /[TZ:-]/.test(s)) return d.toISOString();
	return s;
}
function asInt(value, fallback = 0) {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? Math.trunc(n) : fallback;
}
function asBool(value) {
	return value === true || value === "t" || value === "true" || value === 1 || value === "1";
}
function reputationMeta(score) {
	if (score >= 80) return {
		level: "Excelente",
		key: "excellent"
	};
	if (score >= 60) return {
		level: "Boa",
		key: "good"
	};
	if (score >= 40) return {
		level: "Regular",
		key: "ok"
	};
	if (score >= 20) return {
		level: "Baixa",
		key: "low"
	};
	return {
		level: "Crítica",
		key: "critical"
	};
}
function mapProfile(row) {
	const reputation = asInt(row.reputation, 50);
	const meta = reputationMeta(reputation);
	return {
		userId: row.user_id,
		username: row.username,
		publicId: row.public_id,
		email: row.email,
		inviteCode: row.invite_code,
		referredByUserId: row.referred_by_user_id,
		reputation,
		reputationLevel: meta.level,
		reputationKey: meta.key,
		creditsBalance: asInt(row.credits_balance),
		creditsEarned: asInt(row.credits_earned),
		creditsSpent: asInt(row.credits_spent),
		helpsGiven: asInt(row.helps_given),
		helpsReceived: asInt(row.helps_received),
		link: row.link,
		linkDescription: row.link_description,
		status: row.status,
		isAdmin: asBool(row.is_admin),
		isSeed: asBool(row.is_seed),
		queueJoinedAt: toIso(row.queue_joined_at),
		lastHelpedAt: toIso(row.last_helped_at),
		lastHelpGivenAt: toIso(row.last_help_given_at),
		blockedUntil: toIso(row.blocked_until),
		blockReason: row.block_reason,
		createdAt: toIso(row.created_at) ?? (/* @__PURE__ */ new Date()).toISOString(),
		lastActiveAt: toIso(row.last_active_at) ?? (/* @__PURE__ */ new Date()).toISOString()
	};
}
async function getSettings() {
	const rows = await (await getSql())`select key, value from app_settings`;
	const map = {};
	for (const row of rows) map[row.key] = row.value;
	return map;
}
function settingInt(settings, key, fallback) {
	return asInt(settings[key], fallback);
}
async function getProfile(userId) {
	const rows = await (await getSql())`select * from profiles where user_id = ${userId} limit 1`;
	return rows[0] ? mapProfile(rows[0]) : null;
}
async function logHistory(userId, action, details) {
	await (await getSql())`insert into history_events (user_id, action, details) values (${userId}, ${action}, ${details ?? null})`;
}
async function logAdmin(adminUserId, action, targetUserId, details) {
	await (await getSql())`insert into admin_logs (admin_user_id, action, target_user_id, details) values (${adminUserId}, ${action}, ${targetUserId ?? null}, ${details ?? null})`;
}
async function countSince(userId, action, sinceIso) {
	return asInt((await (await getSql())`
    select count(*)::int as n from rate_events
    where user_id = ${userId} and action = ${action} and created_at >= ${sinceIso}::timestamptz
  `)[0]?.n);
}
async function recordRate(userId, action) {
	await (await getSql())`insert into rate_events (user_id, action) values (${userId}, ${action})`;
}
async function hoursAgoIso(hours) {
	return (/* @__PURE__ */ new Date(Date.now() - hours * 36e5)).toISOString();
}
async function uniquePublicId() {
	const sql = await getSql();
	for (let i = 0; i < 12; i += 1) {
		const id = `AM-${randomCode(6)}`;
		if (asInt((await sql`select count(*)::int as n from profiles where public_id = ${id}`)[0]?.n) === 0) return id;
	}
	return `AM-${randomCode(8)}`;
}
async function uniqueInviteCode() {
	const sql = await getSql();
	for (let i = 0; i < 12; i += 1) {
		const code = randomCode(8);
		if (asInt((await sql`select count(*)::int as n from profiles where invite_code = ${code}`)[0]?.n) === 0) return code;
	}
	return randomCode(10);
}
function validateUsername(raw) {
	const username = raw.trim();
	if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) throw new Error("Use 3 a 24 caracteres: letras, números ou _.");
	return username;
}
function normalizeLink(raw) {
	const trimmed = raw.trim();
	let url;
	try {
		url = new URL(trimmed);
	} catch {
		throw new Error("Informe um link válido, começando com https://");
	}
	if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("O link precisa usar http ou https.");
	if (!url.hostname || url.hostname === "localhost" || url.hostname.endsWith(".local")) throw new Error("Este link não pode ser cadastrado.");
	url.hash = "";
	url.username = "";
	url.password = "";
	let href = url.toString();
	if (href.endsWith("/") && url.pathname === "/") href = href.slice(0, -1);
	if (href.length > 1800) throw new Error("Link longo demais.");
	return href;
}
async function getQueueInfo(userId, settings) {
	const sql = await getSql();
	const cycle = Math.max(1, settingInt(settings, "cycle_size", 10));
	const me = await getProfile(userId);
	if (!me) return {
		position: null,
		eligibleCount: 0,
		helpsNeeded: cycle,
		helpsRemaining: cycle,
		inQueue: false
	};
	const eligible = await sql`
    select user_id from profiles
    where status = 'active'
      and link is not null
      and credits_balance > 0
    order by helps_received asc, coalesce(last_helped_at, to_timestamp(0)) asc, coalesce(queue_joined_at, created_at) asc
  `;
	const index = eligible.findIndex((row) => row.user_id === userId);
	const receivedInCycle = me.helpsReceived % cycle;
	return {
		position: index >= 0 ? index + 1 : null,
		eligibleCount: eligible.length,
		helpsNeeded: cycle,
		helpsRemaining: Math.max(0, cycle - receivedInCycle),
		inQueue: index >= 0
	};
}
async function applyCredits(params) {
	if (params.amount === 0) return getProfile(params.userId);
	const sql = await getSql();
	const current = await getProfile(params.userId);
	if (!current) throw new Error("Perfil não encontrado.");
	const next = current.creditsBalance + params.amount;
	if (next < 0) throw new Error("Saldo insuficiente. O saldo não pode ficar negativo.");
	await sql`
    update profiles
    set credits_balance = ${next},
        credits_earned = ${params.amount > 0 ? current.creditsEarned + params.amount : current.creditsEarned},
        credits_spent = ${params.amount < 0 ? current.creditsSpent + Math.abs(params.amount) : current.creditsSpent},
        last_active_at = now()
    where user_id = ${params.userId}
  `;
	await sql`
    insert into credit_transactions (user_id, amount, balance_after, kind, reason, related_help_id, admin_user_id)
    values (${params.userId}, ${params.amount}, ${next}, ${params.kind}, ${params.reason}, ${params.relatedHelpId ?? null}, ${params.adminUserId ?? null})
  `;
	return getProfile(params.userId);
}
async function bumpReputation(userId, delta) {
	await (await getSql())`
    update profiles
    set reputation = greatest(0, least(100, reputation + ${delta}))
    where user_id = ${userId}
  `;
}
async function assertUsable(profile, opts) {
	if (profile.status === "blocked") throw new Error(profile.blockReason || "Esta conta está bloqueada.");
	if (profile.status === "suspended") throw new Error(profile.blockReason || "Esta conta está suspensa temporariamente.");
	if (opts?.needLink && !profile.link) throw new Error("Cadastre seu link antes de continuar.");
}
async function expireStaleAssignments(settings) {
	const sql = await getSql();
	const minutes = Math.max(5, settingInt(settings, "assignment_ttl_minutes", 30));
	await sql`
    update helps
    set status = 'expired'
    where status in ('assigned', 'opened')
      and assigned_at < now() - (${String(minutes)} || ' minutes')::interval
  `;
}
async function pickNextHelpee(helperId) {
	return (await (await getSql())`
    select p.* from profiles p
    where p.status = 'active'
      and p.link is not null
      and p.credits_balance > 0
      and p.user_id <> ${helperId}
      and not exists (
        select 1 from helps h
        where h.helper_user_id = ${helperId} and h.helped_user_id = p.user_id
      )
    order by
      case when p.is_seed then 1 else 0 end,
      p.helps_received asc,
      coalesce(p.last_helped_at, to_timestamp(0)) asc,
      coalesce(p.queue_joined_at, p.created_at) asc
    limit 1
  `)[0] ?? null;
}
async function loadHelpTask(helpId) {
	const row = (await (await getSql())`
    select h.id, h.helper_user_id, h.helped_user_id, h.link, h.status, h.assigned_at, h.opened_at,
           p.username, p.public_id, p.helps_received, p.status as pstatus
    from helps h
    join profiles p on p.user_id = h.helped_user_id
    where h.id = ${helpId}
    limit 1
  `)[0];
	if (!row) return null;
	return {
		id: asInt(row.id),
		helperUserId: row.helper_user_id,
		helpedUserId: row.helped_user_id,
		helpedUsername: row.username,
		helpedPublicId: row.public_id,
		helpedHelpsReceived: asInt(row.helps_received),
		helpedStatus: row.pstatus,
		link: row.link,
		status: row.status,
		assignedAt: toIso(row.assigned_at) ?? (/* @__PURE__ */ new Date()).toISOString(),
		openedAt: toIso(row.opened_at)
	};
}
async function requireAdmin(userId) {
	const profile = await getProfile(userId);
	if (!profile?.isAdmin) throw new Error("Acesso administrativo negado.");
	return profile;
}
async function maybeAutoBlock(userId, settings) {
	const sql = await getSql();
	const threshold = Math.max(1, settingInt(settings, "auto_block_confirmed_reports", 3));
	if (asInt((await sql`
    select count(*)::int as n from reports
    where reported_user_id = ${userId} and status = 'confirmed'
  `)[0]?.n) >= threshold) {
		await sql`
      update profiles
      set status = 'blocked',
          block_reason = 'Bloqueio automático após denúncias confirmadas.',
          blocked_until = null
      where user_id = ${userId} and status <> 'blocked'
    `;
		await sql`
      insert into blocks (user_id, kind, reason)
      values (${userId}, 'auto', 'Denúncias confirmadas acima do limite')
    `;
		await logHistory(userId, "block", "Bloqueio automático por denúncias confirmadas");
	}
}
var ACTION_LABELS = {
	signup: "Conta criada",
	login: "Sessão iniciada",
	link_update: "Link atualizado",
	help_assigned: "Tarefa de ajuda recebida",
	help_opened: "Link aberto",
	help_completed: "Ajuda concluída",
	help_received: "Ajuda recebida",
	credit_earn: "Créditos ganhos",
	credit_spend: "Créditos utilizados",
	credit_admin: "Ajuste administrativo de créditos",
	invite_joined: "Entrou com convite",
	invite_rewarded: "Bônus de indicação liberado",
	report_created: "Denúncia enviada",
	report_review: "Denúncia analisada",
	block: "Conta bloqueada",
	unblock: "Conta desbloqueada",
	suspend: "Conta suspensa",
	profile_update: "Perfil atualizado",
	support: "Pedido de suporte",
	suspicious: "Comportamento marcado como suspeito"
};
//#endregion
export { settingInt as C, validateUsername as D, uniquePublicId as E, requireAdmin as S, uniqueInviteCode as T, maybeAutoBlock as _, authMiddleware as a, recordRate as b, expireStaleAssignments as c, getSettings as d, hoursAgoIso as f, mapProfile as g, logHistory as h, assertUsable as i, getProfile as l, logAdmin as m, applyCredits as n, bumpReputation as o, loadHelpTask as p, asInt as r, countSince as s, ACTION_LABELS as t, getQueueInfo as u, normalizeLink as v, toIso as w, reputationMeta as x, pickNextHelpee as y };
