import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Handshake, b as Coins, d as ListOrdered, g as HeartHandshake, o as Star } from "../_libs/lucide-react.mjs";
import { c as ProgressBar, n as Disclaimer, p as reputationTone, u as StatCard } from "./shell-DDxVqRsT.mjs";
import { t as GuardedApp } from "./app-guard-BJqWm43j.mjs";
import { t as Badge } from "./card-DDBNLkNB.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-DIi0BGaU.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardedApp, { children: ({ state }) => {
		const p = state.profile;
		const q = state.queue;
		const received = p.helpsReceived % (q?.helpsNeeded ?? 10);
		const needed = q?.helpsNeeded ?? 10;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "stagger-in space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: ["Olá, ", p.username]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Seu círculo hoje"
				})] }),
				p.status === "suspicious" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-warn/12 px-3 py-2 text-sm text-warn",
					children: "Conta em observação. Continue ajudando com calma para recuperar reputação."
				}),
				p.status === "suspended" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger",
					children: ["Conta suspensa temporariamente. ", p.blockReason]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: Coins,
							label: "Créditos",
							value: p.creditsBalance,
							hint: `${p.creditsEarned} ganhos`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: ListOrdered,
							label: "Posição na fila",
							value: q?.inQueue ? `#${q.position}` : "Fora",
							hint: q?.inQueue ? `${q.eligibleCount} na fila` : "Cadastre o link e tenha créditos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: Handshake,
							label: "Ajudas realizadas",
							value: p.helpsGiven
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: HeartHandshake,
							label: "Ajudas recebidas",
							value: p.helpsReceived
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-surface p-4 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Reputação"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							tone: reputationTone(p.reputationKey),
							children: [
								p.reputationLevel,
								" · ",
								p.reputation
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-2 text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs",
							children: "Ações positivas sobem. Denúncias confirmadas descem."
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-surface p-4 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: "Progresso do ciclo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "tabular-nums text-muted",
								children: [
									received,
									"/",
									needed
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
							value: received,
							max: needed
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted",
							children: [
								q?.helpsRemaining ?? needed,
								" ajudas restantes neste ciclo de ",
								needed,
								"."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/ajudar",
					className: "block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						size: "lg",
						variant: "accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "size-5" }), "Ajudar alguém"]
					})
				}),
				!p.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/link",
					className: "block text-center text-sm font-medium text-primary",
					children: "Cadastrar meu link para entrar na fila"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Disclaimer, { text: state.disclaimer })
			]
		});
	} });
}
//#endregion
export { Dashboard as component };
