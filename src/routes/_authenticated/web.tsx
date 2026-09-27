import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/web")({
  component: WebPreview,
});

function WebPreview() {
  return (
    <AppShell title="Web Preview">
      <div className="mx-auto max-w-3xl px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground">Browse the web inside RB Agent.</p>
      </div>
    </AppShell>
  );
}
