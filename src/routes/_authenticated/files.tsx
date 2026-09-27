import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/files")({
  component: FilePreview,
});

function FilePreview() {
  return (
    <AppShell title="File Preview">
      <div className="mx-auto max-w-3xl px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground">Upload documents to preview them here.</p>
      </div>
    </AppShell>
  );
}
