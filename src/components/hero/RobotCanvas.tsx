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
import { useRef, useEffect, useMemo, useState } from "react";
import type { Group, Vector3 } from "three";
import * as THREE from "three";

interface ArmColors {
  accent: string;
  segment: string;
  segmentMid: string;
  segmentDark: string;
  joint: string;
  cellColor: string;
  rimLight: string;
}

const DARK_COLORS: ArmColors = {
  accent: "#00e0b8",
  segment: "#1a1a1f",
  segmentMid: "#22222a",
  segmentDark: "#15151a",
  joint: "#23232a",
  cellColor: "#1a3a35",
  rimLight: "#5a8cff",
};

const LIGHT_COLORS: ArmColors = {
  accent: "#c96442",
  segment: "#3a342c",
  segmentMid: "#2e2a23",
  segmentDark: "#221f1a",
  joint: "#403a32",
  cellColor: "#a89478",
  rimLight: "#e8a877",
};

function useArmColors(): ArmColors {
  const [colors, setColors] = useState<ArmColors>(DARK_COLORS);
  useEffect(() => {
    const read = () => {
      const isLight = document.documentElement.dataset.theme === "light";
      setColors(isLight ? LIGHT_COLORS : DARK_COLORS);
    };
    read();
    window.addEventListener("themechange", read);
    return () => window.removeEventListener("themechange", read);
  }, []);
  return colors;
}

const L_UPPER = 0.85; // shoulder → elbow
const L_LOWER = 0.7; // elbow → wrist1
const TAIL = 0.45 + 0.34; // wrist1 → tip (forearm + gripper offset)

function ArmSegment({
  length,
  radius = 0.12,
  colors,
}: {
  length: number;
  radius?: number;
  colors: ArmColors;
}) {
  return (
    <mesh position={[0, length / 2, 0]} castShadow>
      <cylinderGeometry args={[radius * 0.85, radius, length, 32]} />
      <meshPhysicalMaterial
        color={colors.segment}
        metalness={0.85}
        roughness={0.32}
        clearcoat={0.55}
        clearcoatRoughness={0.25}
      />
    </mesh>
  );
}

function NeutralJoint({
  size = 0.16,
  colors,
}: {
  size?: number;
  colors: ArmColors;
}) {
  return (
    <mesh castShadow>
      <sphereGeometry args={[size, 32, 32]} />
      <meshPhysicalMaterial
        color={colors.joint}
        metalness={0.9}
        roughness={0.22}
        clearcoat={0.5}
      />
    </mesh>
  );
}

function Gripper({ colors }: { colors: ArmColors }) {
  return (
    <group>
      <NeutralJoint size={0.15} colors={colors} />
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.11, 0.06, 24]} />
        <meshPhysicalMaterial
          color={colors.segmentMid}
          metalness={0.9}
          roughness={0.25}
          clearcoat={0.5}
        />
      </mesh>
      <mesh position={[0.07, 0.2, 0]} castShadow>
        <boxGeometry args={[0.04, 0.22, 0.12]} />
        <meshPhysicalMaterial
          color={colors.segmentDark}
          metalness={0.85}
          roughness={0.28}
          clearcoat={0.4}
        />
      </mesh>
      <mesh position={[-0.07, 0.2, 0]} castShadow>
        <boxGeometry args={[0.04, 0.22, 0.12]} />
        <meshPhysicalMaterial
          color={colors.segmentDark}
          metalness={0.85}
          roughness={0.28}
          clearcoat={0.4}
        />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial
          color={colors.accent}
          emissive={colors.accent}
          emissiveIntensity={3.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function clampMag(v: number, max: number) {
  return Math.max(-max, Math.min(max, v));
}

function Arm({
  targetWorld,
  colors,
}: {
  targetWorld: React.MutableRefObject<Vector3>;
  colors: ArmColors;
}) {
  const root = useRef<Group>(null);
  const j1 = useRef<Group>(null);
  const j2 = useRef<Group>(null);
  const j3 = useRef<Group>(null);
  const j4 = useRef<Group>(null);

  const SHOULDER_Y = 0.32;

  useFrame((_, delta) => {
    if (!root.current) return;
    const dt = Math.min(delta, 0.05);

    const localTarget = root.current.worldToLocal(targetWorld.current.clone());

    const targetYaw =
      root.current.rotation.y + Math.atan2(localTarget.x, localTarget.z);
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      targetYaw,
      4,
      dt
    );

    const horiz = Math.sqrt(localTarget.x ** 2 + localTarget.z ** 2);
    const vy = localTarget.y - SHOULDER_Y;

    const L2 = L_LOWER + TAIL;
    let dist = Math.sqrt(horiz * horiz + vy * vy);
    const reachMax = L_UPPER + L2 - 0.05;
    const reachMin = Math.abs(L_UPPER - L2) + 0.05;
    dist = THREE.MathUtils.clamp(dist, reachMin, reachMax);

    const a = Math.atan2(horiz, Math.max(vy, -dist));
    const cosB =
      (L_UPPER * L_UPPER + dist * dist - L2 * L2) / (2 * L_UPPER * dist);
    const b = Math.acos(THREE.MathUtils.clamp(cosB, -1, 1));
    const targetShoulderX = clampMag(a - b, Math.PI * 0.55);

    const cosE =
      (L_UPPER * L_UPPER + L2 * L2 - dist * dist) / (2 * L_UPPER * L2);
    const targetElbow = Math.PI - Math.acos(THREE.MathUtils.clamp(cosE, -1, 1));

    if (j1.current) {
      j1.current.rotation.x = THREE.MathUtils.damp(
        j1.current.rotation.x,
        targetShoulderX,
        4,
        dt
      );
    }
    if (j2.current) {
      j2.current.rotation.x = THREE.MathUtils.damp(
        j2.current.rotation.x,
        targetElbow,
        4,
        dt
      );
    }
    if (j3.current) {
      j3.current.rotation.x = THREE.MathUtils.damp(
        j3.current.rotation.x,
        0,
        4,
        dt
      );
    }
    if (j4.current) {
      const t = performance.now() * 0.0008;
      const targetTwist = Math.sin(t) * 0.18;
      j4.current.rotation.z = THREE.MathUtils.damp(
        j4.current.rotation.z,
        targetTwist,
        3,
        dt
      );
    }
  });

  return (
    <group ref={root} position={[0, -0.95, 0]} scale={0.78}>
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.1, 48]} />
        <meshPhysicalMaterial
          color={colors.segmentDark}
          metalness={0.6}
          roughness={0.5}
          clearcoat={0.3}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.55, 0.011, 16, 64]} />
        <meshStandardMaterial
          color={colors.accent}
          emissive={colors.accent}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.18, 48]} />
        <meshPhysicalMaterial
          color={colors.segmentMid}
          metalness={0.85}
          roughness={0.25}
          clearcoat={0.5}
        />
      </mesh>
      <group position={[0, 0.32, 0]}>
        <NeutralJoint size={0.18} colors={colors} />
        <group ref={j1}>
          <ArmSegment length={L_UPPER} colors={colors} />
          <group position={[0, L_UPPER, 0]}>
            <NeutralJoint size={0.14} colors={colors} />
            <group ref={j2}>
              <ArmSegment length={L_LOWER} colors={colors} />
              <group position={[0, L_LOWER, 0]}>
                <NeutralJoint size={0.12} colors={colors} />
                <group ref={j3}>
                  <ArmSegment length={0.45} radius={0.085} colors={colors} />
                  <group position={[0, 0.45, 0]}>
                    <group ref={j4}>
                      <Gripper colors={colors} />
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

function MouseTarget({
  targetWorld,
}: {
  targetWorld: React.MutableRefObject<Vector3>;
}) {
  const { camera } = useThree();
  const ndc = useRef(new THREE.Vector2(0, 0));
  const desired = useRef(new THREE.Vector3(0.5, 0.6, 1.4));
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const canvas = document.querySelector(
        "section#hero canvas"
      ) as HTMLCanvasElement | null;
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ndc.current.x = THREE.MathUtils.clamp(x, -1.4, 1.4);
      ndc.current.y = THREE.MathUtils.clamp(y, -1.4, 1.4);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    raycaster.setFromCamera(ndc.current, camera);

    // Target plane sits 1.4 units IN FRONT of the arm root (toward the camera),
    // so the gripper reaches OUT of the screen toward the viewer instead of
    // away into the depth. Plane normal points into the scene; closest point
    // to origin is at -constant * normal = 1.4 units toward camera.
    const planeNormal = camera.getWorldDirection(new THREE.Vector3());
    const plane = new THREE.Plane(planeNormal, 1.4);
    const hit = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(plane, hit)) {
      hit.copy(camera.position).add(
        raycaster.ray.direction.clone().multiplyScalar(4.5)
      );
    }
    desired.current.copy(hit);

    targetWorld.current.lerp(desired.current, 1 - Math.pow(0.001, dt));
  });

  return null;
}

function OrbitingAccent({ color }: { color: string }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.x = Math.cos(t * 0.4) * 2.6;
      ref.current.position.z = Math.sin(t * 0.4) * 2.6;
      ref.current.position.y = 0.8 + Math.sin(t * 0.6) * 0.4;
    }
  });
  return <pointLight ref={ref} color={color} intensity={3} distance={6} />;
}

function Scene({
  targetWorld,
  colors,
}: {
  targetWorld: React.MutableRefObject<Vector3>;
  colors: ArmColors;
}) {
  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight
        castShadow
        position={[3, 6, 4]}
        intensity={1.15}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 2, -3]} intensity={1.2} color={colors.rimLight} />
      <OrbitingAccent color={colors.accent} />

      <Float
        speed={0.7}
        rotationIntensity={0.05}
        floatIntensity={0.08}
        floatingRange={[-0.03, 0.03]}
      >
        <Arm targetWorld={targetWorld} colors={colors} />
      </Float>

      <MouseTarget targetWorld={targetWorld} />

      <Grid
        position={[0, -1.7, 0]}
        args={[14, 14]}
        cellSize={0.4}
        cellThickness={0.5}
        cellColor={colors.cellColor}
        sectionSize={2}
        sectionThickness={1}
        sectionColor={colors.accent}
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
        count={28}
        size={2}
        scale={5}
        speed={0.25}
        color={colors.accent}
        opacity={0.5}
      />

      <Environment preset="city" />
    </>
  );
}

export function RobotCanvas() {
  const targetWorld = useRef<Vector3>(new THREE.Vector3(0.5, 0.6, 1.4));
  const colors = useArmColors();

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [3.2, 2.0, 4.6], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Scene targetWorld={targetWorld} colors={colors} />
      <EffectComposer>
        <Bloom
          mipmapBlur
          intensity={0.7}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.3}
          radius={0.7}
        />
      </EffectComposer>
    </Canvas>
  );
}
