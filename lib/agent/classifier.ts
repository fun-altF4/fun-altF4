/**
 * classifier.ts
 *
 * Visitor classification logic.
 * Parses messages, calls /api/classify endpoint, returns visitor type + confidence.
 *
 * TODO: Implement classification wrapper
 */

export interface ClassificationResult {
  type:
    | 'recruiter'
    | 'founder'
    | 'engineer'
    | 'philosopher'
    | 'curious'
    | 'ambiguous';
  confidence: number;
  signals: string[];
}

export const classifyVisitor = async (
  messages: any[],
): Promise<ClassificationResult> => {
  // TODO: POST to /api/classify, parse JSON response
  throw new Error('Not implemented');
};
