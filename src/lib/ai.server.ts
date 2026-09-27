const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const GEMINI_OPENAI = "https://generativelanguage.googleapis.com/v1beta/openai";

export function gatewayKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet.");
  return key;
}

type AiCtx = { geminiKey?: string | null };

function resolveBase(ctx?: AiCtx) {
  const userKey = ctx?.geminiKey?.trim();
  if (userKey) {
    return {
      base: GEMINI_OPENAI,
      headers: {
        Authorization: `Bearer ${userKey}`,
        "Content-Type": "application/json",
      } as Record<string, string>,
      isGemini: true,
    };
  }
  return {
    base: GATEWAY,
    headers: {
      Authorization: `Bearer ${gatewayKey()}`,
      "Content-Type": "application/json",
      "X-Lovable-AIG-SDK": "fetch",
    } as Record<string, string>,
    isGemini: false,
  };
}

// Map Lovable model id → real Gemini model id
function mapModel(model: string, isGemini: boolean) {
  if (!isGemini) return model;
  const map: Record<string, string> = {
    "google/gemini-3.1-flash-lite": "gemini-2.0-flash-lite",
    "google/gemini-3.8-flash": "gemini-2.0-flash",
    "google/gemini-3.7-flash": "gemini-2.0-flash",
    "google/gemini-3-flash-preview": "gemini-2.0-flash",
    "google/gemini-3.1-pro-preview": "gemini-2.5-pro",
  };
  return map[model] ?? model.replace(/^google\//, "");
}

export async function embed(text: string, ctx?: AiCtx): Promise<number[] | null> {
  const { base, headers, isGemini } = resolveBase(ctx);
  const model = isGemini ? "text-embedding-004" : "openai/text-embedding-3-small";
  const res = await fetch(`${base}/embeddings`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, input: text.slice(0, 6000) }),
  });
  if (!res.ok) {
    console.error("embedding failed", res.status, await res.text());
    return null;
  }
  const json = (await res.json()) as { data?: { embedding: number[] }[] };
  return json.data?.[0]?.embedding ?? null;
}

export async function chatCompletion(
  model: string,
  messages: { role: string; content: string }[],
  ctx?: AiCtx,
) {
  const { base, headers, isGemini } = resolveBase(ctx);
  return fetch(`${base}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model: mapModel(model, isGemini), messages, stream: true }),
  });
}

export async function completeOnce(
  model: string,
  messages: { role: string; content: string }[],
  ctx?: AiCtx,
) {
  const { base, headers, isGemini } = resolveBase(ctx);
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model: mapModel(model, isGemini), messages }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content?.trim() ?? null;
}

export const FORMAT_RULES = `Output formatting rules that you must never break:
Never use asterisk characters for bold or italics. Never use hash characters for headings. Never use markdown syntax of any kind, including backticks outside of real code blocks.
When you list features, options, steps or any structured multi point data, start every single item with the bullet dot character followed by one space, like this:
• first point
• second point
Never use numbers, dashes or asterisks as list markers. Keep prose clean, natural and plain.`;

export function systemPrompt(opts: {
  userName: string;
  agentPrompt?: string;
  memories: string[];
}) {
  const parts = [
    `You are RB Agent, an elite personal AI assistant and multi agent automation hub for ${opts.userName}. You speak naturally in the language the user writes in, including Hindi and Hinglish.`,
    opts.agentPrompt ?? "You are the RB Agent core assistant and you can route work to your coding, phone automation, research, memory and social sub agents.",
    FORMAT_RULES,
  ];
  if (opts.memories.length) {
    parts.push(
      `Long term memory vault for this user. Apply these silently and never ask for them again:\n${opts.memories
        .map((m) => `• ${m}`)
        .join("\n")}`,
    );
  }
  return parts.join("\n\n");
}
