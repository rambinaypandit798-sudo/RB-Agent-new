import { AGENTS, type AgentId } from "@/lib/agents";
export function AgentHub({ open, onOpenChange, onSelect, active }: { open: boolean; onOpenChange: (o: boolean) => void; onSelect: (a: AgentId) => void; active: AgentId; }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-background p-5">
        <h2 className="mb-3 text-lg font-semibold">Sub Agents</h2>
        <button onClick={() => { onSelect("core"); onOpenChange(false); }} className={`mb-2 w-full rounded-2xl border p-3 text-left ${active === "core" ? "border-primary" : ""}`}>RB Agent Core</button>
        {AGENTS.map((a) => (
          <button key={a.id} onClick={() => { onSelect(a.id); onOpenChange(false); }} className={`mb-2 w-full rounded-2xl border p-3 text-left ${active === a.id ? "border-primary" : ""}`}>
            <span className="block font-semibold">{a.name}</span>
            <span className="block text-xs text-muted-foreground">{a.domain}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
