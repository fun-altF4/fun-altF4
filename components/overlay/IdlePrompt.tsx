/**
 * IdlePrompt.tsx
 *
 * Tier 1 idle soft prompt (very subtle, gray-500, italic):
 * "Take your time. I'll start when you're ready."
 *
 * Appears after 12s if visitor still on Tier 1 with no scroll and no input.
 * Fades in gently below the input field.
 *
 * See SECTION 2 TIER 1 (Idle Soft Prompt)
 */

export default function IdlePrompt() {
  return (
    <p className="text-xs text-gray-500 italic text-center max-w-xs mt-6">
      Take your time. I&apos;ll start when you&apos;re ready.
    </p>
  );
}
