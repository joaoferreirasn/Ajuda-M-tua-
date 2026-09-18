//#region node_modules/.nitro/vite/services/ssr/assets/format-B3soZhnF.js
function formatWhen(iso) {
	if (!iso) return "—";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleString("pt-BR", {
		timeZone: "America/Sao_Paulo",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function formatDay(iso) {
	if (!iso) return "—";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleDateString("pt-BR", {
		timeZone: "America/Sao_Paulo",
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function errMessage(err, fallback = "Algo deu errado. Tente novamente.") {
	if (err && typeof err === "object" && "message" in err && typeof err.message === "string") {
		const msg = err.message;
		if (msg === "Unauthorized") return "Sessão expirada. Entre novamente.";
		if (msg.toLowerCase().includes("failed to fetch") || msg.toLowerCase().includes("network")) return "Sem conexão. É necessária internet para esta ação.";
		return msg;
	}
	return fallback;
}
//#endregion
export { formatDay as n, formatWhen as r, errMessage as t };
