/**
 * camera-paths.ts
 *
 * GSAP camera keyframes per beat.
 * Camera position, lookAt, FOV animation sequences.
 *
 * Used by CameraDirector to orchestrate smooth transitions.
 *
 * TODO: Define camera paths with GSAP timeline
 */

export const CAMERA_PATHS = {
  BEAT_1: {
    // Camera at DualCore, no movement
    position: [0, 0, 3],
    lookAt: [0, 0, 0],
    fov: 50,
  },
  BEAT_2: {
    // Subtle tilt watching bridges
    position: [0, 0.5, 3],
    lookAt: [0, 0, 0],
    fov: 50,
  },
  BEAT_3: {
    // Pull back to galaxy view (GSAP tween over ~8s)
    position: [0, 0, 20],
    lookAt: [0, 0, 0],
    fov: 75,
  },
  BEAT_4: {
    // Dynamic dive toward cluster (Bezier curve)
    // Randomized per page load based on selectedCluster
    position: 'computed',
    lookAt: 'computed',
    fov: 60,
  },
  BEAT_5: {
    // Return to galaxy
    position: [0, 0, 20],
    lookAt: [0, 0, 0],
    fov: 75,
  },
};

// Helper to compute Beat 4 camera path based on selected cluster
export const computeClusterDiveCamera = (clusterIndex: number) => {
  // TODO: Return Bezier control points for cluster dive
  // Based on cluster position in 3D space
  throw new Error('Not implemented');
};
