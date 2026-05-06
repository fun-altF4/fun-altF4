/**
 * chunks.ts
 *
 * Chunking logic for vault corpus.
 * Splits /vault/*.md files into retrievable chunks.
 *
 * TODO: Implement chunking (can start simple: by paragraph)
 */

export interface Chunk {
  id: string;
  content: string;
  source: string;
  index: number;
}

export const chunkVaultFiles = async (): Promise<Chunk[]> => {
  // TODO: Load all /vault/*.md files
  // Split by paragraph/section
  // Create embeddings for vector search
  // Return chunks with metadata
  throw new Error('Not implemented');
};
