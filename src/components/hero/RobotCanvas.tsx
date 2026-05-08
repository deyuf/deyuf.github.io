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
import { useRef, useEffect, useMemo } from "react";
import type { Group, Vector3 } from "three";
import * as THREE from "three";

const ACCENT = "#00e0b8";

const L_UPPER = 0.85; // shoulder → elbow
const L_LOWER = 0.7; // elbow → wrist1
const TAIL = 0.45 + 0.34; // wrist1 → tip (forearm + gripper offset)

function ArmSegment({
  length,
  radius = 0.12,
}: {
  length: number;
  radius?: number;
}) {
  return (
    <mesh position={[0, length / 2, 0]} castShadow>
      <cylinderGeometry args={[radius * 0.85, radius, length, 32]} />
      <meshPhysicalMaterial
        color="#1a1a1f"
        metalness={0.85}
        roughness={0.32}
        clearcoat={0.55}
        clearcoatRoughness={0.25}
      />
    </mesh>
  );
}

function NeutralJoint({ size = 0.16 }: { size?: number }) {
  return (
    <mesh castShadow>
      <sphereGeometry args={[size, 32, 32]} />
      <meshPhysicalMaterial
        color="#23232a"
        metalness={0.9}
        roughness={0.22}
        clearcoat={0.5}
      />
    </mesh>
  );
}

function Gripper() {
  return (
    <group>
      <NeutralJoint size={0.15} />
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
      {/* Fingers */}
      <mesh position={[0.07, 0.2, 0]} castShadow>
        <boxGeometry args={[0.04, 0.22, 0.12]} />
        <meshPhysicalMaterial
          color="#15151a"
          metalness={0.85}
          roughness={0.28}
          clearcoat={0.4}
        />
      </mesh>
      <mesh position={[-0.07, 0.2, 0]} castShadow>
        <boxGeometry args={[0.04, 0.22, 0.12]} />
        <meshPhysicalMaterial
          color="#15151a"
          metalness={0.85}
          roughness={0.28}
          clearcoat={0.4}
        />
      </mesh>
      {/* Single emissive tip — the only glowing point on the arm itself */}
      <mesh position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
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

function Arm({ targetWorld }: { targetWorld: React.MutableRefObject<Vector3> }) {
  const root = useRef<Group>(null);
  const j1 = useRef<Group>(null);
  const j2 = useRef<Group>(null);
  const j3 = useRef<Group>(null);
  const j4 = useRef<Group>(null);

  // Shoulder origin in arm-root local space (after scale 0.78 → world)
  // Arm-root sits at (0, -0.95, 0) world before scale; inside the group, shoulder is at y=0.32
  // We compute IK in arm-root local space directly.
  const SHOULDER_Y = 0.32;

  useFrame((_, delta) => {
    if (!root.current) return;
    const dt = Math.min(delta, 0.05);

    // Convert world target into arm-root local space (root is in world)
    const localTarget = root.current.worldToLocal(targetWorld.current.clone());

    // Base yaw — face target horizontally (XZ plane)
    const targetYaw =
      root.current.rotation.y + Math.atan2(localTarget.x, localTarget.z);
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      targetYaw,
      4,
      dt
    );

    // After (eventual) yaw, target sits in the YZ plane of arm-root
    const horiz = Math.sqrt(localTarget.x ** 2 + localTarget.z ** 2);
    const vy = localTarget.y - SHOULDER_Y;

    // 2-bone IK on shoulder (L_UPPER) + virtual lower (L_LOWER + TAIL)
    const L2 = L_LOWER + TAIL;
    let dist = Math.sqrt(horiz * horiz + vy * vy);
    const reachMax = L_UPPER + L2 - 0.05;
    const reachMin = Math.abs(L_UPPER - L2) + 0.05;
    dist = THREE.MathUtils.clamp(dist, reachMin, reachMax);

    // Angle from +Y to target direction (tilt forward)
    const a = Math.atan2(horiz, Math.max(vy, -dist));
    const cosB = (L_UPPER * L_UPPER + dist * dist - L2 * L2) / (2 * L_UPPER * dist);
    const b = Math.acos(THREE.MathUtils.clamp(cosB, -1, 1));
    const targetShoulderX = clampMag(a - b, Math.PI * 0.55);

    const cosE = (L_UPPER * L_UPPER + L2 * L2 - dist * dist) / (2 * L_UPPER * L2);
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
    // Wrist 1 — relax to neutral so the chain reads cleanly
    if (j3.current) {
      j3.current.rotation.x = THREE.MathUtils.damp(
        j3.current.rotation.x,
        0,
        4,
        dt
      );
    }
    // Wrist 2 (twist) — keep a small idle so the gripper isn't dead
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
      {/* Single accent ring on base — the only base-level glow */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.55, 0.011, 16, 64]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={1.2}
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
        <NeutralJoint size={0.18} />
        <group ref={j1}>
          <ArmSegment length={L_UPPER} />
          {/* Elbow */}
          <group position={[0, L_UPPER, 0]}>
            <NeutralJoint size={0.14} />
            <group ref={j2}>
              <ArmSegment length={L_LOWER} />
              {/* Wrist 1 */}
              <group position={[0, L_LOWER, 0]}>
                <NeutralJoint size={0.12} />
                <group ref={j3}>
                  <ArmSegment length={0.45} radius={0.085} />
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

function MouseTarget({
  targetWorld,
}: {
  targetWorld: React.MutableRefObject<Vector3>;
}) {
  const { camera, size } = useThree();
  const ndc = useRef(new THREE.Vector2(0, 0));
  const desired = useRef(new THREE.Vector3(0, 0.6, 1.5));
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  // Track mouse globally so the arm follows even when cursor leaves the canvas.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Convert client coordinates to NDC, but use the canvas bounding rect
      // so motion stays correctly aligned regardless of canvas position.
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

    // Project the ray onto a plane in front of the arm. Plane normal faces the
    // camera, anchored 0.6 units in front of the arm root. Falling back to a
    // sphere of fixed distance keeps the target stable when the ray is parallel.
    const planeNormal = camera.getWorldDirection(new THREE.Vector3()).negate();
    const plane = new THREE.Plane(planeNormal, 1.4);
    const hit = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(plane, hit)) {
      hit.copy(camera.position).add(
        raycaster.ray.direction.clone().multiplyScalar(4.5)
      );
    }
    desired.current.copy(hit);

    targetWorld.current.lerp(desired.current, 1 - Math.pow(0.001, dt));
    void size;
  });

  return null;
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
  return <pointLight ref={ref} color={ACCENT} intensity={3} distance={6} />;
}

function Scene({
  targetWorld,
}: {
  targetWorld: React.MutableRefObject<Vector3>;
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
      <pointLight position={[-3, 2, -3]} intensity={1.2} color="#5a8cff" />
      <OrbitingAccent />

      <Float
        speed={0.7}
        rotationIntensity={0.05}
        floatIntensity={0.08}
        floatingRange={[-0.03, 0.03]}
      >
        <Arm targetWorld={targetWorld} />
      </Float>

      <MouseTarget targetWorld={targetWorld} />

      <Grid
        position={[0, -1.7, 0]}
        args={[14, 14]}
        cellSize={0.4}
        cellThickness={0.5}
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
        count={28}
        size={2}
        scale={5}
        speed={0.25}
        color={ACCENT}
        opacity={0.5}
      />

      <Environment preset="city" />
    </>
  );
}

export function RobotCanvas() {
  const targetWorld = useRef<Vector3>(new THREE.Vector3(0.5, 0.6, 1.4));

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [3.2, 2.0, 4.6], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Scene targetWorld={targetWorld} />
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
