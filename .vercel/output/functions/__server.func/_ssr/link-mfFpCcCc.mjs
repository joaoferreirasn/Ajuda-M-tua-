import { o as __toESM } from "../_runtime.mjs";
import { r as formatWhen, t as errMessage } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as ErrorBox } from "./shell-DDxVqRsT.mjs";
import { h as saveMyLink } from "./fns-cmkqNg2e.mjs";
import { t as GuardedApp } from "./app-guard-BJqWm43j.mjs";
import { n as Card } from "./card-DDBNLkNB.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Input, t as Field } from "./input-CASHohjc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/link-mfFpCcCc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LinkPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardedApp, {
		title: "Meu link",
		children: ({ state, reload }) => {
			const p = state.profile;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkForm, {
				current: p.link,
				description: p.linkDescription,
				updated: p.queueJoinedAt,
				reload
			});
		}
	});
}
function LinkForm({ current, description, updated, reload }) {
	const [link, setLink] = (0, import_react.useState)(current ?? "");
	const [desc, setDesc] = (0, import_react.useState)(description ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function onSubmit(e) {
		e.preventDefault();
		if (!navigator.onLine) {
			setError("É necessária conexão para salvar o link.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			await saveMyLink({ data: {
				link,
				description: desc
			} });
			toast.success("Link salvo.");
			await reload();
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
				children: "Cadastre o seu link de participação em uma promoção ou jogo promocional externo do TikTok. O mesmo link não pode ser usado por outra conta."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { message: error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Link",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: link,
							onChange: (e) => setLink(e.target.value),
							placeholder: "https://www.tiktok.com/..."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nome ou descrição (opcional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: desc,
							onChange: (e) => setDesc(e.target.value),
							placeholder: "Ex.: Live da promoção"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: busy,
						children: busy ? "Validando…" : "Salvar link"
					})
				]
			}),
			current && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Link atual"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 break-all text-sm",
					children: current
				}),
				updated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted",
					children: ["Na fila desde ", formatWhen(updated)]
				})
			] })
		]
	});
}
//#endregion
export { LinkPage as component };
