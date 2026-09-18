import { o as __toESM } from "../_runtime.mjs";
import { r as formatWhen, t as errMessage } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Handshake, v as Flag, y as ExternalLink } from "../_libs/lucide-react.mjs";
import { i as ErrorBox, r as EmptyState } from "./shell-DDxVqRsT.mjs";
import { m as markHelpOpened, n as completeHelp, t as assignHelp } from "./fns-cmkqNg2e.mjs";
import { t as GuardedApp } from "./app-guard-BJqWm43j.mjs";
import { n as Card, t as Badge } from "./card-DDBNLkNB.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ajudar-BbwsEgz0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AjudarPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardedApp, {
		title: "Ajudar alguém",
		children: ({ state, reload }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AjudarBody, {
			initial: state.openHelp,
			reload
		})
	});
}
function AjudarBody({ initial, reload }) {
	const [task, setTask] = (0, import_react.useState)(initial);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [empty, setEmpty] = (0, import_react.useState)(false);
	async function assign() {
		if (!navigator.onLine) {
			setError("É necessária conexão com a internet para receber uma tarefa.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const res = await assignHelp();
			if (!res.task) {
				setEmpty(true);
				setTask(null);
			} else {
				setTask(res.task);
				setEmpty(false);
			}
		} catch (err) {
			setError(errMessage(err));
		} finally {
			setBusy(false);
		}
	}
	async function openLink() {
		if (!task) return;
		setBusy(true);
		setError(null);
		try {
			await markHelpOpened({ data: { helpId: task.id } });
			setTask({
				...task,
				status: "opened",
				openedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			window.open(task.link, "_blank", "noopener,noreferrer");
		} catch (err) {
			setError(errMessage(err));
		} finally {
			setBusy(false);
		}
	}
	async function confirm() {
		if (!task) return;
		if (!navigator.onLine) {
			setError("Sem conexão. A ajuda só é registrada quando o servidor confirma.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			await completeHelp({ data: { helpId: task.id } });
			toast.success("Ajuda registrada. Você ganhou 1 crédito.");
			setTask(null);
			await reload();
		} catch (err) {
			setError(errMessage(err));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "O sistema escolhe o próximo participante elegível. Você nunca ajuda a mesma pessoa duas vezes."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { message: error }),
			!task && !empty && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full",
				size: "lg",
				onClick: assign,
				disabled: busy,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "size-5" }), busy ? "Buscando…" : "Receber próxima pessoa"]
			}),
			empty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Ninguém elegível agora",
				body: "Convide amigos ou volte daqui a pouco. A fila evita repetir as mesmas pessoas.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/convidar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						children: "Convidar amigos"
					})
				})
			}),
			task && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Próximo participante"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold",
								children: task.helpedUsername
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: task.helpedPublicId
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "primary",
							children: task.status === "opened" ? "Link aberto" : "Na fila"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-bg px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Ajudas recebidas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium tabular-nums",
								children: task.helpedHelpsReceived
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-bg px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Atribuída em"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: formatWhen(task.assignedAt)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "break-all rounded-xl bg-bg px-3 py-2 text-xs text-muted",
						children: task.link
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						size: "lg",
						onClick: openLink,
						disabled: busy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), "Abrir link"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						variant: "outline",
						size: "lg",
						onClick: confirm,
						disabled: busy,
						children: "Concluí a ajuda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app/denunciar",
						search: { id: task.helpedPublicId },
						className: "flex items-center justify-center gap-2 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-4" }), "Denunciar este link"]
					})
				]
			})
		]
	});
}
//#endregion
export { AjudarPage as component };
