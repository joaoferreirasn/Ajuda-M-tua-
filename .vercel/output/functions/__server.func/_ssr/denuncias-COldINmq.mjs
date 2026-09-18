import { o as __toESM } from "../_runtime.mjs";
import { r as formatWhen } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as reviewReport, l as listAdminReports, t as AdminGuard } from "./admin-fns-CMSCE7JO.mjs";
import { n as Card, t as Badge } from "./card-DDBNLkNB.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Input } from "./input-CASHohjc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/denuncias-COldINmq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminReports() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, {
		title: "Denúncias",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsPanel, {})
	});
}
function ReportsPanel() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		listAdminReports().then(setRows).catch(() => setRows([]));
	}, []);
	async function act(id, status, suspend = false) {
		await reviewReport({ data: {
			reportId: id,
			status,
			note,
			suspend
		} });
		toast.success("Denúncia atualizada.");
		setRows(await listAdminReports());
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value: note,
			onChange: (e) => setNote(e.target.value),
			placeholder: "Observação administrativa"
		}), rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-medium",
						children: [
							row.reporterUsername,
							" → ",
							row.reportedUsername
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: row.status === "confirmed" ? "danger" : row.status === "rejected" ? "ok" : "warn",
						children: row.status
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [row.reason, row.description ? ` — ${row.description}` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: formatWhen(row.createdAt)
				}),
				row.status === "pending" || row.status === "reviewing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => void act(row.id, "reviewing"),
							children: "Analisar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => void act(row.id, "confirmed"),
							children: "Confirmar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "danger",
							onClick: () => void act(row.id, "confirmed", true),
							children: "Confirmar e suspender"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => void act(row.id, "rejected"),
							children: "Rejeitar"
						})
					]
				}) : null
			]
		}, row.id))]
	});
}
//#endregion
export { AdminReports as component };
