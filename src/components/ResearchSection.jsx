
import React, { useRef, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Award, Users, FileText, Lock, Brain } from 'lucide-react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

const NeuralNetworkBackground = () => {
  const groupRef = useRef();
  const { mouse, viewport } = useThree(); // Removed 'size' as viewport is preferred for responsive scaling

  const { nodes, connections } = useMemo(() => {
    const nodeArray = [];
    const connectionArray = [];
    const layers = 5 + Math.floor(Math.random() * 4); 
    const baseNodesPerLayer = [5, 7, 9, 7, 5]; 
    const nodesPerLayer = baseNodesPerLayer.map(n => n + Math.floor(Math.random() * 5 - 2.5));

    const layerSpacing = viewport.width / (layers + 1) * 0.7; 
    const nodeSpacingVertical = viewport.height / (Math.max(...nodesPerLayer.map(n => Math.max(2,n))) + 2) * 0.5;
    
    let currentX = -(layers - 1) * layerSpacing / 2;

    for (let i = 0; i < layers; i++) {
      const numNodes = Math.max(2, nodesPerLayer[i % nodesPerLayer.length]);
      let currentY = -(numNodes - 1) * nodeSpacingVertical / 2;
      for (let j = 0; j < numNodes; j++) {
        const nodeSize = 0.05 + Math.random() * 0.05; // slightly larger, more variance
        nodeArray.push(
          <mesh key={`node-${i}-${j}`} position={[currentX + (Math.random()-0.5)*0.15, currentY + (Math.random()-0.5)*0.15, (Math.random() - 0.5) * 0.7]}>
            <sphereGeometry args={[nodeSize, 12, 12]} /> {/* More segments for smoother nodes */}
            <meshStandardMaterial color={Math.random() > 0.5 ? 0xa381ff : 0x64ffda} emissive={Math.random() > 0.5 ? 0xc0a4ff : 0x9afff2} emissiveIntensity={0.7} roughness={0.15} metalness={0.2} />
          </mesh>
        );
        
        if (i < layers - 1) {
          const nextLayerNodes = Math.max(2, nodesPerLayer[(i+1)%nodesPerLayer.length]);
          let nextNodeY = -(nextLayerNodes - 1) * nodeSpacingVertical / 2;
          for (let k = 0; k < nextLayerNodes; k++) {
            if (Math.random() > 0.2) { 
                const points = [
                    new THREE.Vector3(currentX, currentY, (Math.random() - 0.5) * 0.7), 
                    new THREE.Vector3(currentX + layerSpacing * (0.8 + Math.random()*0.4) , nextNodeY + (Math.random()-0.5)*0.15, (Math.random() - 0.5) * 0.7) // Connections not perfectly aligned
                ];
                const tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 10, 0.007 + Math.random()*0.006, 7, false); // Thinner, more connections
                connectionArray.push(
                    <mesh key={`conn-${i}-${j}-${k}`} geometry={tubeGeometry}>
                    <meshBasicMaterial color={0xffffff} transparent opacity={0.025 + Math.random()*0.08} depthWrite={false} blending={THREE.AdditiveBlending}/>
                    </mesh>
                );
            }
            nextNodeY += nodeSpacingVertical;
          }
        }
        currentY += nodeSpacingVertical;
      }
      currentX += layerSpacing;
    }
    return { nodes: nodeArray, connections: connectionArray };
  }, [viewport.width, viewport.height]);


  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.012 + mouse.x * 0.25; 
      groupRef.current.rotation.x = mouse.y * 0.25;
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.12) * 0.06;
      groupRef.current.position.z = -4.0 + Math.sin(clock.getElapsedTime() * 0.18) * 0.7; 
    }
  });

  return (
    <group ref={groupRef} scale={Math.min(viewport.width, viewport.height) / 4.0}> {/* Adjusted scale for better coverage */}
      {nodes}
      {connections}
      <Sparkles count={180} scale={22} size={10 + Math.random()*15} speed={0.07 + Math.random()*0.15} color={0xd1c4e9} opacity={0.3 + Math.random()*0.15}/>
    </group>
  );
};


const ResearchItemCard = ({ item, index }) => {
  return (
    <motion.div
      className={`bg-card/80 backdrop-blur-xl rounded-xl p-8 border-2 ${item.status === "Published" ? "border-blue-500/50" : "border-purple-500/50"} relative overflow-hidden shadow-2xl group transition-all duration-300 hover:border-primary hover:shadow-primary/35 hover:scale-105`}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.18, ease:"easeOut" }}
    >
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${item.status === "Published" ? "from-blue-500 via-cyan-500 to-teal-500" : "from-purple-500 via-pink-500 to-rose-500"}`}></div>
      
      {item.watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-6xl sm:text-7xl font_['Courier_New',_monospace] text-foreground/10 opacity-80 transform rotate-[-15deg] select-none group-hover:text-primary/15 transition-colors">
            {item.watermark}
          </span>
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-start space-x-4 sm:space-x-6 mb-6">
          <div className={`p-3 sm:p-4 rounded-lg bg-gradient-to-br ${item.status === "Published" ? "from-blue-600 to-cyan-600" : "from-purple-600 to-pink-600"} shadow-lg`}>
            {item.icon}
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">{item.title}</h3>
            <p className={`text-xs sm:text-sm font-semibold ${item.status === "Published" ? "text-blue-400" : "text-purple-400"}`}>{item.publication}</p>
            <span className={`mt-1 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${item.status === "Published" ? "bg-blue-500/25 text-blue-300 border border-blue-400/40" : "bg-purple-500/25 text-purple-300 border border-purple-400/40"}`}>
              {item.status}
            </span>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">{item.description}</p>
        
        {item.link && (
          <motion.a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center space-x-2 bg-gradient-to-r ${item.status === "Published" ? "from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500" : "from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"} text-primary-foreground px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Read Full Paper</span>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};


const ResearchSection = () => {
  const researchItems = [
    {
      title: "An Energy Efficient Hybrid Communication Protocol for Large Area Wireless Sensor Networks",
      publication: "Elsevier Procedia Computer Science (ICECMSN)",
      link: "https://tinyurl.com/yc33cawk",
      description: "Focused on optimizing wireless communication algorithms for enhanced system efficiency in large-scale sensor deployments.",
      status: "Published",
      icon: <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300" />,
    },
    {
      title: "Novel Thesis & Ongoing Research Paper",
      publication: "Details Confidential",
      link: null,
      description: "Working on a novel thesis related to AI and a different research project. Specifics are confidential due to ongoing work.",
      status: "In Progress",
      icon: <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-300" />,
      watermark: "TOP SECRET",
    }
  ];

  return (
    <section id="research" className="py-20 relative min-h-screen overflow-hidden bg-background">
      <motion.div className="absolute inset-0 z-0 pointer-events-none" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }} // Increased opacity for more presence
        transition={{ duration: 2.2, delay: 0.1 }}
      >
        <Canvas dpr={[1,1.5]} camera={{ position: [0, 0, 10], fov: 65 }}> {/* Adjusted camera */}
          <ambientLight intensity={0.1} /> {/* Reduced ambient for more contrast */}
          <pointLight position={[0, 6, 8]} intensity={1.3} color={0xd1b3ff} /> {/* Main key light */}
          <pointLight position={[0, -6, 8]} intensity={0.9} color={0x81c7fa} /> {/* Fill light */}
          <directionalLight position={[-5, 0, -5]} intensity={0.4} color={0xffffff} /> {/* Rim light */}
          <Suspense fallback={<div className="absolute inset-0 bg-gray-950 animate-pulse flex items-center justify-center"><span className="text-foreground text-lg">Initializing Neural Core...</span></div>}>
            <NeuralNetworkBackground />
          </Suspense>
        </Canvas>
      </motion.div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h2 className="text-5xl font-bold text-foreground mb-4" style={{ textShadow: '0 0 12px hsla(270, 70%, 70%,0.5)' }}>Research Contributions</h2>
          <p className="text-xl text-muted-foreground">Advancing knowledge through academic inquiry</p>
        </motion.div>

        <div className="space-y-12">
          {researchItems.map((item, index) => (
            <ResearchItemCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
