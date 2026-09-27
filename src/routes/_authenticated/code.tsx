import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/code")({
  component: CodePreview,
});

function CodePreview() {
  return (
    <AppShell title="Code Preview">
      <div className="mx-auto max-w-3xl px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground">Connect a GitHub repository in Settings.</p>
      </div>
    </AppShell>
  );
}
