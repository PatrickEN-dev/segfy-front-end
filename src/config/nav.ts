export interface NavItem {
  title: string;
  href: string;
  matchMode?: "exact" | "prefix";
}

export const primaryNav: NavItem[] = [
  {
    title: "Visão geral",
    href: "/dashboard",
    matchMode: "exact",
  },
  {
    title: "Apólices",
    href: "/policies",
    matchMode: "prefix",
  },
  {
    title: "Vencimentos",
    href: "/expiring",
    matchMode: "prefix",
  },
];
