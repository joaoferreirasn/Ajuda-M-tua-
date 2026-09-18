import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminGuard } from "@/components/admin-guard";
import { ErrorBox } from "@/components/shell";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminSetStatus, getAdminUser, searchAdminUsers } from "@/lib/app/admin-fns";
import { errMessage, formatWhen } from "@/lib/app/format";
import type { Profile } from "@/lib/app/types";

export const Route = createFileRoute("/admin/usuarios")({ component: AdminUsers });

function AdminUsers() {
  return (
    <AdminGuard title="Usuários">
      <UsersPanel />
    </AdminGuard>
  );
}

function UsersPanel() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof getAdminUser>> | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function search() {
    const list = await searchAdminUsers({ data: { q } });
    setRows(list);
  }

  useEffect(() => {
    search().catch(() => setRows([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function open(userId: string) {
    setSelected(userId);
    setDetail(await getAdminUser({ data: { userId } }));
  }

  async function setStatus(status: string) {
    if (!selected) return;
    setError(null);
    try {
      await adminSetStatus({ data: { userId: selected, status, reason } });
      toast.success("Status atualizado.");
      await open(selected);
      await search();
    } catch (err) {
      setError(errMessage(err));
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nome, ID ou e-mail" />
          <Button type="button" onClick={() => search().catch(() => {})}>
            Buscar
          </Button>
        </div>
        {rows.map((row) => (
          <button
            key={row.userId}
            type="button"
            onClick={() => void open(row.userId)}
            className="w-full rounded-2xl bg-surface p-3 text-left shadow-card"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{row.username}</p>
              <Badge tone={row.status === "active" ? "ok" : row.status === "blocked" ? "danger" : "warn"}>{row.status}</Badge>
            </div>
            <p className="text-xs text-muted">
              {row.publicId} · {row.email || "sem e-mail"}
            </p>
          </button>
        ))}
      </div>
      <div>
        {!detail ? (
          <p className="text-sm text-muted">Selecione um usuário para ver histórico e reputação.</p>
        ) : (
          <Card className="space-y-3">
            <div>
              <p className="text-lg font-semibold">{detail.profile.username}</p>
              <p className="text-sm text-muted">
                {detail.profile.publicId} · reputação {detail.profile.reputation}
              </p>
            </div>
            <ErrorBox message={error} />
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo da ação" />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => void setStatus("active")}>
                Desbloquear
              </Button>
              <Button size="sm" variant="outline" onClick={() => void setStatus("suspended")}>
                Suspender
              </Button>
              <Button size="sm" variant="danger" onClick={() => void setStatus("blocked")}>
                Bloquear
              </Button>
              <Button size="sm" variant="outline" onClick={() => void setStatus("suspicious")}>
                Marcar suspeito
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Histórico</p>
              {detail.history.map((h) => (
                <p key={h.id} className="text-xs text-muted">
                  {formatWhen(h.createdAt)} · {h.action} {h.details}
                </p>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
