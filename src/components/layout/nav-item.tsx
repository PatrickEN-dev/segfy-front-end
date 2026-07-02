"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type NavItem as NavItemType } from "@/config/nav";
import { cn } from "@/lib/utils";

interface NavItemProps {
  item: NavItemType;
}

export function NavItem({ item }: NavItemProps) {
  const pathname = usePathname();
  const isActive =
    item.matchMode === "prefix"
      ? pathname.startsWith(item.href)
      : pathname === item.href;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex h-8 items-center rounded-sm px-3 text-sm transition-colors",
        isActive
          ? "font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {isActive && (
        <span
          aria-hidden
          className="absolute -left-3 top-1/2 h-4 w-px -translate-y-1/2 bg-foreground"
        />
      )}
      {item.title}
    </Link>
  );
}
