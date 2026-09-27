import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
export const Route = createFileRoute("/_authenticated/c/$chatId")({ component: ChatScreen });
function ChatScreen() { const { chatId } = Route.useParams(); return <AppShell title="Chat"><div className="p-6">Chat: {chatId}</div></AppShell>; }
