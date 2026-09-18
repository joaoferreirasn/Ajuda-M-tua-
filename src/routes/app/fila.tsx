import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GuardedApp } from "@/components/app-guard";
import { EmptyState, ProgressBar } from "@/components/shell";
import { Card } from "@/components/ui/card";
import { getQueueBoard } from "@/lib/app/fns";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/app/fila")({ component: FilaPage });

function FilaPage() {
  return (
    <GuardedApp title="Minha posição na fila">
      {({ state }) => <FilaBody mine={state.queue} />}
    </GuardedApp>
  );
}

function FilaBody({
  mine,
}: {
  mine: { position: number | null; eligibleCount: number; helpsNeeded: number; helpsRemaining: number; inQueue: boolean } | null;
}) {
  const [board, setBoard] = useState<Awaited<ReturnType<typeof getQueueBoard>> | null>(null);
  useEffect(() => {
    getQueueBoard().then(setBoard).catch(() => setBoard(null));
  }, []);
  const q = board?.mine ?? mine;
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm text-muted">Sua posição</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">{q?.inQueue ? `#${q.position}` : "Fora da fila"}</p>
        <p className="mt-2 text-sm text-muted">{q?.eligibleCount ?? 0} participantes elegíveis agora</p>
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs text-muted">
            <span>Ajudas restantes neste ciclo</span>
            <span className="tabular-nums">{q?.helpsRemaining}/{q?.helpsNeeded}</span>
          </div>
          <ProgressBar value={(q?.helpsNeeded ?? 10) - (q?.helpsRemaining ?? 10)} max={q?.helpsNeeded ?? 10} />
        </div>
      </Card>
      <p className="text-sm text-muted">
        A fila prioriza quem espera há mais tempo e recebeu menos ajudas, para não concentrar em poucas contas.
      </p>
      {!board?.participants.length ? (
        <EmptyState title="Fila vazia" body="Quando houver links cadastrados, as posições aparecem aqui." />
      ) : (
        <div className="space-y-2">
          {board.participants.map((row) => (
            <div
              key={row.publicId}
              className={cn(
                "flex items-center justify-between rounded-2xl bg-surface px-4 py-3 shadow-card",
                row.isMe && "ring-2 ring-primary/30",
              )}
            >
              <div>
                <p className="text-sm font-medium">
                  #{row.position} {row.isMe ? "Você" : row.username}
                </p>
                <p className="text-xs text-muted">
                  {row.publicId} · {row.helpsReceived} recebidas · {row.helpsGiven} feitas
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
