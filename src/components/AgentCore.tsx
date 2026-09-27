export function AgentCore({ onClick, label = "RB Agent", size = 196, busy = false }: { onClick?: () => void; label?: string; size?: number; busy?: boolean; }) {
  return (
    <button onClick={onClick} className="grid place-items-center rounded-full bg-primary/20" style={{ width: size, height: size }}>
      <span className="text-center">
        <span className="block text-lg font-semibold">{label}</span>
        <span className="block text-[11px]">{busy ? "thinking" : "tap to open"}</span>
      </span>
    </button>
  );
}
