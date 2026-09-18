import { Link, Navigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useAppState } from "@/components/app-guard";
import { LoadingScreen } from "@/components/shell";
import { LogoMark } from "@/components/brand";

function WordmarkMini() {
  return (
    <div className="flex items-center gap-2">
      <LogoMark className="size-8" />
      <span className="text-sm font-semibold">Admin</span>
    </div>
  );
}

const LINKS = [
  { to: "/admin", label: "Visão geral" },
  { to: "/admin/usuarios", label: "Usuários" },
  { to: "/admin/creditos", label: "Créditos" },
  { to: "/admin/fila", label: "Fila" },
  { to: "/admin/denuncias", label: "Denúncias" },
  { to: "/admin/configuracoes", label: "Configurações" },
];

export function AdminGuard({ children, title }: { children: ReactNode; title: string }) {
  const { user, isPending, state, ready } = useAppState();
  if (isPending || (user && !ready)) return <LoadingScreen label="Abrindo painel" />;
  if (!user) return <RedirectToSignIn />;
  if (!state?.profile) return <Navigate to="/onboarding" />;
  if (!state.profile.isAdmin) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
        <div className="space-y-2">
          <p className="text-lg font-medium">Área restrita</p>
          <p className="text-sm text-muted">Somente administradores acessam este painel.</p>
          <Link to="/app" className="inline-block text-sm font-medium text-primary">
            Voltar ao aplicativo
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-dvh bg-bg">
      <header className="border-b border-border/70 bg-surface/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <WordmarkMini />
          <Link to="/app" className="flex items-center gap-1 text-sm text-muted">
            <ArrowLeft className="size-4" />
            App
          </Link>
        </div>
        <nav className="mx-auto mt-2 flex max-w-5xl gap-1 overflow-x-auto pb-1">
          {LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="shrink-0 rounded-full px-3 py-1.5 text-sm text-muted hover:bg-fg/5 hover:text-fg"
              activeProps={{ className: "shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="mb-5 text-2xl font-semibold tracking-tight">{title}</h1>
        {children}
      </main>
    </div>
  );
}
