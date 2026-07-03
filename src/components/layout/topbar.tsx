import Link from "next/link";
import { Brand } from "@/components/layout/brand";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <MobileNav />
        <Brand />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button asChild size="sm">
          <Link href="/policies/new">Nova apólice</Link>
        </Button>
      </div>
    </header>
  );
}
