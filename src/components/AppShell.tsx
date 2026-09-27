import type { ReactNode } from "react";
export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 flex items-center gap-3 bg-background/80 px-4 py-3 backdrop-blur">
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-semibold">{title ?? "RB Agent"}</p>
          <p className="text-[11px] text-muted-foreground">Personal AI Assistant</p>
        </div>
      </header>
      <main className="min-h-0 flex-1 pb-24">{children}</main>
    </div>
  );
}
