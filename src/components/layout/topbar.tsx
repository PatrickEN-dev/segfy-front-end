import { Brand } from "@/components/layout/brand";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background px-4 md:hidden">
      <MobileNav />
      <Brand />
    </header>
  );
}
