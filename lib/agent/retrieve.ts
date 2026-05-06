/**
 * retrieve.ts
 *
 * RAG retrieval over vault chunks.
 * Hybrid BM25 + vector search to find relevant knowledge.
 *
 * TODO: Implement retrieval pipeline
 */

export interface VaultChunk {
  id: string;
  content: string;
  source: string;
  score: number;
}

export const retrieveChunks = async (
  query: string,
  topK?: number,
): Promise<VaultChunk[]> => {
  // TODO: Implement hybrid search over vault
  // - Load vault chunks from /vault/*.md
  // - BM25 keyword matching
  // - Vector similarity (embed query + chunks)
  // - Return top-k results
  throw new Error('Not implemented');
};
