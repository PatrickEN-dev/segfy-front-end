import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  variant?: "brand" | "mono";
}

export function LogoMark({ className, variant = "brand" }: LogoMarkProps) {
  const bg = variant === "brand" ? "hsl(var(--primary))" : "currentColor";
  const fg =
    variant === "brand" ? "hsl(var(--primary-foreground))" : "hsl(var(--sidebar))";

  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Segfy"
      className={cn("h-6 w-6", className)}
    >
      <rect x="0" y="0" width="24" height="24" rx="6" fill={bg} />
      <path
        d="M15.6 9.3c-.4-1-1.5-1.6-2.9-1.6-1.8 0-3 .9-3 2.2 0 1.2.9 1.9 2.7 2.2l1 .2c1 .2 1.5.5 1.5 1s-.6 1-1.6 1c-1 0-1.8-.4-2.1-1.2l-1.9.6c.5 1.3 1.8 2 3.9 2 2 0 3.3-1 3.3-2.4 0-1.3-.9-2-2.8-2.4l-1-.2c-1-.2-1.4-.4-1.4-.9 0-.5.5-.8 1.4-.8.8 0 1.4.3 1.7 1l1.9-.7Z"
        fill={fg}
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
          Segfy
        </span>
      )}
    </span>
  );
}
