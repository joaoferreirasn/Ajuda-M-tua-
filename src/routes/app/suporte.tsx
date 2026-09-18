import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GuardedApp } from "@/components/app-guard";
import { ErrorBox } from "@/components/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { createSupportTicket } from "@/lib/app/fns";
import { errMessage } from "@/lib/app/format";

export const Route = createFileRoute("/app/suporte")({ component: SuportePage });

function SuportePage() {
  return (
    <GuardedApp title="Suporte">
      {() => <SupportForm />}
    </GuardedApp>
  );
}

function SupportForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!navigator.onLine) {
      setError("É necessária conexão para enviar o pedido.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await createSupportTicket({ data: { subject, message } });
      toast.success("Pedido enviado. A equipe administrativa recebe o registro.");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm text-muted">
          Use este canal para problemas de acesso, link recusado ou conta bloqueada. Não pedimos senha e não prometemos resultados em promoções externas.
        </p>
      </Card>
      <ErrorBox message={error} />
      <form onSubmit={onSubmit} className="space-y-3">
        <Field label="Assunto">
          <Input required value={subject} onChange={(e) => setSubject(e.target.value)} />
        </Field>
        <Field label="Mensagem">
          <Textarea required value={message} onChange={(e) => setMessage(e.target.value)} />
        </Field>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Enviando…" : "Enviar"}
        </Button>
      </form>
    </div>
  );
}
