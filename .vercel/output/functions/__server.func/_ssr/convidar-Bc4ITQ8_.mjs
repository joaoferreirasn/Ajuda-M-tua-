import { o as __toESM } from "../_runtime.mjs";
import { r as formatWhen } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as EmptyState } from "./shell-DDxVqRsT.mjs";
import { s as getInviteInfo } from "./fns-cmkqNg2e.mjs";
import { t as GuardedApp } from "./app-guard-BJqWm43j.mjs";
import { n as Card } from "./card-DDBNLkNB.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/convidar-Bc4ITQ8_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ConvidarPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardedApp, {
		title: "Convidar amigos",
		children: ({ state }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InviteBody, { code: state.profile.inviteCode })
	});
}
function InviteBody({ code }) {
	const [info, setInfo] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getInviteInfo().then(setInfo).catch(() => setInfo(null));
	}, []);
	const url = `${typeof window !== "undefined" ? window.location.origin : ""}/cadastro?ref=${encodeURIComponent(code)}`;
	async function copy(text, label) {
		try {
			await navigator.clipboard.writeText(text);
			toast.success(`${label} copiado.`);
		} catch {
			toast.error("Não foi possível copiar.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "O bônus de indicação só é liberado depois que a pessoa indicada realmente participar — concluindo a primeira ajuda."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Seu código"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl font-semibold tracking-wide",
						children: code
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "break-all text-xs text-muted",
						children: url
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => copy(code, "Código"),
							children: "Copiar código"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => copy(url, "Link"),
							children: "Copiar link"
						})]
					})
				]
			}),
			!info?.invited.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nenhum convite usado ainda",
				body: "Compartilhe o código. Quando a pessoa ajudar pela primeira vez, o bônus entra na sua conta."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: info.invited.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: row.username
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: formatWhen(row.createdAt)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted",
						children: row.status === "rewarded" ? "Bônus liberado" : "Aguardando participação"
					})]
				}, row.publicId))
			})
		]
	});
}
//#endregion
export { ConvidarPage as component };
