import { C as require_jsx_runtime, b as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as authMiddleware, r as asInt } from "./core-nF0T3C3G.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
import { S as ArrowLeft } from "../_libs/lucide-react.mjs";
import { a as LoadingScreen, o as LogoMark } from "./shell-DDxVqRsT.mjs";
import { a as createSsrRpc } from "./fns-cmkqNg2e.mjs";
import { n as useAppState } from "./app-guard-BJqWm43j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-fns-CMSCE7JO.js
var import_jsx_runtime = require_jsx_runtime();
function WordmarkMini() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-semibold",
			children: "Admin"
		})]
	});
}
var LINKS = [
	{
		to: "/admin",
		label: "Visão geral"
	},
	{
		to: "/admin/usuarios",
		label: "Usuários"
	},
	{
		to: "/admin/creditos",
		label: "Créditos"
	},
	{
		to: "/admin/fila",
		label: "Fila"
	},
	{
		to: "/admin/denuncias",
		label: "Denúncias"
	},
	{
		to: "/admin/configuracoes",
		label: "Configurações"
	}
];
function AdminGuard({ children, title }) {
	const { user, isPending, state, ready } = useAppState();
	if (isPending || user && !ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingScreen, { label: "Abrindo painel" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!state?.profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	if (!state.profile.isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-medium",
					children: "Área restrita"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Somente administradores acessam este painel."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app",
					className: "inline-block text-sm font-medium text-primary",
					children: "Voltar ao aplicativo"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-border/70 bg-surface/90 px-4 py-3 backdrop-blur",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-5xl items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordmarkMini, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/app",
					className: "flex items-center gap-1 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "App"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mx-auto mt-2 flex max-w-5xl gap-1 overflow-x-auto pb-1",
				children: LINKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					className: "shrink-0 rounded-full px-3 py-1.5 text-sm text-muted hover:bg-fg/5 hover:text-fg",
					activeProps: { className: "shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary" },
					children: item.label
				}, item.to))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-5xl px-4 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-5 text-2xl font-semibold tracking-tight",
				children: title
			}), children]
		})]
	});
}
var getAdminStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("46a02e6b7b523392b4192bd89501a44df55a08e3128231ac4792baf9fb8cbdac"));
var searchAdminUsers = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ q: String(input?.q ?? "").trim() })).handler(createSsrRpc("fddec399236440f04bf717de3f1591a19585f9de5345bb70c1d2f9e6cb5dd4ee"));
var getAdminUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ userId: String(input?.userId ?? "") })).handler(createSsrRpc("2eba7db0452c9770f2b18d81afac2624fff3816439f0361b62014e4fb634046e"));
var adminSetStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	userId: String(input?.userId ?? ""),
	status: String(input?.status ?? ""),
	reason: String(input?.reason ?? "").trim().slice(0, 240)
})).handler(createSsrRpc("c2dc40dadcb4fe936d8bf17b7dee5f403984ff2e8aa7b6efc789f6c5ca2f6d78"));
var adminAdjustCredits = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	userId: String(input?.userId ?? ""),
	amount: asInt(input?.amount),
	reason: String(input?.reason ?? "").trim().slice(0, 240)
})).handler(createSsrRpc("283c1af89b805464838670a3e71f84d3bc2330f4b885b3dd549a6acd65da93be"));
var listAdminReports = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("45e205366cfae1a249b47a22f868e65b1975d4317902409c412dfaba4c327beb"));
var reviewReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	reportId: asInt(input?.reportId),
	status: String(input?.status ?? ""),
	note: String(input?.note ?? "").trim().slice(0, 400),
	suspend: Boolean(input?.suspend)
})).handler(createSsrRpc("c7c0324dbec250d095f1cbfa95b6a2d40997b8aff432669ab54ebe88fa1564bb"));
var listAdminQueue = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5a88cdad8325bdb94ae2c23112d475b19df5a02aada87b13040c1979b5a1d4e3"));
var getAdminSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1949d5251fa6d69833bbe81dd773dc8eda17d4a18b902cec9e215c7b2254b247"));
var saveAdminSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ entries: input?.entries ?? {} })).handler(createSsrRpc("7d7fc1f010f68818574a255d8f159275b3b399e22ace443171d1c62857770efd"));
var listSupportTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4b578211c315ff74495fbde5e2319b7b18028fbe2f22271253aa8a0f2321dac6"));
var listAdminLogs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("05f7dafb8edd540023cf9ad21e68afe0300e406a2062a25caaa4a4ef903971fb"));
//#endregion
export { getAdminStats as a, listAdminQueue as c, reviewReport as d, saveAdminSettings as f, getAdminSettings as i, listAdminReports as l, adminAdjustCredits as n, getAdminUser as o, searchAdminUsers as p, adminSetStatus as r, listAdminLogs as s, AdminGuard as t, listSupportTickets as u };
