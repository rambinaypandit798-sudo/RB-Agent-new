import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/skills")({
  component: Skills,
});

function Skills() {
  return (
    <AppShell title="Skill Add">
      <div className="mx-auto max-w-2xl px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground">Add custom skills and standing instructions.</p>
      </div>
    </AppShell>
  );
}
