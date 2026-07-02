import { type ReactNode } from "react";

interface DataRowProps {
  label: string;
  children: ReactNode;
  mono?: boolean;
}

export function DataRow({ label, children, mono }: DataRowProps) {
  return (
    <div className="flex flex-col gap-0.5 py-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={
          mono
            ? "font-mono text-sm tabular-nums"
            : "text-sm text-foreground"
        }
      >
        {children}
      </span>
    </div>
  );
}
