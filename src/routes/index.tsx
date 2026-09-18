import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowRight, Handshake, Link2, ShieldCheck } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Wordmark } from "@/components/brand";
import { Disclaimer, Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { DISCLAIMER } from "@/lib/app/copy";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  if (!isPending && user) return <Navigate to="/app" />;

  return (
    <Screen>
      <div className="stagger-in flex flex-1 flex-col">
        <Wordmark />
        <div className="mt-10 space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Comunidade de reciprocidade</p>
          <h1 className="text-4xl font-semibold tracking-tight">Ajude. Receba ajuda. Sem promessas vazias.</h1>
          <p className="text-base leading-relaxed text-muted">
            O Ajuda Mútua organiza a participação entre pessoas que compartilham links de promoções e jogos do TikTok. Você ajuda alguém, entra na fila, e o círculo continua.
          </p>
        </div>
        <div className="mt-8 space-y-3">
          {[
            { icon: Handshake, title: "Ajudar alguém", body: "O sistema escolhe o próximo participante elegível. Sem escolha manual, sem privilegiar amigos." },
            { icon: Link2, title: "Seu link na fila", body: "Cadastre um único link. Ninguém mais pode usar o mesmo. A posição atualiza sozinha." },
            { icon: ShieldCheck, title: "Créditos e reputação", body: "Cada ajuda vale participação real, registrada. Denúncias e antifraude protegem o círculo." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 rounded-2xl bg-surface p-4 shadow-card">
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-4" />
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-3">
          <Link to="/cadastro">
            <Button className="w-full" size="lg">
              Criar conta gratuita
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button className="w-full" variant="outline" size="lg">
              Já tenho conta
            </Button>
          </Link>
        </div>
        <div className="mt-8">
          <Disclaimer text={DISCLAIMER} />
        </div>
      </div>
    </Screen>
  );
}
