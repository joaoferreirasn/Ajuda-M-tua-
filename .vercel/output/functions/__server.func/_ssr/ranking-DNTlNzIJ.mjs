import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as cn, r as EmptyState } from "./shell-DDxVqRsT.mjs";
import { u as getRanking } from "./fns-cmkqNg2e.mjs";
import { t as GuardedApp } from "./app-guard-BJqWm43j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ranking-DNTlNzIJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RankingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardedApp, {
		title: "Ranking",
		children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankingList, {})
	});
}
function RankingList() {
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		getRanking().then(setRows).catch(() => setRows([]));
	}, []);
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Ranking ainda vazio",
		body: "As pessoas que mais ajudam aparecem aqui automaticamente."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Quem mais ajuda o círculo. Atualizado a cada ação concluída."
		}), rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-card", row.isMe && "ring-2 ring-primary/30"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "w-8 text-sm font-semibold tabular-nums text-muted",
					children: ["#", row.position]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: row.isMe ? `${row.username} (você)` : row.username
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: row.reputationLevel
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold tabular-nums",
						children: row.helpsGiven
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "ajudas"
					})]
				})
			]
		}, row.publicId))]
	});
}
//#endregion
export { RankingPage as component };
