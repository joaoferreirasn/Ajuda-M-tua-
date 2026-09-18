import { o as __toESM } from "../_runtime.mjs";
import { t as errMessage } from "./format-B3soZhnF.mjs";
import { C as require_jsx_runtime, U as require_react, b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
import { a as LoadingScreen, s as OfflineBanner, t as AppShell } from "./shell-DDxVqRsT.mjs";
import { c as getMyState, p as logClientSession } from "./fns-cmkqNg2e.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-guard-BJqWm43j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useAppState() {
	const { user, isPending } = useCurrentUserState();
	const [state, setState] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	async function reload() {
		const next = await getMyState();
		setState(next);
		return next;
	}
	(0, import_react.useEffect)(() => {
		if (isPending || !user) return;
		let live = true;
		getMyState().then((next) => {
			if (live) setState(next);
		}).catch((err) => {
			if (live) setError(errMessage(err));
		}).finally(() => {
			if (live) setReady(true);
		});
		logClientSession({ data: { userAgent: navigator.userAgent } }).catch(() => {});
		return () => {
			live = false;
		};
	}, [isPending, user]);
	return {
		user,
		isPending,
		state,
		error,
		ready,
		reload,
		setState
	};
}
function GuardedApp({ children, title }) {
	const { user, isPending, state, error, ready, reload } = useAppState();
	if (isPending || user && !ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingScreen, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (error && !state) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg font-medium",
				children: "Não foi possível carregar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: error
			})]
		})
	});
	if (!state?.profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	if (state.profile.status === "blocked") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-sm space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg font-medium",
				children: "Conta bloqueada"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: state.profile.blockReason || "Esta conta não pode usar o Ajuda Mútua no momento."
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		profile: state.profile,
		title,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineBanner, {})
		}), children({
			state,
			reload
		})]
	});
}
//#endregion
export { useAppState as n, GuardedApp as t };
