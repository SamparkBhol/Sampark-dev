
import React, { useRef, useMemo, Suspense, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const AccretionDiskMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(),
    uColor1: new THREE.Color('#ff8a00'),
    uColor2: new THREE.Color('#e52e71'),
    uNoiseScale: 3.5,
    uSwirlIntensity: 4.0,
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uNoiseScale;
    uniform float uSwirlIntensity;
    varying vec2 vUv;

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = mod(((i.y + vec3(0.0, i1.y, 1.0 ))*34.0+1.0)*(i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ), 289.0);
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472090901 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xw + h.yz * x12.zy;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 centeredUv = vUv - 0.5;
      float dist = length(centeredUv);
      float angle = atan(centeredUv.y, centeredUv.x);
      float mouseDist = length(uMouse - centeredUv * 2.0);
      float mouseEffect = 1.0 - smoothstep(0.0, 0.6, mouseDist);
      float noise = snoise(vUv * uNoiseScale - uTime * 0.1);
      float swirl = uSwirlIntensity * (1.0 - dist) * (1.0 + mouseEffect * 1.5);
      angle -= swirl * noise + uTime * 0.4;
      vec2 warpedUv = vec2(cos(angle), sin(angle)) * dist;
      float noise2 = snoise((warpedUv + 0.5) * uNoiseScale * 1.5 + uTime * 0.2);
      vec3 color = mix(uColor1, uColor2, 0.5 + 0.5 * sin(dist * 12.0 + noise2 * 5.0 - uTime * 2.0));
      float innerFade = smoothstep(0.18, 0.23, dist);
      float outerFade = 1.0 - smoothstep(0.48, 0.5, dist);
      float hotStreak = pow(max(0.0, snoise(vec2(angle * 5.0, dist * 8.0) - uTime * 0.8)), 5.0);
      color += vec3(1.0, 1.0, 0.7) * hotStreak * (1.0 + mouseEffect * 2.0);
      float finalAlpha = innerFade * outerFade;
      finalAlpha = pow(finalAlpha, 1.5);
      gl_FragColor = vec4(color, finalAlpha * 1.8);
    }
  `
);

const StarfieldMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(),
    uLensCenter: new THREE.Vector2(0, 0),
    uLensRadius: 0.15,
    uDistortionStrength: 0.05,
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec2 uLensCenter;
    uniform float uLensRadius;
    uniform float uDistortionStrength;
    varying vec2 vUv;

    float hash(float n) { return fract(sin(n) * 43758.5453); }
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

    void main() {
      vec2 uv = (vUv - 0.5) * (uResolution.xy / min(uResolution.x, uResolution.y));
      vec2 lensUv = uv - uLensCenter;
      float distToLens = length(lensUv);
      if (distToLens < uLensRadius * 2.5) { 
          float falloff = 1.0 - smoothstep(uLensRadius * 0.7, uLensRadius * 2.5, distToLens);
          vec2 offset = normalize(lensUv) * pow(distToLens + 0.001, -1.2) * uDistortionStrength * falloff * 1.5; 
          uv -= offset;
      }
      
      float stars = 0.0;
      vec2 starUv = uv * 450.0; 
      float starHash = hash(floor(starUv));
      
      if (starHash > 0.996) { 
          float starIntensity = pow(1.0 - fract(starUv.x), 20.0) * pow(1.0 - fract(starUv.y), 20.0); 
          stars += starIntensity * (0.7 + hash(floor(starUv) + 2.0) * 0.3) * 1.5; 
          stars *= 0.7 + 0.3 * sin(uTime * (1.5 + hash(floor(starUv)+4.0)) + hash(floor(starUv)+3.0)*6.28); 
      }

      starUv = uv * 250.0; 
      starHash = hash(floor(starUv));
      if (starHash > 0.985) { 
          float starIntensity = pow(1.0 - fract(starUv.x), 25.0) * pow(1.0 - fract(starUv.y), 25.0);
          stars += starIntensity * (0.4 + hash(floor(starUv) + 5.0) * 0.2) * 0.7; 
          stars *= 0.5 + 0.5 * sin(uTime * (1.0 + hash(floor(starUv)+6.0)) + hash(floor(starUv)+7.0)*6.28);
      }
      
      vec3 color = vec3(0.85, 0.9, 1.0) * stars * 2.2; 
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

const JetMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#ffae00'),
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = mod(((i.y + vec3(0.0, i1.y, 1.0 ))*34.0+1.0)*(i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ), 289.0);
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472090901 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xw + h.yz * x12.zy;
      return 130.0 * dot(m, g);
    }

    void main() {
      float noise = snoise(vec2(vUv.x * 2.0, vUv.y * 5.0 - uTime * 0.5));
      float falloff = pow(vUv.y, 2.0);
      float edgeFalloff = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 4.0);
      float finalAlpha = falloff * edgeFalloff * noise;
      gl_FragColor = vec4(uColor, finalAlpha * 0.5);
    }
  `
);

extend({ AccretionDiskMaterial, StarfieldMaterial, JetMaterial });

const RelativisticJet = () => {
  const [material, setMaterial] = useState(null);

  useFrame(({ clock }) => {
    if (material) {
      material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <group>
      <mesh rotation={[0, 0, 0]} position={[0, 0.4, -1]}>
        <coneGeometry args={[0.3, 15, 32]} />
        <jetMaterial
          ref={setMaterial}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {material && (
        <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.4, -1]}>
          <coneGeometry args={[0.3, 15, 32]} />
          <primitive object={material} attach="material" />
        </mesh>
      )}
    </group>
  );
};

const OrbitalParticles = ({ count = 350 }) => {
    const pointsRef = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const radius = 0.8 + Math.random() * 2.0; 
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.03 + Math.random() * 0.25; 
            const yOffset = (Math.random() - 0.5) * 0.3; 
            temp.push({ radius, angle, speed, yOffset });
        }
        return temp;
    }, [count]);

    useFrame(({ clock }) => {
        particles.forEach((p, i) => {
            p.angle += p.speed * 0.012; 
            const x = Math.cos(p.angle) * p.radius;
            const z = Math.sin(p.angle) * p.radius;
            pointsRef.current.geometry.attributes.position.setXYZ(i, x, p.yOffset, z);
        });
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} rotation={[Math.PI * 0.4, 0, 0]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length}
                    array={new Float32Array(particles.length * 3)}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.025} color="#ffccaa" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
        </points>
    );
};

const BlackHoleScene = () => {
  const { size, gl } = useThree();
  const accretionDiskRef = useRef();
  const starfieldRef = useRef();
  const mousePos = useRef(new THREE.Vector2());

  useFrame(({ clock, mouse }) => {
    mousePos.current.lerp(mouse, 0.05);

    if (accretionDiskRef.current) {
      accretionDiskRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
      accretionDiskRef.current.material.uniforms.uMouse.value.copy(mousePos.current);
    }
    if (starfieldRef.current) {
        starfieldRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
        const lensCenter = new THREE.Vector2(mousePos.current.x * 0.5, mousePos.current.y * 0.5);
        starfieldRef.current.material.uniforms.uLensCenter.value.copy(lensCenter);
    }
  });

  return (
    <group>
      <mesh ref={starfieldRef} position={[0, 0, -15]}>
        <planeGeometry args={[50, 50]} />
        <starfieldMaterial
          uniforms-uResolution-value={new THREE.Vector2(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio())}
        />
      </mesh>
      <mesh position={[0, 0, -1]}>
        <circleGeometry args={[0.7, 64]} />
        <meshBasicMaterial color={0x000000} />
      </mesh>
      <mesh ref={accretionDiskRef} rotation={[Math.PI * 0.4, 0, 0]}>
        <ringGeometry args={[0.7, 2.0, 128, 8]} />
        <accretionDiskMaterial
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms-uResolution-value={new THREE.Vector2(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio())}
        />
      </mesh>
      <RelativisticJet />
      <OrbitalParticles />
    </group>
  );
};


const MovingStars3D = ({ count = 1000 }) => { 
    const points = useRef();
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;
  
    const particles = useMemo(() => {
      const temp = [];
      for (let i = 0; i < count; i++) {
        const x = THREE.MathUtils.randFloatSpread(viewport.width * aspect * 1.5);
        const y = THREE.MathUtils.randFloatSpread(viewport.height * 1.5);
        const z = THREE.MathUtils.randFloat(-20, 5); // Depth for 3D effect
        const speed = 0.005 + Math.random() * 0.02;
        const scale = 0.1 + Math.random() * 0.4;
        temp.push({ x, y, z, speed, scale, initialZ: z });
      }
      return temp;
    }, [count, viewport.width, viewport.height, aspect]);
  
    useFrame((state) => {
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
      points.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.02) * 0.1;
      
      particles.forEach((particle, i) => {
        particle.z += particle.speed;
        if (particle.z > 10) { // Reset particle if it goes too far
            particle.z = particle.initialZ - 5; // Reset further back
            particle.x = THREE.MathUtils.randFloatSpread(viewport.width * aspect * 1.5);
            particle.y = THREE.MathUtils.randFloatSpread(viewport.height * 1.5);
        }
        
        const i3 = i * 3;
        points.current.geometry.attributes.position.array[i3 + 0] = particle.x;
        points.current.geometry.attributes.position.array[i3 + 1] = particle.y;
        points.current.geometry.attributes.position.array[i3 + 2] = particle.z;
        points.current.geometry.attributes.scale.array[i] = particle.scale * (1 + Math.sin(state.clock.elapsedTime * particle.speed * 50) * 0.2); // Twinkle effect
      });
      points.current.geometry.attributes.position.needsUpdate = true;
      points.current.geometry.attributes.scale.needsUpdate = true;
    });

    const particleGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        particles.forEach((p, i) => {
            positions[i*3] = p.x;
            positions[i*3+1] = p.y;
            positions[i*3+2] = p.z;
            scales[i] = p.scale;
        });
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute("scale", new THREE.Float32BufferAttribute(scales, 1));
        return geometry;
    }, [count, particles]);
  
    return (
        <points ref={points} geometry={particleGeometry}>
            <pointsMaterial 
              size={0.05} 
              color="#ffffff" 
              transparent 
              opacity={0.75} 
              blending={THREE.AdditiveBlending} 
              sizeAttenuation={true} 
            />
        </points>
    );
};

const CompleteBlackHoleEffect = () => {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 75 }}>
      <color attach="background" args={['#000000']} />
      <Suspense fallback={null}>
        <BlackHoleScene />
        <MovingStars3D /> 
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.7} height={400} intensity={2.0} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};

export default CompleteBlackHoleEffect;
