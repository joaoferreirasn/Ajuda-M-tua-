import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-LKfT49jh.mjs";
import { C as settingInt, D as validateUsername, E as uniquePublicId, T as uniqueInviteCode, a as authMiddleware, b as recordRate, c as expireStaleAssignments, d as getSettings, f as hoursAgoIso, g as mapProfile, h as logHistory, i as assertUsable, l as getProfile, n as applyCredits, o as bumpReputation, p as loadHelpTask, r as asInt, s as countSince, t as ACTION_LABELS, u as getQueueInfo, v as normalizeLink, w as toIso, x as reputationMeta, y as pickNextHelpee } from "./core-nF0T3C3G.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fns-B_WCcH9X.js
async function authEmail(userId) {
	return (await (await getSql()).query(`select email, name from "user" where id = $1 limit 1`, [userId]))[0] ?? {
		email: null,
		name: null
	};
}
var getMyState_createServerFn_handler = createServerRpc({
	id: "91edf9b018c68c7f7d7f62ba38d2e32e19c988f021e5c951db7a9f35b4dcbce5",
	name: "getMyState",
	filename: "src/lib/app/fns.ts"
}, (opts) => getMyState.__executeServer(opts));
var getMyState = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyState_createServerFn_handler, async ({ context }) => {
	const settings = await getSettings();
	const profile = await getProfile(context.userId);
	if (profile) {
		const sql = await getSql();
		await sql`update profiles set last_active_at = now() where user_id = ${context.userId}`;
		if (profile.status === "suspended" && profile.blockedUntil) {
			const until = new Date(profile.blockedUntil).getTime();
			if (Number.isFinite(until) && until < Date.now()) await sql`update profiles set status = 'active', blocked_until = null, block_reason = null where user_id = ${context.userId}`;
		}
	}
	const fresh = profile ? await getProfile(context.userId) : null;
	const queue = fresh ? await getQueueInfo(context.userId, settings) : null;
	const sql = await getSql();
	let openHelp = null;
	if (fresh) {
		await expireStaleAssignments(settings);
		const open = await sql`
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
		disclaimer: settings.disclaimer || "Aviso: O Ajuda Mútua apenas organiza a participação e a ajuda entre usuários. O aplicativo não garante prêmios, dinheiro, ganhos financeiros ou resultados em promoções externas.",
		settings: {
			cycleSize: settingInt(settings, "cycle_size", 10),
			welcomeCredits: settingInt(settings, "welcome_credits", 3)
		}
	};
});
var completeOnboarding_createServerFn_handler = createServerRpc({
	id: "5526a52d9df4e9950fdb8fa3c23291e08fd8e69af5307f5954b62898e023ae4d",
	name: "completeOnboarding",
	filename: "src/lib/app/fns.ts"
}, (opts) => completeOnboarding.__executeServer(opts));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	username: String(input?.username ?? ""),
	inviteCode: String(input?.inviteCode ?? "").trim().toUpperCase()
})).handler(completeOnboarding_createServerFn_handler, async ({ context, data }) => {
	const existing = await getProfile(context.userId);
	if (existing) return existing;
	const username = validateUsername(data.username);
	const sql = await getSql();
	const taken = await sql`select count(*)::int as n from profiles where lower(username) = ${username.toLowerCase()}`;
	if (asInt(taken[0]?.n) > 0) throw new Error("Este nome de usuário já está em uso.");
	const settings = await getSettings();
	const welcome = Math.max(0, settingInt(settings, "welcome_credits", 3));
	const identity = await authEmail(context.userId);
	const publicId = await uniquePublicId();
	const inviteCode = await uniqueInviteCode();
	let referredBy = null;
	if (data.inviteCode) {
		referredBy = (await sql`
        select user_id from profiles
        where upper(invite_code) = ${data.inviteCode} and user_id <> ${context.userId}
        limit 1
      `)[0]?.user_id ?? null;
		if (data.inviteCode && !referredBy) throw new Error("Código de convite inválido.");
	}
	const admins = await sql`select count(*)::int as n from profiles where is_admin = true`;
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
		if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) throw new Error("Nome de usuário ou identificador já existe. Tente outro.");
		throw err;
	}
	if (welcome > 0) await sql`
        insert into credit_transactions (user_id, amount, balance_after, kind, reason)
        values (${context.userId}, ${welcome}, ${welcome}, 'welcome', 'Créditos iniciais de boas-vindas')
      `;
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
var saveMyLink_createServerFn_handler = createServerRpc({
	id: "0a396c6e8f15abd6ed4774cc0fe57e730cc2a6f5df04c7632791f37bdbb040f7",
	name: "saveMyLink",
	filename: "src/lib/app/fns.ts"
}, (opts) => saveMyLink.__executeServer(opts));
var saveMyLink = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	link: String(input?.link ?? ""),
	description: String(input?.description ?? "").trim().slice(0, 120)
})).handler(saveMyLink_createServerFn_handler, async ({ context, data }) => {
	const profile = await getProfile(context.userId);
	if (!profile) throw new Error("Conclua o cadastro do perfil primeiro.");
	await assertUsable(profile);
	const settings = await getSettings();
	const max = settingInt(settings, "max_link_updates_per_day", 4);
	if (await countSince(context.userId, "link_update", await hoursAgoIso(24)) >= max) throw new Error("Limite de alterações de link atingido por hoje.");
	const link = normalizeLink(data.link);
	const sql = await getSql();
	const dup = await sql`
      select count(*)::int as n from profiles
      where link = ${link} and user_id <> ${context.userId}
    `;
	if (asInt(dup[0]?.n) > 0) throw new Error("Este link já está cadastrado em outra conta.");
	profile.link ? profile.queueJoinedAt : (/* @__PURE__ */ new Date()).toISOString();
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
	return getProfile(context.userId);
});
var assignHelp_createServerFn_handler = createServerRpc({
	id: "59393bde347da2c9cf9451efc9201295cb96039b6fed1d536e13fa4a8a343c3a",
	name: "assignHelp",
	filename: "src/lib/app/fns.ts"
}, (opts) => assignHelp.__executeServer(opts));
var assignHelp = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(assignHelp_createServerFn_handler, async ({ context }) => {
	const profile = await getProfile(context.userId);
	if (!profile) throw new Error("Conclua o cadastro do perfil primeiro.");
	await assertUsable(profile);
	const settings = await getSettings();
	await expireStaleAssignments(settings);
	const sql = await getSql();
	const open = await sql`
      select id from helps
      where helper_user_id = ${context.userId} and status in ('assigned', 'opened')
      order by assigned_at desc limit 1
    `;
	if (open[0]) return {
		task: await loadHelpTask(asInt(open[0].id)),
		resumed: true
	};
	const max = settingInt(settings, "max_helps_per_hour", 8);
	if (await countSince(context.userId, "help_assign", await hoursAgoIso(1)) >= max) throw new Error("Você atingiu o limite de ajudas por hora. Tente novamente em instantes.");
	const next = await pickNextHelpee(context.userId);
	if (!next?.link) return {
		task: null,
		resumed: false
	};
	try {
		const inserted = await sql`
        insert into helps (helper_user_id, helped_user_id, link, status)
        values (${context.userId}, ${next.user_id}, ${next.link}, 'assigned')
        returning id
      `;
		const id = asInt(inserted[0]?.id);
		await recordRate(context.userId, "help_assign");
		await logHistory(context.userId, "help_assigned", `Ajudar ${next.username} (${next.public_id})`);
		return {
			task: await loadHelpTask(id),
			resumed: false
		};
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) throw new Error("Não foi possível atribuir esta pessoa. Tente novamente.");
		throw err;
	}
});
var markHelpOpened_createServerFn_handler = createServerRpc({
	id: "bf87d7cf130e1872c945d2035e1bb5459e419222912f3551b298829fcc2eafc8",
	name: "markHelpOpened",
	filename: "src/lib/app/fns.ts"
}, (opts) => markHelpOpened.__executeServer(opts));
var markHelpOpened = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ helpId: asInt(input?.helpId) })).handler(markHelpOpened_createServerFn_handler, async ({ context, data }) => {
	if (!data.helpId) throw new Error("Tarefa inválida.");
	if (!(await (await getSql())`
      update helps
      set status = 'opened', opened_at = coalesce(opened_at, now())
      where id = ${data.helpId}
        and helper_user_id = ${context.userId}
        and status in ('assigned', 'opened')
      returning id
    `)[0]) throw new Error("Tarefa não encontrada ou já encerrada.");
	await logHistory(context.userId, "help_opened", `Tarefa #${data.helpId}`);
	return loadHelpTask(data.helpId);
});
var completeHelp_createServerFn_handler = createServerRpc({
	id: "ef493f23f3ac0cef086f2ff4c4d1f02ec9e1b89df3454793bd7a8e8d6df9fa94",
	name: "completeHelp",
	filename: "src/lib/app/fns.ts"
}, (opts) => completeHelp.__executeServer(opts));
var completeHelp = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ helpId: asInt(input?.helpId) })).handler(completeHelp_createServerFn_handler, async ({ context, data }) => {
	if (!data.helpId) throw new Error("Tarefa inválida.");
	const profile = await getProfile(context.userId);
	if (!profile) throw new Error("Perfil não encontrado.");
	await assertUsable(profile);
	const settings = await getSettings();
	const sql = await getSql();
	const row = (await sql`
      select id, helped_user_id, assigned_at, opened_at, status
      from helps
      where id = ${data.helpId} and helper_user_id = ${context.userId}
      limit 1
    `)[0];
	if (!row) throw new Error("Tarefa não encontrada.");
	if (row.status === "completed") throw new Error("Esta ajuda já foi concluída.");
	if (row.status !== "assigned" && row.status !== "opened") throw new Error("Esta tarefa não pode ser concluída.");
	if (!row.opened_at) throw new Error("Abra o link antes de confirmar a ajuda.");
	const assignedAt = toIso(row.opened_at) ?? toIso(row.assigned_at);
	const elapsed = assignedAt ? (Date.now() - new Date(assignedAt).getTime()) / 1e3 : 999;
	const minSeconds = settingInt(settings, "min_help_seconds", 8);
	const flagSeconds = settingInt(settings, "fast_complete_flag_seconds", 8);
	if (elapsed < minSeconds) throw new Error(`Aguarde alguns segundos após abrir o link para confirmar a ajuda.`);
	if (!(await sql`
      update helps
      set status = 'completed',
          opened_at = coalesce(opened_at, now()),
          completed_at = now()
      where id = ${data.helpId}
        and helper_user_id = ${context.userId}
        and status in ('assigned', 'opened')
      returning id
    `)[0]) throw new Error("Não foi possível concluir a ajuda.");
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
	if (reward > 0) await applyCredits({
		userId: context.userId,
		amount: reward,
		kind: "help_given",
		reason: "Ajuda concluída",
		relatedHelpId: data.helpId
	});
	await bumpReputation(context.userId, elapsed < flagSeconds + 1 ? Math.max(0, rep - 1) : rep);
	const helped = await getProfile(row.helped_user_id);
	if (helped && helped.status === "active") {
		await sql`
        update profiles
        set helps_received = helps_received + 1,
            last_helped_at = now()
        where user_id = ${row.helped_user_id}
      `;
		if (cost > 0 && helped.creditsBalance >= cost) await applyCredits({
			userId: row.helped_user_id,
			amount: -cost,
			kind: "help_received",
			reason: "Ajuda recebida na fila",
			relatedHelpId: data.helpId
		});
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
	const pendingInvite = await sql`
      select id, inviter_user_id from invites
      where invitee_user_id = ${context.userId} and status = 'pending'
      limit 1
    `;
	if (pendingInvite[0]) {
		const bonus = settingInt(settings, "referral_bonus_credits", 2);
		const bonusRep = settingInt(settings, "referral_bonus_reputation", 5);
		await sql`update invites set status = 'rewarded', rewarded_at = now() where id = ${pendingInvite[0].id}`;
		if (bonus > 0) await applyCredits({
			userId: pendingInvite[0].inviter_user_id,
			amount: bonus,
			kind: "referral",
			reason: `Indicação: ${profile.username} participou`
		});
		await bumpReputation(pendingInvite[0].inviter_user_id, bonusRep);
		await logHistory(pendingInvite[0].inviter_user_id, "invite_rewarded", profile.username);
	}
	return {
		profile: await getProfile(context.userId),
		queue: await getQueueInfo(context.userId, settings)
	};
});
var listMyCredits_createServerFn_handler = createServerRpc({
	id: "ef5b8b4acad556a1c6e05d9b5973a0b4dcfdeec52135b152b7bb12208a0d88a8",
	name: "listMyCredits",
	filename: "src/lib/app/fns.ts"
}, (opts) => listMyCredits.__executeServer(opts));
var listMyCredits = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyCredits_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, amount, balance_after, kind, reason, created_at
      from credit_transactions
      where user_id = ${context.userId}
      order by created_at desc
      limit 80
    `).map((row) => ({
		id: asInt(row.id),
		amount: asInt(row.amount),
		balanceAfter: asInt(row.balance_after),
		kind: row.kind,
		reason: row.reason,
		createdAt: toIso(row.created_at) ?? ""
	}));
});
var listMyHistory_createServerFn_handler = createServerRpc({
	id: "7bb98c4db633b590258ed76d9e9df674d25f10a174c6c750db37322db611b6f8",
	name: "listMyHistory",
	filename: "src/lib/app/fns.ts"
}, (opts) => listMyHistory.__executeServer(opts));
var listMyHistory = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyHistory_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, action, details, created_at
      from history_events
      where user_id = ${context.userId}
      order by created_at desc
      limit 100
    `).map((row) => ({
		id: asInt(row.id),
		action: ACTION_LABELS[row.action] ?? row.action,
		details: row.details,
		createdAt: toIso(row.created_at) ?? ""
	}));
});
var getRanking_createServerFn_handler = createServerRpc({
	id: "a8b2ce507d7c315ea3df25a2996fe11dad2af98f41d6241b8dff032dab0cf45b",
	name: "getRanking",
	filename: "src/lib/app/fns.ts"
}, (opts) => getRanking.__executeServer(opts));
var getRanking = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getRanking_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select username, public_id, helps_given, reputation, user_id
      from profiles
      where is_seed = false and status in ('active', 'suspicious')
      order by helps_given desc, reputation desc, created_at asc
      limit 50
    `).map((row, index) => ({
		position: index + 1,
		username: row.username,
		publicId: row.public_id,
		helpsGiven: asInt(row.helps_given),
		reputation: asInt(row.reputation),
		reputationLevel: reputationMeta(asInt(row.reputation)).level,
		isMe: row.user_id === context.userId
	}));
});
var getQueueBoard_createServerFn_handler = createServerRpc({
	id: "54adb7db33ad6b9b65edef71b96e597ecc5751083421f828f088801c74030a7e",
	name: "getQueueBoard",
	filename: "src/lib/app/fns.ts"
}, (opts) => getQueueBoard.__executeServer(opts));
var getQueueBoard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getQueueBoard_createServerFn_handler, async ({ context }) => {
	const settings = await getSettings();
	return {
		mine: await getQueueInfo(context.userId, settings),
		participants: (await (await getSql())`
      select * from profiles
      where status = 'active' and link is not null and credits_balance > 0
      order by helps_received asc, coalesce(last_helped_at, to_timestamp(0)) asc, coalesce(queue_joined_at, created_at) asc
      limit 40
    `).map((row, index) => {
			const p = mapProfile(row);
			return {
				position: index + 1,
				username: p.isSeed ? "Participante da comunidade" : p.username,
				publicId: p.publicId,
				helpsReceived: p.helpsReceived,
				helpsGiven: p.helpsGiven,
				isMe: p.userId === context.userId,
				isSeed: p.isSeed
			};
		})
	};
});
var getInviteInfo_createServerFn_handler = createServerRpc({
	id: "877c693c56f118404de11a756ea42d1cd3f343556206fe9f34de006b7db9739f",
	name: "getInviteInfo",
	filename: "src/lib/app/fns.ts"
}, (opts) => getInviteInfo.__executeServer(opts));
var getInviteInfo = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getInviteInfo_createServerFn_handler, async ({ context }) => {
	const profile = await getProfile(context.userId);
	if (!profile) throw new Error("Perfil não encontrado.");
	const rows = await (await getSql())`
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
			rewardedAt: toIso(row.rewarded_at)
		}))
	};
});
var createReport_createServerFn_handler = createServerRpc({
	id: "33c7f1f7d68df851d5a2c50eb790571bbff20ce96d3026aa284ebe14148a696c",
	name: "createReport",
	filename: "src/lib/app/fns.ts"
}, (opts) => createReport.__executeServer(opts));
var createReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	reportedPublicId: String(input?.reportedPublicId ?? "").trim(),
	reportedUserId: String(input?.reportedUserId ?? "").trim(),
	reason: String(input?.reason ?? "").trim(),
	description: String(input?.description ?? "").trim().slice(0, 500)
})).handler(createReport_createServerFn_handler, async ({ context, data }) => {
	if (![
		"spam",
		"fraude",
		"link_invalido",
		"abuso",
		"irregular",
		"outro"
	].includes(data.reason)) throw new Error("Selecione um motivo válido.");
	const profile = await getProfile(context.userId);
	if (!profile) throw new Error("Perfil não encontrado.");
	await assertUsable(profile);
	const settings = await getSettings();
	const max = settingInt(settings, "max_reports_per_day", 3);
	if (await countSince(context.userId, "report", await hoursAgoIso(24)) >= max) throw new Error("Limite de denúncias por dia atingido.");
	const sql = await getSql();
	const targetRows = data.reportedUserId ? await sql`select * from profiles where user_id = ${data.reportedUserId} limit 1` : await sql`select * from profiles where public_id = ${data.reportedPublicId} or username = ${data.reportedPublicId} limit 1`;
	const target = targetRows[0] ? mapProfile(targetRows[0]) : null;
	if (!target) throw new Error("Usuário não encontrado.");
	if (target.userId === context.userId) throw new Error("Você não pode denunciar a si mesmo.");
	const open = await sql`
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
var createSupportTicket_createServerFn_handler = createServerRpc({
	id: "aa4b2ca717a8666e2f23ce82b2de4b2fc012df017c0618308839060bcd44b7c8",
	name: "createSupportTicket",
	filename: "src/lib/app/fns.ts"
}, (opts) => createSupportTicket.__executeServer(opts));
var createSupportTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	subject: String(input?.subject ?? "").trim().slice(0, 80),
	message: String(input?.message ?? "").trim().slice(0, 1e3)
})).handler(createSupportTicket_createServerFn_handler, async ({ context, data }) => {
	if (data.subject.length < 3 || data.message.length < 8) throw new Error("Descreva o assunto e a mensagem com um pouco mais de detalhe.");
	await (await getSql())`
      insert into support_tickets (user_id, subject, message)
      values (${context.userId}, ${data.subject}, ${data.message})
    `;
	await logHistory(context.userId, "support", data.subject);
	return { ok: true };
});
var logClientSession_createServerFn_handler = createServerRpc({
	id: "c016cfadff5a07b9dfb3f39be01e233795e605476ef9d5df8a9fa271743ea9ee",
	name: "logClientSession",
	filename: "src/lib/app/fns.ts"
}, (opts) => logClientSession.__executeServer(opts));
var logClientSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ userAgent: String(input?.userAgent ?? "").slice(0, 180) })).handler(logClientSession_createServerFn_handler, async ({ context, data }) => {
	if (await countSince(context.userId, "session", await hoursAgoIso(1)) > 8) return { ok: true };
	await (await getSql())`insert into session_logs (user_id, user_agent) values (${context.userId}, ${data.userAgent || null})`;
	await recordRate(context.userId, "session");
	return { ok: true };
});
//#endregion
export { assignHelp_createServerFn_handler, completeHelp_createServerFn_handler, completeOnboarding_createServerFn_handler, createReport_createServerFn_handler, createSupportTicket_createServerFn_handler, getInviteInfo_createServerFn_handler, getMyState_createServerFn_handler, getQueueBoard_createServerFn_handler, getRanking_createServerFn_handler, listMyCredits_createServerFn_handler, listMyHistory_createServerFn_handler, logClientSession_createServerFn_handler, markHelpOpened_createServerFn_handler, saveMyLink_createServerFn_handler };
