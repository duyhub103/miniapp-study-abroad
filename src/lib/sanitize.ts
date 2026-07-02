import sanitizeHtml from "sanitize-html";

/**
 * Strip all HTML tags and dangerous content from user input.
 * Used on backend before saving to DB.
 */
export function sanitizeInput(input: string): string {
  // Strip all HTML tags
  const cleaned = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });

  // Trim whitespace
  return cleaned.trim();
}

/**
 * Sanitize all string fields in an object (shallow, one level deep).
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = sanitizeInput(value);
    }
  }
  return result;
}
