import { useState } from "react";
export function InputBar({ onSend, busy, agentLabel }: { model: string; onModelChange: (id: string) => void; onSend: (t: string) => void; busy: boolean; liveMode: boolean; onLiveModeChange: (o: boolean) => void; agentLabel: string; }) {
  const [t, setT] = useState("");
  return (
    <div className="rounded-3xl bg-card p-2.5 shadow">
      <div className="flex items-end gap-2">
        <textarea value={t} rows={1} onChange={(e) => setT(e.target.value)} placeholder={`ASK ${agentLabel}`} className="max-h-32 w-full resize-none bg-transparent px-1 py-2.5 outline-none" />
        <button onClick={() => { if (t.trim() && !busy) { onSend(t.trim()); setT(""); } }} disabled={busy || !t.trim()} className="rounded-full bg-primary px-4 py-2 text-primary-foreground disabled:opacity-40">Send</button>
      </div>
    </div>
  );
}
