/**
 * search.ts
 *
 * Hybrid BM25 + vector search over vault chunks.
 *
 * TODO: Implement search pipeline
 */

export const hybridSearch = async (
  query: string,
  topK: number = 6,
): Promise<Array<{ chunk: string; score: number }>> => {
  // TODO: BM25 keyword matching + vector similarity
  // Combine scores, return top-k results
  throw new Error('Not implemented');
};
