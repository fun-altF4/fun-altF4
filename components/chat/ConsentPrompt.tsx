/**
 * ConsentPrompt.tsx
 *
 * Cross-session memory opt-in (Tier 3).
 * Appears after 3+ messages.
 * - Asks permission to store conversation history for future visits
 * - Sets cookie-based visitor ID for 12-month retention
 * - Links to privacy policy
 *
 * On accept:
 * - POST /api/consent with visitor ID + consent flag
 * - Store consent in localStorage
 *
 * See SECTION 10 (Privacy & Consent)
 */

export default function ConsentPrompt() {
  // TODO: Implement consent dialog
  // - Modal/dialog UI
  // - Accept/Decline buttons
  // - Privacy policy link
  // - localStorage persistence
  // - POST /api/consent handler

  return null;
}
