export function cleanText(input: string): string {
  if (!input) return "";
  return input.replace(/\r/g, "").split("\n").map((raw) => raw.replace(/^\s{0,6}#{1,6}\s*/, "").replace(/\*{1,3}/g, "")).join("\n").trim();
}
export function chatTitleFrom(text: string) {
  const clean = cleanText(text).replace(/\n/g, " ").trim();
  return clean.length > 48 ? `${clean.slice(0, 48)}…` : clean || "New chat";
}
