import { o as __toESM } from "../_runtime.mjs";
import { t as errMessage } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react, x as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as ErrorBox } from "./shell-DDxVqRsT.mjs";
import { i as createReport } from "./fns-cmkqNg2e.mjs";
import { t as GuardedApp } from "./app-guard-BJqWm43j.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-CASHohjc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/denunciar-BpcFj8m7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REASONS = [
	{
		id: "spam",
		label: "Spam"
	},
	{
		id: "fraude",
		label: "Fraude"
	},
	{
		id: "link_invalido",
		label: "Link inválido"
	},
	{
		id: "abuso",
		label: "Abuso"
	},
	{
		id: "irregular",
		label: "Comportamento irregular"
	},
	{
		id: "outro",
		label: "Outro"
	}
];
function DenunciarPage() {
	const { id } = useSearch({ from: "/app/denunciar" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardedApp, {
		title: "Denúncia",
		children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportForm, { prefill: id })
	});
}
function ReportForm({ prefill }) {
	const [target, setTarget] = (0, import_react.useState)(prefill);
	const [reason, setReason] = (0, import_react.useState)("spam");
	const [description, setDescription] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		if (!navigator.onLine) {
			setError("É necessária conexão para registrar a denúncia.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			await createReport({ data: {
				reportedPublicId: target,
				reason,
				description
			} });
			toast.success("Denúncia enviada para análise.");
			setDescription("");
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
				children: "A denúncia fica pendente até um administrador analisar. Denúncias confirmadas reduzem reputação e podem bloquear a conta."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { message: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "ID ou nome de usuário",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: target,
							onChange: (e) => setTarget(e.target.value),
							placeholder: "AM-XXXXXX"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Motivo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-12 w-full rounded-xl bg-surface px-4 text-base shadow-card outline-none focus:ring-2 focus:ring-ring/40",
							value: reason,
							onChange: (e) => setReason(e.target.value),
							children: REASONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: item.id,
								children: item.label
							}, item.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Descrição",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							placeholder: "O que aconteceu?"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: busy,
						children: busy ? "Enviando…" : "Enviar denúncia"
					})
				]
			})
		]
	});
}
//#endregion
export { DenunciarPage as component };
