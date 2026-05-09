"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  GLYPHS,
  aizawaAttractor,
  makeGlyphAtlas,
} from "@/lib/glyph-atlas";
import { heroProgressRef } from "@/lib/hero-scroll";
import {
  scrollVelocityRef,
  smoothedScrollVelocityRef,
} from "@/lib/scroll-state";
import PostFX from "./post-fx";

const VELOCITY_NORM = 22;

/* -----------------------------------------------------------------------
 * BACKDROP — fullscreen 2D shader rendered in clip space
 * Domain-warped FBM + mouse-driven density attractor + ring pulse.
 * Stays behind the 3D layer regardless of the perspective camera.
 * --------------------------------------------------------------------- */

const BG_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // bypass the camera — sit at the back of clip space
    gl_Position = vec4(position.xy, 0.999, 1.0);
  }
`;

const BG_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform sampler2D uAtlas;
  uniform float uCharCount;
  uniform vec2 uPointer;
  uniform float uPointerEnergy;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }
  float pattern(vec2 p, float t) {
    vec2 q = vec2(
      fbm(p + vec2(t * 0.06, 0.0)),
      fbm(p + vec2(5.2, 1.3 + t * 0.04))
    );
    vec2 r = vec2(
      fbm(p + 4.0 * q + vec2(1.7, 9.2 + t * 0.13)),
      fbm(p + 4.0 * q + vec2(8.3 + t * 0.17, 2.8))
    );
    return fbm(p + 4.0 * r);
  }

  void main() {
    vec2 cellPx = vec2(11.0, 15.0);
    vec2 frag = vUv * uResolution;
    vec2 cell = floor(frag / cellPx);
    vec2 inCell = fract(frag / cellPx);

    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 q = (cell / (uResolution / cellPx)) * vec2(aspect, 1.0) * 2.4;

    float n = pattern(q, uTime * 0.55);

    vec2 dp = (vUv - uPointer) * vec2(aspect, 1.0);
    float dist = length(dp);
    float ring = sin(dist * 28.0 - uTime * 5.0);
    n += ring * exp(-dist * 5.0) * 0.16 * uPointerEnergy;
    n += exp(-dist * 7.0) * 0.50 * uPointerEnergy;

    n = smoothstep(0.34, 0.95, n);

    // dim the backdrop a touch — the 3D attractor sits in front
    n *= 0.55;

    float idx = floor(n * (uCharCount - 0.001));
    vec2 atlasUV = vec2((idx + inCell.x) / uCharCount, inCell.y);
    float glyph = texture2D(uAtlas, atlasUV).r;

    float vignette = smoothstep(1.18, 0.32, distance(vUv, vec2(0.5)));

    vec3 phosphor = vec3(0.95, 0.62, 0.0);
    float brightness = pow(n, 1.4);
    vec3 color = phosphor * (0.7 + brightness * 0.6);

    float alpha = glyph * brightness * vignette;
    // backdrop fragments composited onto opaque clear color
    gl_FragColor = vec4(color * alpha, 1.0);
  }
`;

function Backdrop() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const atlas = useMemo(() => makeGlyphAtlas(), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uAtlas: { value: atlas },
      uCharCount: { value: GLYPHS.length },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerEnergy: { value: 0 },
    }),
    [atlas]
  );

  useFrame(({ size, pointer, clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    matRef.current.uniforms.uResolution.value.set(size.width, size.height);
    const target = matRef.current.uniforms.uPointer.value as THREE.Vector2;
    const tx = pointer.x * 0.5 + 0.5;
    const ty = pointer.y * 0.5 + 0.5;
    target.x += (tx - target.x) * 0.06;
    target.y += (ty - target.y) * 0.06;
    const onCanvas = pointer.x !== 0 || pointer.y !== 0 ? 1 : 0;
    const e = matRef.current.uniforms.uPointerEnergy;
    e.value += (onCanvas - e.value) * 0.04;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={BG_VERT}
        fragmentShader={BG_FRAG}
        depthTest={false}
        depthWrite={false}
        transparent={false}
      />
    </mesh>
  );
}

/* -----------------------------------------------------------------------
 * ATTRACTOR — 3D Aizawa strange attractor as a glyph point cloud.
 * Particles flow along a precomputed orbit; the whole shape rotates
 * with cursor parallax. Bloom catches the bright heads.
 * --------------------------------------------------------------------- */

const TRAJ_STEPS = 9000;
const PARTICLE_COUNT = 6500;

const FG_VERT = /* glsl */ `
  attribute float aGlyphIdx;
  attribute float aBrightness;
  attribute float aPhase;
  varying float vGlyphIdx;
  varying float vBrightness;

  uniform float uTime;
  uniform float uPixelRatio;

  void main() {
    vGlyphIdx = aGlyphIdx;

    // shimmer staggered by phase
    float shimmer = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase * 6.28318);

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float depth = -mv.z;

    // depth fade — far points dim, front points pop
    float depthFade = smoothstep(14.0, 4.0, depth);

    // a fraction of the particles ride a moving brightness wave around the orbit
    float wave = 0.5 + 0.5 * sin(uTime * 1.2 - aPhase * 12.0);
    float headPulse = pow(wave, 8.0);

    vBrightness =
      aBrightness * shimmer * (0.3 + depthFade) +
      headPulse * 0.9 * depthFade;

    float size = 11.0 * uPixelRatio / max(depth, 0.5);
    gl_PointSize = clamp(size, 1.0, 28.0);

    gl_Position = projectionMatrix * mv;
  }
`;

const FG_FRAG = /* glsl */ `
  precision mediump float;
  uniform sampler2D uAtlas;
  uniform float uCharCount;
  varying float vGlyphIdx;
  varying float vBrightness;
  void main() {
    vec2 uv = gl_PointCoord;
    vec2 atlasUV = vec2((vGlyphIdx + uv.x) / uCharCount, uv.y);
    float glyph = texture2D(uAtlas, atlasUV).r;
    if (glyph < 0.05) discard;
    float falloff = 1.0 - length(uv - 0.5) * 0.5;
    vec3 phosphor = vec3(1.0, 0.69, 0.0);
    float intensity = glyph * vBrightness * falloff;
    // boost color above 1.0 so bloom pass sees a real bright head
    gl_FragColor = vec4(phosphor * (0.6 + intensity * 1.2), intensity);
  }
`;

function AttractorField() {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const positionAttrRef = useRef<THREE.BufferAttribute>(null);
  const atlas = useMemo(() => makeGlyphAtlas(), []);

  // Precompute the attractor orbit + per-particle attributes once.
  const { trajectory, positions, glyphIdx, brightness, phase } = useMemo(() => {
    const trajectory = aizawaAttractor(TRAJ_STEPS, 0.0085, 1.6);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const glyphIdx = new Float32Array(PARTICLE_COUNT);
    const brightness = new Float32Array(PARTICLE_COUNT);
    const phase = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const startIdx = Math.floor((i / PARTICLE_COUNT) * TRAJ_STEPS);
      positions[i * 3] = trajectory[startIdx * 3];
      positions[i * 3 + 1] = trajectory[startIdx * 3 + 1];
      positions[i * 3 + 2] = trajectory[startIdx * 3 + 2];
      glyphIdx[i] = Math.floor(Math.random() * GLYPHS.length);
      brightness[i] = 0.35 + Math.random() * 0.65;
      phase[i] = i / PARTICLE_COUNT;
    }
    return { trajectory, positions, glyphIdx, brightness, phase };
  }, []);

  const uniforms = useMemo(
    () => ({
      uAtlas: { value: atlas },
      uCharCount: { value: GLYPHS.length },
      uTime: { value: 0 },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 1.6)
            : 1,
      },
    }),
    [atlas]
  );

  useFrame(({ pointer, clock, camera }) => {
    if (!groupRef.current || !matRef.current || !positionAttrRef.current)
      return;
    const t = clock.elapsedTime;
    matRef.current.uniforms.uTime.value = t;

    // ----- Lusion-style 3-segment scroll timeline ---------------------
    const p = heroProgressRef.current;

    // S1: 0.0–0.4  entry      ease-in quad   (slow build, accelerates)
    const s1Raw = Math.max(0, Math.min(1, p / 0.4));
    const entry = s1Raw * s1Raw;

    // S2: 0.4–0.75 apex       held / linear  (peak intensity)
    const s2 = Math.max(0, Math.min(1, (p - 0.4) / 0.35));

    // S3: 0.75–1.0 exit       ease-out quad  (release, hand off downstream)
    const s3Raw = Math.max(0, Math.min(1, (p - 0.75) / 0.25));
    const exit = 1 - (1 - s3Raw) * (1 - s3Raw);

    // Camera dolly: pull in through entry, partial pull-back through exit
    const targetCamZ = 7 - entry * 2.8 + exit * 1.6;
    const targetCamY = -entry * 0.55 + exit * 0.3;
    camera.position.z += (targetCamZ - camera.position.z) * 0.1;
    camera.position.y += (targetCamY - camera.position.y) * 0.1;

    // ----- Studio-Freight velocity-driven micro-shake -----------------
    // smooth the 60fps lenis velocity in-place to avoid jitter spikes
    const target = Math.min(scrollVelocityRef.current / VELOCITY_NORM, 1);
    smoothedScrollVelocityRef.current +=
      (target - smoothedScrollVelocityRef.current) * 0.18;
    const vSmooth = smoothedScrollVelocityRef.current;
    const shake = vSmooth * 0.05;
    camera.position.x = Math.sin(t * 28) * shake;
    camera.lookAt(0, 0, 0);

    // Flow rate: rises in entry, holds in apex, fades in exit
    const flowMul = 1 + entry * 1.7 + s2 * (1 - exit) * 0.7 - exit * 0.35;
    const stepsPerSec = 220 * flowMul;
    const offset = Math.floor(t * stepsPerSec);

    const arr = positions;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseIdx = Math.floor(phase[i] * TRAJ_STEPS);
      let tIdx = (baseIdx + offset) % TRAJ_STEPS;
      if (tIdx < 0) tIdx += TRAJ_STEPS;
      const j = i * 3;
      const k = tIdx * 3;
      arr[j] = trajectory[k];
      arr[j + 1] = trajectory[k + 1];
      arr[j + 2] = trajectory[k + 2];
    }
    positionAttrRef.current.needsUpdate = true;

    // Rotation: accelerates through entry, sustains in apex, decays in exit
    const rotBoost = entry * 0.012 + s2 * (1 - exit) * 0.006;
    groupRef.current.rotation.y += 0.0028 + rotBoost;

    // Tilt: dipping during entry, lifting during exit, plus pointer parallax
    const targetX = pointer.y * 0.22 - entry * 0.4 + exit * 0.18;
    const targetZ = pointer.x * 0.22;
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.z +=
      (targetZ - groupRef.current.rotation.z) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <points frustumCulled={false} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute
            ref={positionAttrRef}
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aGlyphIdx"
            args={[glyphIdx, 1]}
          />
          <bufferAttribute
            attach="attributes-aBrightness"
            args={[brightness, 1]}
          />
          <bufferAttribute attach="attributes-aPhase" args={[phase, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={FG_VERT}
          fragmentShader={FG_FRAG}
          transparent
          depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* -----------------------------------------------------------------------
 * HERO CANVAS — perspective camera, backdrop + attractor + post-FX.
 * --------------------------------------------------------------------- */

export default function AsciiShader() {
  return (
    <Canvas
      camera={{ fov: 42, position: [0, 0, 7], near: 0.1, far: 60 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.6]}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#070707", 1);
      }}
    >
      <Backdrop />
      <AttractorField />
      <PostFX preset="hero" />
    </Canvas>
  );
}
