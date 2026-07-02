import { Brand } from "@/components/layout/brand";
import { NavItem } from "@/components/layout/nav-item";
import { primaryNav } from "@/config/nav";
import { siteConfig } from "@/config/site";

export function Sidebar() {
  return (
    <aside className="hidden w-60 flex-col border-r bg-[hsl(var(--surface))] md:flex">
      <div className="flex h-14 items-center px-6">
        <Brand />
      </div>
      <div className="px-6 pb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        Operação
      </div>
      <nav
        aria-label="Navegação principal"
        className="flex-1 space-y-px overflow-y-auto px-6 pb-6"
      >
        {primaryNav.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>
      <div className="px-6 py-4">
        <p className="text-xs font-medium text-foreground">
          {siteConfig.tenantLabel}
        </p>
        <p className="text-[11px] text-muted-foreground">
          Ambiente de operação
        </p>
      </div>
    </aside>
  );
}
