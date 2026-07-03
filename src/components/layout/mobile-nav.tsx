"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Brand } from "@/components/layout/brand";
import { ThemeToggleMenuItem } from "@/components/theme/theme-toggle";
import { primaryNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-sidebar-border bg-sidebar text-sidebar-foreground"
      >
        <div className="pt-1">
          <Brand className="text-sidebar-foreground" />
        </div>
        <SheetTitle className="sr-only">Navegação</SheetTitle>
        <SheetDescription className="sr-only">
          Navegue entre as seções do painel.
        </SheetDescription>
        <p className="pt-4 text-[11px] font-semibold uppercase tracking-widest text-sidebar-muted">
          Operação
        </p>
        <nav aria-label="Navegação principal" className="flex flex-col gap-1">
          {primaryNav.map((item) => {
            const isActive =
              item.matchMode === "prefix"
                ? pathname.startsWith(item.href)
                : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center rounded-md px-3 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent font-medium text-sidebar-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-sidebar-border pt-2">
          <ThemeToggleMenuItem />
        </div>
        <div className="rounded-md border border-sidebar-border bg-sidebar-accent/60 p-3">
          <p className="text-xs font-medium text-sidebar-foreground">
            {siteConfig.tenantLabel}
          </p>
          <p className="mt-0.5 text-[11px] text-sidebar-muted">
            Ambiente de operação
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}