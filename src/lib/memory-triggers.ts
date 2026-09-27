const T = ["याद रखो", "remember this", "save this", "keep this in mind", "don't forget"];
export function hasMemoryTrigger(text: string) { const l = text.toLowerCase(); return T.some((t) => l.includes(t.toLowerCase())); }
