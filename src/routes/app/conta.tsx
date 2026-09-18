import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { authClient, signOut, authEnabled } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { GuardedApp } from "@/components/app-guard";
import { ErrorBox, reputationTone } from "@/components/shell";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { errMessage, formatDay } from "@/lib/app/format";

export const Route = createFileRoute("/app/conta")({ component: ContaPage });

function ContaPage() {
  return (
    <GuardedApp title="Minha conta">
      {({ state }) => {
        const p = state.profile!;
        const q = state.queue;
        return (
          <div className="space-y-4">
            <Card className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xl font-semibold">{p.username}</p>
                  <p className="text-sm text-muted">{p.publicId}</p>
                </div>
                <Badge tone={reputationTone(p.reputationKey)}>{p.reputationLevel}</Badge>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <Info k="E-mail" v={p.email || "—"} />
                <Info k="Cadastro" v={formatDay(p.createdAt)} />
                <Info k="Créditos" v={String(p.creditsBalance)} />
                <Info k="Reputação" v={String(p.reputation)} />
                <Info k="Ajudas feitas" v={String(p.helpsGiven)} />
                <Info k="Ajudas recebidas" v={String(p.helpsReceived)} />
                <Info k="Fila" v={q?.inQueue ? `#${q.position}` : "Fora"} />
                <Info k="Convite" v={p.inviteCode} />
              </dl>
              <p className="break-all text-xs text-muted">{p.link || "Nenhum link cadastrado"}</p>
            </Card>
            <PasswordBox />
            <div className="flex flex-col gap-2">
              <Link to="/app/historico" className="text-sm font-medium text-primary">
                Ver histórico completo
              </Link>
              <Link to="/app/denunciar" className="text-sm text-muted">
                Denunciar um participante
              </Link>
            </div>
            <div className="rounded-2xl bg-surface p-4 shadow-card">
              <p className="mb-3 text-sm font-medium">Sessão</p>
              {authEnabled && !hasGateSessionMarker() && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => void signOut().catch(() => toast.error("Não foi possível sair agora."))}
                >
                  Sair
                </Button>
              )}
            </div>
          </div>
        );
      }}
    </GuardedApp>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-bg px-3 py-2">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

function PasswordBox() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      setError("A confirmação não confere.");
      return;
    }
    if (next.length < 8) {
      setError("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error: authError } = await authClient.changePassword({
        currentPassword: current,
        newPassword: next,
        revokeOtherSessions: true,
      });
      if (authError) throw new Error(authError.message || "Não foi possível alterar a senha.");
      toast.success("Senha atualizada.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(errMessage(err, "Esta opção vale para contas criadas com e-mail e senha."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <p className="mb-3 text-sm font-medium">Alterar senha</p>
      <ErrorBox message={error} />
      <form onSubmit={onSubmit} className="mt-3 space-y-3">
        <Field label="Senha atual">
          <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </Field>
        <Field label="Nova senha">
          <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} required />
        </Field>
        <Field label="Confirmar nova senha">
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </Field>
        <Button type="submit" variant="outline" className="w-full" disabled={busy}>
          {busy ? "Salvando…" : "Atualizar senha"}
        </Button>
      </form>
    </Card>
  );
}
