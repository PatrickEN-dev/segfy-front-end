import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface BrandProps {
  className?: string;
}

export function Brand({ className }: BrandProps) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "text-sm font-semibold tracking-tight text-foreground",
        className,
      )}
      aria-label={siteConfig.name}
    >
      {siteConfig.name}
      <span className="ml-1 text-muted-foreground">/ Painel</span>
    </Link>
  );
}
