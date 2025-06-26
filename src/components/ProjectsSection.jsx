
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Github, Code, Brain, Layers, Gamepad, Package, ArrowRight } from 'lucide-react';
import ProceduralTerrain from '@/components/ProceduralTerrain';

const ProjectCard = ({ project, index }) => {
  const getIcon = (title) => {
    if (title.toLowerCase().includes('nlp') || title.toLowerCase().includes('ai')) return <Brain className="w-7 h-7 text-blue-300" />;
    if (title.toLowerCase().includes('assignofast')) return <Layers className="w-7 h-7 text-yellow-300" />;
    if (title.toLowerCase().includes('descollab')) return <Layers className="w-7 h-7 text-teal-300" />;
    if (title.toLowerCase().includes('zelda') || title.toLowerCase().includes('aetherengine')) return <Gamepad className="w-7 h-7 text-red-300" />;
    if (title.toLowerCase().includes('quantum')) return <Package className="w-7 h-7 text-purple-300" />;
    return <Code className="w-7 h-7 text-cyan-300" />;
  };

  return (
    <motion.div
      className="bg-card/90 backdrop-blur-lg rounded-xl p-6 border-2 border-border group shadow-xl flex flex-col justify-between transform transition-all duration-300 hover:border-primary hover:shadow-primary/40 hover:scale-105"
      initial={{ opacity: 0, y: 70 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8, delay: index * 0.15, ease:"easeOut" }}
    >
      <div>
        <div className="flex items-center mb-4 space-x-3.5">
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary to-pink-500 shadow-lg">
            {project.icon || getIcon(project.title)}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">{project.title}</h3>
        </div>
        <p className="text-muted-foreground mb-5 leading-relaxed text-sm h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/70 scrollbar-track-transparent">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs border border-primary/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <motion.a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-primary to-pink-500 text-primary-foreground py-2.5 px-5 rounded-lg hover:from-primary/90 hover:to-pink-500/90 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
      >
        <Github className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Visit GitHub</span>
      </motion.a>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const projects = [
    {
      title: 'Plant Disease Detector Webapp',
      description: `Revolutionizing agriculture with cutting-edge AI technology. Upload a leaf image and get instant disease diagnosis with professional treatment recommendations`,
      tech: ['Python', 'MediaPipe', 'OpenCV', 'FastAPI', 'ReactJS', 'ThreeJS', 'APIs'],
      link: 'https://plantdisease-scarlmtd-projects-co.vercel.app/',
    },
    {
      title: 'HyDe NLP',
      description: `HyDE leverages This project implements for precise zero-shot dense retrieval, revolutionizing how we find information without needing labeled data.This project is inspired by the groundbreaking research paper Precise Zero-Shot Dense Retrieval without Relevance Labels`,
      tech: ['Python', 'Sentence Transformers', 'FAISS', 'FastAPI', 'Flask', 'Hugging Face Transformers', 'LangChain', 'React'],
      link: 'https://github.com/SamparkBhol/HyDE-NLP',
    },
    {
      title: 'Assignofast',
      description: 'Developed full-stack productivity app with IEEE-CS VIT for assignment management, schedules, and workflows with intelligent reminders. Built Chrome extension extending core functionality with cross-platform synchronization and data consistency. Used Flutter for mobile development and Firebase for backend, ensuring scalable architecture and reliable data management.',
      tech: ['Flutter', 'Firebase', 'Dart', 'Chrome Extension'],
      link: 'https://assignofast.ieeecsvit.com/',
    },
    {
      title: 'Descollab',
      description: ' A collaborative design platform optimizing workflows with real-time synchronization , implemented React architecture with Tailwind CSS for responsive frontend, integrated with Firebase and developed live commenting, version control, and conflict resolution.',
      tech: ['React', 'Tailwind CSS', 'Firebase', 'JavaScript'],
      link: 'https://github.com/SamparkBhol/descollab',
    },
    {
      title: 'ZeldaGame2D',
      description: 'A 2D adventure game inspired by classic Zelda titles, featuring tile-based maps, character movement, combat mechanics, and basic enemy AI. Developed using a game engine (e.g., Godot or Unity with C#) focusing on core gameplay loops and pixel art aesthetics.',
      tech: ['Game Engine (Godot/Unity)', 'C# or GDScript', 'Pixel Art'],
      link: 'https://github.com/SamparkBhol/Zeldaprojectgame',
    },
    {
      title: 'Quantum Code Snippets',
      description: 'A collection of illustrative code examples and small projects demonstrating fundamental quantum computing concepts.',
      tech: ['Qiskit', 'Python', 'Jupyter'],
      link: 'https://github.com/SamparkBhol/Qiskit-Quantum-Code-Snippets',
    },
    {
      title: 'EtherEngine',
      description: 'The ultimate browser-based game engine with AI-powered development tools. Build, test, and deploy games without any backend setup along',
      tech: ['ReactJS', 'AiMl', 'many more'],
      link: 'https://github.com/SamparkBhol/EtherEngine',
    },
    {
      title: 'GameDev AI Assistant (Extension)',
      description: 'A browser extension designed to assist game developers by providing quick access to documentation, code snippets, and AI-powered suggestions for common game development tasks and challenges. Integrates with popular game engines and APIs.',
      tech: ['JavaScript', 'HTML', 'CSS', 'Browser Extension API', 'OpenAI API'],
      link: 'https://github.com/SamparkBhol/gamedev-ai-assistant',
    },
    {
      title: 'CodeVault',
      description: 'The ultimate toolkit for modern developers. Access a vast library of code snippets, plan your projects with an AI-driven workflow, and unlock powerful insights. Along with this there is smart ai workflow management of tasks',
      tech: ['React', 'CSS', 'Vite', 'AIML'],
      link: 'https://taskcodevault-vault.vercel.app',
    }
  ];
  
  const terrainNoiseConfig = {
    noiseScale: 10.0, 
    waveSpeed: 0.01, 
    waveHeight: 0.04, 
    mouseInfluence: 0.005,
    timeFactor: 0.05, 
    detailFactor: 0.3, 
    baseOpacity: 0.85, 
  };

  const terrainSparklesConfig = {
    count: 15, 
    scale: 18,
    size: 10,
    speed: 0.005,
    opacity: 0.08,
  };

  return (
    <section id="projects" className="py-24 sm:py-32 relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 opacity-75"> 
        <Suspense fallback={<div className="absolute inset-0 bg-gray-950 animate-pulse flex items-center justify-center"><span className="text-foreground text-lg">Constructing Projects Grid...</span></div>}>
          <ProceduralTerrain 
            color1="hsl(210, 70%, 12%)" 
            color2="hsl(230, 60%, 18%)" 
            noiseConfig={terrainNoiseConfig}
            sparklesConfig={terrainSparklesConfig}
          />
        </Suspense>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-foreground mb-4" style={{ textShadow: '0 0 12px hsla(var(--primary),0.6)' }}>Projects Showcase</h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">Innovative solutions built with cutting-edge technologies</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
        <motion.div
          className="text-center mt-16 sm:mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
        >
          <motion.a
            href="https://github.com/SamparkBhol"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-7 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-xl hover:shadow-2xl text-base sm:text-lg transform hover:scale-105"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Github className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>View More Projects on GitHub</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
