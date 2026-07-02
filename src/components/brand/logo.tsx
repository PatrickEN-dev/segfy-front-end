import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  variant?: "brand" | "mono";
}

/**
 * Segfy mark: a stylised shield holding an "S" shaped by two arcs — evokes
 * the insurance heritage (proteção) and the SaaS/fintech modernity.
 */
export function LogoMark({ className, variant = "brand" }: LogoMarkProps) {
  const gradientId = "segfy-mark-gradient";
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Segfy"
      className={cn("h-6 w-6", className)}
    >
      {variant === "brand" && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M16 2.2 4.5 6.3v9.2c0 6.6 4.5 12.4 11.5 14.3 7-1.9 11.5-7.7 11.5-14.3V6.3L16 2.2Z"
        fill={variant === "brand" ? `url(#${gradientId})` : "currentColor"}
      />
      <path
        d="M20.4 11.6c-.6-1.4-2-2.3-3.9-2.3-2.4 0-4 1.3-4 3.1 0 1.7 1.2 2.6 3.6 3.1l1.4.3c1.4.3 2 .7 2 1.4 0 .8-.8 1.4-2.2 1.4-1.4 0-2.4-.5-2.9-1.6l-2.5.9c.7 1.8 2.4 2.9 5.3 2.9 2.7 0 4.5-1.3 4.5-3.3 0-1.8-1.2-2.7-3.8-3.3l-1.4-.3c-1.3-.3-1.9-.6-1.9-1.3 0-.7.7-1.2 1.9-1.2 1.1 0 1.9.5 2.3 1.4l2.6-.9Z"
        fill="hsl(var(--primary-foreground))"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  variant?: "brand" | "mono";
}

export function Logo({
  className,
  showWordmark = true,
  variant = "brand",
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark variant={variant} />
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight">
          segfy
        </span>
      )}
    </span>
  );
}