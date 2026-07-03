import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface BrandProps {
  className?: string;
  variant?: "brand" | "mono";
}

export function Brand({ className, variant = "brand" }: BrandProps) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "inline-flex items-center gap-2 text-foreground transition-opacity hover:opacity-90",
        className,
      )}
      aria-label={siteConfig.name}
    >
      <Logo variant={variant} />
    </Link>
  );
}
