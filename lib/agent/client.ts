/**
 * client.ts
 *
 * Anthropic client wrapper with prompt caching.
 * Caches SYSTEM_PROMPT + persona block to reduce latency + cost.
 *
 * See SECTION 8 (/api/chat) for integration details.
 * TODO: Implement Anthropic client with cache_control setup
 */

export const createAnthropicClient = () => {
  // TODO: Initialize Anthropic client with API key from env
  // Mark SYSTEM_PROMPT + persona block with cache_control: { type: "ephemeral" }
  // Return client instance for streaming + non-streaming calls
};
