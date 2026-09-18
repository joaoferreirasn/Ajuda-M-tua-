import { o as __toESM } from "../_runtime.mjs";
import { r as formatWhen, t as errMessage } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as ErrorBox } from "./shell-DDxVqRsT.mjs";
import { o as getAdminUser, p as searchAdminUsers, r as adminSetStatus, t as AdminGuard } from "./admin-fns-CMSCE7JO.mjs";
import { n as Card, t as Badge } from "./card-DDBNLkNB.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Input } from "./input-CASHohjc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/usuarios-o_jRRbUl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminUsers() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, {
		title: "Usuários",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersPanel, {})
	});
}
function UsersPanel() {
	const [q, setQ] = (0, import_react.useState)("");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	async function search() {
		const list = await searchAdminUsers({ data: { q } });
		setRows(list);
	}
	(0, import_react.useEffect)(() => {
		search().catch(() => setRows([]));
	}, []);
	async function open(userId) {
		setSelected(userId);
		setDetail(await getAdminUser({ data: { userId } }));
	}
	async function setStatus(status) {
		if (!selected) return;
		setError(null);
		try {
			await adminSetStatus({ data: {
				userId: selected,
				status,
				reason
			} });
			toast.success("Status atualizado.");
			await open(selected);
			await search();
		} catch (err) {
			setError(errMessage(err));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1fr_1.1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Buscar nome, ID ou e-mail"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: () => search().catch(() => {}),
					children: "Buscar"
				})]
			}), rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => void open(row.userId),
				className: "w-full rounded-2xl bg-surface p-3 text-left shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: row.username
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: row.status === "active" ? "ok" : row.status === "blocked" ? "danger" : "warn",
						children: row.status
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						row.publicId,
						" · ",
						row.email || "sem e-mail"
					]
				})]
			}, row.userId))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: !detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Selecione um usuário para ver histórico e reputação."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-semibold",
					children: detail.profile.username
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						detail.profile.publicId,
						" · reputação ",
						detail.profile.reputation
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { message: error }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: reason,
					onChange: (e) => setReason(e.target.value),
					placeholder: "Motivo da ação"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => void setStatus("active"),
							children: "Desbloquear"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => void setStatus("suspended"),
							children: "Suspender"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "danger",
							onClick: () => void setStatus("blocked"),
							children: "Bloquear"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => void setStatus("suspicious"),
							children: "Marcar suspeito"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Histórico"
					}), detail.history.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							formatWhen(h.createdAt),
							" · ",
							h.action,
							" ",
							h.details
						]
					}, h.id))]
				})
			]
		}) })]
	});
}
//#endregion
export { AdminUsers as component };
