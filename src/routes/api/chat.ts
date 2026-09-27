import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!token) return new Response(JSON.stringify({ error: "Not signed in" }), { status: 401 });

        const supabase = createClient(
          process.env["SUPABASE_URL"]!,
          process.env["SUPABASE_PUBLISHABLE_KEY"]!,
          { auth: { persistSession: false }, global: { headers: { Authorization: `Bearer ${token}` } } },
        );

        const { data: userData } = await supabase.auth.getUser(token);
        if (!userData?.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

        const body = await request.json();
        const messages = body.messages ?? [];

        // Simple placeholder response — replace with real AI logic if needed
        const reply = "RB Agent is ready.";
        return new Response(reply, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      },
    },
  },
});
