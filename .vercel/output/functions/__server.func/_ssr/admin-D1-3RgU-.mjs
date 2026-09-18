import { o as __toESM } from "../_runtime.mjs";
import { r as formatWhen } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getAdminStats, s as listAdminLogs, t as AdminGuard, u as listSupportTickets } from "./admin-fns-CMSCE7JO.mjs";
import { n as Card } from "./card-DDBNLkNB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-D1-3RgU-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminHome() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, {
		title: "Painel administrativo",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDash, {})
	});
}
function AdminDash() {
	const [stats, setStats] = (0, import_react.useState)(null);
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [tickets, setTickets] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		getAdminStats().then(setStats).catch(() => setStats(null));
		listAdminLogs().then(setLogs).catch(() => setLogs([]));
		listSupportTickets().then(setTickets).catch(() => setTickets([]));
	}, []);
	const items = stats ? [
		["Usuários", stats.totalUsers],
		["Ativos", stats.activeUsers],
		["Bloqueados", stats.blockedUsers],
		["Novos (7d)", stats.newUsers],
		["Links", stats.links],
		["Ajudas feitas", stats.helpsDone],
		["Ajudas recebidas", stats.helpsReceived],
		["Créditos movidos", stats.creditsMoved],
		["Denúncias", stats.pendingReports],
		["Suspeitos", stats.suspiciousUsers],
		["Tickets", stats.openTickets]
	] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
				children: items.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-2xl font-semibold tabular-nums",
					children: value
				})] }, String(label)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Pedidos de suporte"
					}),
					tickets.slice(0, 5).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium",
							children: [
								t.username,
								" · ",
								t.subject
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: t.message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: formatWhen(t.createdAt)
						})
					] }, t.id)),
					tickets.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Nenhum ticket aberto."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Auditoria recente"
				}), logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: log.action
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: log.details
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: formatWhen(log.createdAt)
						})
					]
				}, log.id))]
			})
		]
	});
}
//#endregion
export { AdminHome as component };
