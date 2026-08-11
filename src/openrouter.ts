export const DEFAULT_OPENROUTER_MODEL = "openai/gpt-5.4-mini";

export const DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export function resolveOpenRouterBaseURL(value?: string): string {
  if (!value) {
    return DEFAULT_OPENROUTER_BASE_URL;
  }

  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("OPENROUTER_BASE_URL must use http:// or https://");
  }

  return value.replace(/\/$/, "");
}

export function resolveOpenRouterModel(value?: string): string {
  if (!value) {
    return DEFAULT_OPENROUTER_MODEL;
  }

  const model = value.trim();
  if (!model) {
    throw new Error("OPENROUTER_MODEL cannot be empty");
  }

  return model;
}
