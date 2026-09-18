import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AdminGuard } from "@/components/admin-guard";
import { ErrorBox } from "@/components/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { adminAdjustCredits, getAdminUser, searchAdminUsers } from "@/lib/app/admin-fns";
import { errMessage, formatWhen } from "@/lib/app/format";

export const Route = createFileRoute("/admin/creditos")({ component: AdminCredits });

function AdminCredits() {
  return (
    <AdminGuard title="Créditos">
      <CreditsPanel />
    </AdminGuard>
  );
}

function CreditsPanel() {
  const [q, setQ] = useState("");
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("1");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof getAdminUser>> | null>(null);

  async function find() {
    const list = await searchAdminUsers({ data: { q } });
    const first = list[0];
    if (!first) throw new Error("Usuário não encontrado.");
    setUserId(first.userId);
    setDetail(await getAdminUser({ data: { userId: first.userId } }));
  }

  async function apply() {
    setError(null);
    try {
      if (!userId) await find();
      const id = userId || (await searchAdminUsers({ data: { q } }))[0]?.userId;
      if (!id) throw new Error("Usuário não encontrado.");
      await adminAdjustCredits({ data: { userId: id, amount: Number(amount), reason } });
      toast.success("Créditos ajustados e registrados.");
      setDetail(await getAdminUser({ data: { userId: id } }));
    } catch (err) {
      setError(errMessage(err));
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <p className="text-sm text-muted">Toda correção gera log administrativo e transação. O saldo não pode ficar negativo.</p>
      <ErrorBox message={error} />
      <Field label="Buscar usuário">
        <div className="flex gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="nome, ID ou e-mail" />
          <Button type="button" variant="outline" onClick={() => find().catch((err) => setError(errMessage(err)))}>
            Abrir
          </Button>
        </div>
      </Field>
      {detail && (
        <Card>
          <p className="font-medium">{detail.profile.username}</p>
          <p className="text-sm text-muted">Saldo atual: {detail.profile.creditsBalance}</p>
        </Card>
      )}
      <Field label="Valor (use negativo para debitar)">
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>
      <Field label="Motivo">
        <Input value={reason} onChange={(e) => setReason(e.target.value)} required />
      </Field>
      <Button onClick={() => void apply()}>Registrar correção</Button>
      {detail && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Transações</p>
          {detail.transactions.map((tx) => (
            <Card key={tx.id} className="flex justify-between text-sm">
              <span>{tx.reason}</span>
              <span className="tabular-nums">
                {tx.amount > 0 ? "+" : ""}
                {tx.amount} · {formatWhen(tx.createdAt)}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
