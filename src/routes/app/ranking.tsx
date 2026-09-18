import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GuardedApp } from "@/components/app-guard";
import { EmptyState } from "@/components/shell";
import { getRanking } from "@/lib/app/fns";
import { cn } from "@/lib/cn";
import type { RankingRow } from "@/lib/app/types";

export const Route = createFileRoute("/app/ranking")({ component: RankingPage });

function RankingPage() {
  return (
    <GuardedApp title="Ranking">
      {() => <RankingList />}
    </GuardedApp>
  );
}

function RankingList() {
  const [rows, setRows] = useState<RankingRow[]>([]);
  useEffect(() => {
    getRanking().then(setRows).catch(() => setRows([]));
  }, []);
  if (!rows.length) {
    return <EmptyState title="Ranking ainda vazio" body="As pessoas que mais ajudam aparecem aqui automaticamente." />;
  }
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted">Quem mais ajuda o círculo. Atualizado a cada ação concluída.</p>
      {rows.map((row) => (
        <div
          key={row.publicId}
          className={cn(
            "flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-card",
            row.isMe && "ring-2 ring-primary/30",
          )}
        >
          <span className="w-8 text-sm font-semibold tabular-nums text-muted">#{row.position}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{row.isMe ? `${row.username} (você)` : row.username}</p>
            <p className="text-xs text-muted">{row.reputationLevel}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums">{row.helpsGiven}</p>
            <p className="text-xs text-muted">ajudas</p>
          </div>
        </div>
      ))}
    </div>
  );
}
