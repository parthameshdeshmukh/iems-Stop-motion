import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================================================
// GEOMETRY CACHE: Shared across all 4 canvas instances (0 redundant allocations)
// ============================================================================
let cachedFaceplateGeometry = null;
let cachedShellGeometry = null;
let cachedTubeGeometries = null;
let cachedEartipGeometry = null;
let cachedCableTubeGeometry = null;
let cachedCableBraidGeometry = null;
let cachedNozzleGeometry = null;

// Anatomical Concha-Bowl 2D Contour (Authentic ear concha curvature)
function createConchaShape() {
  const shape = new THREE.Shape();
  // Start at tragus notch (left-center)
  shape.moveTo(-0.85, -0.2);
  // Curve down to antitragus and canal root (lower left)
  shape.bezierCurveTo(-0.95, -0.6, -0.65, -1.1, -0.15, -1.15);
  // Curve through concha floor towards ear-canal transition (bottom right)
  shape.bezierCurveTo(0.45, -1.2, 0.95, -0.85, 1.05, -0.2);
  // Curve up along antihelix back-wall (right side)
  shape.bezierCurveTo(1.15, 0.45, 0.9, 1.15, 0.35, 1.38);
  // Curve over superior helix crest (top)
  shape.bezierCurveTo(-0.2, 1.45, -0.65, 1.3, -0.85, 0.9);
  // Tragus indentation (upper-left to center-left)
  shape.bezierCurveTo(-1.02, 0.55, -0.75, 0.12, -0.85, -0.2);
  return shape;
}

function getFaceplateGeometry() {
  if (!cachedFaceplateGeometry) {
    const shape = createConchaShape();
    const extrudeSettings = {
      steps: 2,
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelOffset: 0,
      bevelSegments: 4,
    };
    cachedFaceplateGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }
  return cachedFaceplateGeometry;
}

function getShellGeometry() {
  if (!cachedShellGeometry) {
    const shape = createConchaShape();
    const extrudeSettings = {
      steps: 4,
      depth: 1.45,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.14,
      bevelSegments: 5,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    cachedShellGeometry = geom;
  }
  return cachedShellGeometry;
}

// Stepped CNC Titanium Sound Bore Nozzle
function getNozzleGeometry() {
  if (!cachedNozzleGeometry) {
    const points = [];
    points.push(new THREE.Vector2(0.18, 0.0));   // inner bore
    points.push(new THREE.Vector2(0.24, 0.0));   // inner chamfer
    points.push(new THREE.Vector2(0.24, 0.45));  // tip stem
    points.push(new THREE.Vector2(0.275, 0.45)); // retention lip upper
    points.push(new THREE.Vector2(0.275, 0.38)); // retention lip outer
    points.push(new THREE.Vector2(0.245, 0.35)); // retention lip lower
    points.push(new THREE.Vector2(0.245, 0.15)); // main stem
    points.push(new THREE.Vector2(0.32, 0.1));   // base shoulder
    points.push(new THREE.Vector2(0.36, 0.0));   // canal docking collar
    cachedNozzleGeometry = new THREE.LatheGeometry(points, 32);
  }
  return cachedNozzleGeometry;
}

// Realistic Umbrella Mushroom Silicone Eartip (SpinFit / Final Audio profile)
function getEartipGeometry() {
  if (!cachedEartipGeometry) {
    const points = [];
    points.push(new THREE.Vector2(0.22, 0.24));  // inner bore tip
    points.push(new THREE.Vector2(0.26, 0.22));  // shoulder
    points.push(new THREE.Vector2(0.38, 0.14));  // umbrella slope
    points.push(new THREE.Vector2(0.52, 0.0));   // flare
    points.push(new THREE.Vector2(0.58, -0.16)); // widest umbrella rim
    points.push(new THREE.Vector2(0.55, -0.32)); // curled edge
    points.push(new THREE.Vector2(0.48, -0.35)); // inward lip
    cachedEartipGeometry = new THREE.LatheGeometry(points, 32);
  }
  return cachedEartipGeometry;
}

// Over-Ear Braided Audiophile Cable Path
function getCableGeometries() {
  if (!cachedCableTubeGeometry) {
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.06, 0.35, -0.05),
      new THREE.Vector3(-0.16, 0.85, -0.2),
      new THREE.Vector3(-0.25, 1.35, -0.5),
      new THREE.Vector3(-0.15, 1.65, -0.9),
      new THREE.Vector3(0.12, 1.7, -1.3),
      new THREE.Vector3(0.38, 1.45, -1.65),
      new THREE.Vector3(0.55, 1.0, -1.9),
    ]);
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.04, 0.02, 0.02),
      new THREE.Vector3(-0.02, 0.37, -0.03),
      new THREE.Vector3(-0.12, 0.87, -0.18),
      new THREE.Vector3(-0.21, 1.37, -0.48),
      new THREE.Vector3(-0.11, 1.67, -0.88),
      new THREE.Vector3(0.15, 1.72, -1.28),
      new THREE.Vector3(0.41, 1.47, -1.63),
      new THREE.Vector3(0.58, 1.02, -1.88),
    ]);
    cachedCableTubeGeometry = new THREE.TubeGeometry(curve1, 32, 0.042, 6, false);
    cachedCableBraidGeometry = new THREE.TubeGeometry(curve2, 32, 0.038, 6, false);
  }
  return [cachedCableTubeGeometry, cachedCableBraidGeometry];
}

function getTubeGeometries() {
  if (!cachedTubeGeometries) {
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.3, 0.4, 0.1),
      new THREE.Vector3(0.5, 0.1, -0.4),
      new THREE.Vector3(0.4, -0.4, -0.9),
    ]);
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.1, -0.2, 0.2),
      new THREE.Vector3(0.1, -0.4, -0.3),
      new THREE.Vector3(0.35, -0.45, -0.9),
    ]);
    cachedTubeGeometries = [
      new THREE.TubeGeometry(curve1, 18, 0.04, 6, false),
      new THREE.TubeGeometry(curve2, 18, 0.04, 6, false),
    ];
  }
  return cachedTubeGeometries;
}

/**
 * Procedural Flagship In-Ear Monitor (IEM) 3D Model
 * Architecturally accurate audiophile monitor featuring:
 * - Ergonomic Concha-Bowl Silhouette
 * - CNC Grade 5 Titanium Faceplate with Bass Equalization Vent
 * - Smoky Medical Acrylic Acoustic Shell with visible drivers
 * - Angled (42°) CNC Titanium Sound Bore with retention barb & laser grille
 * - Dual-density Umbrella Silicone Eartip with rigid inner stem
 * - Recessed 0.78mm 2-Pin Connector & Over-Ear Braided SPC Cable
 * - 10mm Beryllium Vapor Sub-Woofer Dynamic Driver
 * - Dual Knowles Mid Balanced Armatures & Dual Sonion Super-Tweeter Array
 * - Medical acoustic sound guides and 4-way linear phase crossover
 */
export default function IEMModel({
  progressRef = null,
  explodeProgress = 0,
  isHero = false,
  colorway = 'silver',
  activeComponent = null,
  onHoverComponent = null,
  isWireframe = false,
}) {
  const groupRef = useRef();

  // Themes / Luxury Finishes
  const themes = useMemo(() => ({
    silver: {
      faceplate: '#cbd5e1',
      metalness: 0.95,
      roughness: 0.2,
      accent: '#00f0ff',
      shell: '#0a1017',
      shellTransmission: 0.84,
      cable: '#f1f5f9',
    },
    obsidian: {
      faceplate: '#18181b',
      metalness: 0.75,
      roughness: 0.32,
      accent: '#71717a',
      shell: '#050507',
      shellTransmission: 0.78,
      cable: '#38bdf8',
    },
    cobalt: {
      faceplate: '#0f172a',
      metalness: 0.92,
      roughness: 0.24,
      accent: '#38bdf8',
      shell: '#061324',
      shellTransmission: 0.88,
      cable: '#e2e8f0',
    },
  }), []);

  const currentTheme = themes[colorway] || themes.silver;

  // Component refs for scroll-driven exploded-view interpolation
  const faceplateRef = useRef();
  const shellRef = useRef();
  const connectorRef = useRef();
  const dynamicDriverRef = useRef();
  const midBARef = useRef();
  const highBARef = useRef();
  const crossoverRef = useRef();
  const helmholtzRef = useRef();
  const soundTubesRef = useRef();
  const nozzleRef = useRef();
  const eartipRef = useRef();

  const smoothProgress = useRef(0);

  useFrame((state, delta) => {
    const targetP = progressRef ? progressRef.current : explodeProgress;
    // Responsive damp factor 18: immediate response to scroll without jitter
    smoothProgress.current = THREE.MathUtils.damp(
      smoothProgress.current,
      targetP,
      18,
      delta
    );
    const p = smoothProgress.current;

    // Hero idle floating motion
    if (isHero && groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.12;
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.25 + 0.35;
      groupRef.current.rotation.x = Math.cos(t * 0.5) * 0.1 - 0.08;
    }

    // Exploded View Trajectories (Locked directly to scroll progress)
    // 1. Titanium Faceplate: Unlocks forward (+Z) and angles outward
    if (faceplateRef.current) {
      faceplateRef.current.position.set(p * 0.3, p * 0.6, 1.2 + p * 3.6);
      faceplateRef.current.rotation.set(p * 0.1, p * 0.35, p * -0.15);
    }

    // 2. Translucent Acoustic Shell: Separates backward (-Z) and to the left
    if (shellRef.current) {
      shellRef.current.position.set(-p * 2.2, -p * 0.3, -p * 2.5);
      shellRef.current.rotation.set(-p * 0.15, -p * 0.4, p * 0.1);
    }

    // 3. Recessed 2-Pin Connector & Cable: Unplugs upward and back
    if (connectorRef.current) {
      connectorRef.current.position.set(-0.75 - p * 1.8, 1.05 + p * 2.2, 0.15 - p * 1.5);
      connectorRef.current.rotation.set(-p * 0.2, p * 0.3, -p * 0.1);
    }

    // 4. 10mm Beryllium Dynamic Driver: Decouples downward and to the front-left
    if (dynamicDriverRef.current) {
      dynamicDriverRef.current.position.set(-0.2 - p * 2.8, -0.4 - p * 2.4, 0.3 + p * 0.8);
      dynamicDriverRef.current.rotation.set(p * 0.3, -p * 0.5, p * 0.4);
    }

    // 5. Dual Mid BA Drivers: Fan out upward right
    if (midBARef.current) {
      midBARef.current.position.set(0.4 + p * 2.4, 0.5 + p * 2.2, 0.1 + p * 1.2);
      midBARef.current.rotation.set(p * 0.25, p * 0.45, -p * 0.2);
    }

    // 6. Dual Ultra-High BA Array: Float higher and forward
    if (highBARef.current) {
      highBARef.current.position.set(0.7 + p * 2.8, -0.2 + p * 1.4, 0.5 + p * 2.2);
      highBARef.current.rotation.set(-p * 0.2, p * 0.6, p * 0.1);
    }

    // 7. 4-Way Crossover PCB: Translates lower center-right
    if (crossoverRef.current) {
      crossoverRef.current.position.set(0.1 + p * 1.4, -0.7 - p * 2.6, -0.2 - p * 0.8);
      crossoverRef.current.rotation.set(p * 0.5, -p * 0.3, p * 0.6);
    }

    // 8. Helmholtz Chamber: Moves rear-downward
    if (helmholtzRef.current) {
      helmholtzRef.current.position.set(-0.4 - p * 1.6, -0.8 - p * 1.8, -0.6 - p * 2.0);
    }

    // 9. Sound Tubes: Elongate between drivers and nozzle
    if (soundTubesRef.current) {
      soundTubesRef.current.position.set(0.3 + p * 1.2, 0.1 + p * 0.2, -0.5 - p * 0.6);
      soundTubesRef.current.scale.set(1 + p * 0.3, 1 + p * 0.4, 1 + p * 0.5);
    }

    // 10. Angled Titanium Nozzle: Shoots forward-downward along ear canal trajectory
    if (nozzleRef.current) {
      nozzleRef.current.position.set(0.45 + p * 2.2, -0.65 - p * 1.6, -1.1 - p * 3.5);
      nozzleRef.current.rotation.set(0.42 + p * 0.3, -0.32 - p * 0.2, 0.12 + p * 0.2);
    }

    // 11. Umbrella Silicone Eartip: Extends furthest forward along nozzle axis
    if (eartipRef.current) {
      eartipRef.current.position.set(0.68 + p * 3.2, -0.85 - p * 2.4, -1.65 - p * 5.2);
      eartipRef.current.rotation.set(0.42 + p * 0.3, -0.32 - p * 0.2, 0.12 + p * 0.2);
    }
  });

  // Cached Geometries
  const faceplateGeometry = useMemo(() => getFaceplateGeometry(), []);
  const shellGeometry = useMemo(() => getShellGeometry(), []);
  const nozzleGeometry = useMemo(() => getNozzleGeometry(), []);
  const eartipGeometry = useMemo(() => getEartipGeometry(), []);
  const [cableTubeGeom, cableBraidGeom] = useMemo(() => getCableGeometries(), []);
  const tubeGeometries = useMemo(() => getTubeGeometries(), []);

  return (
    <group ref={groupRef} dispose={null}>
      {/* ========================================================
          1. CNC TITANIUM ERGONOMIC FACEPLATE WITH ACOUSTIC VENT
          ======================================================== */}
      <group
        ref={faceplateRef}
        position={[0, 0, 1.2]}
      >
        {/* Main beveled metal faceplate */}
        <mesh geometry={faceplateGeometry}>
          <meshPhysicalMaterial
            color={currentTheme.faceplate}
            metalness={0.96}
            roughness={0.18}
            clearcoat={0.9}
            clearcoatRoughness={0.08}
            reflectivity={0.95}
            wireframe={isWireframe}
          />
        </mesh>

        {/* Outer Electric Accent Bezel Groove */}
        <mesh position={[0, 0, 0.23]}>
          <ringGeometry args={[0.92, 0.95, 32]} />
          <meshStandardMaterial
            color={currentTheme.accent}
            emissive={currentTheme.accent}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>

        {/* Acoustic Bass Equalization Vent Port (Physical indicator of dynamic driver) */}
        <group position={[0.32, 0.62, 0.23]}>
          {/* Machined outer titanium collar */}
          <mesh>
            <cylinderGeometry args={[0.11, 0.11, 0.04, 24]} />
            <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Recessed micro-acoustic laser mesh */}
          <mesh position={[0, 0.021, 0]}>
            <circleGeometry args={[0.08, 24]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.6} wireframe />
          </mesh>
        </group>

        {/* Central Luxury Insignia Medallion */}
        <group position={[0, 0.1, 0.24]}>
          <mesh>
            <circleGeometry args={[0.3, 32]} />
            <meshStandardMaterial color="#09090b" metalness={0.9} roughness={0.35} />
          </mesh>
          {/* Precision audio chevron badge */}
          <mesh position={[0, 0, 0.01]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.14, 0.14]} />
            <meshStandardMaterial
              color={currentTheme.accent}
              emissive={currentTheme.accent}
              emissiveIntensity={1.5}
            />
          </mesh>
          <mesh position={[0.07, -0.05, 0.01]}>
            <boxGeometry args={[0.035, 0.14, 0.01]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[-0.07, -0.05, 0.01]}>
            <boxGeometry args={[0.035, 0.14, 0.01]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          2. ANATOMICAL SMOKY RESIN CONCHA SHELL
          ======================================================== */}
      <group
        ref={shellRef}
        position={[0, 0, 0]}
      >
        <mesh geometry={shellGeometry}>
          <meshPhysicalMaterial
            color={currentTheme.shell}
            opacity={0.82}
            transparent={true}
            roughness={0.12}
            metalness={0.15}
            clearcoat={0.9}
            clearcoatRoughness={0.06}
            reflectivity={0.9}
            wireframe={isWireframe}
          />
        </mesh>
        {/* Anatomical Ear-Canal Transition Spout Root */}
        <mesh position={[0.42, -0.62, -0.7]} rotation={[0.42, -0.32, 0.12]}>
          <cylinderGeometry args={[0.38, 0.44, 0.4, 24]} />
          <meshPhysicalMaterial
            color={currentTheme.shell}
            opacity={0.88}
            transparent={true}
            roughness={0.15}
            metalness={0.15}
            clearcoat={0.8}
          />
        </mesh>
      </group>

      {/* ========================================================
          3. RECESSED 0.78MM 2-PIN CONNECTOR & OVER-EAR BRAIDED CABLE
          ======================================================== */}
      <group
        ref={connectorRef}
        position={[-0.75, 1.05, 0.15]}
      >
        {/* Recessed socket cavity on IEM shell */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.36, 0.25, 0.36]} />
          <meshStandardMaterial color="#111827" roughness={0.6} />
        </mesh>

        {/* Clear Audiophile Molded 2-Pin Plug Housing */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.32, 0.35, 0.32]} />
          <meshPhysicalMaterial
            color="#cbd5e1"
            transmission={0.85}
            transparent
            opacity={0.9}
            roughness={0.1}
            ior={1.48}
          />
        </mesh>

        {/* Right Channel Polarity Indicator Dot (Red = Right, standard audiophile) */}
        <mesh position={[0.17, 0.15, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>

        {/* Dual Gold-Plated 0.78mm Connector Pins */}
        <mesh position={[-0.07, -0.06, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0.07, -0.06, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Knurled Aluminum Cable Collar */}
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.12, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.25} />
        </mesh>

        {/* Signature Audiophile Over-Ear Braided Silver-Plated Cable Loop */}
        <group position={[0, 0.42, 0]}>
          {/* Main Silver Litz Conductor */}
          <mesh geometry={cableTubeGeom}>
            <meshStandardMaterial
              color={currentTheme.cable}
              metalness={0.92}
              roughness={0.2}
            />
          </mesh>
          {/* Intertwined Second Braid Strand */}
          <mesh geometry={cableBraidGeom}>
            <meshStandardMaterial
              color="#94a3b8"
              metalness={0.88}
              roughness={0.25}
            />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          4. 10MM BERYLLIUM DYNAMIC SUB-WOOFER
          ======================================================== */}
      <group
        ref={dynamicDriverRef}
        position={[-0.2, -0.4, 0.3]}
      >
        {/* N52 Neodymium Magnet Chassis */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.54, 0.54, 0.24, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.2} />
        </mesh>
        {/* Rear Vented Center Pole Piece */}
        <mesh position={[0, 0, -0.13]}>
          <cylinderGeometry args={[0.18, 0.18, 0.05, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        {/* Brass Acoustic Suspension Ring */}
        <mesh position={[0, 0, 0.13]}>
          <torusGeometry args={[0.44, 0.045, 16, 32]} />
          <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.3} />
        </mesh>
        {/* Concentric Copper Voice Coil */}
        <mesh position={[0, 0, 0.14]}>
          <torusGeometry args={[0.29, 0.038, 16, 32]} />
          <meshStandardMaterial color="#ea580c" metalness={0.92} roughness={0.25} />
        </mesh>
        {/* Pure Beryllium Vapor Diaphragm Dome */}
        <mesh position={[0, 0, 0.16]}>
          <sphereGeometry args={[0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.98} roughness={0.08} />
        </mesh>
      </group>

      {/* ========================================================
          5. DUAL MID-RANGE BALANCED ARMATURE DRIVERS (Knowles Array)
          ======================================================== */}
      <group
        ref={midBARef}
        position={[0.4, 0.5, 0.1]}
      >
        {/* Driver 1 Laser-Welded Nickel Enclosure */}
        <mesh position={[-0.14, 0, 0]}>
          <boxGeometry args={[0.26, 0.55, 0.35]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.22} />
        </mesh>
        {/* Driver 2 Enclosure */}
        <mesh position={[0.14, 0, 0]}>
          <boxGeometry args={[0.26, 0.55, 0.35]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.22} />
        </mesh>
        {/* Laser-Etched Model Markings */}
        <mesh position={[0.14, 0, 0.18]}>
          <planeGeometry args={[0.18, 0.08]} />
          <meshBasicMaterial color="#334155" />
        </mesh>
        {/* Acoustic Sound Spout leading to sound tube */}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.15, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* ========================================================
          6. DUAL ULTRA-HIGH FREQUENCY BA ARRAY (Sonion Tweeters)
          ======================================================== */}
      <group
        ref={highBARef}
        position={[0.7, -0.2, 0.5]}
      >
        <mesh>
          <boxGeometry args={[0.22, 0.38, 0.28]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.16} />
        </mesh>
        {/* Dual Micro Sound Outlets */}
        <mesh position={[0, -0.21, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.1, 12]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#00f0ff"
            emissiveIntensity={0.6}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* ========================================================
          7. 4-WAY PASSIVE CROSSOVER PCB
          ======================================================== */}
      <group
        ref={crossoverRef}
        position={[0.1, -0.7, -0.2]}
        rotation={[0.3, 0.2, -0.1]}
      >
        {/* Audiophile Matte Black Board */}
        <mesh>
          <boxGeometry args={[0.88, 0.06, 0.78]} />
          <meshStandardMaterial color="#09090b" roughness={0.6} metalness={0.2} />
        </mesh>
        {/* 24K Gold-Plated Circuit Traces */}
        <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 0.7]} />
          <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.25} wireframe />
        </mesh>
        {/* High-Grade Film Capacitors */}
        <mesh position={[-0.24, 0.08, -0.14]}>
          <boxGeometry args={[0.18, 0.12, 0.22]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.24, 0.08, 0.14]}>
          <boxGeometry args={[0.18, 0.12, 0.22]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Toroidal Micro-Inductor */}
        <mesh position={[0.05, 0.09, -0.12]}>
          <torusGeometry args={[0.08, 0.04, 12, 24]} />
          <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ========================================================
          8. HELMHOLTZ ACOUSTIC RESONANCE CHAMBER
          ======================================================== */}
      <group
        ref={helmholtzRef}
        position={[-0.4, -0.8, -0.6]}
      >
        <mesh>
          <cylinderGeometry args={[0.21, 0.21, 0.44, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.215, 0.02, 12, 24]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* ========================================================
          9. MEDICAL CLEAR ACOUSTIC SOUND TUBES
          ======================================================== */}
      <group
        ref={soundTubesRef}
        position={[0.3, 0.1, -0.5]}
      >
        {tubeGeometries.map((geom, idx) => (
          <mesh key={idx} geometry={geom}>
            <meshStandardMaterial
              color="#38bdf8"
              opacity={0.7}
              transparent={true}
              roughness={0.15}
              metalness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* ========================================================
          10. ANGLED (42°) CNC TITANIUM SOUND BORE NOZZLE
          ======================================================== */}
      <group
        ref={nozzleRef}
        position={[0.45, -0.65, -1.1]}
        rotation={[0.42, -0.32, 0.12]}
      >
        {/* Stepped CNC Machined Titanium Nozzle with retention barb */}
        <mesh geometry={nozzleGeometry}>
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.96}
            roughness={0.16}
          />
        </mesh>

        {/* Laser Micro-Perforated Acoustic Mesh Filter at Bore Tip */}
        <mesh position={[0, 0.452, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.235, 32]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.98}
            roughness={0.25}
            wireframe={true}
          />
        </mesh>

        {/* Inner acoustic damper ring */}
        <mesh position={[0, 0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.14, 0.23, 24]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* ========================================================
          11. AUTHENTIC UMBRELLA SILICONE EARTIP
          ======================================================== */}
      <group
        ref={eartipRef}
        position={[0.68, -0.85, -1.65]}
        rotation={[0.42, -0.32, 0.12]}
      >
        {/* Translucent Mushroom Umbrella Silicone Dome */}
        <mesh geometry={eartipGeometry}>
          <meshStandardMaterial
            color="#e2e8f0"
            opacity={0.82}
            transparent={true}
            roughness={0.35}
            metalness={0.05}
          />
        </mesh>

        {/* Rigid Dark Inner Stem Core (grips the titanium nozzle) */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.42, 24]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}
