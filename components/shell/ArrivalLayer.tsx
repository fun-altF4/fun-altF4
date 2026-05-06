/**
 * ArrivalLayer (Tier 1)
 *
 * Implements the first 3 seconds of the experience:
 * - Pure #000000 background
 * - Dim point of light pulsing at 60 bpm (4px circle with expanding glow)
 * - Stillness detection (1.5s no mousemove)
 * - Text reveal sequence:
 *   1. "This portfolio is a working AI. It will introduce me to you. It will also notice you."
 *   2. "Say something — or scroll if you'd rather watch."
 *   3. Text input (underline only, 320px max width on desktop)
 * - Audio toggle button (32px circle, bottom-right)
 * - Idle soft prompt after 12s (gray-500, italic)
 * - Transitions: scroll → Tier 2 (Cinematic), input submit → Tier 3 (Conversation)
 *
 * See SECTION 2, TIER 1 in spec
 */

interface ArrivalLayerProps {
  onEnableTransitions: () => void;
}

export default function ArrivalLayer({ onEnableTransitions }: ArrivalLayerProps) {
  // TODO: Implement full Arrival layer
  // - Dim point animation
  // - Stillness-triggered text reveal sequence (Framer Motion)
  // - Input field with focus underline
  // - Audio toggle in bottom-right
  // - Idle soft prompt (appears after 12s)

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-1 h-1 rounded-full bg-white mx-auto mb-8" />
        <p className="text-gray-400">Arrival Layer — TODO</p>
      </div>
    </div>
  );
}
