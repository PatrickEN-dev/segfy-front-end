"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-md border border-border bg-background text-foreground shadow-none",
          title: "text-sm font-medium",
          description: "text-xs text-muted-foreground",
        },
      }}
    />
  );
}
