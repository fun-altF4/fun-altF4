/**
 * /api/chat
 *
 * Streaming agent endpoint (Edge Runtime).
 *
 * POST { messages: Message[], visitorType: string, sessionId: string }
 *
 * Steps:
 * 1. Retrieve top-k=6 vault chunks based on last user message
 * 2. Inject SYSTEM_PROMPT + persona block + RAG chunks + history
 * 3. Stream from Claude Sonnet 4 with SSE
 * 4. Post-stream: parse for <MIRROR> token
 * 5. Update Redis session
 *
 * Performance target: <600ms first token (TTFB + latency)
 *
 * See SECTION 8 (/api/chat) in spec
 */

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    // TODO: Parse request body
    // TODO: Validate session
    // TODO: Retrieve vault chunks
    // TODO: Build prompt with RAG
    // TODO: Stream from Anthropic
    // TODO: Parse MIRROR token
    // TODO: Update Redis session

    return new Response('Chat API — TODO', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('[chat/route] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
