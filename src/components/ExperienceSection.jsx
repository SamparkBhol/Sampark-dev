
import React, { useRef, Suspense, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase, Award, ArrowDown } from 'lucide-react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles, shaderMaterial } from '@react-three/drei';

const InfiniteRoadLine = ({ index, totalLines, segmentLength, color }) => {
  const lineRef = useRef();
  
  useFrame(({ clock }) => {
    if (lineRef.current) {
      const speed = 35; 
      const newZ = (lineRef.current.position.z + speed * (1/60)) % (totalLines * segmentLength); 
      lineRef.current.position.z = newZ;
    }
  });

  return (
    <mesh ref={lineRef} position={[0, -0.49, -index * segmentLength]}>
      <planeGeometry args={[0.12, segmentLength * 0.7]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} roughness={0.4} metalness={0.1} />
    </mesh>
  );
};


const CustomRoadSurfaceShaderMaterial = shaderMaterial(
  {
    time: 0,
    roadColor: new THREE.Color(0x101015), 
    lineColor: new THREE.Color(0x303035), 
    glowColor: new THREE.Color(0x7f00ff), 
    lineThickness: 0.008,
    gridSize: 0.8,
    scrollSpeed: 0.3,
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float time;
    uniform vec3 roadColor;
    uniform vec3 lineColor;
    uniform vec3 glowColor;
    uniform float lineThickness;
    uniform float gridSize;
    uniform float scrollSpeed;
    varying vec2 vUv;

    float pulse(float val, float freq, float phase) {
      return 0.5 + 0.5 * sin(val * freq + phase + time * 2.0);
    }

    void main() {
      vec2 uv = vUv;
      uv.y += time * scrollSpeed; 

      vec3 color = roadColor;

      vec2 grid = fract(uv / gridSize);
      float lineX = smoothstep(0.0, lineThickness, grid.x) - smoothstep(1.0 - lineThickness, 1.0, grid.x);
      float lineY = smoothstep(0.0, lineThickness, grid.y) - smoothstep(1.0 - lineThickness, 1.0, grid.y);
      float gridPattern = max(lineX, lineY);
      
      color = mix(color, lineColor, gridPattern * 0.6);

      float edgeGlow = 1.0 - abs(vUv.x - 0.5) * 2.0; 
      edgeGlow = pow(edgeGlow, 3.0); 
      float pulseFactor = pulse(vUv.y, 15.0, vUv.x * 5.0); 
      color = mix(color, glowColor, edgeGlow * 0.3 * pulseFactor);
      
      float centerGlowDist = abs(vUv.x - 0.5);
      float centerGlow = smoothstep(0.05, 0.0, centerGlowDist) * 0.4; 
      centerGlow *= pulse(vUv.y, 25.0, 0.0);
      color = mix(color, vec3(1.0, 1.0, 0.8), centerGlow); 

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ CustomRoadSurfaceShaderMaterial });


const InfiniteRoadScene = () => {
  const { clock, camera } = useThree();
  const roadLength = 200; 
  const roadWidth = 8;
  const segmentLength = 4;
  const totalLines = Math.ceil(roadLength / segmentLength) + 5; 

  const roadSurfaceRef = useRef();

   useEffect(() => {
    if (roadSurfaceRef.current) {
      roadSurfaceRef.current.material.key = CustomRoadSurfaceShaderMaterial.key;
    }
  }, []);

  useFrame((state) => {
    if (roadSurfaceRef.current && roadSurfaceRef.current.material.uniforms) {
      roadSurfaceRef.current.material.uniforms.time.value = clock.getElapsedTime();
    }
    camera.position.x = Math.sin(clock.getElapsedTime() * 0.08) * 0.2;
    camera.position.y = 2.8; 
    camera.rotation.x = -0.1; 
    camera.rotation.z = Math.sin(clock.getElapsedTime() * 0.05) * 0.015;
    camera.rotation.y = Math.sin(clock.getElapsedTime() * 0.02) * 0.005;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 2]} intensity={0.8} color="#c0b0ff" />
      <pointLight position={[0, 5, -30]} intensity={1.5} color="#ff80c0" distance={80} decay={1.5}/>

      <mesh ref={roadSurfaceRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -roadLength / 3]}>
        <planeGeometry args={[roadWidth, roadLength * 1.5]} /> 
        <customRoadSurfaceShaderMaterial key={CustomRoadSurfaceShaderMaterial.key} />
      </mesh>
      
      {[ -1, 1 ].map(side => (
         <mesh key={`wall-${side}`} position={[side * (roadWidth/2 + 0.3), 0.5, -roadLength / 3]} rotation={[0,0,0]}>
          <planeGeometry args={[0.2, 3]} />
          <meshStandardMaterial 
            color={0xaa00ff} 
            emissive={0xcc33ff} 
            emissiveIntensity={1.5} 
            transparent 
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}


      <Sparkles 
        count={300} 
        scale={80} 
        size={15 + Math.random()*10} 
        speed={0.1 + Math.random()*0.2} 
        color={"#e0c0ff"} 
        opacity={0.35}
      />
      <fog attach="fog" args={['#05000a', 20, 90]} />
    </>
  );
};


const ExperienceMilestone = ({ experience, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -70 : 70, rotate: index % 2 === 0 ? -7 : 7 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 }}
      className="w-full max-w-md mx-auto mb-20 snap-center" 
    >
      <div className="bg-card/90 backdrop-blur-lg rounded-xl p-6 sm:p-8 border-2 border-primary/70 shadow-2xl h-full flex flex-col justify-between transition-all duration-300 hover:border-primary hover:shadow-primary/50 transform hover:scale-105">
        <div>
          <div className="flex items-center mb-4 sm:mb-5 space-x-4">
            <div className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-primary to-pink-500 shadow-xl">
              {experience.title.includes("ML") ? <Award className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" /> : <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">{experience.title}</h3>
              <p className="text-primary text-sm sm:text-base font-semibold">{experience.organization}</p>
            </div>
          </div>

          <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-1.5 space-x-2">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{experience.duration}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-5 space-x-2">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{experience.location}</span>
          </div>

          <ul className="space-y-2.5 text-sm sm:text-base text-foreground/95 list-disc list-inside pl-1">
            {experience.contributions.map((contrib, i) => (
              <li key={i}>{contrib}</li>
            ))}
          </ul>
        </div>
        <div className="mt-5 sm:mt-6 text-right text-xs sm:text-sm text-pink-400/95 font-mono">
          Milestone #{index + 1}
        </div>
      </div>
    </motion.div>
  );
};

const ExperienceSection = () => {
  const experiences = [
    {
      title: "ML Intern",
      organization: "National Informatics Centre, MeitY, Govt. of India | Odisha",
      duration: "May 2024 – July 2024",
      location: "Onsite, Odisha",
      contributions: [
        "Researched anomaly detection with graph-based models.",
        "Built ML pipelines and regression models for SATHI platform.",
        "Worked on model optimization and deployment reliability."
      ]
    },
    {
      title: "AI Intern",
      organization: "CSM Technologies | Bhubaneswar (Onsite)",
      duration: "May 2025 – July 2025",
      location: "Bhubaneswar, India",
      contributions: [
        "LLM/NLP model integration using Langchain & Langflow.",
        "Explored Generative AI and frontend co-development.",
        "Strengthened skills in ML/DL and production-ready toolchains."
      ]
    }
  ];

  return (
    <section id="experience" className="py-24 sm:py-32 relative overflow-hidden min-h-screen flex flex-col justify-center bg-background">
      <div className="absolute inset-0 z-0 opacity-100"> 
        <Suspense fallback={<div className="absolute inset-0 bg-gray-950 animate-pulse flex items-center justify-center"><span className="text-foreground text-lg">Paving Digital Highway...</span></div>}>
           <Canvas dpr={[1, 1.5]} camera={{ position: [0, 3.5, 25], fov: 70, near: 0.5, far: 150 }} shadows>
            <InfiniteRoadScene />
          </Canvas>
        </Suspense>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 relative z-10 w-full text-center">
        <motion.div
          className="mb-16 sm:mb-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-foreground mb-4" style={{textShadow: '0 0 15px hsla(var(--primary),0.7), 0 0 30px hsla(var(--primary),0.4)'}}>My Journey</h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">Charting a course through experience and innovation.</p>
        </motion.div>

        <div className="relative space-y-24 sm:space-y-28"> 
          {experiences.map((exp, index) => (
            <ExperienceMilestone key={index} experience={exp} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-20 sm:mt-24 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: experiences.length * 0.2 + 0.7 }}
        >
          <ArrowDown size={40} className="mx-auto mb-3 animate-bounce text-primary" />
          <p className="italic text-lg sm:text-xl">And the journey continues...</p>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;