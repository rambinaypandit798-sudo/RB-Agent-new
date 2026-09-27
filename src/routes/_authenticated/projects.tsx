import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/projects")({
  component: Projects,
});

function Projects() {
  return (
    <AppShell title="Projects">
      <div className="mx-auto max-w-2xl px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground">Your projects will appear here.</p>
      </div>
    </AppShell>
  );
}
