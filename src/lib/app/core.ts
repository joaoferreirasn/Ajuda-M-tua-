import type {
  AccountStatus,
  AppSettingsMap,
  HelpTask,
  Profile,
  QueueInfo,
  ReputationKey,
} from "./types";
import { DISCLAIMER } from "./copy";

export { DISCLAIMER };

async function getSql() {
  const mod = await import("@/lib/db");
  return mod.getSql();
}

const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function randomCode(len: number) {
  let out = "";
  for (let i = 0; i < len; i += 1) {
    out += ALPHA[Math.floor(Math.random() * ALPHA.length)];
  }
  return out;
}

export function toIso(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) return value.toISOString();
  const s = String(value);
  const d = new Date(s);
  if (!Number.isNaN(d.getTime()) && /[TZ:-]/.test(s)) return d.toISOString();
  return s;
}

export function asInt(value: unknown, fallback = 0) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export function asBool(value: unknown) {
  return value === true || value === "t" || value === "true" || value === 1 || value === "1";
}

export function reputationMeta(score: number): { level: string; key: ReputationKey } {
  if (score >= 80) return { level: "Excelente", key: "excellent" };
  if (score >= 60) return { level: "Boa", key: "good" };
  if (score >= 40) return { level: "Regular", key: "ok" };
  if (score >= 20) return { level: "Baixa", key: "low" };
  return { level: "Crítica", key: "critical" };
}

export type ProfileRow = {
  user_id: string;
  username: string;
  public_id: string;
  email: string | null;
  invite_code: string;
  referred_by_user_id: string | null;
  reputation: number;
  credits_balance: number;
  credits_earned: number;
  credits_spent: number;
  helps_given: number;
  helps_received: number;
  link: string | null;
  link_description: string | null;
  status: AccountStatus;
  is_admin: boolean;
  is_seed: boolean;
  queue_joined_at: unknown;
  last_helped_at: unknown;
  last_help_given_at: unknown;
  blocked_until: unknown;
  block_reason: string | null;
  created_at: unknown;
  last_active_at: unknown;
};

export function mapProfile(row: ProfileRow): Profile {
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
    createdAt: toIso(row.created_at) ?? new Date().toISOString(),
    lastActiveAt: toIso(row.last_active_at) ?? new Date().toISOString(),
  };
}

export async function getSettings(): Promise<AppSettingsMap> {
  const sql = await getSql();
  const rows = await sql<{ key: string; value: string }>`select key, value from app_settings`;
  const map: AppSettingsMap = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export function settingInt(settings: AppSettingsMap, key: string, fallback: number) {
  return asInt(settings[key], fallback);
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const sql = await getSql();
  const rows = await sql<ProfileRow>`select * from profiles where user_id = ${userId} limit 1`;
  return rows[0] ? mapProfile(rows[0]) : null;
}

export async function logHistory(userId: string, action: string, details?: string) {
  const sql = await getSql();
  await sql`insert into history_events (user_id, action, details) values (${userId}, ${action}, ${details ?? null})`;
}

export async function logAdmin(
  adminUserId: string,
  action: string,
  targetUserId?: string | null,
  details?: string,
) {
  const sql = await getSql();
  await sql`insert into admin_logs (admin_user_id, action, target_user_id, details) values (${adminUserId}, ${action}, ${targetUserId ?? null}, ${details ?? null})`;
}

export async function countSince(userId: string, action: string, sinceIso: string) {
  const sql = await getSql();
  const rows = await sql<{ n: number }>`
    select count(*)::int as n from rate_events
    where user_id = ${userId} and action = ${action} and created_at >= ${sinceIso}::timestamptz
  `;
  return asInt(rows[0]?.n);
}

export async function recordRate(userId: string, action: string) {
  const sql = await getSql();
  await sql`insert into rate_events (user_id, action) values (${userId}, ${action})`;
}

export async function hoursAgoIso(hours: number) {
  return new Date(Date.now() - hours * 3600_000).toISOString();
}

export async function uniquePublicId() {
  const sql = await getSql();
  for (let i = 0; i < 12; i += 1) {
    const id = `AM-${randomCode(6)}`;
    const rows = await sql<{ n: number }>`select count(*)::int as n from profiles where public_id = ${id}`;
    if (asInt(rows[0]?.n) === 0) return id;
  }
  return `AM-${randomCode(8)}`;
}

export async function uniqueInviteCode() {
  const sql = await getSql();
  for (let i = 0; i < 12; i += 1) {
    const code = randomCode(8);
    const rows = await sql<{ n: number }>`select count(*)::int as n from profiles where invite_code = ${code}`;
    if (asInt(rows[0]?.n) === 0) return code;
  }
  return randomCode(10);
}

export function validateUsername(raw: string) {
  const username = raw.trim();
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    throw new Error("Use 3 a 24 caracteres: letras, números ou _.");
  }
  return username;
}

export function normalizeLink(raw: string) {
  const trimmed = raw.trim();
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Informe um link válido, começando com https://");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("O link precisa usar http ou https.");
  }
  if (!url.hostname || url.hostname === "localhost" || url.hostname.endsWith(".local")) {
    throw new Error("Este link não pode ser cadastrado.");
  }
  url.hash = "";
  url.username = "";
  url.password = "";
  let href = url.toString();
  if (href.endsWith("/") && url.pathname === "/") href = href.slice(0, -1);
  if (href.length > 1800) throw new Error("Link longo demais.");
  return href;
}

export async function getQueueInfo(userId: string, settings: AppSettingsMap): Promise<QueueInfo> {
  const sql = await getSql();
  const cycle = Math.max(1, settingInt(settings, "cycle_size", 10));
  const me = await getProfile(userId);
  if (!me) {
    return { position: null, eligibleCount: 0, helpsNeeded: cycle, helpsRemaining: cycle, inQueue: false };
  }
  const eligible = await sql<{ user_id: string }>`
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
    inQueue: index >= 0,
  };
}

export async function applyCredits(params: {
  userId: string;
  amount: number;
  kind: string;
  reason: string;
  relatedHelpId?: number | null;
  adminUserId?: string | null;
}) {
  if (params.amount === 0) return getProfile(params.userId);
  const sql = await getSql();
  const current = await getProfile(params.userId);
  if (!current) throw new Error("Perfil não encontrado.");
  const next = current.creditsBalance + params.amount;
  if (next < 0) throw new Error("Saldo insuficiente. O saldo não pode ficar negativo.");
  const earned = params.amount > 0 ? current.creditsEarned + params.amount : current.creditsEarned;
  const spent = params.amount < 0 ? current.creditsSpent + Math.abs(params.amount) : current.creditsSpent;
  await sql`
    update profiles
    set credits_balance = ${next},
        credits_earned = ${earned},
        credits_spent = ${spent},
        last_active_at = now()
    where user_id = ${params.userId}
  `;
  await sql`
    insert into credit_transactions (user_id, amount, balance_after, kind, reason, related_help_id, admin_user_id)
    values (${params.userId}, ${params.amount}, ${next}, ${params.kind}, ${params.reason}, ${params.relatedHelpId ?? null}, ${params.adminUserId ?? null})
  `;
  return getProfile(params.userId);
}

export async function bumpReputation(userId: string, delta: number) {
  const sql = await getSql();
  await sql`
    update profiles
    set reputation = greatest(0, least(100, reputation + ${delta}))
    where user_id = ${userId}
  `;
}

export async function assertUsable(profile: Profile, opts?: { needLink?: boolean }) {
  if (profile.status === "blocked") {
    throw new Error(profile.blockReason || "Esta conta está bloqueada.");
  }
  if (profile.status === "suspended") {
    throw new Error(profile.blockReason || "Esta conta está suspensa temporariamente.");
  }
  if (opts?.needLink && !profile.link) {
    throw new Error("Cadastre seu link antes de continuar.");
  }
}

export async function expireStaleAssignments(settings: AppSettingsMap) {
  const sql = await getSql();
  const minutes = Math.max(5, settingInt(settings, "assignment_ttl_minutes", 30));
  await sql`
    update helps
    set status = 'expired'
    where status in ('assigned', 'opened')
      and assigned_at < now() - (${String(minutes)} || ' minutes')::interval
  `;
}

export async function pickNextHelpee(helperId: string): Promise<ProfileRow | null> {
  const sql = await getSql();
  const rows = await sql<ProfileRow>`
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
  `;
  return rows[0] ?? null;
}

export async function loadHelpTask(helpId: number): Promise<HelpTask | null> {
  const sql = await getSql();
  const rows = await sql<{
    id: number;
    helper_user_id: string;
    helped_user_id: string;
    link: string;
    status: HelpTask["status"];
    assigned_at: unknown;
    opened_at: unknown;
    username: string;
    public_id: string;
    helps_received: number;
    pstatus: AccountStatus;
  }>`
    select h.id, h.helper_user_id, h.helped_user_id, h.link, h.status, h.assigned_at, h.opened_at,
           p.username, p.public_id, p.helps_received, p.status as pstatus
    from helps h
    join profiles p on p.user_id = h.helped_user_id
    where h.id = ${helpId}
    limit 1
  `;
  const row = rows[0];
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
    assignedAt: toIso(row.assigned_at) ?? new Date().toISOString(),
    openedAt: toIso(row.opened_at),
  };
}

export async function requireAdmin(userId: string) {
  const profile = await getProfile(userId);
  if (!profile?.isAdmin) throw new Error("Acesso administrativo negado.");
  return profile;
}

export async function maybeAutoBlock(userId: string, settings: AppSettingsMap) {
  const sql = await getSql();
  const threshold = Math.max(1, settingInt(settings, "auto_block_confirmed_reports", 3));
  const rows = await sql<{ n: number }>`
    select count(*)::int as n from reports
    where reported_user_id = ${userId} and status = 'confirmed'
  `;
  if (asInt(rows[0]?.n) >= threshold) {
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

export const ACTION_LABELS: Record<string, string> = {
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
  suspicious: "Comportamento marcado como suspeito",
};
