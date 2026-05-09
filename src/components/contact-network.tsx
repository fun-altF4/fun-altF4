"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { GLYPHS, makeGlyphAtlas } from "@/lib/glyph-atlas";
import PostFX from "./post-fx";

/* -----------------------------------------------------------------------
 * SIGNAL NETWORK — sparse 3D graph. Nodes are glyph endpoints.
 * Faint phosphor lines connect them. Bright pulses travel along the
 * edges, bell-shaped fade at endpoints. Reads as live communication.
 * --------------------------------------------------------------------- */

const NODE_COUNT = 22;
const PULSE_COUNT = 110;
const NEIGHBORS = 3;

// deterministic pseudo-random so SSR + client agree on layout
function rand(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
}

function generateGraph() {
  const r = rand(13371);
  const nodePos = new Float32Array(NODE_COUNT * 3);
  const radius = 2.4;

  // distribute nodes roughly on a sphere with jitter so the graph reads 3D
  for (let i = 0; i < NODE_COUNT; i++) {
    const theta = r() * Math.PI * 2;
    const phi = Math.acos(2 * r() - 1);
    const rr = radius * (0.55 + 0.45 * r());
    nodePos[i * 3] = Math.sin(phi) * Math.cos(theta) * rr;
    nodePos[i * 3 + 1] = Math.cos(phi) * rr * 0.7;
    nodePos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * rr;
  }

  // each node → its K nearest neighbors, deduped to undirected edges
  const seen = new Set<string>();
  const edges: number[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < NODE_COUNT; j++) {
      if (i === j) continue;
      const dx = nodePos[i * 3] - nodePos[j * 3];
      const dy = nodePos[i * 3 + 1] - nodePos[j * 3 + 1];
      const dz = nodePos[i * 3 + 2] - nodePos[j * 3 + 2];
      dists.push({ j, d: dx * dx + dy * dy + dz * dz });
    }
    dists.sort((a, b) => a.d - b.d);
    for (let k = 0; k < NEIGHBORS; k++) {
      const j = dists[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push(i, j);
    }
  }

  // line-segment positions: each edge writes start xyz then end xyz
  const edgeCount = edges.length / 2;
  const linePositions = new Float32Array(edgeCount * 2 * 3);
  for (let e = 0; e < edgeCount; e++) {
    const a = edges[e * 2];
    const b = edges[e * 2 + 1];
    const off = e * 6;
    linePositions[off] = nodePos[a * 3];
    linePositions[off + 1] = nodePos[a * 3 + 1];
    linePositions[off + 2] = nodePos[a * 3 + 2];
    linePositions[off + 3] = nodePos[b * 3];
    linePositions[off + 4] = nodePos[b * 3 + 1];
    linePositions[off + 5] = nodePos[b * 3 + 2];
  }

  return { nodePos, edges, edgeCount, linePositions };
}

/* --- pulse shader: glyph atlas + bell-shape brightness --------------- */

const PULSE_VERT = /* glsl */ `
  attribute float aGlyphIdx;
  attribute float aBrightness;
  varying float vGlyphIdx;
  varying float vBrightness;
  uniform float uPixelRatio;

  void main() {
    vGlyphIdx = aGlyphIdx;
    vBrightness = aBrightness;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float depth = -mv.z;
    float depthFade = smoothstep(11.0, 2.5, depth);
    vBrightness *= depthFade;
    gl_PointSize = clamp(14.0 * uPixelRatio / max(depth, 0.5), 1.0, 26.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const PULSE_FRAG = /* glsl */ `
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
    float falloff = 1.0 - length(uv - 0.5) * 0.55;
    vec3 phosphor = vec3(1.0, 0.69, 0.0);
    float intensity = glyph * vBrightness * falloff;
    gl_FragColor = vec4(phosphor * (0.7 + intensity * 1.3), intensity);
  }
`;

/* --- node shader: bigger, calmer glyph with subtle pulse ------------- */

const NODE_VERT = /* glsl */ `
  attribute float aGlyphIdx;
  attribute float aPhase;
  varying float vGlyphIdx;
  varying float vBrightness;
  uniform float uTime;
  uniform float uPixelRatio;

  void main() {
    vGlyphIdx = aGlyphIdx;
    float pulse = 0.5 + 0.5 * sin(uTime * 1.6 + aPhase * 6.28318);
    vBrightness = 0.45 + 0.55 * pulse;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float depth = -mv.z;
    gl_PointSize = clamp(20.0 * uPixelRatio / max(depth, 0.5), 2.0, 36.0);
    gl_Position = projectionMatrix * mv;
  }
`;

function Network() {
  const groupRef = useRef<THREE.Group>(null);
  const pulsePosAttr = useRef<THREE.BufferAttribute>(null);
  const pulseBrightnessAttr = useRef<THREE.BufferAttribute>(null);
  const pulseMatRef = useRef<THREE.ShaderMaterial>(null);
  const nodeMatRef = useRef<THREE.ShaderMaterial>(null);

  const atlas = useMemo(() => makeGlyphAtlas(), []);
  const graph = useMemo(() => generateGraph(), []);

  const pulseData = useMemo(() => {
    const r = rand(99173);
    const edgeIdx = new Float32Array(PULSE_COUNT);
    const phase = new Float32Array(PULSE_COUNT);
    const speed = new Float32Array(PULSE_COUNT);
    const glyphIdx = new Float32Array(PULSE_COUNT);
    const positions = new Float32Array(PULSE_COUNT * 3);
    const brightness = new Float32Array(PULSE_COUNT);

    for (let i = 0; i < PULSE_COUNT; i++) {
      edgeIdx[i] = Math.floor(r() * graph.edgeCount);
      phase[i] = r();
      speed[i] = 0.18 + r() * 0.42;
      glyphIdx[i] = Math.floor(r() * GLYPHS.length);
      brightness[i] = 0;
    }

    return { edgeIdx, phase, speed, glyphIdx, positions, brightness };
  }, [graph.edgeCount]);

  const nodeData = useMemo(() => {
    const r = rand(55501);
    const glyphIdx = new Float32Array(NODE_COUNT);
    const phase = new Float32Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) {
      glyphIdx[i] = (i * 3 + 7) % GLYPHS.length; // varied across atlas
      phase[i] = r();
    }
    return { glyphIdx, phase };
  }, []);

  const pulseUniforms = useMemo(
    () => ({
      uAtlas: { value: atlas },
      uCharCount: { value: GLYPHS.length },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 1.6)
            : 1,
      },
    }),
    [atlas]
  );

  const nodeUniforms = useMemo(
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

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    if (nodeMatRef.current) nodeMatRef.current.uniforms.uTime.value = t;

    // recompute pulse positions + brightness
    const { positions, brightness, edgeIdx, phase, speed } = pulseData;
    const { edges } = graph;
    const np = graph.nodePos;
    for (let i = 0; i < PULSE_COUNT; i++) {
      const p = ((phase[i] + t * speed[i]) % 1 + 1) % 1;
      const e = edgeIdx[i];
      const a = edges[e * 2];
      const b = edges[e * 2 + 1];
      const ax = np[a * 3];
      const ay = np[a * 3 + 1];
      const az = np[a * 3 + 2];
      const bx = np[b * 3];
      const by = np[b * 3 + 1];
      const bz = np[b * 3 + 2];
      const j = i * 3;
      positions[j] = ax + (bx - ax) * p;
      positions[j + 1] = ay + (by - ay) * p;
      positions[j + 2] = az + (bz - az) * p;
      // bell-shape brightness — bright mid-edge, fade at endpoints
      brightness[i] = Math.sin(p * Math.PI) * 1.4;
    }

    if (pulsePosAttr.current) pulsePosAttr.current.needsUpdate = true;
    if (pulseBrightnessAttr.current)
      pulseBrightnessAttr.current.needsUpdate = true;

    // slow rotation + pointer parallax
    groupRef.current.rotation.y += 0.0028;
    const targetX = pointer.y * 0.32;
    const targetZ = pointer.x * 0.28;
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.z +=
      (targetZ - groupRef.current.rotation.z) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* edges — phosphor, brighter so the network reads at distance */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[graph.linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={"#ffb000"}
          transparent
          opacity={0.42}
          depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* nodes — larger, subtly pulsing glyphs */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[graph.nodePos, 3]}
          />
          <bufferAttribute
            attach="attributes-aGlyphIdx"
            args={[nodeData.glyphIdx, 1]}
          />
          <bufferAttribute
            attach="attributes-aPhase"
            args={[nodeData.phase, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={nodeMatRef}
          uniforms={nodeUniforms}
          vertexShader={NODE_VERT}
          fragmentShader={PULSE_FRAG}
          transparent
          depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* pulses traveling along edges */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            ref={pulsePosAttr}
            attach="attributes-position"
            args={[pulseData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aGlyphIdx"
            args={[pulseData.glyphIdx, 1]}
          />
          <bufferAttribute
            ref={pulseBrightnessAttr}
            attach="attributes-aBrightness"
            args={[pulseData.brightness, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={pulseMatRef}
          uniforms={pulseUniforms}
          vertexShader={PULSE_VERT}
          fragmentShader={PULSE_FRAG}
          transparent
          depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function ContactNetwork() {
  return (
    <Canvas
      camera={{ fov: 45, position: [0, 0, 6.5], near: 0.1, far: 60 }}
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
      <Network />
      <PostFX preset="scene" />
    </Canvas>
  );
}
