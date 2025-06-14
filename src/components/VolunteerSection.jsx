
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, Leaf, Briefcase, Code, Globe } from 'lucide-react';
import ProceduralTerrain from '@/components/ProceduralTerrain';

const VolunteerSection = () => {
  const volunteerWork = [
    {
      organization: "IEEE Computer Society – VIT Vellore",
      role: "Event Organizer & Project Contributor (2023 - Present)",
      description: "Organized multiple technical events, hackathons, and workshops while contributing to collaborative chapter projects and promoting peer-to-peer learning.",
      icon: <Briefcase className="w-10 h-10 text-blue-400" />,
      visual: (
        <div className="absolute -bottom-4 -right-4 opacity-15">
          <Code size={80} className="text-blue-300" />
        </div>
      ),
      borderColor: "border-blue-500/40",
      gradientColor: "from-blue-500 to-cyan-500"
    },
    {
      organization: "Association of Energy Engineers – VIT Vellore Student Chapter (AEE-VIT)",
      role: "Active Member & Event Participant (2023 - 2024)",
      description: "Participated in discussions and events focused on renewable energy, energy management systems, and sustainable engineering practices.",
      icon: <Leaf className="w-10 h-10 text-green-400" />,
      visual: (
        <div className="absolute -bottom-4 -right-4 opacity-15">
          <Globe size={80} className="text-green-300" />
        </div>
      ),
      borderColor: "border-green-500/40",
      gradientColor: "from-green-500 to-teal-500"
    }
  ];

  const terrainNoiseConfig = { 
    noiseScale: 5.0,
    waveSpeed: 0.08,
    waveHeight: 0.2,
    mouseInfluence: 0.07,
    timeFactor: 0.6,
    detailFactor: 1.5,
    baseOpacity: 0.6,
  };
  const terrainSparklesConfig = { 
    count: 60,
    scale: 12,
    size: 7,
    speed: 0.06,
    opacity: 0.25,
  };

  return (
    <section id="volunteer" className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 opacity-55">
        <Suspense fallback={<div className="absolute inset-0 bg-gray-950 animate-pulse flex items-center justify-center"><span className="text-foreground text-lg">Assembling Guild Halls...</span></div>}>
          <ProceduralTerrain 
            color1="hsl(160, 35%, 10%)" 
            color2="hsl(180, 40%, 16%)" 
            noiseConfig={terrainNoiseConfig}
            sparklesConfig={terrainSparklesConfig}
            />
        </Suspense>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h2 className="text-5xl font-bold text-foreground mb-4" style={{ textShadow: '0 0 10px hsla(20, 70%, 60%,0.4)'}}>Volunteer Affiliations</h2>
          <p className="text-xl text-muted-foreground">Engaging with technical communities</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {volunteerWork.map((work, index) => (
            <motion.div
              key={index}
              className={`bg-card/80 backdrop-blur-lg rounded-xl p-8 ${work.borderColor} border-2 relative overflow-hidden shadow-xl group transform hover:scale-105 transition-all duration-300`}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: index * 0.2 }}
              whileHover={{ scale: 1.03, boxShadow: `0 12px 35px -12px hsla(var(--primary),0.3)` }}
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${work.gradientColor}`}></div>
              {work.visual}
              
              <div className="relative z-10">
                <div className="flex items-center mb-6 space-x-4">
                  <div className={`p-3 rounded-full bg-gradient-to-br ${work.gradientColor} shadow-lg`}>
                    {work.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{work.organization}</h3>
                    <p className={`text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r ${work.gradientColor}`}>{work.role}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">{work.description}</p>
                
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolunteerSection;
