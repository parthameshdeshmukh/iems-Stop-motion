import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import IEMModel from './IEMModel';
import StudioEnvironment from './StudioEnvironment';
import Particles from './Particles';

export default function InteractiveViewer({ colorway = 'silver', isInView = true }) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        frameloop={isInView ? 'always' : 'never'}
        camera={{ position: [0, 0.4, 4.8], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}
        dpr={[1, 1.25]}
      >
        <Suspense fallback={null}>
          <StudioEnvironment intensity={1.25} />
          <Particles count={40} spread={8} />

          <group position={[0, -0.1, 0]} rotation={[0.2, 0.4, 0]}>
            <IEMModel
              explodeProgress={0}
              isHero={false}
              colorway={colorway}
            />
          </group>

          <ContactShadows
            position={[0, -2.2, 0]}
            opacity={0.35}
            scale={7}
            blur={2.0}
            far={3.5}
            resolution={256}
            color="#000000"
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={1.2}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.7}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
