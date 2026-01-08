'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const FRAME_THICKNESS = 0.06;
const FRAME_DEPTH = 0.08;
const GLASS_THICKNESS = 0.01;

function FrameBars({ width, height, color }: { width: number; height: number; color: string }) {
  const horizontalLength = width;
  const verticalLength = height - FRAME_THICKNESS * 2;

  return (
    <group>
      <mesh position={[0, height / 2 - FRAME_THICKNESS / 2, 0]}>
        <boxGeometry args={[horizontalLength, FRAME_THICKNESS, FRAME_DEPTH]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, -height / 2 + FRAME_THICKNESS / 2, 0]}>
        <boxGeometry args={[horizontalLength, FRAME_THICKNESS, FRAME_DEPTH]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-width / 2 + FRAME_THICKNESS / 2, 0, 0]}>
        <boxGeometry args={[FRAME_THICKNESS, verticalLength, FRAME_DEPTH]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[width / 2 - FRAME_THICKNESS / 2, 0, 0]}>
        <boxGeometry args={[FRAME_THICKNESS, verticalLength, FRAME_DEPTH]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Glass({ width, height }: { width: number; height: number }) {
  const glassWidth = width - FRAME_THICKNESS * 2;
  const glassHeight = height - FRAME_THICKNESS * 2;

  return (
    <mesh position={[0, 0, FRAME_DEPTH / 2 - GLASS_THICKNESS / 2]}>
      <boxGeometry args={[glassWidth, glassHeight, GLASS_THICKNESS]} />
      <meshPhysicalMaterial
        color="#cde7f5"
        roughness={0.1}
        transmission={0.9}
        thickness={0.02}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function WindowModel({ width, height, frameColor }: { width: number; height: number; frameColor: string }) {
  return (
    <group>
      <FrameBars width={width} height={height} color={frameColor} />
      <Glass width={width} height={height} />
    </group>
  );
}

export default function Opening3D({
  widthMm,
  heightMm,
  frameColor,
}: {
  widthMm: number;
  heightMm: number;
  frameColor: string;
}) {
  const width = Math.max(widthMm / 1000, 0.3);
  const height = Math.max(heightMm / 1000, 0.3);
  const cameraDistance = Math.max(width, height) * 1.8;

  return (
    <Canvas
      style={{ height: 360, background: '#f4f4f4', borderRadius: '10px' }}
      camera={{ position: [0, 0, cameraDistance], fov: 45 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={0.8} />
      <WindowModel width={width} height={height} frameColor={frameColor} />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
