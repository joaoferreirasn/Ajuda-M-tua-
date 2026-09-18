import { o as __toESM } from "../_runtime.mjs";
import { t as errMessage } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react, b as Navigate, x as useSearch, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as LoadingScreen, d as Wordmark, i as ErrorBox, l as Screen, n as Disclaimer } from "./shell-DDxVqRsT.mjs";
import { r as completeOnboarding } from "./fns-cmkqNg2e.mjs";
import { t as authClient } from "./client-B40BzJxt.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { t as DISCLAIMER } from "./copy-BV8BXIg0.mjs";
import { n as Input, t as Field } from "./input-CASHohjc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cadastro-CUvCiZvI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Cadastro() {
	const { user, isPending } = useCurrentUserState();
	const { ref } = useSearch({ from: "/cadastro" });
	const [username, setUsername] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [invite, setInvite] = (0, import_react.useState)(ref);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingScreen, {});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/app" });
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		if (password !== confirm) {
			setError("A confirmação de senha não confere.");
			return;
		}
		if (password.length < 8) {
			setError("A senha precisa ter pelo menos 8 caracteres.");
			return;
		}
		setBusy(true);
		try {
			const { error: authError } = await authClient.signUp.email({
				email: email.trim(),
				password,
				name: username.trim(),
				callbackURL: "/app"
			});
			if (authError) throw new Error(authError.message || "Não foi possível criar a conta.");
			await authClient.getSession();
			await completeOnboarding({ data: {
				username: username.trim(),
				inviteCode: invite
			} });
			window.location.href = "/app/link";
		} catch (err) {
			setError(errMessage(err, "Não foi possível criar a conta."));
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-semibold tracking-tight",
				children: "Criar conta"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Entre no círculo. Sem promessas de prêmio — só organização da ajuda mútua."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Disclaimer, { text: DISCLAIMER }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { message: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nome de usuário",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							autoComplete: "username",
							value: username,
							onChange: (e) => setUsername(e.target.value),
							placeholder: "ex: ana_silva"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "E-mail",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							required: true,
							autoComplete: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Senha",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							required: true,
							autoComplete: "new-password",
							value: password,
							onChange: (e) => setPassword(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Confirmar senha",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							required: true,
							autoComplete: "new-password",
							value: confirm,
							onChange: (e) => setConfirm(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Código de convite (opcional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: invite,
							onChange: (e) => setInvite(e.target.value.toUpperCase()),
							placeholder: "Se alguém te indicou"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						size: "lg",
						disabled: busy,
						children: busy ? "Criando…" : "Criar conta"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-center text-sm text-muted",
				children: [
					"Já tem conta?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "font-medium text-primary",
						children: "Entrar"
					})
				]
			})
		]
	}) });
}
//#endregion
export { Cadastro as component };
