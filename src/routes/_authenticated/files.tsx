import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
export const Route = createFileRoute("/_authenticated/files")({ component: FilesPage });
function FilesPage() { return <AppShell title="Files"><div className="p-6 text-center">Files page</div></AppShell>; }
