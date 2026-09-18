import { createFileRoute, Link } from "@tanstack/react-router";
import { Coins, Handshake, HeartHandshake, ListOrdered, Star } from "lucide-react";
import { GuardedApp } from "@/components/app-guard";
import { Disclaimer, ProgressBar, StatCard, reputationTone } from "@/components/shell";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/")({ component: Dashboard });

function Dashboard() {
  return (
    <GuardedApp>
      {({ state }) => {
        const p = state.profile!;
        const q = state.queue;
        const received = p.helpsReceived % (q?.helpsNeeded ?? 10);
        const needed = q?.helpsNeeded ?? 10;
        return (
          <div className="stagger-in space-y-4">
            <div>
              <p className="text-sm text-muted">Olá, {p.username}</p>
              <h1 className="text-2xl font-semibold tracking-tight">Seu círculo hoje</h1>
            </div>
            {p.status === "suspicious" && (
              <p className="rounded-xl bg-warn/12 px-3 py-2 text-sm text-warn">
                Conta em observação. Continue ajudando com calma para recuperar reputação.
              </p>
            )}
            {p.status === "suspended" && (
              <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
                Conta suspensa temporariamente. {p.blockReason}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Coins} label="Créditos" value={p.creditsBalance} hint={`${p.creditsEarned} ganhos`} />
              <StatCard
                icon={ListOrdered}
                label="Posição na fila"
                value={q?.inQueue ? `#${q.position}` : "Fora"}
                hint={q?.inQueue ? `${q.eligibleCount} na fila` : "Cadastre o link e tenha créditos"}
              />
              <StatCard icon={Handshake} label="Ajudas realizadas" value={p.helpsGiven} />
              <StatCard icon={HeartHandshake} label="Ajudas recebidas" value={p.helpsReceived} />
            </div>
            <div className="rounded-2xl bg-surface p-4 shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Reputação</p>
                <Badge tone={reputationTone(p.reputationKey)}>
                  {p.reputationLevel} · {p.reputation}
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-2 text-muted">
                <Star className="size-4 text-primary" />
                <span className="text-xs">Ações positivas sobem. Denúncias confirmadas descem.</span>
              </div>
            </div>
            <div className="rounded-2xl bg-surface p-4 shadow-card">
              <div className="mb-2 flex items-center justify-between text-sm">
                <p className="font-medium">Progresso do ciclo</p>
                <p className="tabular-nums text-muted">
                  {received}/{needed}
                </p>
              </div>
              <ProgressBar value={received} max={needed} />
              <p className="mt-2 text-xs text-muted">
                {q?.helpsRemaining ?? needed} ajudas restantes neste ciclo de {needed}.
              </p>
            </div>
            <Link to="/app/ajudar" className="block">
              <Button className="w-full" size="lg" variant="accent">
                <Handshake className="size-5" />
                Ajudar alguém
              </Button>
            </Link>
            {!p.link && (
              <Link to="/app/link" className="block text-center text-sm font-medium text-primary">
                Cadastrar meu link para entrar na fila
              </Link>
            )}
            <Disclaimer text={state.disclaimer} />
          </div>
        );
      }}
    </GuardedApp>
  );
}
