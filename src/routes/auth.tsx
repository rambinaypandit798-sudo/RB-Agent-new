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
