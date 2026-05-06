/**
 * identity.ts
 *
 * Supabase Postgres identity CRUD (Phase 3 — scaffold for now).
 * Long-term visitor identity memory (12-month retention).
 * Opt-in via consent prompt after 3+ messages.
 *
 * TODO: Implement Postgres integration
 */

export interface VisitorIdentity {
  visitorId: string;
  name: string | null;
  bio: string | null;
  interests: string[];
  conversationHistory: string;
  consentedAt: Date;
  expiresAt: Date;
}

export const getIdentity = async (visitorId: string): Promise<VisitorIdentity | null> => {
  // TODO: Query Supabase table
  throw new Error('Not implemented');
};

export const createIdentity = async (identity: VisitorIdentity): Promise<void> => {
  // TODO: INSERT into Supabase table with 12-month TTL
  throw new Error('Not implemented');
};
