import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GuardedApp } from "@/components/app-guard";
import { EmptyState } from "@/components/shell";
import { Card } from "@/components/ui/card";
import { listMyHistory } from "@/lib/app/fns";
import { formatWhen } from "@/lib/app/format";
import type { HistoryItem } from "@/lib/app/types";

export const Route = createFileRoute("/app/historico")({ component: HistoricoPage });

function HistoricoPage() {
  return (
    <GuardedApp title="Histórico">
      {() => <HistoryList />}
    </GuardedApp>
  );
}

function HistoryList() {
  const [rows, setRows] = useState<HistoryItem[]>([]);
  useEffect(() => {
    listMyHistory().then(setRows).catch(() => setRows([]));
  }, []);
  if (!rows.length) {
    return <EmptyState title="Nada registrado ainda" body="Ajudas, créditos, convites e denúncias aparecem com data e hora." />;
  }
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <Card key={row.id}>
          <p className="text-sm font-medium">{row.action}</p>
          {row.details && <p className="mt-1 text-sm text-muted">{row.details}</p>}
          <p className="mt-2 text-xs text-muted">{formatWhen(row.createdAt)}</p>
        </Card>
      ))}
    </div>
  );
}
