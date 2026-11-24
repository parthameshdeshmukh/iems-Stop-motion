import React from 'react';
import { Environment } from '@react-three/drei';

export default function StudioEnvironment({ intensity = 1.0 }) {
  return (
    <>
      {/* Deep dark cinematic background lighting rig */}
      <ambientLight intensity={0.4 * intensity} />

      {/* Key Light: Crisp metallic reflection from upper left without heavy depth pass */}
      <directionalLight
        position={[-5, 8, 6]}
        intensity={3.0 * intensity}
        color="#ffffff"
      />

      {/* Fill Light: Soft neutral fill */}
      <directionalLight
        position={[6, -2, 4]}
        intensity={1.2 * intensity}
        color="#94a3b8"
      />

      {/* Rim Light 1: Electric Blue Edge / Specular highlight */}
      <pointLight
        position={[-4, -3, -4]}
        intensity={3.5 * intensity}
        color="#00f0ff"
        distance={12}
      />

      {/* Rim Light 2: Cool Silver Edge from behind */}
      <spotLight
        position={[4, 6, -5]}
        intensity={2.2 * intensity}
        color="#e2e8f0"
        angle={0.6}
        penumbra={1}
      />

      {/* Studio HDRI Environment for realistic metallic and clearcoat reflections */}
      <Environment preset="city" environmentIntensity={0.65 * intensity} />
    </>
  );
}
