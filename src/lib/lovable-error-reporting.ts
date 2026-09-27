export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) { if (typeof window !== "undefined") console.error(error, context); }
