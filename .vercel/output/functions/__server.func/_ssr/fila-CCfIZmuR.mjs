import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as listAdminQueue, t as AdminGuard } from "./admin-fns-CMSCE7JO.mjs";
import { n as Card, t as Badge } from "./card-DDBNLkNB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fila-CCfIZmuR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminFila() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, {
		title: "Fila",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueueTable, {})
	});
}
function QueueTable() {
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listAdminQueue().then(setRows).catch(() => setRows([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-medium",
				children: [
					"#",
					row.position,
					" ",
					row.username,
					" ",
					row.isSeed ? "(comunidade)" : ""
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [
					row.publicId,
					" · recebidas ",
					row.helpsReceived,
					" · feitas ",
					row.helpsGiven,
					" · créditos ",
					row.creditsBalance
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: row.status === "active" ? "ok" : "warn",
				children: row.status
			})]
		}, row.userId))
	});
}
//#endregion
export { AdminFila as component };
