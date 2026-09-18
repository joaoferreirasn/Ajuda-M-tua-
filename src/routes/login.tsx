import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Wordmark } from "@/components/brand";
import { Screen, ErrorBox } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { errMessage } from "@/lib/app/format";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) return <Navigate to="/app" />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error: authError } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/app",
      });
      if (authError) throw new Error(authError.message || "Não foi possível entrar.");
      window.location.href = "/app";
    } catch (err) {
      setError(errMessage(err, "E-mail ou senha inválidos."));
      setBusy(false);
    }
  }

  return (
    <Screen className="justify-center">
      <div className="stagger-in space-y-6">
        <Wordmark />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Entrar</h1>
          <p className="mt-2 text-sm text-muted">Acesse sua conta para continuar o círculo de ajuda.</p>
        </div>
        <ErrorBox message={error} />
        {authEnabled ? (
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="E-mail">
              <Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Senha">
              <Input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-muted">O acesso está desativado no momento.</p>
        )}
        <p className="text-center text-xs text-muted">
          Entre com seu e-mail e senha para acessar o Ajuda Mútua.
        </p>
        <p className="text-center text-sm text-muted">
          Não tem conta?{" "}
          <Link to="/cadastro" className="font-medium text-primary">
            Criar conta
          </Link>
        </p>
        <p className="text-center text-sm">
          <Link to="/recuperar" className="text-muted underline-offset-4 hover:underline">
            Esqueci minha senha
          </Link>
        </p>
      </div>
    </Screen>
  );
}
