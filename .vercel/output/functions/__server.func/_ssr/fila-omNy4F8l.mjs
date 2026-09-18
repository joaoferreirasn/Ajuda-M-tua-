import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as ProgressBar, f as cn, r as EmptyState } from "./shell-DDxVqRsT.mjs";
import { l as getQueueBoard } from "./fns-cmkqNg2e.mjs";
import { t as GuardedApp } from "./app-guard-BJqWm43j.mjs";
import { n as Card } from "./card-DDBNLkNB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fila-omNy4F8l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FilaPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardedApp, {
		title: "Minha posição na fila",
		children: ({ state }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaBody, { mine: state.queue })
	});
}
function FilaBody({ mine }) {
	const [board, setBoard] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getQueueBoard().then(setBoard).catch(() => setBoard(null));
	}, []);
	const q = board?.mine ?? mine;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Sua posição"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-3xl font-semibold tabular-nums",
					children: q?.inQueue ? `#${q.position}` : "Fora da fila"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [q?.eligibleCount ?? 0, " participantes elegíveis agora"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex justify-between text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ajudas restantes neste ciclo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [
								q?.helpsRemaining,
								"/",
								q?.helpsNeeded
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
						value: (q?.helpsNeeded ?? 10) - (q?.helpsRemaining ?? 10),
						max: q?.helpsNeeded ?? 10
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "A fila prioriza quem espera há mais tempo e recebeu menos ajudas, para não concentrar em poucas contas."
			}),
			!board?.participants.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Fila vazia",
				body: "Quando houver links cadastrados, as posições aparecem aqui."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: board.participants.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex items-center justify-between rounded-2xl bg-surface px-4 py-3 shadow-card", row.isMe && "ring-2 ring-primary/30"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium",
						children: [
							"#",
							row.position,
							" ",
							row.isMe ? "Você" : row.username
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							row.publicId,
							" · ",
							row.helpsReceived,
							" recebidas · ",
							row.helpsGiven,
							" feitas"
						]
					})] })
				}, row.publicId))
			})
		]
	});
}
//#endregion
export { FilaPage as component };
