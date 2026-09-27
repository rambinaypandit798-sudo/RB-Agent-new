export type ModelTier = "Fast" | "Balanced" | "Max";
export type ModelOption = { id: string; label: string; tier: ModelTier; blurb: string };
export const MODELS: ModelOption[] = [
  { id: "google/gemini-3.1-flash-lite", label: "Gemini Flash Lite", tier: "Fast", blurb: "Lowest latency" },
  { id: "google/gemini-3.8-flash", label: "Gemini 3.8 Flash", tier: "Fast", blurb: "Default speed" },
  { id: "google/gemini-3.1-pro-preview", label: "Gemini Pro Ultra", tier: "Max", blurb: "Deep reasoning" },
];
export const DEFAULT_MODEL = "google/gemini-3.8-flash";
export function modelLabel(id: string) { return MODELS.find((m) => m.id === id)?.label ?? "Gemini 3.8 Flash"; }
