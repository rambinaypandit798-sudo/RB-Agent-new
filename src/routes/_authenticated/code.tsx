import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
export const Route = createFileRoute("/_authenticated/code")({ component: CodePage });
function CodePage() { return <AppShell title="Code"><div className="p-6 text-center">Code page</div></AppShell>; }
