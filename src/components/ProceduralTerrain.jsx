
import React, { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

const TerrainPlane = ({ color1, color2, noiseConfig = {} }) => {
  const meshRef = useRef();
  const { mouse } = useThree();

  const defaultNoiseConfig = {
    noiseScale: 5.0,
    waveSpeed: 0.05,
    waveHeight: 0.15,
    mouseInfluence: 0.05,
    timeFactor: 0.5, 
    detailFactor: 2.0,
    baseOpacity: 0.75, // Base opacity for the terrain
  };

  const currentConfig = { ...defaultNoiseConfig, ...noiseConfig };


  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      mouse: { value: new THREE.Vector2() },
      color1: { value: new THREE.Color(color1) },
      color2: { value: new THREE.Color(color2) },
      noiseScale: { value: currentConfig.noiseScale }, 
      waveSpeed: { value: currentConfig.waveSpeed }, 
      waveHeight: { value: currentConfig.waveHeight }, 
      mouseInfluence: { value: currentConfig.mouseInfluence },
      timeFactor: { value: currentConfig.timeFactor },
      detailFactor: { value: currentConfig.detailFactor },
      baseOpacity: { value: currentConfig.baseOpacity },
    }),
    [color1, color2, currentConfig]
  );

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value = clock.getElapsedTime() * uniforms.timeFactor.value;
      meshRef.current.material.uniforms.mouse.value.lerp(mouse, 0.02); 
    }
  });

  const vertexShader = `
    uniform float time;
    uniform float noiseScale;
    uniform float waveSpeed;
    uniform float waveHeight;
    uniform vec2 mouse;
    uniform float mouseInfluence;
    uniform float detailFactor;
    varying vec2 vUv;
    varying float vElevation;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472090901 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857; 
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      float mouseDist = length(vec2(mouse.x, mouse.y) - (uv - 0.5) * 2.0); // Distance from mouse to UV point
      float localMouseInfluence = mouseInfluence * (1.0 - smoothstep(0.0, 1.5, mouseDist)); // Influence fades with distance

      float noise1 = snoise(vec3(
        pos.x * noiseScale + time * waveSpeed + localMouseInfluence * mouse.x, 
        pos.y * noiseScale + time * waveSpeed + localMouseInfluence * mouse.y, 
        time * waveSpeed * 0.7
      ));
      float noise2 = snoise(vec3(
        pos.x * noiseScale * detailFactor + time * waveSpeed * 0.6 + localMouseInfluence * mouse.x * 0.5, 
        pos.y * noiseScale * detailFactor + time * waveSpeed * 0.6 + localMouseInfluence * mouse.y * 0.5, 
        time * waveSpeed * 0.4
      ));
      
      pos.z += (noise1 * 0.7 + noise2 * 0.3) * waveHeight; 
      vElevation = noise1 * 0.6 + noise2 * 0.4; // Blend elevation for color
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float baseOpacity;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      float mixVal = smoothstep(-0.8, 0.8, vElevation); 
      vec3 finalColor = mix(color1, color2, mixVal);
      
      float edgeFadeX = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x); // Softer edge fade
      float edgeFadeY = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
      float edgeFade = edgeFadeX * edgeFadeY;

      float distanceToCenter = distance(vUv, vec2(0.5));
      float centerGlow = smoothstep(0.6, 0.0, distanceToCenter) * 0.4; 

      gl_FragColor = vec4(finalColor, (edgeFade + centerGlow) * baseOpacity);
    }
  `;

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} scale={[14, 14, 1]}> 
      <planeGeometry args={[10, 10, 70, 70]} /> 
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const ProceduralTerrain = ({ color1 = 'hsl(240, 20%, 10%)', color2 = 'hsl(260, 25%, 15%)', noiseConfig = {}, sparklesConfig = {} }) => {
  const defaultSparklesConfig = {
    count: 40 + Math.floor(Math.random() * 60), // More variance
    scale: 10 + Math.random() * 10,
    size: 5 + Math.random() * 12,
    speed: 0.02 + Math.random() * 0.12,
    opacity: 0.2 + Math.random() * 0.3, // Generally more visible sparkles
  };
  const currentSparklesConfig = { ...defaultSparklesConfig, ...sparklesConfig };


  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 3.0, 7.5], fov: 60 }}> 
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 4, 4]} intensity={0.8} color={new THREE.Color(color1).lerp(new THREE.Color(0xffffff), 0.6).getHex()}/>
      <Suspense fallback={null}>
        <TerrainPlane color1={color1} color2={color2} noiseConfig={noiseConfig} />
        <Sparkles 
            count={currentSparklesConfig.count} 
            scale={currentSparklesConfig.scale} 
            size={currentSparklesConfig.size} 
            speed={currentSparklesConfig.speed} 
            opacity={currentSparklesConfig.opacity}
            color={new THREE.Color(color2).lerp(new THREE.Color(0xffffff), 0.4).getHex()}
        />
      </Suspense>
    </Canvas>
  );
};

export default ProceduralTerrain;
