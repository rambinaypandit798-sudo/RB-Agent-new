export type SpeechState = { activeId: string | null; speaking: boolean; paused: boolean; spoken: string };
type Listener = (state: SpeechState) => void;
class SpeechEngine {
  private listeners = new Set<Listener>();
  private state: SpeechState = { activeId: null, speaking: false, paused: false, spoken: "" };
  subscribe(l: Listener) { this.listeners.add(l); l(this.state); return () => this.listeners.delete(l); }
  private emit(p: Partial<SpeechState>) { this.state = { ...this.state, ...p }; this.listeners.forEach((l) => l(this.state)); }
  speak(id: string, text: string, _v: string) { if (typeof window === "undefined") return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.onend = () => this.emit({ activeId: null, speaking: false, paused: false, spoken: "" }); window.speechSynthesis.speak(u); this.emit({ activeId: id, speaking: true, paused: false, spoken: "" }); }
  pause() { window.speechSynthesis.cancel(); this.emit({ paused: true, speaking: false }); }
  resume() { this.emit({ paused: false }); }
  toggle(id: string, text: string, v: string) { if (this.state.activeId !== id) return this.speak(id, text, v); if (this.state.paused) this.resume(); else this.pause(); }
  stop() { window.speechSynthesis.cancel(); this.emit({ activeId: null, speaking: false, paused: false, spoken: "" }); }
}
export const speechEngine = new SpeechEngine();
type RecognitionLike = { lang: string; continuous: boolean; interimResults: boolean; start: () => void; stop: () => void; abort: () => void; onresult: ((e: unknown) => void) | null; onerror: ((e: unknown) => void) | null; onend: (() => void) | null; };
export function createRecognition(lang = "hi-IN"): RecognitionLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => RecognitionLike; webkitSpeechRecognition?: new () => RecognitionLike };
  const C = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!C) return null;
  const r = new C();
  r.lang = lang; r.continuous = true; r.interimResults = true;
  return r;
}
export function readTranscript(e: unknown): { text: string; final: boolean } {
  const ev = e as { results?: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> };
  if (!ev.results) return { text: "", final: false };
  let t = "", f = false;
  for (let i = 0; i < ev.results.length; i++) { const r = ev.results[i]; if (!r) continue; t += r[0]?.transcript ?? ""; if (r.isFinal) f = true; }
  return { text: t.trim(), final: f };
}
