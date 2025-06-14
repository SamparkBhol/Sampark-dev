
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Cloud, Cpu, Zap, Shield, Settings, Palette as PaletteIcon, Brain, Server, Wrench as Tool, Wind, Box, Terminal, Container, CloudCog, Users, GitBranch } from 'lucide-react';
import ProceduralTerrain from '@/components/ProceduralTerrain';

const SkillIcon = ({ icon: Icon, name, useCases, color, index }) => (
  <motion.div
    className="relative group p-3 bg-card/85 backdrop-blur-md rounded-lg border border-border hover:border-primary/75 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-primary/25 transform hover:scale-110"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.06 }}
    whileHover={{ y: -5 }}
  >
    <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br ${color} mx-auto mb-2 shadow-lg`}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
    </div>
    <p className="text-center text-xs sm:text-sm font-medium text-foreground truncate w-full">{name}</p>
    {useCases && (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 w-max max-w-xs p-2.5 bg-primary text-primary-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-2xl">
        <p>{useCases}</p>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-primary"></div>
      </div>
    )}
  </motion.div>
);

const SkillsSection = () => {
  const skillsData = {
    languages: [
      { name: "Python", icon: Code, useCases: "AI/ML, Web Dev, Scripting", color: "from-blue-500 to-cyan-500" },
      { name: "JavaScript", icon: Code, useCases: "Web Dev (Frontend/Backend)", color: "from-yellow-400 to-amber-500" },
      { name: "HTML", icon: Code, useCases: "Web Structure", color: "from-orange-500 to-red-500" },
      { name: "CSS", icon: PaletteIcon, useCases: "Web Styling", color: "from-sky-400 to-blue-600" },
      { name: "C", icon: Code, useCases: "Systems, Embedded", color: "from-gray-500 to-slate-600" },
      { name: "C++", icon: Code, useCases: "Game Dev, Performance", color: "from-indigo-500 to-purple-600" },
      { name: "R", icon: Code, useCases: "Data Analysis, Stats", color: "from-blue-400 to-sky-500" },
      { name: "React", icon: Zap, useCases: "Frontend UI Framework", color: "from-sky-500 to-cyan-400" },
      { name: "Solidity", icon: Shield, useCases: "Smart Contracts (Blockchain)", color: "from-purple-600 to-violet-700" },
    ],
    frameworks: [
      { name: "LangChain", icon: Brain, useCases: "LLM Applications", color: "from-green-400 to-lime-500" },
      { name: "Langflow", icon: Brain, useCases: "Visual LLM Orchestration", color: "from-teal-400 to-emerald-500" },
      { name: "Flask", icon: Server, useCases: "Python Web Backend", color: "from-slate-600 to-gray-700" },
      { name: "Node.js", icon: Server, useCases: "JavaScript Backend Runtime", color: "from-green-500 to-lime-600"},
      { name: "LangGraph", icon: Server, useCases: "Building Stateful LLM Workflows", color: "from-gray-600 to-slate-700"},
      { name: "Flutter", icon: Zap, useCases: "Cross-Platform Mobile Apps", color: "from-blue-400 to-indigo-500" },
      { name: "Godot", icon: Settings, useCases: "Game Development Engine", color: "from-sky-600 to-blue-700" },
      { name: "Orange", icon: Cpu, useCases: "Data Mining, ML GUI", color: "from-amber-500 to-orange-600" },
      { name: "Unreal Engine", icon: Settings, useCases: "AAA Game Development", color: "from-gray-700 to-black" },
      { name: "Buildbox", icon: Box, useCases: "No-code Game Development", color: "from-orange-400 to-yellow-500" },
      { name: "TailwindCSS", icon: Wind, useCases: "Utility-first CSS Framework", color: "from-cyan-500 to-sky-600" },
      { name: "Three.js", icon: Cpu, useCases: "3D Web Graphics Library", color: "from-pink-500 to-rose-500" },
    ],
    databases: [
      { name: "PostgreSQL", icon: Database, useCases: "Advanced Relational Data", color: "from-blue-600 to-indigo-700" },
      { name: "MySQL", icon: Database, useCases: "Popular Relational Data", color: "from-sky-500 to-blue-600" },
      { name: "MongoDB", icon: Database, useCases: "NoSQL Document Database", color: "from-green-600 to-emerald-700"},
      { name: "Firebase", icon: Cloud, useCases: "NoSQL, Realtime DB, BaaS", color: "from-yellow-400 to-amber-500" },
    ],
    devopsCloud: [
      { name: "Docker", icon: Container, useCases: "Containerization Platform", color: "from-blue-500 to-sky-600" },
      { name: "Kubernetes", icon: CloudCog, useCases: "Container Orchestration", color: "from-indigo-500 to-purple-600" },
      { name: "AWS Solutions", icon: Cloud, useCases: "Cloud Computing Services (EC2, S3, Lambda)", color: "from-orange-500 to-amber-600" },
      { name: "Git", icon: GitBranch, useCases: "Version Control System", color: "from-orange-600 to-red-700" },
      { name: "GitLab", icon: GitBranch, useCases: "DevOps Platform & CI/CD", color: "from-amber-500 to-orange-600" },
    ],
    aiTools: [
      { name: "TensorFlow", icon: Brain, useCases: "Deep Learning Framework", color: "from-orange-400 to-red-500" },
      { name: "PyTorch", icon: Brain, useCases: "Deep Learning Framework", color: "from-red-500 to-rose-600" },
      { name: "Scikit-learn", icon: Cpu, useCases: "Machine Learning Library", color: "from-blue-400 to-cyan-500" },
      { name: "Ollama", icon: Brain, useCases: "Running LLMs Locally", color: "from-purple-500 to-pink-500" },
      { name: "Hugging Face", icon: Users, useCases: "ML Models, Datasets & Tools", color: "from-yellow-300 to-amber-400" },
      { name: "Keras", icon: Brain, useCases: "High-level Neural Networks API", color: "from-red-600 to-rose-700"},
      { name: "OpenCV", icon: Cpu, useCases: "Computer Vision Library", color: "from-blue-600 to-sky-700"},
    ],
    otherTools: [
      { name: "Kivy", icon: PaletteIcon, useCases: "Python GUI Applications", color: "from-gray-400 to-slate-500" },
      { name: "Qiskit", icon: Cpu, useCases: "Quantum Computing SDK", color: "from-indigo-400 to-purple-500" },
      { name: "PennyLane", icon: Cpu, useCases: "Quantum Machine Learning", color: "from-pink-500 to-rose-600" },
      { name: "Model Context Protocol", icon: Shield, useCases: "Secure AI Collaboration (Conceptual)", color: "from-teal-500 to-cyan-600" },
      { name: "Jupyter Notebooks", icon: Terminal, useCases: "Interactive Computing", color: "from-orange-500 to-amber-600"},
      { name: "VS Code", icon: Tool, useCases: "Code Editor", color: "from-blue-500 to-sky-600"},
    ]
  };
  
  const categoryTitles = {
    languages: "Programming Languages",
    frameworks: "Frameworks & Technologies",
    databases: "Databases & Storage",
    devopsCloud: "DevOps & Cloud",
    aiTools: "AI & Machine Learning Tools",
    otherTools: "Other Development Tools"
  };

  const categoryIcons = {
    languages: <Code className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />,
    frameworks: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />,
    databases: <Server className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />,
    devopsCloud: <CloudCog className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />,
    aiTools: <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />,
    otherTools: <Tool className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
  };
  
  const categoryBgShapes = {
    languages: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent",
    frameworks: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/15 via-transparent to-transparent",
    databases: "bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-500/15 via-transparent to-transparent",
    devopsCloud: "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent",
    aiTools: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/15 via-transparent to-transparent",
    otherTools: "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-yellow-500/15 via-transparent to-transparent",
  };

  const terrainNoiseConfig = { 
    noiseScale: 6.0,
    waveSpeed: 0.04,
    waveHeight: 0.12,
    mouseInfluence: 0.03,
    timeFactor: 0.3,
    detailFactor: 4.0,
    baseOpacity: 0.9,
  };
  const terrainSparklesConfig = { 
    count: 45,
    scale: 10,
    size: 5,
    speed: 0.02,
    opacity: 0.15,
  };


  return (
    <section id="skills" className="py-20 relative overflow-hidden bg-background">
       <div className="absolute inset-0 z-0 opacity-80">
        <Suspense fallback={<div className="absolute inset-0 bg-gray-950 animate-pulse flex items-center justify-center"><span className="text-foreground text-lg">Forging Arsenal...</span></div>}>
          <ProceduralTerrain 
            color1="hsl(215, 50%, 15%)" 
            color2="hsl(235, 40%, 22%)" 
            noiseConfig={terrainNoiseConfig}
            sparklesConfig={terrainSparklesConfig}
          />
        </Suspense>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-3" style={{ textShadow: '0 0 10px hsla(230, 60%, 70%,0.4)'}}>Technical Arsenal</h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">A versatile toolkit for crafting innovative digital solutions and advancing research.</p>
        </motion.div>

        {Object.keys(skillsData).map((categoryKey, catIndex) => {
          const currentSkills = skillsData[categoryKey];
          if (currentSkills.length === 0) return null;

          return (
            <motion.div 
              key={categoryKey} 
              className={`mb-12 p-5 sm:p-6 rounded-xl border border-border shadow-2xl relative overflow-hidden ${categoryBgShapes[categoryKey]}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: catIndex * 0.12 + 0.15, ease: "easeOut" }}
            >
              <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-border/75">
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary to-pink-500 shadow-lg">
                  {categoryIcons[categoryKey]}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{categoryTitles[categoryKey]}</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {currentSkills.map((skill, skillIndex) => (
                  <SkillIcon key={skill.name} {...skill} index={skillIndex} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default SkillsSection;
