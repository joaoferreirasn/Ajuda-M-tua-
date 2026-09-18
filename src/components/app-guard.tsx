import { Navigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, LoadingScreen, OfflineBanner } from "@/components/shell";
import { getMyState, logClientSession, type MyState } from "@/lib/app/fns";
import { errMessage } from "@/lib/app/format";

export function useAppState() {
  const { user, isPending } = useCurrentUserState();
  const [state, setState] = useState<MyState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  async function reload() {
    const next = await getMyState();
    setState(next);
    return next;
  }

  useEffect(() => {
    if (isPending || !user) return;
    let live = true;
    getMyState()
      .then((next) => {
        if (live) setState(next);
      })
      .catch((err) => {
        if (live) setError(errMessage(err));
      })
      .finally(() => {
        if (live) setReady(true);
      });
    void logClientSession({ data: { userAgent: navigator.userAgent } }).catch(() => {});
    return () => {
      live = false;
    };
  }, [isPending, user]);

  return { user, isPending, state, error, ready, reload, setState };
}

export function GuardedApp({ children, title }: { children: (ctx: { state: MyState; reload: () => Promise<MyState> }) => ReactNode; title?: string }) {
  const { user, isPending, state, error, ready, reload } = useAppState();

  if (isPending || (user && !ready)) return <LoadingScreen />;
  if (!user) return <RedirectToSignIn />;
  if (error && !state) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
        <div className="space-y-3">
          <p className="text-lg font-medium">Não foi possível carregar</p>
          <p className="text-sm text-muted">{error}</p>
        </div>
      </div>
    );
  }
  if (!state?.profile) return <Navigate to="/onboarding" />;
  if (state.profile.status === "blocked") {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
        <div className="max-w-sm space-y-3">
          <p className="text-lg font-medium">Conta bloqueada</p>
          <p className="text-sm text-muted">{state.profile.blockReason || "Esta conta não pode usar o Ajuda Mútua no momento."}</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell profile={state.profile} title={title}>
      <div className="mb-3">
        <OfflineBanner />
      </div>
      {children({ state, reload })}
    </AppShell>
  );
}
