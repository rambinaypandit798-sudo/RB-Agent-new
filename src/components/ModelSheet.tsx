import { MODELS } from "@/lib/models";
export function ModelSheet({ open, onOpenChange, value, onChange }: { open: boolean; onOpenChange: (o: boolean) => void; value: string; onChange: (id: string) => void; }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-background p-5">
        <h2 className="mb-3 text-lg font-semibold">Choose model</h2>
        {MODELS.map((m) => (
          <button key={m.id} onClick={() => { onChange(m.id); onOpenChange(false); }} className={`mb-2 w-full rounded-2xl border p-3 text-left ${value === m.id ? "border-primary" : ""}`}>{m.label}</button>
        ))}
      </div>
    </div>
  );
}
