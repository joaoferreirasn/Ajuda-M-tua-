import { o as __toESM } from "../_runtime.mjs";
import { t as errMessage } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react, b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
import { a as LoadingScreen, d as Wordmark, i as ErrorBox, l as Screen, n as Disclaimer } from "./shell-DDxVqRsT.mjs";
import { c as getMyState, r as completeOnboarding } from "./fns-cmkqNg2e.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { t as Button } from "./button-CHfOkRUY.mjs";
import { t as DISCLAIMER } from "./copy-BV8BXIg0.mjs";
import { n as Input, t as Field } from "./input-CASHohjc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-ZGPRiJRX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboarding() {
	const { user, isPending } = useCurrentUserState();
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [hasProfile, setHasProfile] = (0, import_react.useState)(false);
	const [username, setUsername] = (0, import_react.useState)("");
	const [invite, setInvite] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let live = true;
		getMyState().then((state) => {
			if (!live) return;
			setHasProfile(Boolean(state.profile));
			if (!state.profile && user.displayName) setUsername(user.displayName.replace(/\s+/g, "_").slice(0, 24));
		}).catch(() => {}).finally(() => {
			if (live) setChecking(false);
		});
		return () => {
			live = false;
		};
	}, [user]);
	if (isPending || user && checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingScreen, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (hasProfile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/app" });
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			await completeOnboarding({ data: {
				username,
				inviteCode: invite
			} });
			window.location.href = "/app/link";
		} catch (err) {
			setError(errMessage(err));
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-semibold tracking-tight",
				children: "Completar perfil"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Escolha um nome público. O ID e o código de convite são gerados automaticamente."
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
							value: username,
							onChange: (e) => setUsername(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Código de convite (opcional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: invite,
							onChange: (e) => setInvite(e.target.value.toUpperCase())
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						size: "lg",
						disabled: busy,
						children: busy ? "Salvando…" : "Continuar"
					})
				]
			})
		]
	}) });
}
//#endregion
export { Onboarding as component };
