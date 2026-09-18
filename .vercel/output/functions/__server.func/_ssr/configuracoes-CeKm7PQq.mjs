import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as saveAdminSettings, i as getAdminSettings, t as AdminGuard } from "./admin-fns-CMSCE7JO.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-CASHohjc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/configuracoes-CeKm7PQq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIELDS = [
	{
		key: "welcome_credits",
		label: "Créditos iniciais"
	},
	{
		key: "help_credit_reward",
		label: "Créditos por ajuda"
	},
	{
		key: "receive_credit_cost",
		label: "Custo ao receber ajuda"
	},
	{
		key: "referral_bonus_credits",
		label: "Bônus de indicação (créditos)"
	},
	{
		key: "referral_bonus_reputation",
		label: "Bônus de indicação (reputação)"
	},
	{
		key: "help_reputation_delta",
		label: "Reputação por ajuda"
	},
	{
		key: "cycle_size",
		label: "Tamanho do ciclo da fila"
	},
	{
		key: "max_helps_per_hour",
		label: "Limite de ajudas por hora"
	},
	{
		key: "min_help_seconds",
		label: "Tempo mínimo para confirmar (s)"
	},
	{
		key: "max_reports_per_day",
		label: "Limite de denúncias por dia"
	},
	{
		key: "max_link_updates_per_day",
		label: "Limite de alterações de link por dia"
	},
	{
		key: "assignment_ttl_minutes",
		label: "Validade da tarefa (min)"
	},
	{
		key: "auto_block_confirmed_reports",
		label: "Bloqueio automático após N denúncias"
	},
	{
		key: "fast_complete_flag_seconds",
		label: "Sinalizar confirmação rápida (s)"
	},
	{
		key: "disclaimer",
		label: "Aviso geral",
		area: true
	}
];
function AdminSettings() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, {
		title: "Configurações",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsForm, {})
	});
}
function SettingsForm() {
	const [entries, setEntries] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		getAdminSettings().then(setEntries).catch(() => {});
	}, []);
	async function onSubmit(e) {
		e.preventDefault();
		await saveAdminSettings({ data: { entries } });
		toast.success("Configurações salvas.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "max-w-xl space-y-3",
		children: [FIELDS.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: field.label,
			children: field.area ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: entries[field.key] ?? "",
				onChange: (e) => setEntries((prev) => ({
					...prev,
					[field.key]: e.target.value
				}))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: entries[field.key] ?? "",
				onChange: (e) => setEntries((prev) => ({
					...prev,
					[field.key]: e.target.value
				}))
			})
		}, field.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "submit",
			children: "Salvar regras"
		})]
	});
}
//#endregion
export { AdminSettings as component };
