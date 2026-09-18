import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Wordmark } from "@/components/brand";
import { Screen, LoadingScreen, ErrorBox, Disclaimer } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { completeOnboarding, getMyState } from "@/lib/app/fns";
import { DISCLAIMER } from "@/lib/app/copy";
import { errMessage } from "@/lib/app/format";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const { user, isPending } = useCurrentUserState();
  const [checking, setChecking] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [username, setUsername] = useState("");
  const [invite, setInvite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    let live = true;
    getMyState()
      .then((state) => {
        if (!live) return;
        setHasProfile(Boolean(state.profile));
        if (!state.profile && user.displayName) {
          setUsername(user.displayName.replace(/\s+/g, "_").slice(0, 24));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (live) setChecking(false);
      });
    return () => {
      live = false;
    };
  }, [user]);

  if (isPending || (user && checking)) return <LoadingScreen />;
  if (!user) return <RedirectToSignIn />;
  if (hasProfile) return <Navigate to="/app" />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await completeOnboarding({ data: { username, inviteCode: invite } });
      window.location.href = "/app/link";
    } catch (err) {
      setError(errMessage(err));
      setBusy(false);
    }
  }

  return (
    <Screen>
      <div className="space-y-6">
        <Wordmark />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Completar perfil</h1>
          <p className="mt-2 text-sm text-muted">Escolha um nome público. O ID e o código de convite são gerados automaticamente.</p>
        </div>
        <Disclaimer text={DISCLAIMER} />
        <ErrorBox message={error} />
        <form onSubmit={onSubmit} className="space-y-3">
          <Field label="Nome de usuário">
            <Input required value={username} onChange={(e) => setUsername(e.target.value)} />
          </Field>
          <Field label="Código de convite (opcional)">
            <Input value={invite} onChange={(e) => setInvite(e.target.value.toUpperCase())} />
          </Field>
          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy ? "Salvando…" : "Continuar"}
          </Button>
        </form>
      </div>
    </Screen>
  );
}
