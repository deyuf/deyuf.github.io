"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import * as THREE from "three";

/**
 * Stylized 6-DOF manipulator built from primitives. Lightweight (no STL),
 * robotics-coded, idle sway driven by useFrame.
 */
function ArmSegment({
  length,
  color = "#1f1f23",
  radius = 0.12,
}: {
  length: number;
  color?: string;
  radius?: number;
}) {
  return (
    <mesh position={[0, length / 2, 0]} castShadow>
      <cylinderGeometry args={[radius * 0.85, radius, length, 24]} />
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
    </mesh>
  );
}

function Joint({ accent = false }: { accent?: boolean }) {
  return (
    <mesh castShadow>
      <sphereGeometry args={[0.18, 24, 24]} />
      <meshStandardMaterial
        color={accent ? "#00e0b8" : "#2a2a30"}
        metalness={accent ? 0.2 : 0.6}
        roughness={accent ? 0.4 : 0.35}
        emissive={accent ? "#00e0b8" : "#000000"}
        emissiveIntensity={accent ? 0.18 : 0}
      />
    </mesh>
  );
}

function Gripper() {
  return (
    <group>
      <Joint accent />
      <mesh position={[0.06, 0.16, 0]} castShadow>
        <boxGeometry args={[0.04, 0.22, 0.12]} />
        <meshStandardMaterial color="#1a1a1d" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-0.06, 0.16, 0]} castShadow>
        <boxGeometry args={[0.04, 0.22, 0.12]} />
        <meshStandardMaterial color="#1a1a1d" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Arm() {
  const root = useRef<Group>(null);
  const j1 = useRef<Group>(null);
  const j2 = useRef<Group>(null);
  const j3 = useRef<Group>(null);
  const j4 = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (root.current) root.current.rotation.y = Math.sin(t * 0.3) * 0.5;
    if (j1.current) j1.current.rotation.x = -0.4 + Math.sin(t * 0.45) * 0.25;
    if (j2.current) j2.current.rotation.x = 0.9 + Math.cos(t * 0.5) * 0.3;
    if (j3.current) j3.current.rotation.x = -0.3 + Math.sin(t * 0.6) * 0.2;
    if (j4.current) j4.current.rotation.z = Math.sin(t * 0.8) * 0.4;
  });

  return (
    <group ref={root} position={[0, -0.8, 0]}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.12, 32]} />
        <meshStandardMaterial color="#101013" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.45, 0.16, 32]} />
        <meshStandardMaterial color="#1a1a1f" metalness={0.5} roughness={0.45} />
      </mesh>
      {/* Shoulder */}
      <group position={[0, 0.32, 0]}>
        <Joint />
        <group ref={j1}>
          <ArmSegment length={0.85} />
          {/* Elbow */}
          <group position={[0, 0.85, 0]}>
            <Joint />
            <group ref={j2}>
              <ArmSegment length={0.7} />
              {/* Wrist 1 */}
              <group position={[0, 0.7, 0]}>
                <Joint />
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

function AccentLight() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.x = Math.cos(t * 0.4) * 2.4;
      ref.current.position.z = Math.sin(t * 0.4) * 2.4;
    }
  });
  return <pointLight ref={ref} color="#00e0b8" intensity={2} distance={6} />;
}

export function RobotCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [2.4, 1.4, 3.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[3, 5, 3]}
        intensity={1.0}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <AccentLight />
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.25}>
        <Arm />
      </Float>
      <ContactShadows
        position={[0, -0.86, 0]}
        opacity={0.6}
        scale={6}
        blur={2.4}
        far={3}
      />
      <Environment preset="city" />
    </Canvas>
  );
}
