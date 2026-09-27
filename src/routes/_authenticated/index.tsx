import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { InputBar } from "@/components/InputBar";
import { useProfile, useSettings, useUpdateSettings } from "@/hooks/useAccount";
import { createChatWithMessage } from "@/hooks/useChats";
import { DEFAULT_MODEL } from "@/lib/models";

export const Route = createFileRoute("/_authenticated/")({
  component: HomeScreen,
});

function HomeScreen() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const [liveMode, setLiveMode] = useState(false);
  const [busy, setBusy] = useState(false);

  const model = settings?.model ?? DEFAULT_MODEL;
  const name = profile?.display_name ?? "friend";

  const send = async (text: string) => {
    setBusy(true);
    try {
      const chatId = await createChatWithMessage(text, "core");
      navigate({ to: "/c/$chatId", params: { chatId } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start the chat.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-2xl flex-col px-4">
        <div className="flex flex-col items-center pt-6 text-center">
          <h1 className="mt-3 text-[22px] leading-snug font-semibold">
            नमस्ते, {name} आज आपका क्या प्लान है
          </h1>
        </div>
        <div className="sticky bottom-24 mt-5">
          <InputBar
            model={model}
            onModelChange={(id) => updateSettings.mutate({ ...settings, model: id })}
            onSend={send}
            busy={busy}
            liveMode={liveMode}
            onLiveModeChange={setLiveMode}
            agentLabel="RB Agent"
          />
        </div>
      </div>
    </AppShell>
  );
}
