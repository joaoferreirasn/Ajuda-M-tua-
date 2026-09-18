import { o as __toESM } from "../_runtime.mjs";
import { t as errMessage } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Wordmark, i as ErrorBox, l as Screen } from "./shell-DDxVqRsT.mjs";
import { t as authClient } from "./client-B40BzJxt.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { n as Input, t as Field } from "./input-CASHohjc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recuperar-sGR4dYcv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Recuperar() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [done, setDone] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			const { error: authError } = await authClient.forgetPassword({
				email: email.trim(),
				redirectTo: "/login"
			});
			if (authError) throw new Error(authError.message || "Não foi possível enviar o e-mail.");
			setDone(true);
		} catch (err) {
			setError(errMessage(err, "Se a conta existir, enviaremos as instruções quando o e-mail estiver disponível."));
			setDone(true);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		className: "justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "Recuperar senha"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Informe o e-mail da conta. Se ele existir, enviaremos o próximo passo."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { message: error }),
				done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-ok/10 px-3 py-3 text-sm text-ok",
					children: "Se houver uma conta com este e-mail, as instruções serão enviadas. Você também pode alterar a senha depois de entrar."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "E-mail",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: busy,
						children: busy ? "Enviando…" : "Enviar"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "block text-center text-sm font-medium text-primary",
					children: "Voltar ao login"
				})
			]
		})
	});
}
//#endregion
export { Recuperar as component };
