import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as cn } from "./shell-DDxVqRsT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/card-DDBNLkNB.js
var import_jsx_runtime = require_jsx_runtime();
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-2xl bg-surface p-4 shadow-card", className),
		...props
	});
}
function Badge({ className, tone = "default", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", {
			default: "bg-fg/6 text-fg",
			ok: "bg-ok/12 text-ok",
			warn: "bg-warn/12 text-warn",
			danger: "bg-danger/12 text-danger",
			primary: "bg-primary/12 text-primary"
		}[tone], className),
		children
	});
}
//#endregion
export { Card as n, Badge as t };
