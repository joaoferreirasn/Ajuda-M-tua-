import { createFileRoute } from "@tanstack/react-router";
import { GuardedApp } from "@/components/app-guard";
import { Disclaimer } from "@/components/shell";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/app/regras")({ component: RegrasPage });

const RULES = [
  {
    title: "O que é",
    body: "O Ajuda Mútua só organiza a reciprocidade entre participantes. Cada pessoa cadastra o próprio link e ajuda as demais acessando os links da fila.",
  },
  {
    title: "Créditos",
    body: "Concluir uma ajuda gera +1 crédito. Receber ajuda na fila utiliza 1 crédito. O saldo nunca fica negativo e ninguém altera o próprio saldo pelo app.",
  },
  {
    title: "Fila",
    body: "A fila é automática. Quem espera mais e recebeu menos ajuda tem prioridade. Não é possível escolher quem ajudar.",
  },
  {
    title: "Duplicidade",
    body: "A mesma conta não ajuda a mesma pessoa duas vezes. O mesmo link não pode ser cadastrado em contas diferentes.",
  },
  {
    title: "Reputação",
    body: "Ajudar sobe a reputação. Denúncias confirmadas e comportamento irregular descem. Contas suspeitas podem ser suspensas.",
  },
  {
    title: "Indicações",
    body: "O bônus de convite só entra depois que a pessoa indicada participa de verdade, concluindo uma ajuda.",
  },
  {
    title: "Gratuito",
    body: "Esta versão é 100% gratuita. Não há assinatura, cobrança ou créditos pagos.",
  },
];

function RegrasPage() {
  return (
    <GuardedApp title="Regras">
      {({ state }) => (
        <div className="space-y-3">
          <Disclaimer text={state.disclaimer} />
          {RULES.map((rule) => (
            <Card key={rule.title}>
              <p className="font-medium">{rule.title}</p>
              <p className="mt-1 text-sm text-muted">{rule.body}</p>
            </Card>
          ))}
        </div>
      )}
    </GuardedApp>
  );
}
