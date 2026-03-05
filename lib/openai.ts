import OpenAI from "openai";

export function getClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Missing OPENAI_API_KEY env var");
  return new OpenAI({ apiKey: key });
}

export function getModel(): string {
  return process.env.OPENAI_MODEL || "gpt-4.1-mini";
}
