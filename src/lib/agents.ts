export type AgentId = "core" | "coding" | "automation" | "research" | "memory" | "social";
export type Agent = { id: AgentId; name: string; domain: string; icon: string; prompt: string };
export const AGENTS: Agent[] = [
  { id: "coding", name: "Coding", domain: "Code review", icon: "code", prompt: "You are Coding." },
  { id: "automation", name: "Automation", domain: "Device tasks", icon: "smartphone", prompt: "You are Automation." },
  { id: "research", name: "Research", domain: "Deep browsing", icon: "globe", prompt: "You are Research." },
  { id: "memory", name: "Memory", domain: "Long facts", icon: "brain", prompt: "You are Memory." },
  { id: "social", name: "Social", domain: "Chatbot", icon: "send", prompt: "You are Social." },
];
export function agentById(id: string) { return AGENTS.find((a) => a.id === id); }
export function agentName(id: string) { return id === "core" ? "RB Agent" : (agentById(id)?.name ?? "RB Agent"); }
