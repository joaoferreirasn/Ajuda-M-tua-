import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin-guard";
import { Card } from "@/components/ui/card";
import { getAdminStats, listAdminLogs, listSupportTickets } from "@/lib/app/admin-fns";
import { formatWhen } from "@/lib/app/format";
import type { AdminStats } from "@/lib/app/types";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  return (
    <AdminGuard title="Painel administrativo">
      <AdminDash />
    </AdminGuard>
  );
}

function AdminDash() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<Awaited<ReturnType<typeof listAdminLogs>>>([]);
  const [tickets, setTickets] = useState<Awaited<ReturnType<typeof listSupportTickets>>>([]);
  useEffect(() => {
    getAdminStats().then(setStats).catch(() => setStats(null));
    listAdminLogs().then(setLogs).catch(() => setLogs([]));
    listSupportTickets().then(setTickets).catch(() => setTickets([]));
  }, []);
  const items = stats
    ? [
        ["Usuários", stats.totalUsers],
        ["Ativos", stats.activeUsers],
        ["Bloqueados", stats.blockedUsers],
        ["Novos (7d)", stats.newUsers],
        ["Links", stats.links],
        ["Ajudas feitas", stats.helpsDone],
        ["Ajudas recebidas", stats.helpsReceived],
        ["Créditos movidos", stats.creditsMoved],
        ["Denúncias", stats.pendingReports],
        ["Suspeitos", stats.suspiciousUsers],
        ["Tickets", stats.openTickets],
      ]
    : [];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(([label, value]) => (
          <Card key={String(label)}>
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
          </Card>
        ))}
      </div>
      <section className="space-y-2">
        <h2 className="text-sm font-medium">Pedidos de suporte</h2>
        {tickets.slice(0, 5).map((t) => (
          <Card key={t.id}>
            <p className="text-sm font-medium">
              {t.username} · {t.subject}
            </p>
            <p className="mt-1 text-sm text-muted">{t.message}</p>
            <p className="mt-1 text-xs text-muted">{formatWhen(t.createdAt)}</p>
          </Card>
        ))}
        {tickets.length === 0 && <p className="text-sm text-muted">Nenhum ticket aberto.</p>}
      </section>
      <section className="space-y-2">
        <h2 className="text-sm font-medium">Auditoria recente</h2>
        {logs.map((log) => (
          <Card key={log.id} className="text-sm">
            <p className="font-medium">{log.action}</p>
            <p className="text-muted">{log.details}</p>
            <p className="text-xs text-muted">{formatWhen(log.createdAt)}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
