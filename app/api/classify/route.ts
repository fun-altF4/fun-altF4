/**
 * /api/classify
 *
 * Visitor classifier (Edge Runtime, Haiku call).
 *
 * POST { messages: Message[] }
 *
 * Returns: { type, confidence, signals }
 * Target latency: <300ms
 *
 * See SECTION 6.2 and SECTION 8 (/api/classify)
 */

export const runtime = 'edge';

export async function POST(_request: Request) {
  try {
    // TODO: Parse request body
    // TODO: Call Haiku with CLASSIFIER_PROMPT
    // TODO: Parse JSON response
    // TODO: Return classified result

    return new Response(JSON.stringify({ type: 'ambiguous', confidence: 0, signals: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[classify/route] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
