/**
 * Particles.tsx
 *
 * ~10,000 instanced ambient particles drifting through the volume (desktop).
 * - InstancedMesh for performance
 * - Random positions, slow Brownian drift
 * - Varying scales: 0.02–0.08 units
 * - Opacity: 0.3–0.7
 * - Custom particle.vert + particle.frag shaders
 * - Mobile lite scene: 3000 particles max
 *
 * Visible: Beats 3–5 (appears with galaxy reveal)
 * Performance: critical for 60fps desktop, 30fps mobile
 *
 * See SECTION 2 BEAT 3 and SECTION 9 (performance targets)
 */

export default function Particles() {
  // TODO: Implement Particles
  // - Load particles.vert + particles.frag
  // - Create InstancedMesh with 10k instances (desktop) or 3k (mobile)
  // - Randomize position and scale per instance
  // - useFrame: implement slow Brownian motion
  // - Handle mobile vs desktop via DeviceClass context

  return null;
}
