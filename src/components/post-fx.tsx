"use client";

import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
  Scanline,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { useMemo } from "react";
import { Vector2 } from "three";

export type PostFXPreset = "hero" | "portrait" | "rain" | "scene";

const PRESETS: Record<
  PostFXPreset,
  {
    bloomIntensity: number;
    bloomThreshold: number;
    bloomSmoothing: number;
    ca: number;
    vignetteOffset: number;
    vignetteDarkness: number;
    noise: number;
    scanlineDensity: number;
    scanlineOpacity: number;
  }
> = {
  hero: {
    bloomIntensity: 1.45,
    bloomThreshold: 0.18,
    bloomSmoothing: 0.55,
    ca: 0.0018,
    vignetteOffset: 0.15,
    vignetteDarkness: 0.85,
    noise: 0.06,
    scanlineDensity: 1.55,
    scanlineOpacity: 0.11,
  },
  portrait: {
    bloomIntensity: 1.1,
    bloomThreshold: 0.12,
    bloomSmoothing: 0.5,
    ca: 0.0009,
    vignetteOffset: 0.2,
    vignetteDarkness: 0.7,
    noise: 0.04,
    scanlineDensity: 1.4,
    scanlineOpacity: 0.07,
  },
  rain: {
    bloomIntensity: 1.25,
    bloomThreshold: 0.22,
    bloomSmoothing: 0.55,
    ca: 0.0014,
    vignetteOffset: 0.12,
    vignetteDarkness: 0.9,
    noise: 0.07,
    scanlineDensity: 1.75,
    scanlineOpacity: 0.13,
  },
  // line-geometry friendly — minimal CA so wireframes/edges don't ghost
  scene: {
    bloomIntensity: 1.2,
    bloomThreshold: 0.16,
    bloomSmoothing: 0.55,
    ca: 0.0006,
    vignetteOffset: 0.15,
    vignetteDarkness: 0.78,
    noise: 0.04,
    scanlineDensity: 1.3,
    scanlineOpacity: 0.07,
  },
};

export default function PostFX({
  preset = "hero",
}: {
  preset?: PostFXPreset;
}) {
  const p = PRESETS[preset];
  const caOffset = useMemo(() => new Vector2(p.ca, p.ca), [p.ca]);

  return (
    <EffectComposer multisampling={0} stencilBuffer={false}>
      <Bloom
        intensity={p.bloomIntensity}
        luminanceThreshold={p.bloomThreshold}
        luminanceSmoothing={p.bloomSmoothing}
        mipmapBlur
        kernelSize={KernelSize.LARGE}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={caOffset}
        radialModulation={false}
        modulationOffset={0}
      />
      <Scanline
        blendFunction={BlendFunction.OVERLAY}
        density={p.scanlineDensity}
        opacity={p.scanlineOpacity}
      />
      <Noise blendFunction={BlendFunction.OVERLAY} opacity={p.noise} />
      <Vignette
        eskil={false}
        offset={p.vignetteOffset}
        darkness={p.vignetteDarkness}
      />
    </EffectComposer>
  );
}
