import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GuardedApp } from "@/components/app-guard";
import { EmptyState, StatCard } from "@/components/shell";
import { Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { listMyCredits } from "@/lib/app/fns";
import { formatWhen } from "@/lib/app/format";
import type { CreditTx } from "@/lib/app/types";

export const Route = createFileRoute("/app/creditos")({ component: CreditosPage });

function CreditosPage() {
  return (
    <GuardedApp title="Meus créditos">
      {({ state }) => <CreditsBody earned={state.profile!.creditsEarned} spent={state.profile!.creditsSpent} balance={state.profile!.creditsBalance} />}
    </GuardedApp>
  );
}

function CreditsBody({ earned, spent, balance }: { earned: number; spent: number; balance: number }) {
  const [rows, setRows] = useState<CreditTx[]>([]);
  useEffect(() => {
    listMyCredits().then(setRows).catch(() => setRows([]));
  }, []);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatCard icon={Coins} label="Saldo" value={balance} />
        <StatCard icon={Coins} label="Ganhos" value={earned} />
        <StatCard icon={Coins} label="Usados" value={spent} />
      </div>
      <p className="text-sm text-muted">
        Cada ajuda concluída gera 1 crédito. Receber ajuda na fila utiliza 1 crédito. O saldo nunca fica negativo e não pode ser alterado pelo aplicativo.
      </p>
      {rows.length === 0 ? (
        <EmptyState title="Sem movimentações" body="Quando você ajudar alguém, a transação aparece aqui." />
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <Card key={row.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{row.reason}</p>
                <p className="text-xs text-muted">{formatWhen(row.createdAt)}</p>
              </div>
              <p className={`text-sm font-semibold tabular-nums ${row.amount >= 0 ? "text-ok" : "text-danger"}`}>
                {row.amount > 0 ? `+${row.amount}` : row.amount}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
