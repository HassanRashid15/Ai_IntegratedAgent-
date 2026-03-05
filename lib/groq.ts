import Groq from "groq-sdk";

export function getClient(): Groq {
  const key = process.env.OPENAI_API_KEY; // Reusing the same env var for simplicity
  if (!key) throw new Error("Missing OPENAI_API_KEY env var (for Groq)");
  return new Groq({ apiKey: key });
}

export function getModel(): string {
  return process.env.OPENAI_MODEL || "llama-3.1-8b-instant";
}

// Helper to handle JSON response for Groq
export function parseGroqResponse(content: string): any {
  try {
    // Try to parse as JSON directly
    return JSON.parse(content);
  } catch {
    // If that fails, try to extract JSON from the content
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Could not parse JSON from Groq response");
  }
}
