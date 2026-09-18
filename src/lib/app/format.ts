export function formatWhen(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDay(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function errMessage(err: unknown, fallback = "Algo deu errado. Tente novamente.") {
  if (err && typeof err === "object" && "message" in err && typeof (err as Error).message === "string") {
    const msg = (err as Error).message;
    if (msg === "Unauthorized") return "Sessão expirada. Entre novamente.";
    if (msg.toLowerCase().includes("failed to fetch") || msg.toLowerCase().includes("network")) {
      return "Sem conexão. É necessária internet para esta ação.";
    }
    return msg;
  }
  return fallback;
}
