import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GuardedApp } from "@/components/app-guard";
import { ErrorBox } from "@/components/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { saveMyLink } from "@/lib/app/fns";
import { errMessage, formatWhen } from "@/lib/app/format";

export const Route = createFileRoute("/app/link")({ component: LinkPage });

function LinkPage() {
  return (
    <GuardedApp title="Meu link">
      {({ state, reload }) => {
        const p = state.profile!;
        return <LinkForm current={p.link} description={p.linkDescription} updated={p.queueJoinedAt} reload={reload} />;
      }}
    </GuardedApp>
  );
}

function LinkForm({
  current,
  description,
  updated,
  reload,
}: {
  current: string | null;
  description: string | null;
  updated: string | null;
  reload: () => Promise<unknown>;
}) {
  const [link, setLink] = useState(current ?? "");
  const [desc, setDesc] = useState(description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!navigator.onLine) {
      setError("É necessária conexão para salvar o link.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await saveMyLink({ data: { link, description: desc } });
      toast.success("Link salvo.");
      await reload();
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Cadastre o seu link de participação em uma promoção ou jogo promocional externo do TikTok. O mesmo link não pode ser usado por outra conta.
      </p>
      <ErrorBox message={error} />
      <form onSubmit={onSubmit} className="space-y-3">
        <Field label="Link">
          <Input required value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.tiktok.com/..." />
        </Field>
        <Field label="Nome ou descrição (opcional)">
          <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ex.: Live da promoção" />
        </Field>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Validando…" : "Salvar link"}
        </Button>
      </form>
      {current && (
        <Card>
          <p className="text-xs text-muted">Link atual</p>
          <p className="mt-1 break-all text-sm">{current}</p>
          {updated && <p className="mt-2 text-xs text-muted">Na fila desde {formatWhen(updated)}</p>}
        </Card>
      )}
    </div>
  );
}
