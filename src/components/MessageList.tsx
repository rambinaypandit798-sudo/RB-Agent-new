export function MessageList({ messages }: { messages: { id: string; role: string; content: string }[] }) {
  return <div className="space-y-4">{messages.map((m) => <div key={m.id} className={m.role === "user" ? "text-right" : ""}><p className={m.role === "user" ? "inline-block rounded-2xl bg-primary px-4 py-2 text-primary-foreground" : ""}>{m.content}</p></div>)}</div>;
}
