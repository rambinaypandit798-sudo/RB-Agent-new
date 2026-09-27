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
