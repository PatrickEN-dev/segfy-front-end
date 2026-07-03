"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      className={className}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

/** Estilizada com os tokens do sidebar (fundo escuro nos dois temas). */
export function ThemeToggleMenuItem({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        className,
      )}
    >
      <span className="relative flex h-4 w-4 items-center justify-center" aria-hidden>
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
      </span>
      <span>{isDark ? "Modo escuro" : "Modo claro"}</span>
      <span
        aria-hidden
        className={cn(
          "ml-auto flex h-4 w-7 items-center rounded-full p-0.5 transition-colors",
          isDark ? "justify-end bg-sidebar-active/80" : "justify-start bg-sidebar-accent",
        )}
      >
        <span className="h-3 w-3 rounded-full bg-sidebar-foreground" />
      </span>
    </button>
  );
}