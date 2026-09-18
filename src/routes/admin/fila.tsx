import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin-guard";
import { Badge, Card } from "@/components/ui/card";
import { listAdminQueue } from "@/lib/app/admin-fns";

export const Route = createFileRoute("/admin/fila")({ component: AdminFila });

function AdminFila() {
  return (
    <AdminGuard title="Fila">
      <QueueTable />
    </AdminGuard>
  );
}

function QueueTable() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listAdminQueue>>>([]);
  useEffect(() => {
    listAdminQueue().then(setRows).catch(() => setRows([]));
  }, []);
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <Card key={row.userId} className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-medium">
              #{row.position} {row.username} {row.isSeed ? "(comunidade)" : ""}
            </p>
            <p className="text-xs text-muted">
              {row.publicId} · recebidas {row.helpsReceived} · feitas {row.helpsGiven} · créditos {row.creditsBalance}
            </p>
          </div>
          <Badge tone={row.status === "active" ? "ok" : "warn"}>{row.status}</Badge>
        </Card>
      ))}
    </div>
  );
}
