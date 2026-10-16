"use client";

import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Group, Mesh } from "three";
import { cssVarToHex } from "@/utils/css-color";

// Three floating panels, one per problem type (coding, MCQ, written), built
// from simple shapes coloured with the site's theme tokens.

interface Palette {
  card: string;
  muted: string;
  border: string;
  primary: string;
  brand2: string;
  brand3: string;
}

function readPalette(): Palette {
  return {
    card: cssVarToHex("--card", "#ffffff"),
    muted: cssVarToHex("--muted", "#eef0f4"),
    border: cssVarToHex("--border", "#e2e5ec"),
    primary: cssVarToHex("--primary", "#4f46e5"),
    brand2: cssVarToHex("--brand-2", "#0f766e"),
    brand3: cssVarToHex("--brand-3", "#f5b53d"),
  };
}

const DEPTH = 0.02;

function Bar({
  x,
  y,
  width,
  color,
  height = 0.07,
}: {
  x: number;
  y: number;
  width: number;
  color: string;
  height?: number;
}) {
  // Bars are positioned by their left edge, like lines of text
  return (
    <RoundedBox
      args={[width, height, DEPTH]}
      radius={height / 2.2}
      smoothness={4}
      position={[x + width / 2, y, 0.06]}
    >
      <meshStandardMaterial color={color} roughness={0.5} />
    </RoundedBox>
  );
}

function Dot({
  x,
  y,
  r,
  color,
  ring = false,
}: {
  x: number;
  y: number;
  r: number;
  color: string;
  ring?: boolean;
}) {
  return (
    <mesh position={[x, y, 0.07]}>
      {ring ? (
        <torusGeometry args={[r, r * 0.22, 12, 32]} />
      ) : (
        <circleGeometry args={[r, 32]} />
      )}
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  );
}

function Panel({
  width,
  height,
  palette,
  children,
}: {
  width: number;
  height: number;
  palette: Palette;
  children: ReactNode;
}) {
  return (
    <group>
      <RoundedBox args={[width, height, 0.1]} radius={0.1} smoothness={6}>
        <meshPhysicalMaterial
          color={palette.card}
          // Lift the panel toward its true token colour so white cards don't read as grey
          emissive={palette.card}
          emissiveIntensity={0.35}
          roughness={0.35}
          clearcoat={0.8}
          clearcoatRoughness={0.25}
        />
      </RoundedBox>
      {children}
    </group>
  );
}

function CodePanel({ palette }: { palette: Palette }) {
  const w = 2.4;
  const h = 1.6;
  const left = -w / 2 + 0.2;
  const top = h / 2 - 0.18;
  const lines = [
    { indent: 0, width: 0.9, color: palette.primary },
    { indent: 0.18, width: 1.1, color: palette.border },
    { indent: 0.18, width: 0.7, color: palette.brand2 },
    { indent: 0.36, width: 0.9, color: palette.border },
    { indent: 0.18, width: 0.55, color: palette.border },
    { indent: 0, width: 0.3, color: palette.primary },
  ];

  return (
    <Panel width={w} height={h} palette={palette}>
      {[palette.brand3, palette.brand2, palette.primary].map((c, i) => (
        <Dot key={c} x={left + i * 0.13} y={top} r={0.035} color={c} />
      ))}
      {lines.map((line, i) => (
        <Bar
          key={`${line.indent}-${line.width}-${i}`}
          x={left + line.indent}
          y={top - 0.22 - i * 0.17}
          width={line.width}
          color={line.color}
        />
      ))}
      {/* Passing test cases */}
      {[0, 1, 2].map((i) => (
        <group key={i} position={[w / 2 - 0.55, top - 0.3 - i * 0.26, 0]}>
          <Bar
            x={-0.2}
            y={0}
            width={0.62}
            height={0.16}
            color={palette.muted}
          />
          <Dot x={-0.1} y={0} r={0.045} color={palette.brand2} />
          <Bar x={0.0} y={0} width={0.3} height={0.05} color={palette.brand2} />
        </group>
      ))}
    </Panel>
  );
}

function McqPanel({ palette }: { palette: Palette }) {
  const w = 1.8;
  const h = 1.45;
  const left = -w / 2 + 0.2;
  const top = h / 2 - 0.22;

  return (
    <Panel width={w} height={h} palette={palette}>
      <Bar x={left} y={top} width={1.2} color={palette.primary} height={0.09} />
      {[0, 1, 2, 3].map((i) => {
        const selected = i === 1;
        const y = top - 0.3 - i * 0.24;
        return (
          <group key={i}>
            {selected && (
              <Bar
                x={left - 0.08}
                y={y}
                width={w - 0.24}
                height={0.2}
                color={palette.muted}
              />
            )}
            <Dot
              x={left + 0.06}
              y={y}
              r={0.055}
              color={selected ? palette.primary : palette.border}
              ring={!selected}
            />
            <Bar
              x={left + 0.2}
              y={y}
              width={[0.9, 0.7, 1.05, 0.6][i]}
              color={selected ? palette.primary : palette.border}
            />
          </group>
        );
      })}
    </Panel>
  );
}

function WrittenPanel({ palette }: { palette: Palette }) {
  const w = 1.9;
  const h = 1.3;
  const left = -w / 2 + 0.2;
  const top = h / 2 - 0.22;
  const caret = useRef<Mesh>(null);

  // Blinking caret at the end of the answer
  useFrame(({ clock }) => {
    if (caret.current) caret.current.visible = clock.elapsedTime % 1 < 0.55;
  });

  const widths = [1.45, 1.35, 1.5, 1.2, 0.7];

  return (
    <Panel width={w} height={h} palette={palette}>
      <Bar x={left} y={top} width={0.8} color={palette.brand2} height={0.09} />
      {widths.map((width, i) => (
        <Bar
          key={`${width}-${i}`}
          x={left}
          y={top - 0.26 - i * 0.15}
          width={width}
          color={palette.border}
        />
      ))}
      <mesh ref={caret} position={[left + 0.78, top - 0.26 - 4 * 0.15, 0.07]}>
        <planeGeometry args={[0.025, 0.13]} />
        <meshBasicMaterial color={palette.brand3} />
      </mesh>
    </Panel>
  );
}

// Tilts the whole arrangement toward the pointer and sways it gently
function Rig({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const targetY = pointer.current.x * 0.28 + Math.sin(t * 0.25) * 0.08;
    const targetX = pointer.current.y * 0.14;
    const k = 1 - Math.exp(-delta * 3);
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
  });

  return <group ref={group}>{children}</group>;
}

export default function HeroScene({
  active,
  onReady,
}: {
  active: boolean;
  onReady: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const [palette, setPalette] = useState<Palette | null>(null);

  // Re-read the tokens after the theme class has been applied
  useEffect(() => {
    const id = requestAnimationFrame(() => setPalette(readPalette()));
    return () => cancelAnimationFrame(id);
  }, [resolvedTheme]);

  useEffect(() => {
    if (palette) onReady();
  }, [palette, onReady]);

  if (!palette) return null;

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7.4], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[2, 4, 6]} intensity={2} />
      <pointLight
        position={[-3, 1.5, 2]}
        intensity={14}
        color={palette.primary}
      />
      <pointLight position={[3, -1, 2]} intensity={10} color={palette.brand2} />

      <Rig>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
          <group position={[0, 0.05, 0.3]}>
            <CodePanel palette={palette} />
          </group>
        </Float>
        <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.7}>
          <group position={[-1.7, -0.75, -0.7]} rotation={[0, 0.3, 0]}>
            <McqPanel palette={palette} />
          </group>
        </Float>
        <Float speed={1.25} rotationIntensity={0.3} floatIntensity={0.6}>
          <group position={[1.7, 0.8, -0.7]} rotation={[0, -0.3, 0]}>
            <WrittenPanel palette={palette} />
          </group>
        </Float>
      </Rig>

      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.35}
        scale={9}
        blur={2.6}
        far={3}
        color={palette.primary}
      />
    </Canvas>
  );
}
