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
      <SheetContent side="left">
        <div className="pt-1">
          <Brand />
        </div>
        <SheetTitle className="sr-only">Navegação</SheetTitle>
        <SheetDescription className="sr-only">
          Navegue entre as seções do painel.
        </SheetDescription>
        <p className="pt-4 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Operação
        </p>
        <nav aria-label="Navegação principal" className="flex flex-col gap-px">
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
                  "flex h-9 items-center rounded-sm px-2 text-sm transition-colors",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto">
          <p className="text-xs font-medium text-foreground">
            {siteConfig.tenantLabel}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Ambiente de operação
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
