import { o as __toESM } from "../_runtime.mjs";
import { r as formatWhen } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as Coins } from "../_libs/lucide-react.mjs";
import { r as EmptyState, u as StatCard } from "./shell-DDxVqRsT.mjs";
import { d as listMyCredits } from "./fns-cmkqNg2e.mjs";
import { t as GuardedApp } from "./app-guard-BJqWm43j.mjs";
import { n as Card } from "./card-DDBNLkNB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/creditos-DxGHxNiP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CreditosPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardedApp, {
		title: "Meus créditos",
		children: ({ state }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditsBody, {
			earned: state.profile.creditsEarned,
			spent: state.profile.creditsSpent,
			balance: state.profile.creditsBalance
		})
	});
}
function CreditsBody({ earned, spent, balance }) {
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listMyCredits().then(setRows).catch(() => setRows([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Coins,
						label: "Saldo",
						value: balance
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Coins,
						label: "Ganhos",
						value: earned
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Coins,
						label: "Usados",
						value: spent
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Cada ajuda concluída gera 1 crédito. Receber ajuda na fila utiliza 1 crédito. O saldo nunca fica negativo e não pode ser alterado pelo aplicativo."
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Sem movimentações",
				body: "Quando você ajudar alguém, a transação aparece aqui."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: row.reason
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: formatWhen(row.createdAt)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-sm font-semibold tabular-nums ${row.amount >= 0 ? "text-ok" : "text-danger"}`,
						children: row.amount > 0 ? `+${row.amount}` : row.amount
					})]
				}, row.id))
			})
		]
	});
}
//#endregion
export { CreditosPage as component };
