#!/bin/bash
set -e

mkdir -p src/lib src/components/ui src/routes/_authenticated

# ===== LIB FILES =====
cat > src/lib/utils.ts << 'ENDOFFILE'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
ENDOFFILE

cat > src/lib/models.ts << 'ENDOFFILE'
export type ModelTier = "Fast" | "Balanced" | "Max";
export type ModelOption = { id: string; label: string; tier: ModelTier; blurb: string };
export const MODELS: ModelOption[] = [
  { id: "google/gemini-3.1-flash-lite", label: "Gemini Flash Lite", tier: "Fast", blurb: "Lowest latency" },
  { id: "google/gemini-3.8-flash", label: "Gemini 3.8 Flash", tier: "Fast", blurb: "Default speed" },
  { id: "google/gemini-3.1-pro-preview", label: "Gemini Pro Ultra", tier: "Max", blurb: "Deep reasoning" },
];
export const DEFAULT_MODEL = "google/gemini-3.8-flash";
export function modelLabel(id: string) { return MODELS.find((m) => m.id === id)?.label ?? "Gemini 3.8 Flash"; }
ENDOFFILE

cat > src/lib/agents.ts << 'ENDOFFILE'
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
ENDOFFILE

cat > src/lib/format.ts << 'ENDOFFILE'
export function cleanText(input: string): string {
  if (!input) return "";
  return input.replace(/\r/g, "").split("\n").map((raw) => raw.replace(/^\s{0,6}#{1,6}\s*/, "").replace(/\*{1,3}/g, "")).join("\n").trim();
}
export function chatTitleFrom(text: string) {
  const clean = cleanText(text).replace(/\n/g, " ").trim();
  return clean.length > 48 ? `${clean.slice(0, 48)}…` : clean || "New chat";
}
ENDOFFILE

cat > src/lib/voices.ts << 'ENDOFFILE'
export type VoiceProfile = { id: string; name: string; tone: string; lang: string; pitch: number; rate: number; match: string[]; gender: "male" | "female" };
export const VOICE_PROFILES: VoiceProfile[] = [
  { id: "aarav", name: "Aarav", tone: "Deep", lang: "en-IN", pitch: 0.82, rate: 0.96, match: ["ravi", "male"], gender: "male" },
];
export const DEFAULT_VOICE = "aarav";
export function voiceById(id: string) { return VOICE_PROFILES.find((v) => v.id === id) ?? VOICE_PROFILES[0]; }
ENDOFFILE

cat > src/lib/speech.ts << 'ENDOFFILE'
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
ENDOFFILE

cat > src/lib/memory-triggers.ts << 'ENDOFFILE'
const T = ["याद रखो", "remember this", "save this", "keep this in mind", "don't forget"];
export function hasMemoryTrigger(text: string) { const l = text.toLowerCase(); return T.some((t) => l.includes(t.toLowerCase())); }
ENDOFFILE

cat > src/lib/error-page.ts << 'ENDOFFILE'
export function renderErrorPage(): string {
  return '<!doctype html><html><body><h1>Error</h1></body></html>';
}
ENDOFFILE

cat > src/lib/error-capture.ts << 'ENDOFFILE'
let lastError: { error: unknown; at: number } | undefined;
const TTL = 5000;
function record(e: unknown) { lastError = { error: e, at: Date.now() }; }
export function consumeLastCapturedError(): unknown {
  if (!lastError) return undefined;
  if (Date.now() - lastError.at > TTL) { lastError = undefined; return undefined; }
  const { error } = lastError; lastError = undefined; return error;
}
if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (e) => record((e as ErrorEvent).error ?? e));
  globalThis.addEventListener("unhandledrejection", (e) => record((e as PromiseRejectionEvent).reason));
}
ENDOFFILE

cat > src/lib/lovable-error-reporting.ts << 'ENDOFFILE'
export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) { if (typeof window !== "undefined") console.error(error, context); }
ENDOFFILE

# ===== UI STUBS =====
for c in accordion alert-dialog alert aspect-ratio avatar badge breadcrumb button calendar card carousel chart checkbox collapsible command context-menu dialog drawer dropdown-menu form hover-card input-otp input label menubar navigation-menu pagination popover progress radio-group resizable scroll-area select separator sheet sidebar skeleton slider sonner switch table tabs textarea toggle-group toggle tooltip; do
  n="${c//-/_}"
  cat > "src/components/ui/${c}.tsx" << ENDOFFILE
"use client";
import * as React from "react";
export function ${n}() { return null; }
export const ${n}Trigger = ${n};
export const ${n}Content = ${n};
export default ${n};
ENDOFFILE
done

# ===== MAIN COMPONENTS =====
cat > src/components/AppShell.tsx << 'ENDOFFILE'
import type { ReactNode } from "react";
export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 flex items-center gap-3 bg-background/80 px-4 py-3 backdrop-blur">
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-semibold">{title ?? "RB Agent"}</p>
          <p className="text-[11px] text-muted-foreground">Personal AI Assistant</p>
        </div>
      </header>
      <main className="min-h-0 flex-1 pb-24">{children}</main>
    </div>
  );
}
ENDOFFILE

cat > src/components/BrandMark.tsx << 'ENDOFFILE'
export function BrandMark({ size = 40 }: { size?: number; className?: string }) {
  return <div className="shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/60" style={{ width: size, height: size }} />;
}
ENDOFFILE

cat > src/components/InputBar.tsx << 'ENDOFFILE'
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
ENDOFFILE

cat > src/components/AgentCore.tsx << 'ENDOFFILE'
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
ENDOFFILE

cat > src/components/AgentHub.tsx << 'ENDOFFILE'
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
ENDOFFILE

cat > src/components/MessageList.tsx << 'ENDOFFILE'
export function MessageList({ messages }: { messages: { id: string; role: string; content: string }[] }) {
  return <div className="space-y-4">{messages.map((m) => <div key={m.id} className={m.role === "user" ? "text-right" : ""}><p className={m.role === "user" ? "inline-block rounded-2xl bg-primary px-4 py-2 text-primary-foreground" : ""}>{m.content}</p></div>)}</div>;
}
ENDOFFILE

cat > src/components/MemoryVault.tsx << 'ENDOFFILE'
export function MemoryVault() { return <p className="text-sm text-muted-foreground">Memory vault is empty.</p>; }
ENDOFFILE

cat > src/components/ModelSheet.tsx << 'ENDOFFILE'
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
ENDOFFILE

# ===== ROUTES =====
cat > src/routes/auth.tsx << 'ENDOFFILE'
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export const Route = createFileRoute("/auth")({ ssr: false, component: AuthPage });
function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { import("@/integrations/supabase/client").then(({ supabase }) => { supabase.auth.getSession().then(({ data }) => { if (data.session) nav({ to: "/" }); }); }); }, [nav]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      if (mode === "signup") { const { error } = await supabase.auth.signUp({ email, password }); if (error) throw error; }
      else { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; }
      nav({ to: "/" });
    } catch (error) { toast.error(error instanceof Error ? error.message : "Failed"); }
    finally { setBusy(false); }
  };
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-3xl border p-7">
        <h1 className="text-center text-2xl font-semibold">RB Agent</h1>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border p-3" />
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border p-3" />
        <button type="submit" disabled={busy} className="w-full rounded-xl bg-primary p-3 text-primary-foreground">{mode === "signup" ? "Create account" : "Sign in"}</button>
        <button type="button" className="w-full text-sm text-primary" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>{mode === "signup" ? "Sign in" : "Create account"}</button>
      </form>
    </div>
  );
}
ENDOFFILE

cat > src/routes/_authenticated/route.tsx << 'ENDOFFILE'
import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated")({ ssr: false, component: () => <Outlet /> });
ENDOFFILE

cat > src/routes/_authenticated/index.tsx << 'ENDOFFILE'
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
export const Route = createFileRoute("/_authenticated/")({ component: HomeScreen });
function HomeScreen() {
  return <AppShell><div className="mx-auto max-w-2xl px-4 py-10 text-center"><h1 className="text-2xl font-semibold">Welcome to RB Agent</h1><p className="mt-2 text-sm text-muted-foreground">Your AI assistant is ready.</p></div></AppShell>;
}
ENDOFFILE

cat > 'src/routes/_authenticated/c.$chatId.tsx' << 'ENDOFFILE'
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
export const Route = createFileRoute("/_authenticated/c/$chatId")({ component: ChatScreen });
function ChatScreen() { const { chatId } = Route.useParams(); return <AppShell title="Chat"><div className="p-6">Chat: {chatId}</div></AppShell>; }
ENDOFFILE

for r in code files projects skills web; do
  C="${r^}"
  cat > "src/routes/_authenticated/${r}.tsx" << ENDOFFILE
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
export const Route = createFileRoute("/_authenticated/${r}")({ component: ${C}Page });
function ${C}Page() { return <AppShell title="${C}"><div className="p-6 text-center">${C} page</div></AppShell>; }
ENDOFFILE
done

echo "✅ ALL FILES CREATED"
