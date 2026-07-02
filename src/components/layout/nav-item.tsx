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
        "relative flex h-9 items-center gap-2 rounded-md px-3 text-sm transition-colors",
        isActive
          ? "bg-sidebar-accent font-medium text-sidebar-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
    >
      {isActive && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-active"
        />
      )}
      {item.title}
    </Link>
  );
}