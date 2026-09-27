import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
export const Route = createFileRoute("/_authenticated/skills")({ component: SkillsPage });
function SkillsPage() { return <AppShell title="Skills"><div className="p-6 text-center">Skills page</div></AppShell>; }
