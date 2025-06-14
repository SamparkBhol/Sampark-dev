import React, { useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';

const SauronEyeComponent = () => {
  const eyeGroupRef = useRef();
  const pupilRef = useRef();
  const irisRef = useRef();
  const flameParticlesRef = useRef();
  const { mouse, clock, viewport } = useThree(); 

  let blinkTimer = Math.random() * 4 + 3; 
  let isBlinking = false;

  useEffect(() => {
    if (flameParticlesRef.current) {
      const count = 350; 
      const positions = new Float32Array(count * 3);
      const irisRadius = 1.0; 
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radiusVariance = (Math.random() - 0.5) * 0.7; 
        const radius = irisRadius * (1.15 + radiusVariance); 
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 0.45; 
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      flameParticlesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, []);


  useFrame((state) => {
    const elapsedTime = clock.getElapsedTime();
    const aspect = viewport.width / viewport.height;

    if (eyeGroupRef.current) {
      const targetRotationY = Math.sin(elapsedTime * 0.1) * 0.12 + (mouse.x * aspect * 0.1);
      const targetRotationX = Math.cos(elapsedTime * 0.07) * 0.12 - (mouse.y * 0.1);
      eyeGroupRef.current.rotation.y = THREE.MathUtils.lerp(eyeGroupRef.current.rotation.y, targetRotationY, 0.04);
      eyeGroupRef.current.rotation.x = THREE.MathUtils.lerp(eyeGroupRef.current.rotation.x, targetRotationX, 0.04);
    }

    if (pupilRef.current && irisRef.current) {
      const targetLookAt = new THREE.Vector3(mouse.x * 2.5 * aspect, -mouse.y * 2.5, 5); 
      pupilRef.current.lookAt(targetLookAt);
      irisRef.current.lookAt(targetLookAt);
    }

    if (flameParticlesRef.current && flameParticlesRef.current.geometry.attributes.position) {
      flameParticlesRef.current.rotation.y += 0.007;
      const positions = flameParticlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime * 3.8 + i * 0.85) * 0.0035; 
        positions[i*3] += Math.cos(elapsedTime * 2.8 + i * 0.65) * 0.0018;
      }
      flameParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    blinkTimer -= clock.getDelta(); 
    if (blinkTimer <= 0 && !isBlinking) {
      isBlinking = true;
      blinkTimer = Math.random() * 5 + 3.5; 
      const blinkDuration = 0.08; 
      const blinkStartTime = elapsedTime;

      const blinkUpdate = () => {
        const currentBlinkTime = clock.getElapsedTime() - blinkStartTime;
        if (currentBlinkTime < blinkDuration) {
          const progress = currentBlinkTime / blinkDuration;
          const scaleY = Math.abs(Math.sin(progress * Math.PI)); 
          if (irisRef.current) irisRef.current.scale.y = scaleY;
          if (pupilRef.current) pupilRef.current.scale.y = scaleY;
          requestAnimationFrame(blinkUpdate);
        } else {
          if (irisRef.current) irisRef.current.scale.y = 1;
          if (pupilRef.current) pupilRef.current.scale.y = 1;
          isBlinking = false;
        }
      };
      blinkUpdate();
    }
  });

  const eyeRadius = 1.8;
  const irisRadius = 1.0; 
  const pupilHeight = irisRadius * 1.25; 

  return (
    <group ref={eyeGroupRef} position={[0, 0, -3]} scale={Math.min(viewport.width, viewport.height) / 7}>
      <mesh>
        <sphereGeometry args={[eyeRadius * 1.2, 64, 32]} /> 
        <meshPhongMaterial
          color={0x020000} 
          emissive={0x100000} 
          transparent
          opacity={0.65} 
          shininess={10}
        />
      </mesh>

      <mesh ref={irisRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[irisRadius, 0.25, 32, 100]} /> 
        <meshPhongMaterial
          color={0xff2000} 
          emissive={0xe81000} 
          shininess={150}
          opacity={1}
          transparent
        />
      </mesh>

      <mesh ref={pupilRef} position={[0, 0, 0.04]} >
        <cylinderGeometry args={[0.04, 0.04, pupilHeight, 32]} /> 
        <meshBasicMaterial color={0x000000} />
      </mesh>

      <points ref={flameParticlesRef}>
        <bufferGeometry />
        <pointsMaterial
          size={0.05} 
          color={0xffa500} 
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <Sparkles count={80} scale={eyeRadius * 2} size={15} speed={0.2} color={0xffd8aa} opacity={0.5} />
    </group>
  );
};

const EyeOfSauronCanvas = () => {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x010003, 0.15); 
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.2} color={0xffe0cc} />
      <pointLight position={[0, 0, 5]} intensity={1.8} color={0xff3500} distance={30} decay={1.6} />
      <directionalLight position={[-2, 2, 1]} intensity={0.3} color={0xffb070}/>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
      <SauronEyeComponent />
    </>
  );
};

const EyeOfSauron = () => {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7], fov: 60 }} className="w-full h-full absolute inset-0">
      <Suspense fallback={null}>
        <EyeOfSauronCanvas />
      </Suspense>
    </Canvas>
  );
};

export default EyeOfSauron;