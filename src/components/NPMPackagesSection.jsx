
import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Package, ExternalLink, Terminal } from 'lucide-react';
import ProceduralTerrain from '@/components/ProceduralTerrain';

const NPMPackageCard = ({ pkg, index }) => {
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleInstall = () => {
    setInstalling(true);
    setProgress(0);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10 + 5;
      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setInstalling(false);
        }, 1000);
      } else {
        setProgress(currentProgress);
      }
    }, 200);
  };

  return (
    <motion.div
      className="bg-card/85 backdrop-blur-xl rounded-xl p-6 border-2 border-green-500/40 relative overflow-hidden group shadow-xl transform hover:scale-105 transition-all duration-300"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: index * 0.18 }}
      whileHover={{ borderColor: 'rgba(34, 197, 94, 0.8)' }}
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500"></div>
      <div className="absolute -top-8 -right-8 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
        <Package size={100} className="text-green-400 transform rotate-[15deg]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-600 to-teal-600 shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
          </div>
          {pkg.version && <span className="text-xs text-muted-foreground bg-secondary/60 px-2 py-1 rounded-full border border-border">v{pkg.version}</span>}
        </div>

        <p className="text-muted-foreground mb-4 leading-relaxed text-sm h-20 overflow-y-auto scrollbar-thin">{pkg.description}</p>
        
        {installing ? (
          <div className="mt-4">
            <div className="flex items-center text-green-400 text-xs font-mono mb-1">
              <Terminal size={14} className="mr-2"/>
              <span>npm i {pkg.name}...</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2.5">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-teal-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </div>
            {progress === 100 && <p className="text-green-400 text-xs mt-1 font-mono">Installation complete!</p>}
          </div>
        ) : (
          <div className="flex space-x-3 mt-5">
            <motion.button
              onClick={handleInstall}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 hover:from-green-500 hover:to-teal-500 transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Terminal className="w-4 h-4" />
              <span>Install</span>
            </motion.button>
            <motion.a
              href={pkg.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-secondary/60 hover:bg-secondary/80 border border-border text-muted-foreground py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on NPM</span>
            </motion.a>
          </div>
        )}
      </div>
    </motion.div>
  );
};


const NPMPackagesSection = () => {
  const packages = [
    {
      name: "gamedev-simple-utils",
      description: "A lightweight utility toolkit offering helper functions for JavaScript-based game development. Improves game logic modularity and reusability.",
      version: "1.0.5",
      link: "https://www.npmjs.com/package/gamedev-simple-utils"
    },
    {
      name: "cli-legend",
      description: "A CLI-based roguelike maze game built using Node.js. Offers keyboard-only interaction and ASCII-rendered dungeon crawl mechanics.",
      version: "0.8.2",
      link: "https://www.npmjs.com/package/cli-legend"
    }
  ];

  const terrainNoiseConfig = { // Fetching Packages theme
    noiseScale: 4.5, 
    waveSpeed: 0.08, 
    waveHeight: 0.12, 
    mouseInfluence: 0.06,
    timeFactor: 0.7, 
    detailFactor: 2.8, 
    baseOpacity: 0.65,
  };

  const terrainSparklesConfig = {
    count: 60, 
    scale: 12,
    size: 8,
    speed: 0.06,
    opacity: 0.25,
  };

  return (
    <section id="npm-packages" className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 opacity-60">
        <Suspense fallback={<div className="absolute inset-0 bg-gray-950 animate-pulse flex items-center justify-center"><span className="text-foreground text-lg">Fetching Packages...</span></div>}>
          <ProceduralTerrain 
            color1="hsl(150, 50%, 12%)" 
            color2="hsl(180, 55%, 18%)" 
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
          <h2 className="text-5xl font-bold text-foreground mb-4" style={{ textShadow: '0 0 10px hsla(150, 50%, 50%,0.4)'}}>NPM Packages</h2>
          <p className="text-xl text-muted-foreground">Open-source contributions to the developer community</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {packages.map((pkg, index) => (
            <NPMPackageCard key={index} pkg={pkg} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NPMPackagesSection;