import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { MOTION_TUNING, scrollTelemetry } from '../utils/motionConfig';

/**
 * Subtle scroll-reactive particle field in Apple Blue (#2997ff).
 */
function ClassroomParticles({ count }) {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 11;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = -1.5 - Math.random() * 4.5;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const speedBoost = 1 + Math.min(7, Math.abs(scrollTelemetry.velocity) * 0.16);
    pointsRef.current.rotation.y += delta * 0.035 * speedBoost;
    pointsRef.current.position.y = THREE.MathUtils.lerp(
      pointsRef.current.position.y,
      Math.max(-0.7, Math.min(0.7, scrollTelemetry.velocity * 0.018)),
      0.1
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={MOTION_TUNING.COLORS.darkAccentBlue}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Apple Industrial-Design 3D Smart Classroom Objects with Cannon-es Physics:
 * 1. Matte-Glass Smart Lightbulb
 * 2. Brushed-Aluminum Ceiling Fan Rotor
 * 3. Precision Classroom Thermometer
 * 4. Frosted-Glass Environmental Sensor Orb with #2997ff LED Ring
 */
function PhysicsClassroomObjects({ lowPower }) {
  const { viewport, pointer } = useThree();

  const [lightLit, setLightLit] = useState(true);
  const lightBoostRef = useRef(1);
  const fanSpeedRef = useRef(2.2);
  const pulseScaleRef = useRef({ thermo: 1, sensor: 1 });

  const bulbGroup = useRef(null);
  const fanGroup = useRef(null);
  const fanBladesRef = useRef(null);
  const thermoGroup = useRef(null);
  const sensorGroup = useRef(null);

  const physics = useMemo(() => {
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
    const anchors = [
      new CANNON.Vec3(-1.45, 0.72, 0),
      new CANNON.Vec3(1.45, 0.68, 0),
      new CANNON.Vec3(-1.3, -0.76, 0),
      new CANNON.Vec3(1.35, -0.7, 0),
    ];

    const bodies = anchors.map((pos) => {
      const body = new CANNON.Body({
        mass: 1,
        position: pos.clone(),
        linearDamping: 0.85,
        shape: new CANNON.Sphere(0.65),
      });
      world.addBody(body);
      return body;
    });

    return { world, anchors, bodies };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const cursorX = (pointer.x * viewport.width) / 2;
    const cursorY = (pointer.y * viewport.height) / 2;
    const cursorVec = new CANNON.Vec3(cursorX, cursorY, 0);
    const t = state.clock.elapsedTime;

    physics.bodies.forEach((body, idx) => {
      const anchor = physics.anchors[idx];
      const floatY = Math.sin(t * 1.25 + idx * 1.6) * 0.1;

      body.applyForce(
        new CANNON.Vec3(
          (anchor.x - body.position.x) * MOTION_TUNING.PHYSICS_SPRING_RETURN,
          (anchor.y + floatY - body.position.y) * MOTION_TUNING.PHYSICS_SPRING_RETURN,
          (anchor.z - body.position.z) * MOTION_TUNING.PHYSICS_SPRING_RETURN
        )
      );

      const diff = body.position.vsub(cursorVec);
      diff.z = 0;
      const dist = diff.length();
      if (dist < 1.25 && dist > 0.001) {
        diff.normalize();
        const pushStrength = (1 - dist / 1.25) * MOTION_TUNING.PHYSICS_REPULSION_FORCE;
        body.applyForce(diff.scale(pushStrength));
      }
    });

    physics.world.step(1 / 60, dt, 2);

    const groups = [bulbGroup, fanGroup, thermoGroup, sensorGroup];
    groups.forEach((gRef, idx) => {
      if (!gRef.current) return;
      const b = physics.bodies[idx];
      gRef.current.position.set(b.position.x, b.position.y, b.position.z);
      gRef.current.rotation.x = THREE.MathUtils.lerp(
        gRef.current.rotation.x,
        -pointer.y * 0.3,
        0.08
      );
      gRef.current.rotation.y = THREE.MathUtils.lerp(
        gRef.current.rotation.y,
        pointer.x * 0.4 + Math.sin(t * 0.55 + idx) * 0.18,
        0.08
      );
    });

    if (fanBladesRef.current) {
      fanBladesRef.current.rotation.z -= dt * fanSpeedRef.current;
      fanSpeedRef.current = THREE.MathUtils.lerp(fanSpeedRef.current, 2.2, 0.03);
    }

    lightBoostRef.current = THREE.MathUtils.lerp(
      lightBoostRef.current,
      lightLit ? 1.0 : 0.18,
      0.06
    );
    pulseScaleRef.current.thermo = THREE.MathUtils.lerp(pulseScaleRef.current.thermo, 1, 0.1);
    pulseScaleRef.current.sensor = THREE.MathUtils.lerp(pulseScaleRef.current.sensor, 1, 0.1);

    if (thermoGroup.current) thermoGroup.current.scale.setScalar(pulseScaleRef.current.thermo);
    if (sensorGroup.current) sensorGroup.current.scale.setScalar(pulseScaleRef.current.sensor);
  });

  const seg = lowPower ? 14 : 26;

  return (
    <group>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} color="#ffffff" />
      <pointLight
        position={[-1.4, 0.8, 1.5]}
        intensity={1.6 * lightBoostRef.current}
        color={MOTION_TUNING.COLORS.warmBulb}
      />
      <pointLight
        position={[1.4, -0.6, 1.8]}
        intensity={1.5}
        color={MOTION_TUNING.COLORS.darkAccentBlue}
      />

      {/* 1. SMART LIGHTBULB */}
      <group
        ref={bulbGroup}
        onClick={(e) => {
          e.stopPropagation();
          setLightLit((v) => !v);
          lightBoostRef.current = 3.0;
        }}
      >
        <mesh position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.42, seg, seg]} />
          <meshStandardMaterial
            color={lightLit ? '#fef3c7' : '#3a3a3c'}
            emissive={MOTION_TUNING.COLORS.warmBulb}
            emissiveIntensity={lightLit ? 0.72 : 0.05}
            roughness={0.2}
            metalness={0.08}
          />
        </mesh>
        {lightLit && (
          <mesh position={[0, 0.16, 0]} scale={1.42}>
            <sphereGeometry args={[0.42, 16, 16]} />
            <meshBasicMaterial
              color={MOTION_TUNING.COLORS.warmBulb}
              transparent
              opacity={MOTION_TUNING.BLOOM_HALO_OPACITY}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>
        )}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.2, 0.16, 0.3, 16]} />
          <meshStandardMaterial color="#aeaeb2" metalness={0.85} roughness={0.22} />
        </mesh>
      </group>

      {/* 2. BRUSHED-ALUMINUM CEILING FAN */}
      <group
        ref={fanGroup}
        onClick={(e) => {
          e.stopPropagation();
          fanSpeedRef.current = 15.0;
        }}
      >
        <group ref={fanBladesRef}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.14, seg]} />
            <meshStandardMaterial
              color="#d1d1d6"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
          {[0, 1, 2, 3].map((idx) => (
            <group key={idx} rotation={[0, (Math.PI / 2) * idx, 0]}>
              <mesh position={[0.46, 0, 0]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.56, 0.032, 0.17]} />
                <meshStandardMaterial
                  color="#2997ff"
                  emissive="#0071e3"
                  emissiveIntensity={0.25}
                  metalness={0.55}
                  roughness={0.25}
                />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 3. PRECISION THERMOMETER */}
      <group
        ref={thermoGroup}
        onClick={(e) => {
          e.stopPropagation();
          pulseScaleRef.current.thermo = 1.3;
        }}
      >
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.24, seg, seg]} />
          <meshStandardMaterial
            color={MOTION_TUNING.COLORS.thermoCoral}
            emissive={MOTION_TUNING.COLORS.thermoCoral}
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.78, 16]} />
          <meshStandardMaterial color="#f5f5f7" transparent opacity={0.4} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.55, 12]} />
          <meshStandardMaterial
            color={MOTION_TUNING.COLORS.thermoCoral}
            emissive={MOTION_TUNING.COLORS.thermoCoral}
            emissiveIntensity={0.65}
          />
        </mesh>
      </group>

      {/* 4. FROSTED-GLASS SENSOR ORB WITH APPLE BLUE RING */}
      <group
        ref={sensorGroup}
        onClick={(e) => {
          e.stopPropagation();
          pulseScaleRef.current.sensor = 1.3;
        }}
      >
        <mesh>
          <sphereGeometry args={[0.32, seg, seg]} />
          <meshStandardMaterial
            color="#e5e5ea"
            emissive="#2997ff"
            emissiveIntensity={0.35}
            roughness={0.18}
            metalness={0.4}
          />
        </mesh>
        <mesh scale={1.5}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshBasicMaterial
            color="#2997ff"
            transparent
            opacity={MOTION_TUNING.BLOOM_HALO_OPACITY}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0.3, 0]}>
          <torusGeometry args={[0.52, 0.02, 12, 48]} />
          <meshBasicMaterial color="#2997ff" transparent opacity={0.85} />
        </mesh>
      </group>
    </group>
  );
}

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-3xl bg-[#1c1c1e] p-6 text-xs text-[#a1a1a6]">
          Interactive Classroom Hardware Ready
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Scene3D({ className = 'h-72 w-full' }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const isSmallOrLowCpu =
      window.innerWidth < 768 ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    setLowPower(Boolean(isSmallOrLowCpu));

    const onVisibility = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, []);

  if (prefersReducedMotion) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#1c1c1e] p-6 text-center`}
      >
        <Cpu className="h-10 w-10 text-[#2997ff]" />
        <p className="mt-2 text-xs font-medium text-[#a1a1a6]">
          Smart Classroom Hardware Core (Reduced Motion)
        </p>
      </div>
    );
  }

  const isPaused = !inView || !tabVisible;
  const particleCount = lowPower
    ? MOTION_TUNING.PARTICLE_COUNT_MOBILE
    : MOTION_TUNING.PARTICLE_COUNT_DESKTOP;

  return (
    <div
      ref={containerRef}
      data-cursor="Drag"
      className={`relative overflow-hidden rounded-3xl ${className}`}
      title="Move cursor to push classroom objects, or click the lightbulb & fan"
    >
      {/* Subtle Apple studio radial spotlight behind floating hardware */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_48%,rgba(41,151,255,0.14),transparent_68%)] mix-blend-screen"
      />

      <WebGLErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 4.4], fov: 46 }}
          dpr={[1, MOTION_TUNING.MAX_DPR]}
          frameloop={isPaused ? 'never' : 'always'}
          gl={{ antialias: !lowPower, powerPreference: 'high-performance' }}
        >
          <ClassroomParticles count={particleCount} />
          <PhysicsClassroomObjects lowPower={lowPower} />
        </Canvas>
      </WebGLErrorBoundary>

      <span className="pointer-events-none absolute bottom-3 right-4 z-20 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-[#a1a1a6] backdrop-blur-md">
        Push with cursor • Click bulb or fan
      </span>
    </div>
  );
}
