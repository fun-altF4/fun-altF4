/**
 * session.ts
 *
 * Redis session CRUD.
 * Stores ephemeral conversation state with 24h TTL.
 * Visitor ID (sessionId) is the key.
 *
 * TODO: Implement Redis client + CRUD
 */

export interface SessionData {
  visitorId: string;
  visitorType: string;
  visitorConfidence: number;
  messageCount: number;
  createdAt: Date;
  lastActivityAt: Date;
}

export const getSession = async (sessionId: string): Promise<SessionData | null> => {
  // TODO: GET from Redis with key `session:{sessionId}`
  throw new Error('Not implemented');
};

export const setSession = async (session: SessionData): Promise<void> => {
  // TODO: SET Redis with 24h TTL
  throw new Error('Not implemented');
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  // TODO: DEL Redis key
  throw new Error('Not implemented');
};
