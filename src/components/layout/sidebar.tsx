import { Brand } from "@/components/layout/brand";
import { NavItem } from "@/components/layout/nav-item";
import { primaryNav } from "@/config/nav";
import { siteConfig } from "@/config/site";

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-14 items-center px-6">
        <Brand variant="brand" className="text-sidebar-foreground" />
      </div>

      <div className="mt-4 px-6 pb-2 text-[11px] font-semibold uppercase tracking-widest text-sidebar-muted">
        Operação
      </div>
      <nav
        aria-label="Navegação principal"
        className="flex-1 space-y-1 overflow-y-auto px-3 pb-6"
      >
        {primaryNav.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      <div className="mx-6 mb-4 rounded-md border border-sidebar-border bg-sidebar-accent/60 p-3">
        <p className="text-xs font-medium text-sidebar-foreground">
          {siteConfig.tenantLabel}
        </p>
        <p className="mt-0.5 text-[11px] text-sidebar-muted">
          Ambiente de operação
        </p>
      </div>
    </aside>
  );
}