import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Wordmark } from "@/components/brand";
import { Screen, ErrorBox, Disclaimer } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { completeOnboarding } from "@/lib/app/fns";
import { DISCLAIMER } from "@/lib/app/copy";
import { errMessage } from "@/lib/app/format";

export const Route = createFileRoute("/cadastro")({
  validateSearch: (search: Record<string, unknown>): { ref?: string } => ({
    ref: typeof search.ref === "string" ? search.ref : undefined,
  }),
  component: Cadastro,
});

function Cadastro() {
  const { user, isPending } = useCurrentUserState();
  const { ref } = Route.useSearch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [invite, setInvite] = useState(ref ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) return <Navigate to="/app" />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("A confirmação de senha não confere.");
      return;
    }
    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    setBusy(true);
    try {
      const { error: authError } = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: username.trim(),
        callbackURL: "/app",
      });
      if (authError) throw new Error(authError.message || "Não foi possível criar a conta.");
      await authClient.getSession();
      await completeOnboarding({ data: { username: username.trim(), inviteCode: invite } });
      window.location.href = "/app/link";
    } catch (err) {
      setError(errMessage(err, "Não foi possível criar a conta."));
      setBusy(false);
    }
  }

  return (
    <Screen>
      <div className="stagger-in space-y-6">
        <Wordmark />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Criar conta</h1>
          <p className="mt-2 text-sm text-muted">Entre no círculo. Sem promessas de prêmio — só organização da ajuda mútua.</p>
        </div>
        <Disclaimer text={DISCLAIMER} />
        <ErrorBox message={error} />
        {authEnabled ? (
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="Nome de usuário">
              <Input
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: ana_silva"
              />
            </Field>
            <Field label="E-mail">
              <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Senha">
              <Input type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Field label="Confirmar senha">
              <Input type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </Field>
            <Field label="Código de convite (opcional)">
              <Input value={invite} onChange={(e) => setInvite(e.target.value.toUpperCase())} placeholder="Se alguém te indicou" />
            </Field>
            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? "Criando…" : "Criar conta"}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-muted">Cadastro desativado.</p>
        )}
        <p className="text-center text-sm text-muted">
          Já tem conta?{" "}
          <Link to="/login" className="font-medium text-primary">
            Entrar
          </Link>
        </p>
      </div>
    </Screen>
  );
}
