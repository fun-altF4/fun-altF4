"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import PostFX from "./post-fx";

/* -----------------------------------------------------------------------
 * WIREFRAME TERRAIN — a subdivided PlaneGeometry rendered as a wireframe
 * with FBM noise driving vertex displacement. Topographic mesh feel,
 * very different from the point-sprite scenes elsewhere. Phosphor color,
 * additive blending, and a low-CA post-FX so the lines don't ghost.
 * --------------------------------------------------------------------- */

const VERT = /* glsl */ `
  uniform float uTime;
  varying float vHeight;

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
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // plane lives in xy; we lift z (its native normal) for height
    vec2 q = position.xy * 0.18 + vec2(uTime * 0.07, uTime * 0.05);
    float h = fbm(q);
    h += 0.4 * fbm(q * 2.4 - vec2(uTime * 0.03, 0.0));
    h *= 1.6;

    vec3 pos = vec3(position.x, position.y, h);
    vHeight = h;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying float vHeight;
  void main() {
    vec3 phosphor = vec3(1.0, 0.69, 0.0);
    float lift = smoothstep(-0.1, 1.6, vHeight);
    float intensity = 0.45 + lift * 0.85;
    gl_FragColor = vec4(phosphor * (0.55 + intensity * 0.7), intensity);
  }
`;

function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock, pointer }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
    if (!meshRef.current) return;
    // gentle yaw plus cursor parallax
    meshRef.current.rotation.z = clock.elapsedTime * 0.06 + pointer.x * 0.18;
    meshRef.current.rotation.x =
      -Math.PI / 2.6 + pointer.y * 0.08;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.6, 0, 0]} position={[0, -0.6, 0]}>
      <planeGeometry args={[18, 12, 70, 46]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        wireframe
        transparent
        blending={THREE.AdditiveBlending}
        depthTest={false}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function WorkTerrain() {
  return (
    <Canvas
      camera={{ fov: 48, position: [0, 4.2, 6.4], near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.6]}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0, 0, 0);
        gl.setClearColor("#070707", 1);
      }}
    >
      <Terrain />
      <PostFX preset="scene" />
    </Canvas>
  );
}
