import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import IEMModel from './IEMModel';
import StudioEnvironment from './StudioEnvironment';
import Particles from './Particles';

function CameraRig({ progressRef, fallbackProgress = 0 }) {
  const targetPos = useRef(new THREE.Vector3(0, 0, 5.2));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const progress = progressRef ? progressRef.current : fallbackProgress;
    let camZ = 5.2 - progress * 1.5;
    let camX = 0;
    let camY = 0;

    if (progress < 0.25) {
      camZ = 5.2 - progress * 4.0; // Zoom in
      camX = progress * 1.5;
      camY = progress * 0.5;
    } else if (progress < 0.65) {
      camZ = 4.2 + (progress - 0.25) * 3.0; // Pan out as parts spread
      camX = 1.0 + (progress - 0.25) * 1.2;
      camY = 0.3 - (progress - 0.25) * 0.4;
    } else {
      camZ = 5.4 + (progress - 0.65) * 2.2; // Wide exploded framing
      camX = 1.48 - (progress - 0.65) * 0.8;
      camY = 0.16 + (progress - 0.65) * 0.4;
    }

    targetPos.current.set(camX, camY, camZ);
    state.camera.position.lerp(targetPos.current, 0.12);
    state.camera.lookAt(targetLook.current);
  });

  return null;
}

export default function DeconstructionCanvas({
  progressRef = null,
  explodeProgress = 0,
  activeComponent = null,
  onHoverComponent = null,
  isInView = true,
  isWireframe = false,
}) {
  return (
    <div className="w-full h-full absolute inset-0" data-cursor="DISMANTLE">
      <Canvas
        frameloop={isInView ? 'always' : 'never'}
        camera={{ position: [0, 0, 5.2], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}
        dpr={[1, 1.25]}
      >
        <Suspense fallback={null}>
          <CameraRig progressRef={progressRef} fallbackProgress={explodeProgress} />
          <StudioEnvironment intensity={1.2} />
          <Particles count={50} spread={14} />

          <group position={[0, 0, 0]} rotation={[0.15, -0.4, 0]}>
            <IEMModel
              progressRef={progressRef}
              explodeProgress={explodeProgress}
              isHero={false}
              activeComponent={activeComponent}
              onHoverComponent={onHoverComponent}
              isWireframe={isWireframe}
            />
          </group>

          <ContactShadows
            position={[0, -2.8, 0]}
            opacity={0.35}
            scale={11}
            blur={2.0}
            far={4.5}
            resolution={256}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
