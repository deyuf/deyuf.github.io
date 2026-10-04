"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, RoundedBox, useGLTF } from "@react-three/drei";
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";

const MODEL = "/models/ur5/ur5.glb";
const PI = Math.PI;

// UR5's six revolute axes, in the manufacturer's ROS coordinate system.
// The visual transforms and offsets match the original CAD/URDF definitions.
const JOINTS = [
  { name: "shoulder", xyz: [0, 0, 0.089159], rpy: [0, 0, 0], pose: 0.25 },
  { name: "upperarm", xyz: [0, 0, 0], rpy: [PI / 2, 0, 0], pose: -1.95 },
  { name: "forearm", xyz: [-0.425, 0, 0], rpy: [0, 0, 0], pose: 2.3 },
  { name: "wrist1", xyz: [-0.39225, 0, 0.10915], rpy: [0, 0, 0], pose: -0.95 },
  { name: "wrist2", xyz: [0, -0.09465, 0], rpy: [PI / 2, 0, 0], pose: -1.1 },
  { name: "wrist3", xyz: [0, 0.0823, 0], rpy: [PI / 2, PI, PI], pose: 0.35 },
] as const;

const VISUALS: Record<string, { xyz: [number, number, number]; rpy: [number, number, number] }> = {
  base: { xyz: [0, 0, 0], rpy: [0, 0, PI] },
  shoulder: { xyz: [0, 0, 0], rpy: [0, 0, PI] },
  upperarm: { xyz: [0, 0, 0.13585], rpy: [PI / 2, 0, -PI / 2] },
  forearm: { xyz: [0, 0, 0.0165], rpy: [PI / 2, 0, -PI / 2] },
  wrist1: { xyz: [0, 0, -0.093], rpy: [PI / 2, 0, 0] },
  wrist2: { xyz: [0, 0, -0.095], rpy: [0, 0, 0] },
  wrist3: { xyz: [0, 0, -0.0818], rpy: [PI / 2, 0, 0] },
};

function rotation(rpy: readonly number[]) {
  return new THREE.Euler(rpy[0], rpy[1], rpy[2], "ZYX");
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useLightTheme() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const update = () => setLight(document.documentElement.dataset.theme === "light");
    update();
    window.addEventListener("themechange", update);
    return () => window.removeEventListener("themechange", update);
  }, []);
  return light;
}

function Tool() {
  return (
    <group>
      <mesh position={[0, 0, 0.018]} rotation={[PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.032, 0.035, 48]} />
        <meshStandardMaterial color="#8e979c" metalness={1} roughness={0.28} />
      </mesh>
      <RoundedBox args={[0.095, 0.06, 0.055]} radius={0.005} smoothness={2}
        position={[0, 0, 0.055]} castShadow>
        <meshStandardMaterial color="#343d44" metalness={0.9} roughness={0.32} />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.035, 0, 0.105]} castShadow>
            <boxGeometry args={[0.013, 0.038, 0.07]} />
            <meshStandardMaterial color="#a5acb0" metalness={1} roughness={0.3} />
          </mesh>
          <mesh position={[side * 0.027, 0, 0.143]} castShadow>
            <boxGeometry args={[0.025, 0.038, 0.013]} />
            <meshStandardMaterial color="#161c20" roughness={0.72} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Robot({ reduced, light, onReady }: { reduced: boolean; light: boolean; onReady: () => void }) {
  // The indexed GLB uses no compression extensions, so no WASM decoders
  // or third-party decoder downloads are needed under the site’s CSP.
  const { scene } = useGLTF(MODEL, false, false);
  const { gl } = useThree();
  useEffect(() => {
    const frame = requestAnimationFrame(onReady);
    return () => cancelAnimationFrame(frame);
  }, [onReady]);
  const axisRefs = useRef<(THREE.Group | null)[]>([]);
  const pointer = useRef(new THREE.Vector2());
  const hovered = useRef(false);
  const smoothPointer = useRef(new THREE.Vector2());
  const neutralPointer = useMemo(() => new THREE.Vector2(), []);
  const brushedSurface = useMemo(() => {
    const size = 128;
    const bytes = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      const seed = Math.sin(y * 12.9898) * 43758.5453;
      const grain = seed - Math.floor(seed);
      for (let x = 0; x < size; x++) {
        const offset = (y * size + x) * 4;
        const value = 190 + Math.round(grain * 45 + Math.sin(x * 0.4) * 3);
        bytes[offset] = bytes[offset + 1] = bytes[offset + 2] = value;
        bytes[offset + 3] = 255;
      }
    }
    const texture = new THREE.DataTexture(bytes, size, size);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, []);
  useEffect(() => () => brushedSurface.dispose(), [brushedSurface]);

  // Share geometry from the GLB cache, but own and dispose the presentation
  // materials. CAD seams, mounting holes and vertex normals remain intact.
  const { links, materials } = useMemo(() => {
    const materials = new Map<string, THREE.MeshPhysicalMaterial>();
    const links: Record<string, THREE.Object3D> = {};
    for (const name of ["base", ...JOINTS.map((joint) => joint.name)]) {
      const source = scene.getObjectByName(name);
      if (!source) throw new Error(`Missing UR5 CAD link: ${name}`);
      const link = source.clone(true);
      link.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const original = object.material as THREE.Material;
        const materialName = original.name;
        if (!materials.has(materialName)) {
          const aluminum = materialName === "satinAluminum";
          const graphite = materialName === "anodizedGraphite";
          materials.set(materialName, new THREE.MeshPhysicalMaterial({
            name: materialName,
            color: aluminum ? "#a4acb3" : graphite ? "#454e57" : materialName === "machinedSteel" ? "#849099" : "#171d23",
            metalness: 1,
            roughness: aluminum ? 0.44 : graphite ? 0.48 : 0.36,
            roughnessMap: aluminum ? brushedSurface : null,
            anisotropy: 0,
            clearcoat: 0,
            envMapIntensity: light ? 1 : 1.2,
          }));
        }
        object.material = materials.get(materialName)!;
        object.castShadow = true;
        object.receiveShadow = true;
      });
      links[name] = link;
    }
    return { links, materials };
  }, [scene, light, brushedSurface]);

  useEffect(() => () => materials.forEach((material) => material.dispose()), [materials]);

  useEffect(() => {
    const canvas = gl.domElement;
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.current.set(
        THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1),
        THREE.MathUtils.clamp(1 - (event.clientY - rect.top) / rect.height * 2, -1, 1)
      );
      hovered.current = true;
    };
    const leave = () => { hovered.current = false; };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    return () => {
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [gl]);

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    smoothPointer.current.lerp(hovered.current ? pointer.current : neutralPointer, 1 - Math.exp(-3 * dt));
    const { x, y } = smoothPointer.current;
    const offsets = [x * 0.22, y * 0.12, -y * 0.16, y * 0.1, x * 0.18, x * 0.2];
    axisRefs.current.forEach((axis, index) => {
      if (!axis) return;
      const idle = Math.sin(t * 0.22 + index * 0.7) * (index < 3 ? 0.022 : 0.04);
      axis.rotation.z = THREE.MathUtils.damp(axis.rotation.z, JOINTS[index].pose + offsets[index] + idle, 3.5, dt);
    });
  });

  const visual = (name: string) => (
    <group position={VISUALS[name].xyz} rotation={rotation(VISUALS[name].rpy)}>
      <primitive object={links[name]} dispose={null} />
    </group>
  );

  const chain = (index: number): ReactNode => {
    if (index === JOINTS.length) return <Tool />;
    const joint = JOINTS[index];
    return (
      <group name={`axis-${index + 1}-origin`} position={[...joint.xyz]} rotation={rotation(joint.rpy)}>
        <group name={`axis-${index + 1}`} ref={(axis) => { axisRefs.current[index] = axis; }} rotation={[0, 0, joint.pose]}>
          {visual(joint.name)}
          {chain(index + 1)}
        </group>
      </group>
    );
  };

  return (
    <group position={[0.4, -1.9, 0]} scale={6} rotation={[-PI / 2, 0, 0]}>
      <group rotation={[0, 0, PI]}>
        {visual("base")}
        {chain(0)}
      </group>
    </group>
  );
}

function Scene({ reduced, light, onReady }: { reduced: boolean; light: boolean; onReady: () => void }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[1, 5, 5]} intensity={2.2} color="#eef3f8" />
      <directionalLight position={[-4, 2, -3]} intensity={3} color="#cddbeb" />
      <Suspense fallback={null}>
        <Robot reduced={reduced} light={light} onReady={onReady} />
        <ContactShadows key={String(light)} position={[0, -1.91, 0]} scale={12} opacity={light ? 0.32 : 0.55} blur={2.5} far={6} frames={1} />
      </Suspense>
      <Environment resolution={256}>
        <color attach="background" args={["#606a76"]} />
        <Lightformer form="rect" intensity={3.5} color="#ffffff" scale={[1.3, 6, 1]}
          position={[3, 3, 4]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.5} color="#dce9f5" scale={[3, 5, 1]}
          position={[-4, 2, 2]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={4} color="#ffffff" scale={[5, 1, 1]}
          position={[0, 4, -3]} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function RobotCanvas() {
  const reduced = useReducedMotion();
  const light = useLightTheme();
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const paused = reduced || !visible;
  const onReady = useCallback(() => setLoaded(true), []);
  const onError = useCallback(() => setLoaded(false), []);
  return (
    <div ref={host} className="relative h-full w-full" role="img" aria-label="Interactive industrial robot with six independently articulated joints" data-renderer={loaded ? "webgl" : "poster"}>
      {/* The actual CAD render also serves slow networks and devices without WebGL. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/models/ur5/poster.png" alt="" aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        style={{ opacity: loaded ? 0 : 1 }} />
      <SceneBoundary onError={onError}>
        <Canvas frameloop={paused ? "demand" : "always"} dpr={[1, 1.75]}
          camera={{ position: [5.5, 2.6, 7.5], fov: 30 }}
          onCreated={({ camera }) => camera.lookAt(0.55, 0.05, 0)}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent", opacity: loaded ? 1 : 0 }}
          fallback={<span />}
          aria-hidden="true"
        >
          <Scene reduced={paused} light={light} onReady={onReady} />
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
