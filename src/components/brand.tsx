import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("text-primary", className)}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="14" fill="currentColor" />
      <circle cx="20" cy="24" r="8" fill="#EFE8DC" />
      <circle cx="28" cy="24" r="8" fill="#C45C26" fillOpacity="0.92" />
      <circle cx="24" cy="24" r="3.4" fill="#125E54" />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark className="size-9" />
      <div className="leading-tight">
        <p className="font-semibold tracking-tight text-fg">Ajuda Mútua</p>
        {!compact && <p className="text-xs text-muted">Reciprocidade em círculo</p>}
      </div>
    </div>
  );
}
