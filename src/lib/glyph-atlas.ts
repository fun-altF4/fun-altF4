import * as THREE from "three";

export const GLYPHS = [" ", ".", ":", "-", "+", "*", "o", "0", "@", "#"] as const;

/**
 * Build a horizontal glyph atlas as a CanvasTexture for shader sampling.
 * Must be called client-side (uses document.createElement).
 */
export function makeGlyphAtlas(
  chars: readonly string[] = GLYPHS,
  cellW = 16,
  cellH = 24,
  fontPx = 18
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = cellW * chars.length;
  canvas.height = cellH;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${fontPx}px "JetBrains Mono", ui-monospace, monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  chars.forEach((ch, i) => {
    ctx.fillText(ch, i * cellW + cellW / 2, cellH / 2);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** Evenly distributed points on a unit sphere (Fibonacci lattice). */
export function fibonacciSphere(count: number, radius = 1): Float32Array {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return out;
}

/**
 * Integrate the Aizawa strange attractor — a chaotic 3D system that
 * traces an organic, butterfly-shaped trajectory. Returns N positions
 * sampled from a single long orbit (Float32Array of length steps*3).
 *
 * The skip warmup + RK4-style euler keep the orbit on the actual
 * attractor instead of the spiral-in transient.
 */
export function aizawaAttractor(
  steps: number,
  dt = 0.0085,
  scale = 1
): Float32Array {
  const out = new Float32Array(steps * 3);
  const a = 0.95,
    b = 0.7,
    c = 0.6,
    d = 3.5,
    e = 0.25,
    f = 0.1;

  let x = 0.1,
    y = 0,
    z = 0;

  // burn in transient so the visible orbit sits on the attractor surface
  const warmup = 4000;
  for (let i = 0; i < warmup + steps; i++) {
    const dx = (z - b) * x - d * y;
    const dy = d * x + (z - b) * y;
    const dz =
      c +
      a * z -
      (z * z * z) / 3 -
      (x * x + y * y) * (1 + e * z) +
      f * z * x * x * x;

    x += dx * dt;
    y += dy * dt;
    z += dz * dt;

    if (i >= warmup) {
      const j = (i - warmup) * 3;
      out[j] = x * scale;
      out[j + 1] = y * scale;
      out[j + 2] = (z - 1) * scale; // recenter z
    }
  }
  return out;
}
