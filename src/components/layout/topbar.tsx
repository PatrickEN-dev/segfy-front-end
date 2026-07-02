import Link from "next/link";
import { Plus } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <MobileNav />
        <Brand />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button asChild size="sm" className="shadow-brand">
          <Link href="/policies/new">
            <Plus className="h-4 w-4" />
            Nova apólice
          </Link>
        </Button>
      </div>
    </header>
  );
}