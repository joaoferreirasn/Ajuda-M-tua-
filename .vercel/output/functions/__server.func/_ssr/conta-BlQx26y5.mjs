import { o as __toESM } from "../_runtime.mjs";
import { n as formatDay, t as errMessage } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as ErrorBox, p as reputationTone } from "./shell-DDxVqRsT.mjs";
import { i as signOut, t as authClient } from "./client-B40BzJxt.mjs";
import { t as GuardedApp } from "./app-guard-BJqWm43j.mjs";
import { n as Card, t as Badge } from "./card-DDBNLkNB.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Input, t as Field } from "./input-CASHohjc.mjs";
import { a as hasGateSessionMarker } from "./server-BZY7E4I6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conta-BlQx26y5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContaPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardedApp, {
		title: "Minha conta",
		children: ({ state }) => {
			const p = state.profile;
			const q = state.queue;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xl font-semibold",
									children: p.username
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: p.publicId
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: reputationTone(p.reputationKey),
									children: p.reputationLevel
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										k: "E-mail",
										v: p.email || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										k: "Cadastro",
										v: formatDay(p.createdAt)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										k: "Créditos",
										v: String(p.creditsBalance)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										k: "Reputação",
										v: String(p.reputation)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										k: "Ajudas feitas",
										v: String(p.helpsGiven)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										k: "Ajudas recebidas",
										v: String(p.helpsReceived)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										k: "Fila",
										v: q?.inQueue ? `#${q.position}` : "Fora"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										k: "Convite",
										v: p.inviteCode
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "break-all text-xs text-muted",
								children: p.link || "Nenhum link cadastrado"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordBox, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/historico",
							className: "text-sm font-medium text-primary",
							children: "Ver histórico completo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/denunciar",
							className: "text-sm text-muted",
							children: "Denunciar um participante"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-surface p-4 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm font-medium",
							children: "Sessão"
						}), !hasGateSessionMarker() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							className: "w-full",
							onClick: () => void signOut().catch(() => toast.error("Não foi possível sair agora.")),
							children: "Sair"
						})]
					})
				]
			});
		}
	});
}
function Info({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-bg px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-medium",
			children: v
		})]
	});
}
function PasswordBox() {
	const [current, setCurrent] = (0, import_react.useState)("");
	const [next, setNext] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		if (next !== confirm) {
			setError("A confirmação não confere.");
			return;
		}
		if (next.length < 8) {
			setError("A nova senha precisa ter pelo menos 8 caracteres.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const { error: authError } = await authClient.changePassword({
				currentPassword: current,
				newPassword: next,
				revokeOtherSessions: true
			});
			if (authError) throw new Error(authError.message || "Não foi possível alterar a senha.");
			toast.success("Senha atualizada.");
			setCurrent("");
			setNext("");
			setConfirm("");
		} catch (err) {
			setError(errMessage(err, "Esta opção vale para contas criadas com e-mail e senha."));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm font-medium",
			children: "Alterar senha"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { message: error }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "mt-3 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Senha atual",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: current,
						onChange: (e) => setCurrent(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Nova senha",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: next,
						onChange: (e) => setNext(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Confirmar nova senha",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: confirm,
						onChange: (e) => setConfirm(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "outline",
					className: "w-full",
					disabled: busy,
					children: busy ? "Salvando…" : "Atualizar senha"
				})
			]
		})
	] });
}
//#endregion
export { ContaPage as component };
