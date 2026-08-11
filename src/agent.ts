import { AIChatAgent } from "@cloudflare/ai-chat";
import { convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { streamAgent } from "./agent-core";
import { compactHistory } from "./context/compaction";
import {
  resolveOpenRouterBaseURL,
  resolveOpenRouterModel,
} from "./openrouter";

interface Env extends Cloudflare.Env {
  OPENROUTER_API_KEY: string;
  OPENROUTER_BASE_URL?: string;
  OPENROUTER_MODEL?: string;
  TAVILY_API_KEY: string;
  UPSTASH_VECTOR_REST_URL: string;
  UPSTASH_VECTOR_REST_TOKEN: string;
}

export class DesignAgent extends AIChatAgent<Env> {
  async onChatMessage() {
    const openrouter = createOpenAI({
      name: "openrouter",
      apiKey: this.env.OPENROUTER_API_KEY,
      baseURL: resolveOpenRouterBaseURL(this.env.OPENROUTER_BASE_URL),
    });
    const model = openrouter.chat(
      resolveOpenRouterModel(this.env.OPENROUTER_MODEL),
    );

    // Compact older history if the conversation has gotten long. The recent
    // few turns stay verbatim; everything older is collapsed into one
    // summary system message.
    const allMessages = await convertToModelMessages(this.messages);
    const messages = await compactHistory(allMessages, { model });

    const result = streamAgent({
      model,
      messages,
      env: {
        TAVILY_API_KEY: this.env.TAVILY_API_KEY,
        UPSTASH_VECTOR_REST_URL: this.env.UPSTASH_VECTOR_REST_URL,
        UPSTASH_VECTOR_REST_TOKEN: this.env.UPSTASH_VECTOR_REST_TOKEN,
      },
    });

    return result.toUIMessageStreamResponse();
  }
}
