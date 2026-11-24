import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import IEMModel from './IEMModel';

// High-Key Studio Lighting Rig tailored for warm cream / off-white background
function HeroStudioLighting() {
  return (
    <>
      {/* High-CRI diffuse ambient fill light */}
      <ambientLight intensity={1.1} color="#FFFDF7" />

      {/* Main Studio Key Softbox: Upper-left crisp illumination without heavy depth pass */}
      <directionalLight
        position={[-4.5, 6.5, 4.5]}
        intensity={2.6}
        color="#ffffff"
      />

      {/* Warm Fill Light: Soft warm bounce from bottom-right */}
      <directionalLight
        position={[5, -2.5, 3.5]}
        intensity={1.3}
        color="#FDF4E7"
      />

      {/* Specular Rim Light: Accentuates the Grade 5 titanium faceplate bevel */}
      <spotLight
        position={[3, 5.5, -4]}
        intensity={2.2}
        color="#F8FAFC"
        angle={0.65}
        penumbra={1}
      />

      {/* Clarity Fill Light: Brings out internal driver details through translucent resin */}
      <pointLight
        position={[-3, -1.5, -2.5]}
        intensity={1.4}
        color="#E0F2FE"
        distance={9}
      />

      {/* Studio Reflection Environment */}
      <Environment preset="city" environmentIntensity={0.75} />
    </>
  );
}

function HeroModelRig({ activeAngle = 'default', isMobile = false }) {
  const rigRef = useRef();

  const angles = {
    default: [0.18, 0.45, -0.04],
    faceplate: [0.02, 0.05, 0.0],
    nozzle: [0.35, -1.25, 0.15],
    shell: [-0.1, 2.3, 0.1],
  };

  useFrame((state, delta) => {
    if (!rigRef.current) return;
    const target = angles[activeAngle] || angles.default;
    rigRef.current.rotation.x = THREE.MathUtils.damp(rigRef.current.rotation.x, target[0], 6, delta);
    rigRef.current.rotation.y = THREE.MathUtils.damp(rigRef.current.rotation.y, target[1], 6, delta);
    rigRef.current.rotation.z = THREE.MathUtils.damp(rigRef.current.rotation.z, target[2], 6, delta);

    // Subtle natural breathing float
    if (activeAngle === 'default') {
      const t = state.clock.getElapsedTime();
      rigRef.current.position.y = (isMobile ? -0.12 : 0) + Math.sin(t * 0.9) * 0.06;
      rigRef.current.rotation.y += Math.sin(t * 0.4) * 0.0025;
    }
  });

  const posX = isMobile ? 0 : 0.65;
  const scale = isMobile ? 1.08 : 1.35;

  return (
    <Float
      speed={1.8}
      rotationIntensity={activeAngle === 'default' ? 0.35 : 0.1}
      floatIntensity={0.4}
      floatingRange={[-0.08, 0.08]}
    >
      <group ref={rigRef} position={[posX, -0.05, 0]} scale={scale}>
        <IEMModel isHero={true} explodeProgress={0} colorway="silver" />
      </group>
    </Float>
  );
}

export default function HeroCanvas({ isInView = true, activeAngle = 'default' }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none" data-cursor="3D ORBIT">
      <Canvas
        frameloop={isInView ? 'always' : 'never'}
        camera={{ position: [0, 0.2, 5.2], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}
        dpr={[1, 1.25]}
      >
        <Suspense fallback={null}>
          <HeroStudioLighting />
          <HeroModelRig activeAngle={activeAngle} isMobile={isMobile} />

          {/* Warm Studio Contact Shadow anchoring IEM to the cream floor */}
          <ContactShadows
            position={[isMobile ? 0 : 0.65, -2.15, 0]}
            opacity={0.28}
            scale={7.5}
            blur={2.0}
            far={3.5}
            resolution={256}
            color="#2A221A"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
