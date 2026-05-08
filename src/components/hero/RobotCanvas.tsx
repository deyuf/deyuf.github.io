"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Grid,
  Sparkles,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useState, useEffect } from "react";
import type { Group } from "three";
import * as THREE from "three";

const ACCENT = "#00e0b8";

function ArmSegment({
  length,
  color = "#1a1a1f",
  radius = 0.12,
}: {
  length: number;
  color?: string;
  radius?: number;
}) {
  return (
    <group position={[0, length / 2, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[radius * 0.85, radius, length, 32]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.85}
          roughness={0.3}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
        />
      </mesh>
      {/* Inner accent stripe */}
      <mesh>
        <cylinderGeometry
          args={[radius * 0.86, radius * 1.02, length * 0.06, 32]}
        />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Joint({
  accent = false,
  size = 0.18,
}: {
  accent?: boolean;
  size?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (accent && ref.current) {
      const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 1.6) * 0.35;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      if (mat) mat.emissiveIntensity = pulse;
    }
  });
  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={accent ? ACCENT : "#23232a"}
        metalness={accent ? 0.2 : 0.85}
        roughness={accent ? 0.3 : 0.25}
        emissive={accent ? ACCENT : "#000000"}
        emissiveIntensity={accent ? 1 : 0}
        toneMapped={!accent}
      />
    </mesh>
  );
}

function Gripper() {
  return (
    <group>
      <Joint accent size={0.16} />
      {/* Wrist plate */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.11, 0.06, 24]} />
        <meshPhysicalMaterial
          color="#22222a"
          metalness={0.9}
          roughness={0.25}
          clearcoat={0.5}
        />
      </mesh>
      {/* Gripper fingers */}
      <mesh position={[0.07, 0.2, 0]} castShadow>
        <boxGeometry args={[0.04, 0.22, 0.12]} />
        <meshPhysicalMaterial
          color="#15151a"
          metalness={0.8}
          roughness={0.3}
          clearcoat={0.4}
        />
      </mesh>
      <mesh position={[-0.07, 0.2, 0]} castShadow>
        <boxGeometry args={[0.04, 0.22, 0.12]} />
        <meshPhysicalMaterial
          color="#15151a"
          metalness={0.8}
          roughness={0.3}
          clearcoat={0.4}
        />
      </mesh>
      {/* Tip dot */}
      <mesh position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Arm({ pointer }: { pointer: THREE.Vector2 }) {
  const root = useRef<Group>(null);
  const j1 = useRef<Group>(null);
  const j2 = useRef<Group>(null);
  const j3 = useRef<Group>(null);
  const j4 = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Constrained ranges to keep arm inside the frame
    if (root.current) {
      const targetY = Math.sin(t * 0.3) * 0.35 + pointer.x * 0.25;
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        targetY,
        2,
        0.016
      );
    }
    if (j1.current) {
      j1.current.rotation.x = -0.35 + Math.sin(t * 0.45) * 0.18;
    }
    if (j2.current) {
      j2.current.rotation.x = 0.85 + Math.cos(t * 0.5) * 0.22;
    }
    if (j3.current) {
      j3.current.rotation.x = -0.25 + Math.sin(t * 0.6) * 0.15 + pointer.y * 0.2;
    }
    if (j4.current) {
      j4.current.rotation.z = Math.sin(t * 0.8) * 0.45;
    }
  });

  return (
    <group ref={root} position={[0, -0.95, 0]} scale={0.78}>
      {/* Base disc */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.1, 48]} />
        <meshPhysicalMaterial
          color="#0c0c0f"
          metalness={0.6}
          roughness={0.5}
          clearcoat={0.3}
        />
      </mesh>
      {/* Accent ring on base */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.55, 0.012, 16, 64]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.18, 48]} />
        <meshPhysicalMaterial
          color="#1c1c22"
          metalness={0.85}
          roughness={0.25}
          clearcoat={0.5}
        />
      </mesh>
      {/* Shoulder */}
      <group position={[0, 0.32, 0]}>
        <Joint accent size={0.2} />
        <group ref={j1}>
          <ArmSegment length={0.85} />
          {/* Elbow */}
          <group position={[0, 0.85, 0]}>
            <Joint size={0.16} />
            <group ref={j2}>
              <ArmSegment length={0.7} />
              {/* Wrist 1 */}
              <group position={[0, 0.7, 0]}>
                <Joint accent size={0.14} />
                <group ref={j3}>
                  <ArmSegment length={0.45} radius={0.09} />
                  {/* Wrist 2 (twist) */}
                  <group position={[0, 0.45, 0]}>
                    <group ref={j4}>
                      <Gripper />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

function OrbitingAccent() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.x = Math.cos(t * 0.4) * 2.6;
      ref.current.position.z = Math.sin(t * 0.4) * 2.6;
      ref.current.position.y = 0.8 + Math.sin(t * 0.6) * 0.4;
    }
  });
  return <pointLight ref={ref} color={ACCENT} intensity={4} distance={6} />;
}

function Scene({ pointer }: { pointer: THREE.Vector2 }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 0.4, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        castShadow
        position={[3, 6, 4]}
        intensity={1.2}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 2, -3]} intensity={1.4} color="#5a8cff" />
      <OrbitingAccent />

      <Float
        speed={0.9}
        rotationIntensity={0.08}
        floatIntensity={0.12}
        floatingRange={[-0.04, 0.04]}
      >
        <Arm pointer={pointer} />
      </Float>

      {/* Tech-grid floor */}
      <Grid
        position={[0, -1.7, 0]}
        args={[14, 14]}
        cellSize={0.4}
        cellThickness={0.6}
        cellColor="#1a3a35"
        sectionSize={2}
        sectionThickness={1}
        sectionColor={ACCENT}
        fadeDistance={6}
        fadeStrength={1.2}
        infiniteGrid
      />

      <ContactShadows
        position={[0, -1.69, 0]}
        opacity={0.55}
        scale={6}
        blur={2.6}
        far={3}
      />

      <Sparkles
        count={36}
        size={2}
        scale={5}
        speed={0.3}
        color={ACCENT}
        opacity={0.6}
      />

      <Environment preset="city" />
    </>
  );
}

export function RobotCanvas() {
  const [pointer, setPointer] = useState(() => new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      pointer.lerp(target.current, 0.08);
      setPointer(new THREE.Vector2(pointer.x, pointer.y));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pointer]);

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [3.2, 2.0, 4.6], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      onPointerMove={(e) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        target.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        target.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        target.current.set(0, 0);
      }}
    >
      <Scene pointer={pointer} />
      <EffectComposer>
        <Bloom
          mipmapBlur
          intensity={0.9}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.3}
          radius={0.7}
        />
      </EffectComposer>
    </Canvas>
  );
}
