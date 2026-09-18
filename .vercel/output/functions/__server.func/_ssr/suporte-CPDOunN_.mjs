import { o as __toESM } from "../_runtime.mjs";
import { t as errMessage } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as ErrorBox } from "./shell-DDxVqRsT.mjs";
import { o as createSupportTicket } from "./fns-cmkqNg2e.mjs";
import { t as GuardedApp } from "./app-guard-BJqWm43j.mjs";
import { n as Card } from "./card-DDBNLkNB.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-CASHohjc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/suporte-CPDOunN_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuportePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardedApp, {
		title: "Suporte",
		children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportForm, {})
	});
}
function SupportForm() {
	const [subject, setSubject] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		if (!navigator.onLine) {
			setError("É necessária conexão para enviar o pedido.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			await createSupportTicket({ data: {
				subject,
				message
			} });
			toast.success("Pedido enviado. A equipe administrativa recebe o registro.");
			setSubject("");
			setMessage("");
		} catch (err) {
			setError(errMessage(err));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Use este canal para problemas de acesso, link recusado ou conta bloqueada. Não pedimos senha e não prometemos resultados em promoções externas."
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { message: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Assunto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: subject,
							onChange: (e) => setSubject(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mensagem",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							required: true,
							value: message,
							onChange: (e) => setMessage(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: busy,
						children: busy ? "Enviando…" : "Enviar"
					})
				]
			})
		]
	});
}
//#endregion
export { SuportePage as component };
