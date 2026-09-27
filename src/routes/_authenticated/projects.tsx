import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
export const Route = createFileRoute("/_authenticated/projects")({ component: ProjectsPage });
function ProjectsPage() { return <AppShell title="Projects"><div className="p-6 text-center">Projects page</div></AppShell>; }
