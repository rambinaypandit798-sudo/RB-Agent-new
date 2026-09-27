import { useState, useEffect } from "react";
import { Check, Github, Key, LogOut } from "lucide-react";
import { useAccount } from "@/hooks/useAccount";
import { Section } from "@/components/Section";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SettingsPage() {
  const { settings, patch, logout } = useAccount();
  const [geminiKey, setGeminiKey] = useState("");

  useEffect(() => {
    setGeminiKey(settings?.gemini_api_key ?? "");
  }, [settings]);

  return (
    <div className="space-y-6 pb-12">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      {/* Gemini API Key Section */}
      <Section
        icon={Key}
        title="Gemini API key"
        hint="Apni personal Gemini key daalo — warna app ki shared limit use hogi."
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="gemini">API key</Label>
            <Input
              id="gemini"
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              onBlur={() => patch({ gemini_api_key: geminiKey.trim() || null })}
              placeholder="AIzaSy..."
              className="glass h-11 rounded-xl border-0"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Free key banane ke liye: aistudio.google.com/apikey
          </p>
        </div>
      </Section>

      {/* GitHub Section */}
      <Section
        icon={Github}
        title="GitHub"
        hint="Manage your repository connection."
      >
        {/* GitHub section content */}
      </Section>

      <div className="pt-4">
        <Button 
          variant="destructive" 
          onClick={logout}
          className="w-full h-11 rounded-xl"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );
}
