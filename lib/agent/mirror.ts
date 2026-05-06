/**
 * mirror.ts
 *
 * Mirror generation logic.
 * Calls /api/mirror to surface observations about visitor thinking.
 * Triggered after 4–6 turns OR specific visitor behaviors.
 *
 * TODO: Implement mirror retrieval
 */

export interface MirrorObservation {
  observation: string | null;
  trigger: 'cross-domain' | 'opinion' | 'pattern' | null;
}

export const generateMirror = async (
  messages: any[],
  visitorType: string,
): Promise<MirrorObservation | null> => {
  // TODO: POST to /api/mirror, parse JSON response
  throw new Error('Not implemented');
};
