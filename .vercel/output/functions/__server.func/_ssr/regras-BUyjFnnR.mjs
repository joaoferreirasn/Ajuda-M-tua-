import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Disclaimer } from "./shell-DDxVqRsT.mjs";
import { t as GuardedApp } from "./app-guard-BJqWm43j.mjs";
import { n as Card } from "./card-DDBNLkNB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/regras-BUyjFnnR.js
var import_jsx_runtime = require_jsx_runtime();
var RULES = [
	{
		title: "O que é",
		body: "O Ajuda Mútua só organiza a reciprocidade entre participantes. Cada pessoa cadastra o próprio link e ajuda as demais acessando os links da fila."
	},
	{
		title: "Créditos",
		body: "Concluir uma ajuda gera +1 crédito. Receber ajuda na fila utiliza 1 crédito. O saldo nunca fica negativo e ninguém altera o próprio saldo pelo app."
	},
	{
		title: "Fila",
		body: "A fila é automática. Quem espera mais e recebeu menos ajuda tem prioridade. Não é possível escolher quem ajudar."
	},
	{
		title: "Duplicidade",
		body: "A mesma conta não ajuda a mesma pessoa duas vezes. O mesmo link não pode ser cadastrado em contas diferentes."
	},
	{
		title: "Reputação",
		body: "Ajudar sobe a reputação. Denúncias confirmadas e comportamento irregular descem. Contas suspeitas podem ser suspensas."
	},
	{
		title: "Indicações",
		body: "O bônus de convite só entra depois que a pessoa indicada participa de verdade, concluindo uma ajuda."
	},
	{
		title: "Gratuito",
		body: "Esta versão é 100% gratuita. Não há assinatura, cobrança ou créditos pagos."
	}
];
function RegrasPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardedApp, {
		title: "Regras",
		children: ({ state }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Disclaimer, { text: state.disclaimer }), RULES.map((rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: rule.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: rule.body
			})] }, rule.title))]
		})
	});
}
//#endregion
export { RegrasPage as component };
