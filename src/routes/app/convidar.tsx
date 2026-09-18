import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GuardedApp } from "@/components/app-guard";
import { EmptyState } from "@/components/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInviteInfo } from "@/lib/app/fns";
import { formatWhen } from "@/lib/app/format";

export const Route = createFileRoute("/app/convidar")({ component: ConvidarPage });

function ConvidarPage() {
  return (
    <GuardedApp title="Convidar amigos">
      {({ state }) => <InviteBody code={state.profile!.inviteCode} />}
    </GuardedApp>
  );
}

function InviteBody({ code }: { code: string }) {
  const [info, setInfo] = useState<Awaited<ReturnType<typeof getInviteInfo>> | null>(null);
  useEffect(() => {
    getInviteInfo().then(setInfo).catch(() => setInfo(null));
  }, []);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}/cadastro?ref=${encodeURIComponent(code)}`;

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiado.`);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        O bônus de indicação só é liberado depois que a pessoa indicada realmente participar — concluindo a primeira ajuda.
      </p>
      <Card className="space-y-3">
        <div>
          <p className="text-xs text-muted">Seu código</p>
          <p className="text-2xl font-semibold tracking-wide">{code}</p>
        </div>
        <p className="break-all text-xs text-muted">{url}</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => copy(code, "Código")}>
            Copiar código
          </Button>
          <Button onClick={() => copy(url, "Link")}>Copiar link</Button>
        </div>
      </Card>
      {!info?.invited.length ? (
        <EmptyState title="Nenhum convite usado ainda" body="Compartilhe o código. Quando a pessoa ajudar pela primeira vez, o bônus entra na sua conta." />
      ) : (
        <div className="space-y-2">
          {info.invited.map((row) => (
            <Card key={row.publicId} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{row.username}</p>
                <p className="text-xs text-muted">{formatWhen(row.createdAt)}</p>
              </div>
              <p className="text-xs font-medium text-muted">
                {row.status === "rewarded" ? "Bônus liberado" : "Aguardando participação"}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
