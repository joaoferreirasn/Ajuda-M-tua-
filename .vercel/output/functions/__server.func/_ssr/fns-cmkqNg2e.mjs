import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { a as authMiddleware, r as asInt } from "./core-nF0T3C3G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fns-cmkqNg2e.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getMyState = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("91edf9b018c68c7f7d7f62ba38d2e32e19c988f021e5c951db7a9f35b4dcbce5"));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	username: String(input?.username ?? ""),
	inviteCode: String(input?.inviteCode ?? "").trim().toUpperCase()
})).handler(createSsrRpc("5526a52d9df4e9950fdb8fa3c23291e08fd8e69af5307f5954b62898e023ae4d"));
var saveMyLink = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	link: String(input?.link ?? ""),
	description: String(input?.description ?? "").trim().slice(0, 120)
})).handler(createSsrRpc("0a396c6e8f15abd6ed4774cc0fe57e730cc2a6f5df04c7632791f37bdbb040f7"));
var assignHelp = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("59393bde347da2c9cf9451efc9201295cb96039b6fed1d536e13fa4a8a343c3a"));
var markHelpOpened = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ helpId: asInt(input?.helpId) })).handler(createSsrRpc("bf87d7cf130e1872c945d2035e1bb5459e419222912f3551b298829fcc2eafc8"));
var completeHelp = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ helpId: asInt(input?.helpId) })).handler(createSsrRpc("ef493f23f3ac0cef086f2ff4c4d1f02ec9e1b89df3454793bd7a8e8d6df9fa94"));
var listMyCredits = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ef5b8b4acad556a1c6e05d9b5973a0b4dcfdeec52135b152b7bb12208a0d88a8"));
var listMyHistory = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7bb98c4db633b590258ed76d9e9df674d25f10a174c6c750db37322db611b6f8"));
var getRanking = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a8b2ce507d7c315ea3df25a2996fe11dad2af98f41d6241b8dff032dab0cf45b"));
var getQueueBoard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("54adb7db33ad6b9b65edef71b96e597ecc5751083421f828f088801c74030a7e"));
var getInviteInfo = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("877c693c56f118404de11a756ea42d1cd3f343556206fe9f34de006b7db9739f"));
var createReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	reportedPublicId: String(input?.reportedPublicId ?? "").trim(),
	reportedUserId: String(input?.reportedUserId ?? "").trim(),
	reason: String(input?.reason ?? "").trim(),
	description: String(input?.description ?? "").trim().slice(0, 500)
})).handler(createSsrRpc("33c7f1f7d68df851d5a2c50eb790571bbff20ce96d3026aa284ebe14148a696c"));
var createSupportTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	subject: String(input?.subject ?? "").trim().slice(0, 80),
	message: String(input?.message ?? "").trim().slice(0, 1e3)
})).handler(createSsrRpc("aa4b2ca717a8666e2f23ce82b2de4b2fc012df017c0618308839060bcd44b7c8"));
var logClientSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ userAgent: String(input?.userAgent ?? "").slice(0, 180) })).handler(createSsrRpc("c016cfadff5a07b9dfb3f39be01e233795e605476ef9d5df8a9fa271743ea9ee"));
//#endregion
export { createSsrRpc as a, getMyState as c, listMyCredits as d, listMyHistory as f, saveMyLink as h, createReport as i, getQueueBoard as l, markHelpOpened as m, completeHelp as n, createSupportTicket as o, logClientSession as p, completeOnboarding as r, getInviteInfo as s, assignHelp as t, getRanking as u };
