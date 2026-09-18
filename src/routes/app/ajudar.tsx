import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Flag, Handshake } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GuardedApp } from "@/components/app-guard";
import { EmptyState, ErrorBox } from "@/components/shell";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { assignHelp, completeHelp, markHelpOpened } from "@/lib/app/fns";
import { errMessage, formatWhen } from "@/lib/app/format";
import type { HelpTask } from "@/lib/app/types";

export const Route = createFileRoute("/app/ajudar")({ component: AjudarPage });

function AjudarPage() {
  return (
    <GuardedApp title="Ajudar alguém">
      {({ state, reload }) => <AjudarBody initial={state.openHelp} reload={reload} />}
    </GuardedApp>
  );
}

function AjudarBody({
  initial,
  reload,
}: {
  initial: HelpTask | null;
  reload: () => Promise<unknown>;
}) {
  const [task, setTask] = useState<HelpTask | null>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);

  async function assign() {
    if (!navigator.onLine) {
      setError("É necessária conexão com a internet para receber uma tarefa.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await assignHelp();
      if (!res.task) {
        setEmpty(true);
        setTask(null);
      } else {
        setTask(res.task);
        setEmpty(false);
      }
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function openLink() {
    if (!task) return;
    setBusy(true);
    setError(null);
    try {
      await markHelpOpened({ data: { helpId: task.id } });
      setTask({ ...task, status: "opened", openedAt: new Date().toISOString() });
      window.open(task.link, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    if (!task) return;
    if (!navigator.onLine) {
      setError("Sem conexão. A ajuda só é registrada quando o servidor confirma.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await completeHelp({ data: { helpId: task.id } });
      toast.success("Ajuda registrada. Você ganhou 1 crédito.");
      setTask(null);
      await reload();
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        O sistema escolhe o próximo participante elegível. Você nunca ajuda a mesma pessoa duas vezes.
      </p>
      <ErrorBox message={error} />
      {!task && !empty && (
        <Button className="w-full" size="lg" onClick={assign} disabled={busy}>
          <Handshake className="size-5" />
          {busy ? "Buscando…" : "Receber próxima pessoa"}
        </Button>
      )}
      {empty && (
        <EmptyState
          title="Ninguém elegível agora"
          body="Convide amigos ou volte daqui a pouco. A fila evita repetir as mesmas pessoas."
          action={
            <Link to="/app/convidar">
              <Button variant="outline">Convidar amigos</Button>
            </Link>
          }
        />
      )}
      {task && (
        <Card className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted">Próximo participante</p>
              <h2 className="text-xl font-semibold">{task.helpedUsername}</h2>
              <p className="text-sm text-muted">{task.helpedPublicId}</p>
            </div>
            <Badge tone="primary">{task.status === "opened" ? "Link aberto" : "Na fila"}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl bg-bg px-3 py-2">
              <p className="text-xs text-muted">Ajudas recebidas</p>
              <p className="font-medium tabular-nums">{task.helpedHelpsReceived}</p>
            </div>
            <div className="rounded-xl bg-bg px-3 py-2">
              <p className="text-xs text-muted">Atribuída em</p>
              <p className="font-medium">{formatWhen(task.assignedAt)}</p>
            </div>
          </div>
          <p className="break-all rounded-xl bg-bg px-3 py-2 text-xs text-muted">{task.link}</p>
          <Button className="w-full" size="lg" onClick={openLink} disabled={busy}>
            <ExternalLink className="size-4" />
            Abrir link
          </Button>
          <Button className="w-full" variant="outline" size="lg" onClick={confirm} disabled={busy}>
            Concluí a ajuda
          </Button>
          <Link
            to="/app/denunciar"
            search={{ id: task.helpedPublicId }}
            className="flex items-center justify-center gap-2 text-sm text-muted"
          >
            <Flag className="size-4" />
            Denunciar este link
          </Link>
        </Card>
      )}
    </div>
  );
}
