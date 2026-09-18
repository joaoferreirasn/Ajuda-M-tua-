import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, U as require_react, f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Handshake, b as Coins, d as ListOrdered, f as Link2, h as History, i as Trophy, l as ScrollText, m as House, n as Users, p as LifeBuoy, r as UserRound, s as Shield, t as X, u as Menu } from "../_libs/lucide-react.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-DDxVqRsT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function LogoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 48 48",
		className: cn("text-primary", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "48",
				height: "48",
				rx: "14",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "20",
				cy: "24",
				r: "8",
				fill: "#EFE8DC"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "28",
				cy: "24",
				r: "8",
				fill: "#C45C26",
				fillOpacity: "0.92"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "24",
				cy: "24",
				r: "3.4",
				fill: "#125E54"
			})
		]
	});
}
function Wordmark({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold tracking-tight text-fg",
				children: "Ajuda Mútua"
			}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Reciprocidade em círculo"
			})]
		})]
	});
}
var NAV = [
	{
		to: "/app",
		label: "Início",
		icon: House,
		match: "exact"
	},
	{
		to: "/app/ajudar",
		label: "Ajudar",
		icon: Handshake,
		match: "prefix"
	},
	{
		to: "/app/fila",
		label: "Fila",
		icon: ListOrdered,
		match: "prefix"
	},
	{
		to: "/app/ranking",
		label: "Ranking",
		icon: Trophy,
		match: "prefix"
	},
	{
		to: "/app/conta",
		label: "Conta",
		icon: UserRound,
		match: "prefix"
	}
];
var MENU = [
	{
		to: "/app/ajudar",
		label: "Ajudar alguém",
		icon: Handshake
	},
	{
		to: "/app/link",
		label: "Meu link",
		icon: Link2
	},
	{
		to: "/app/creditos",
		label: "Meus créditos",
		icon: Coins
	},
	{
		to: "/app/conta",
		label: "Minha conta",
		icon: UserRound
	},
	{
		to: "/app/fila",
		label: "Minha posição na fila",
		icon: ListOrdered
	},
	{
		to: "/app/ranking",
		label: "Ranking",
		icon: Trophy
	},
	{
		to: "/app/convidar",
		label: "Convidar amigos",
		icon: Users
	},
	{
		to: "/app/historico",
		label: "Histórico",
		icon: History
	},
	{
		to: "/app/regras",
		label: "Regras",
		icon: ScrollText
	},
	{
		to: "/app/suporte",
		label: "Suporte",
		icon: LifeBuoy
	}
];
function AppShell({ children, profile, title }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		setOpen(false);
	}, [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh max-w-lg flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/70 bg-bg/90 px-4 py-3 backdrop-blur-md pt-[max(0.75rem,env(safe-area-inset-top))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center rounded-xl text-fg transition-transform duration-150 active:scale-[0.96]",
					onClick: () => setOpen(true),
					"aria-label": "Abrir menu",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
				})]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-fg/40",
					"aria-label": "Fechar menu",
					onClick: () => setOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "absolute right-0 top-0 flex h-full w-[min(20rem,88vw)] flex-col bg-surface shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-4 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center rounded-xl",
								onClick: () => setOpen(false),
								"aria-label": "Fechar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: profile.username
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: profile.publicId
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "flex-1 overflow-y-auto px-2 pb-8",
							children: [MENU.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex h-12 items-center gap-3 rounded-xl px-3 text-sm", pathname === item.to ? "bg-primary/10 text-primary" : "text-fg hover:bg-fg/5"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4 opacity-80" }), item.label]
							}, item.to)), profile.isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin",
								className: "mt-2 flex h-12 items-center gap-3 rounded-xl px-3 text-sm text-accent hover:bg-accent/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" }), "Painel administrativo"]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 px-4 pb-28 pt-4",
				children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-4 text-2xl font-semibold tracking-tight",
					children: title
				}), children]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed bottom-0 left-1/2 z-30 flex w-full max-w-lg -translate-x-1/2 justify-around border-t border-border/70 bg-surface/95 px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-md",
				children: NAV.map((item) => {
					const active = item.match === "exact" ? pathname === item.to : pathname.startsWith(item.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: cn("flex min-h-12 min-w-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium", active ? "text-primary" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" }), item.label]
					}, item.to);
				})
			})
		]
	});
}
function Screen({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mx-auto flex min-h-dvh max-w-lg flex-col bg-bg px-5 py-8", className),
		children
	});
}
function LoadingScreen({ label = "Carregando" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-14 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: label
			})]
		})
	});
}
function EmptyState({ title, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-surface px-5 py-8 text-center shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: body
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: action
			})
		]
	});
}
function StatCard({ icon: Icon, label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-surface p-3.5 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xl font-semibold tabular-nums tracking-tight",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: hint
			})
		]
	});
}
function Disclaimer({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-xl bg-fg/5 px-3.5 py-3 text-xs leading-relaxed text-muted",
		children: text
	});
}
function OfflineBanner() {
	const [offline, setOffline] = (0, import_react.useState)(typeof navigator !== "undefined" ? !navigator.onLine : false);
	(0, import_react.useEffect)(() => {
		const on = () => setOffline(false);
		const off = () => setOffline(true);
		window.addEventListener("online", on);
		window.addEventListener("offline", off);
		return () => {
			window.removeEventListener("online", on);
			window.removeEventListener("offline", off);
		};
	}, []);
	if (!offline) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl bg-warn/12 px-3 py-2 text-sm text-warn",
		children: "Sem internet. Funções que dependem do servidor ficam pausadas até a conexão voltar."
	});
}
function ErrorBox({ message }) {
	if (!message) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger",
		children: message
	});
}
function ProgressBar({ value, max }) {
	const pct = max <= 0 ? 0 : Math.min(100, Math.round(value / max * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 overflow-hidden rounded-full bg-fg/8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-primary transition-[width] duration-300",
			style: { width: `${pct}%` }
		})
	});
}
function reputationTone(key) {
	if (key === "excellent" || key === "good") return "ok";
	if (key === "ok") return "primary";
	if (key === "low") return "warn";
	return "danger";
}
//#endregion
export { LoadingScreen as a, ProgressBar as c, Wordmark as d, cn as f, ErrorBox as i, Screen as l, Disclaimer as n, LogoMark as o, reputationTone as p, EmptyState as r, OfflineBanner as s, AppShell as t, StatCard as u };
