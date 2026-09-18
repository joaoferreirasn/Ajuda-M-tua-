import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminGuard } from "@/components/admin-guard";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listAdminReports, reviewReport } from "@/lib/app/admin-fns";
import { formatWhen } from "@/lib/app/format";
import type { ReportRow } from "@/lib/app/types";

export const Route = createFileRoute("/admin/denuncias")({ component: AdminReports });

function AdminReports() {
  return (
    <AdminGuard title="Denúncias">
      <ReportsPanel />
    </AdminGuard>
  );
}

function ReportsPanel() {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [note, setNote] = useState("");
  useEffect(() => {
    listAdminReports().then(setRows).catch(() => setRows([]));
  }, []);

  async function act(id: number, status: string, suspend = false) {
    await reviewReport({ data: { reportId: id, status, note, suspend } });
    toast.success("Denúncia atualizada.");
    setRows(await listAdminReports());
  }

  return (
    <div className="space-y-3">
      <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Observação administrativa" />
      {rows.map((row) => (
        <Card key={row.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">
              {row.reporterUsername} → {row.reportedUsername}
            </p>
            <Badge tone={row.status === "confirmed" ? "danger" : row.status === "rejected" ? "ok" : "warn"}>{row.status}</Badge>
          </div>
          <p className="text-sm">
            {row.reason}
            {row.description ? ` — ${row.description}` : ""}
          </p>
          <p className="text-xs text-muted">{formatWhen(row.createdAt)}</p>
          {row.status === "pending" || row.status === "reviewing" ? (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => void act(row.id, "reviewing")}>
                Analisar
              </Button>
              <Button size="sm" onClick={() => void act(row.id, "confirmed")}>
                Confirmar
              </Button>
              <Button size="sm" variant="danger" onClick={() => void act(row.id, "confirmed", true)}>
                Confirmar e suspender
              </Button>
              <Button size="sm" variant="outline" onClick={() => void act(row.id, "rejected")}>
                Rejeitar
              </Button>
            </div>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
