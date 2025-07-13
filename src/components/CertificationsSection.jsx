
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, CheckCircle, Star, Sparkles as LucideSparkles } from 'lucide-react';
import ProceduralTerrain from '@/components/ProceduralTerrain';


const CertificationCard = ({ cert, index }) => {
  return (
    <motion.div
      className="relative group overflow-hidden rounded-2xl border-2 border-primary/40 p-1 bg-gradient-to-br from-purple-900/25 via-black/35 to-blue-900/25 shadow-2xl transition-all duration-500 hover:border-primary/80 hover:shadow-primary/25 transform hover:scale-105"
      initial={{ opacity: 0, y: 60, rotateX: -12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: index * 0.18, ease: [0.25, 1, 0.5, 1] }}
    >
      <div className="absolute inset-0 w-full h-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${"9400D3".substring(1)}' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '35px 35px',
      }}></div>
      
      <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col bg-card/85 backdrop-blur-lg rounded-[calc(0.9rem)]"> 
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-pink-500 shadow-lg">
              <Award className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">{cert.title}</h3>
              <p className="text-sm text-primary font-semibold">{cert.issuer}</p>
            </div>
          </div>
          {cert.verified && (
            <div className="flex items-center space-x-1.5 bg-green-500/20 border border-green-500/40 text-green-300 px-2.5 py-1 rounded-full text-xs font-medium">
              <CheckCircle size={14} />
              <span>Verified</span>
            </div>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">{cert.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {cert.skills.map((skill) => (
            <span key={skill} className="px-2.5 py-1 text-xs bg-secondary/75 text-secondary-foreground/85 rounded-full border border-border">
              {skill}
            </span>
          ))}
        </div>

        <motion.a
          href={cert.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-primary-foreground py-2.5 px-5 rounded-lg hover:shadow-lg hover:shadow-rose-500/35 transition-all duration-300"
          whileHover={{ scale: 1.03, y: -1, boxShadow: '0 0 22px hsla(var(--primary), 0.45)' }}
          whileTap={{ scale: 0.97 }}
        >
          <ExternalLink size={18} />
          <span>View Scroll</span>
        </motion.a>
      </div>
    </motion.div>
  );
};


const CertificationsSection = () => {
  const certifications = [
    {
      title: "ISAA Scroll of Security",
      issuer: "The Saviynt ",
      description: "An ancient scroll granting mastery in Identity Security & Access Assurance, covering arcane identity governance, access runes, and potent security protocols.",
      skills: ["Identity Weaving", "Access Runes", "Security Glyphs", "Compliance Edicts"],
      link: "https://shorturl.at/cQj3S",
      verified: true
    },
    {
      title: "Deep Learning Codex of TensorFlow",
      issuer: "The IBM foundation",
      description: "A powerful codex detailing forbidden deep learning techniques, neural network constructs, and their practical incantations using the TensorFlow framework.",
      skills: ["Deep Sorcery", "TensorFlow Alchemy", "Neural Constructs", "Machine Enchantment"],
      link: "https://tinyurl.com/49ec28jp",
      verified: true
    }
    {
      title: "Cloud Summoner's Scroll of Oracle Foundations",
      issuer: " Oracle ",
      description: "An enchanted scroll bestowed upon those who have mastered the foundational rites of Oracle Cloud Infrastructure—wielding knowledge of cloud realms, virtual constructs, storage sigils, and multi-tenant incantations.",
      skills: ["Cloud Invocation", "Oracle Foundations", "Infrastructure Summoning", "Virtual Networking"],
      link: "https://drive.google.com/file/d/10oyQhf3rD7HnHv3NYwNhy9JIWIdrOZ24/view?usp=sharing",
      verified: true
    }
  ];
  
  const terrainNoiseConfig = { // Scroll of Knowledge theme
    noiseScale: 4.0,
    waveSpeed: 0.05,
    waveHeight: 0.25,
    mouseInfluence: 0.08,
    timeFactor: 0.6,
    detailFactor: 1.5
  };
  const terrainSparklesConfig = { // Scroll of Knowledge theme
    count: 70,
    scale: 15,
    size: 10,
    speed: 0.06,
    opacity: 0.25,
  };


  return (
    <section id="certifications" className="py-24 sm:py-32 relative overflow-hidden bg-background">
       <div className="absolute inset-0 z-0 opacity-65"> 
        <Suspense fallback={<div className="absolute inset-0 bg-gray-950 animate-pulse flex items-center justify-center"><span className="text-foreground text-lg">Unrolling Ancient Scrolls...</span></div>}>
          <ProceduralTerrain 
            color1="hsl(40, 60%, 15%)" 
            color2="hsl(25, 50%, 22%)" 
            noiseConfig={terrainNoiseConfig}
            sparklesConfig={terrainSparklesConfig}
            />
        </Suspense>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-foreground mb-4" style={{textShadow: '0 0 18px hsla(var(--primary),0.6)'}}>Ancient Scrolls of Knowledge</h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">Unveiling powerful credentials and arcane achievements.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
          {certifications.map((cert, index) => (
            <CertificationCard key={index} cert={cert} index={index} />
          ))}
        </div>

        <motion.div
          className="mt-20 sm:mt-24 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45 }}
        >
          <div className="bg-card/75 backdrop-blur-xl rounded-2xl p-8 border border-primary/25 max-w-3xl mx-auto shadow-2xl">
            <LucideSparkles className="w-12 h-12 text-primary mx-auto mb-5" />
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">The Quest for Mastery</h3>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              These scrolls are but milestones in an unending quest for knowledge. The pursuit of mastery is eternal, 
              each incantation learned and artifact acquired paving the way for greater innovations.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CertificationsSection;
