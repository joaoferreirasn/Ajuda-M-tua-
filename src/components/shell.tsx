import { Link, useRouterState } from "@tanstack/react-router";
import {
  Coins,
  Handshake,
  History,
  Home,
  LifeBuoy,
  Link2,
  ListOrdered,
  Menu,
  ScrollText,
  Shield,
  Trophy,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { LogoMark, Wordmark } from "@/components/brand";
import { cn } from "@/lib/cn";
import type { Profile } from "@/lib/app/types";

const NAV = [
  { to: "/app", label: "Início", icon: Home, match: "exact" as const },
  { to: "/app/ajudar", label: "Ajudar", icon: Handshake, match: "prefix" as const },
  { to: "/app/fila", label: "Fila", icon: ListOrdered, match: "prefix" as const },
  { to: "/app/ranking", label: "Ranking", icon: Trophy, match: "prefix" as const },
  { to: "/app/conta", label: "Conta", icon: UserRound, match: "prefix" as const },
];

const MENU = [
  { to: "/app/ajudar", label: "Ajudar alguém", icon: Handshake },
  { to: "/app/link", label: "Meu link", icon: Link2 },
  { to: "/app/creditos", label: "Meus créditos", icon: Coins },
  { to: "/app/conta", label: "Minha conta", icon: UserRound },
  { to: "/app/fila", label: "Minha posição na fila", icon: ListOrdered },
  { to: "/app/ranking", label: "Ranking", icon: Trophy },
  { to: "/app/convidar", label: "Convidar amigos", icon: Users },
  { to: "/app/historico", label: "Histórico", icon: History },
  { to: "/app/regras", label: "Regras", icon: ScrollText },
  { to: "/app/suporte", label: "Suporte", icon: LifeBuoy },
];

export function AppShell({
  children,
  profile,
  title,
}: {
  children: ReactNode;
  profile: Profile;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-bg">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/70 bg-bg/90 px-4 py-3 backdrop-blur-md pt-[max(0.75rem,env(safe-area-inset-top))]">
        <Wordmark compact />
        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl text-fg transition-transform duration-150 active:scale-[0.96]"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-fg/40"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-[min(20rem,88vw)] flex-col bg-surface shadow-card">
            <div className="flex items-center justify-between px-4 py-4">
              <Wordmark compact />
              <button
                type="button"
                className="grid size-11 place-items-center rounded-xl"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="px-4 pb-3">
              <p className="text-sm font-medium">{profile.username}</p>
              <p className="text-xs text-muted">{profile.publicId}</p>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 pb-8">
              {MENU.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-xl px-3 text-sm",
                    pathname === item.to ? "bg-primary/10 text-primary" : "text-fg hover:bg-fg/5",
                  )}
                >
                  <item.icon className="size-4 opacity-80" />
                  {item.label}
                </Link>
              ))}
              {profile.isAdmin && (
                <Link
                  to="/admin"
                  className="mt-2 flex h-12 items-center gap-3 rounded-xl px-3 text-sm text-accent hover:bg-accent/10"
                >
                  <Shield className="size-4" />
                  Painel administrativo
                </Link>
              )}
            </nav>
          </aside>
        </div>
      )}

      <main className="flex-1 px-4 pb-28 pt-4">
        {title && <h1 className="mb-4 text-2xl font-semibold tracking-tight">{title}</h1>}
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-lg -translate-x-1/2 justify-around border-t border-border/70 bg-surface/95 px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-md">
        {NAV.map((item) => {
          const active = item.match === "exact" ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex min-h-12 min-w-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium",
                active ? "text-primary" : "text-muted",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto flex min-h-dvh max-w-lg flex-col bg-bg px-5 py-8", className)}>{children}</div>;
}

export function LoadingScreen({ label = "Carregando" }: { label?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-6">
      <div className="flex flex-col items-center gap-4">
        <LogoMark className="size-14 animate-pulse" />
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-surface px-5 py-8 text-center shadow-card">
      <p className="text-base font-medium">{title}</p>
      <p className="mt-2 text-sm text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Coins;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-surface p-3.5 shadow-card">
      <div className="mb-3 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Disclaimer({ text }: { text: string }) {
  return (
    <p className="rounded-xl bg-fg/5 px-3.5 py-3 text-xs leading-relaxed text-muted">{text}</p>
  );
}

export function OfflineBanner() {
  const [offline, setOffline] = useState(typeof navigator !== "undefined" ? !navigator.onLine : false);
  useEffect(() => {
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
  return (
    <div className="rounded-xl bg-warn/12 px-3 py-2 text-sm text-warn">
      Sem internet. Funções que dependem do servidor ficam pausadas até a conexão voltar.
    </div>
  );
}

export function ErrorBox({ message }: { message: string | null }) {
  if (!message) return null;
  return <div className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">{message}</div>;
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2 overflow-hidden rounded-full bg-fg/8">
      <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function reputationTone(key: string) {
  if (key === "excellent" || key === "good") return "ok" as const;
  if (key === "ok") return "primary" as const;
  if (key === "low") return "warn" as const;
  return "danger" as const;
}
