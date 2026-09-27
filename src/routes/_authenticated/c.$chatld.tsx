import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/c/$chatId")({
  component: ChatScreen,
});

function ChatScreen() {
  const { chatId } = Route.useParams();
  return (
    <AppShell title="Chat">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <p className="text-sm text-muted-foreground">Chat ID: {chatId}</p>
      </div>
    </AppShell>
  );
}
