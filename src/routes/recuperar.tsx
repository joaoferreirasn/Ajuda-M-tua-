import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wordmark } from "@/components/brand";
import { Screen, ErrorBox } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { errMessage } from "@/lib/app/format";

export const Route = createFileRoute("/recuperar")({ component: Recuperar });

function Recuperar() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), redirectTo: "/login" }),
      });
      if (!res.ok) {
        /* still show the generic success to avoid account enumeration */
      }
      setDone(true);
    } catch (err) {
      setError(errMessage(err, "Não foi possível concluir agora. Tente o suporte se o problema continuar."));
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen className="justify-center">
      <div className="space-y-6">
        <Wordmark />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Recuperar senha</h1>
          <p className="mt-2 text-sm text-muted">Informe o e-mail da conta. Se ele existir, enviaremos o próximo passo.</p>
        </div>
        <ErrorBox message={error} />
        {done ? (
          <p className="rounded-xl bg-ok/10 px-3 py-3 text-sm text-ok">
            Se houver uma conta com este e-mail, as instruções serão enviadas. Você também pode alterar a senha depois de entrar.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="E-mail">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Enviando…" : "Enviar"}
            </Button>
          </form>
        )}
        <Link to="/login" className="block text-center text-sm font-medium text-primary">
          Voltar ao login
        </Link>
      </div>
    </Screen>
  );
}
