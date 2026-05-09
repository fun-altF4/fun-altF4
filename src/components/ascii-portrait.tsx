"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { GLYPHS, fibonacciSphere, makeGlyphAtlas } from "@/lib/glyph-atlas";
import PostFX from "./post-fx";

const POINT_COUNT = 4200;

const VERT = /* glsl */ `
  attribute float aGlyphIdx;
  attribute float aBrightness;
  attribute float aPhase;
  varying float vGlyphIdx;
  varying float vBrightness;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uPulse;

  void main() {
    vGlyphIdx = aGlyphIdx;

    // breathing radial displacement — the constellation inhales
    float breathe = 0.06 * sin(uTime * 0.7 + aPhase);
    // a traveling wave around the sphere
    float wave = 0.025 * sin(uTime * 1.4 + position.y * 5.0 + aPhase);
    vec3 pos = position * (1.0 + breathe + wave);

    // per-point shimmer staggered by phase
    float shimmer = 0.5 + 0.5 * sin(uTime * 1.8 + aPhase * 6.28);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // depth-aware brightness — back of sphere dims, front pops
    float depth = -mv.z;
    float depthFade = smoothstep(3.6, 1.6, depth);

    vBrightness = aBrightness * shimmer * (0.45 + 0.85 * depthFade) + uPulse * 0.3;

    // depth-aware point size with min/max clamp
    float size = 14.0 * uPixelRatio / depth;
    gl_PointSize = clamp(size, 1.0, 26.0);

    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
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

    // subtle inner glow falloff so each glyph blooms
    float falloff = 1.0 - length(uv - 0.5) * 0.6;

    vec3 phosphor = vec3(1.0, 0.69, 0.0);
    float intensity = glyph * vBrightness * falloff;
    gl_FragColor = vec4(phosphor * (0.7 + intensity * 0.6), intensity);
  }
`;

function PointCloud() {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const atlas = useMemo(() => makeGlyphAtlas(), []);

  const { positions, glyphIdx, brightness, phase } = useMemo(() => {
    const positions = fibonacciSphere(POINT_COUNT, 1);
    const glyphIdx = new Float32Array(POINT_COUNT);
    const brightness = new Float32Array(POINT_COUNT);
    const phase = new Float32Array(POINT_COUNT);
    for (let i = 0; i < POINT_COUNT; i++) {
      glyphIdx[i] = Math.floor(Math.random() * GLYPHS.length);
      brightness[i] = 0.35 + Math.random() * 0.65;
      phase[i] = Math.random() * Math.PI * 2;
    }
    return { positions, glyphIdx, brightness, phase };
  }, []);

  const uniforms = useMemo(
    () => ({
      uAtlas: { value: atlas },
      uCharCount: { value: GLYPHS.length },
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 1.75)
            : 1,
      },
    }),
    [atlas]
  );

  useFrame(({ pointer, clock }) => {
    if (!groupRef.current || !matRef.current) return;
    const t = clock.elapsedTime;
    matRef.current.uniforms.uTime.value = t;
    // every ~6s a pulse ripples through brightness
    const pulse = Math.max(0, Math.sin(t * 0.45)) ** 6;
    matRef.current.uniforms.uPulse.value = pulse;

    groupRef.current.rotation.y += 0.0032;
    const targetX = pointer.y * 0.28;
    const targetZ = pointer.x * 0.28;
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.z +=
      (targetZ - groupRef.current.rotation.z) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
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
          transparent
          depthTest={false}
          depthWrite={false}
          uniforms={uniforms}
          vertexShader={VERT}
          fragmentShader={FRAG}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function AsciiPortrait() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.6], fov: 45 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.75]}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#070707", 1);
      }}
    >
      <PointCloud />
      <PostFX preset="portrait" />
    </Canvas>
  );
}
