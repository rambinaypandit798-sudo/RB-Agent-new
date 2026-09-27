export type VoiceProfile = { id: string; name: string; tone: string; lang: string; pitch: number; rate: number; match: string[]; gender: "male" | "female" };
export const VOICE_PROFILES: VoiceProfile[] = [
  { id: "aarav", name: "Aarav", tone: "Deep", lang: "en-IN", pitch: 0.82, rate: 0.96, match: ["ravi", "male"], gender: "male" },
];
export const DEFAULT_VOICE = "aarav";
export function voiceById(id: string) { return VOICE_PROFILES.find((v) => v.id === id) ?? VOICE_PROFILES[0]; }
