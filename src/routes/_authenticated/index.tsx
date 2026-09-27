import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
export const Route = createFileRoute("/_authenticated/")({ component: HomeScreen });
function HomeScreen() {
  return <AppShell><div className="mx-auto max-w-2xl px-4 py-10 text-center"><h1 className="text-2xl font-semibold">Welcome to RB Agent</h1><p className="mt-2 text-sm text-muted-foreground">Your AI assistant is ready.</p></div></AppShell>;
}
