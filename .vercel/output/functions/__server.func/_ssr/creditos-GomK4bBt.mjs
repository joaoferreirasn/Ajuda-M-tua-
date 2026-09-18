import { o as __toESM } from "../_runtime.mjs";
import { r as formatWhen, t as errMessage } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as ErrorBox } from "./shell-DDxVqRsT.mjs";
import { n as adminAdjustCredits, o as getAdminUser, p as searchAdminUsers, t as AdminGuard } from "./admin-fns-CMSCE7JO.mjs";
import { n as Card } from "./card-DDBNLkNB.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Input, t as Field } from "./input-CASHohjc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/creditos-GomK4bBt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCredits() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, {
		title: "Créditos",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditsPanel, {})
	});
}
function CreditsPanel() {
	const [q, setQ] = (0, import_react.useState)("");
	const [userId, setUserId] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("1");
	const [reason, setReason] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [detail, setDetail] = (0, import_react.useState)(null);
	async function find() {
		const first = (await searchAdminUsers({ data: { q } }))[0];
		if (!first) throw new Error("Usuário não encontrado.");
		setUserId(first.userId);
		setDetail(await getAdminUser({ data: { userId: first.userId } }));
	}
	async function apply() {
		setError(null);
		try {
			if (!userId) await find();
			const id = userId || (await searchAdminUsers({ data: { q } }))[0]?.userId;
			if (!id) throw new Error("Usuário não encontrado.");
			await adminAdjustCredits({ data: {
				userId: id,
				amount: Number(amount),
				reason
			} });
			toast.success("Créditos ajustados e registrados.");
			setDetail(await getAdminUser({ data: { userId: id } }));
		} catch (err) {
			setError(errMessage(err));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-xl space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Toda correção gera log administrativo e transação. O saldo não pode ficar negativo."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { message: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Buscar usuário",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "nome, ID ou e-mail"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => find().catch((err) => setError(errMessage(err))),
						children: "Abrir"
					})]
				})
			}),
			detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: detail.profile.username
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: ["Saldo atual: ", detail.profile.creditsBalance]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Valor (use negativo para debitar)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: amount,
					onChange: (e) => setAmount(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Motivo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: reason,
					onChange: (e) => setReason(e.target.value),
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void apply(),
				children: "Registrar correção"
			}),
			detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Transações"
				}), detail.transactions.map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tx.reason }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums",
						children: [
							tx.amount > 0 ? "+" : "",
							tx.amount,
							" · ",
							formatWhen(tx.createdAt)
						]
					})]
				}, tx.id))]
			})
		]
	});
}
//#endregion
export { AdminCredits as component };
