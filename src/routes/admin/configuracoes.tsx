import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminGuard } from "@/components/admin-guard";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { getAdminSettings, saveAdminSettings } from "@/lib/app/admin-fns";

export const Route = createFileRoute("/admin/configuracoes")({ component: AdminSettings });

const FIELDS: { key: string; label: string; area?: boolean }[] = [
  { key: "welcome_credits", label: "Créditos iniciais" },
  { key: "help_credit_reward", label: "Créditos por ajuda" },
  { key: "receive_credit_cost", label: "Custo ao receber ajuda" },
  { key: "referral_bonus_credits", label: "Bônus de indicação (créditos)" },
  { key: "referral_bonus_reputation", label: "Bônus de indicação (reputação)" },
  { key: "help_reputation_delta", label: "Reputação por ajuda" },
  { key: "cycle_size", label: "Tamanho do ciclo da fila" },
  { key: "max_helps_per_hour", label: "Limite de ajudas por hora" },
  { key: "min_help_seconds", label: "Tempo mínimo para confirmar (s)" },
  { key: "max_reports_per_day", label: "Limite de denúncias por dia" },
  { key: "max_link_updates_per_day", label: "Limite de alterações de link por dia" },
  { key: "assignment_ttl_minutes", label: "Validade da tarefa (min)" },
  { key: "auto_block_confirmed_reports", label: "Bloqueio automático após N denúncias" },
  { key: "fast_complete_flag_seconds", label: "Sinalizar confirmação rápida (s)" },
  { key: "disclaimer", label: "Aviso geral", area: true },
];

function AdminSettings() {
  return (
    <AdminGuard title="Configurações">
      <SettingsForm />
    </AdminGuard>
  );
}

function SettingsForm() {
  const [entries, setEntries] = useState<Record<string, string>>({});
  useEffect(() => {
    getAdminSettings().then(setEntries).catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveAdminSettings({ data: { entries } });
    toast.success("Configurações salvas.");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-3">
      {FIELDS.map((field) => (
        <Field key={field.key} label={field.label}>
          {field.area ? (
            <Textarea
              value={entries[field.key] ?? ""}
              onChange={(e) => setEntries((prev) => ({ ...prev, [field.key]: e.target.value }))}
            />
          ) : (
            <Input
              value={entries[field.key] ?? ""}
              onChange={(e) => setEntries((prev) => ({ ...prev, [field.key]: e.target.value }))}
            />
          )}
        </Field>
      ))}
      <Button type="submit">Salvar regras</Button>
    </form>
  );
}
