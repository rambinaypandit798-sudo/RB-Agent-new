import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
export const Route = createFileRoute("/_authenticated/web")({ component: WebPage });
function WebPage() { return <AppShell title="Web"><div className="p-6 text-center">Web page</div></AppShell>; }
