"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { GLYPHS, makeGlyphAtlas } from "@/lib/glyph-atlas";
import PostFX from "./post-fx";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform sampler2D uAtlas;
  uniform float uCharCount;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 cellPx = vec2(12.0, 18.0);
    vec2 frag = vUv * uResolution;
    vec2 cell = floor(frag / cellPx);
    vec2 inCell = fract(frag / cellPx);

    // column DNA
    float h1 = hash(vec2(cell.x, 1.0));
    float h2 = hash(vec2(cell.x, 7.7));
    float h3 = hash(vec2(cell.x, 13.1));

    // ~30% of columns are silent — creates rhythm and negative space
    float colActive = step(0.30, h3);

    float speed = 1.4 + h1 * 7.5;
    float yOffset = uTime * speed + h2 * 100.0;

    // each column has its own period so trails don't sync up
    float period = 60.0 + h1 * 30.0;
    float yShift = mod(cell.y + yOffset, period);

    // dramatic exp falloff — bright head, soft long tail
    float head = exp(-yShift * 0.35) * 1.9;
    float tail = exp(-yShift * 0.06) * 0.45;
    float intensity = (head + tail) * colActive;

    // occasional glitch flash on a column — chaotic feel
    float flash = step(0.9985, hash(vec2(cell.x, floor(uTime * 8.0))));
    intensity += flash * 1.2 * colActive;

    // glyph cycles as column scrolls; head changes faster
    float cycleSpeed = 0.4 + head * 0.8;
    float glyphSeed = hash(
      vec2(cell.x, floor((cell.y + yOffset) * cycleSpeed))
    );
    float idx = floor(glyphSeed * (uCharCount - 0.001));

    vec2 atlasUV = vec2((idx + inCell.x) / uCharCount, inCell.y);
    float glyph = texture2D(uAtlas, atlasUV).r;

    // edge fades so streams emerge from / dissolve into darkness
    float xFade =
      smoothstep(0.0, 0.12, vUv.x) * smoothstep(0.0, 0.12, 1.0 - vUv.x);
    float yFade =
      smoothstep(0.0, 0.04, vUv.y) * smoothstep(0.0, 0.06, 1.0 - vUv.y);

    vec3 phosphor = vec3(1.0, 0.69, 0.0);
    // head pops brighter to feed the bloom pass
    vec3 color = phosphor * (0.7 + head * 0.5);

    float alpha = glyph * intensity * xFade * yFade;
    gl_FragColor = vec4(color, alpha);
  }
`;

function RainPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const atlas = useMemo(() => makeGlyphAtlas(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uAtlas: { value: atlas },
      uCharCount: { value: GLYPHS.length },
    }),
    [atlas]
  );

  useFrame(({ size, clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    matRef.current.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthTest={false}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
      />
    </mesh>
  );
}

export default function MatrixRain() {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 1, position: [0, 0, 1] }}
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
      <RainPlane />
      <PostFX preset="rain" />
    </Canvas>
  );
}
