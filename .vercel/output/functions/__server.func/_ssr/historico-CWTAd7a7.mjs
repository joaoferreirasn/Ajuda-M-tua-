import { o as __toESM } from "../_runtime.mjs";
import { r as formatWhen } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as EmptyState } from "./shell-DDxVqRsT.mjs";
import { f as listMyHistory } from "./fns-cmkqNg2e.mjs";
import { t as GuardedApp } from "./app-guard-BJqWm43j.mjs";
import { n as Card } from "./card-DDBNLkNB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/historico-CWTAd7a7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HistoricoPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardedApp, {
		title: "Histórico",
		children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryList, {})
	});
}
function HistoryList() {
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listMyHistory().then(setRows).catch(() => setRows([]));
	}, []);
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Nada registrado ainda",
		body: "Ajudas, créditos, convites e denúncias aparecem com data e hora."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: row.action
			}),
			row.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: row.details
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: formatWhen(row.createdAt)
			})
		] }, row.id))
	});
}
//#endregion
export { HistoricoPage as component };
