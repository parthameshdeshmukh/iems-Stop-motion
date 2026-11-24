import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import IEMModel from './IEMModel';
import StudioEnvironment from './StudioEnvironment';
import Particles from './Particles';

function ReassemblyRig({ progressRef, fallbackProgress = 0.8 }) {
  const groupRef = useRef();
  const invertedProgressRef = useRef(0.2);

  useFrame((state) => {
    if (!groupRef.current) return;
    const progress = progressRef ? progressRef.current : fallbackProgress;
    invertedProgressRef.current = Math.max(0, 1 - progress * 1.2);

    const t = state.clock.getElapsedTime();
    // Reassembly rotation and approach towards camera
    // As progress goes from 0 to 1, IEM reassembles and rotates 360 to present its beauty
    const targetRotY = Math.PI * 2 * (1 - progress) + Math.sin(t * 0.5) * 0.15;
    const targetRotX = 0.2 - progress * 0.15;
    const targetZ = -1.5 + progress * 2.2; // moves towards camera

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1);
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* explodeProgress is inverted: at progress = 1, parts are 0 (completely assembled) */}
      <IEMModel
        progressRef={invertedProgressRef}
        isHero={false}
        colorway="silver"
      />
    </group>
  );
}

export default function ReassemblyCanvas({ progressRef = null, fallbackProgress = 0.8, isInView = true }) {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        frameloop={isInView ? 'always' : 'never'}
        camera={{ position: [0, 0.2, 5.0], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}
        dpr={[1, 1.25]}
      >
        <Suspense fallback={null}>
          <StudioEnvironment intensity={1.3} />
          <Particles count={40} spread={10} />
          <ReassemblyRig progressRef={progressRef} fallbackProgress={fallbackProgress} />
          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.35}
            scale={9}
            blur={2.0}
            far={3.5}
            resolution={256}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
