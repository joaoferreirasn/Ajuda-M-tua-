import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GuardedApp } from "@/components/app-guard";
import { ErrorBox } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { createReport } from "@/lib/app/fns";
import { errMessage } from "@/lib/app/format";

export const Route = createFileRoute("/app/denunciar")({
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  component: DenunciarPage,
});

const REASONS = [
  { id: "spam", label: "Spam" },
  { id: "fraude", label: "Fraude" },
  { id: "link_invalido", label: "Link inválido" },
  { id: "abuso", label: "Abuso" },
  { id: "irregular", label: "Comportamento irregular" },
  { id: "outro", label: "Outro" },
];

function DenunciarPage() {
  const { id } = Route.useSearch();
  return (
    <GuardedApp title="Denúncia">
      {() => <ReportForm prefill={id ?? ""} />}
    </GuardedApp>
  );
}

function ReportForm({ prefill }: { prefill: string }) {
  const [target, setTarget] = useState(prefill);
  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!navigator.onLine) {
      setError("É necessária conexão para registrar a denúncia.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await createReport({
        data: { reportedPublicId: target, reason, description },
      });
      toast.success("Denúncia enviada para análise.");
      setDescription("");
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        A denúncia fica pendente até um administrador analisar. Denúncias confirmadas reduzem reputação e podem bloquear a conta.
      </p>
      <ErrorBox message={error} />
      <form onSubmit={onSubmit} className="space-y-3">
        <Field label="ID ou nome de usuário">
          <Input required value={target} onChange={(e) => setTarget(e.target.value)} placeholder="AM-XXXXXX" />
        </Field>
        <Field label="Motivo">
          <select
            className="h-12 w-full rounded-xl bg-surface px-4 text-base shadow-card outline-none focus:ring-2 focus:ring-ring/40"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {REASONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Descrição">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="O que aconteceu?" />
        </Field>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Enviando…" : "Enviar denúncia"}
        </Button>
      </form>
    </div>
  );
}
