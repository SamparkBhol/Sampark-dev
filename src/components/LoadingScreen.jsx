
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlitchChar = ({ char, delay }) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-{}[]|;:,.<>?/~`';
  const [displayChar, setDisplayChar] = useState(char);

  useEffect(() => {
    let interval;
    const startGlitching = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayChar(chars[Math.floor(Math.random() * chars.length)]);
      }, 40 + Math.random() * 60); // Slightly faster glitching
    }, delay);

    const stopGlitching = setTimeout(() => {
      clearInterval(interval);
      setDisplayChar(char);
    }, delay + 350 + Math.random() * 250); // Slightly longer glitch persistence before resolving

    return () => {
      clearTimeout(startGlitching);
      clearTimeout(stopGlitching);
      clearInterval(interval);
    };
  }, [char, delay]);

  return <span className="inline-block min-w-[1ch]">{displayChar}</span>; // Ensure char takes up space
};

const GlitchText = ({ text }) => {
  return (
    <div className="glitch-text-container">
      {text.split('').map((char, index) => (
        <GlitchChar key={index} char={char} delay={index * 25 + Math.random() * 80} /> // Faster per-char delay
      ))}
    </div>
  );
};


const LoadingScreen = () => {
  const [phase, setPhase] = useState(0); // 0: initial dots, 1: hacker glitch, 2: welcome message
  const [currentLine, setCurrentLine] = useState(0);

  const hackerLines = [
    "> Bootstrapping quantum entanglement matrix...",
    "> Calibrating chroniton field emitters [||||||||||||||||||] 98%",
    "> Synchronizing neural network with temporal flux...",
    "> Engaging warp core... ONLINE",
    "> Decrypting ancestral knowledge archives...",
    "> Warning: Anomaly detected in Sector 7G...",
    "> Rerouting power through auxiliary conduits... STABLE",
    "> Analyzing cognitive drift patterns...",
    "> Compiling shader graph for visual cortex interface...",
    "> All systems nominal. Welcome, Architect.",
    "> Preparing Sampark's Universe...",
  ];


  useEffect(() => {
    const phaseTimers = [
      setTimeout(() => setPhase(1), 1000), // Dots to hacker glitch (shorter initial delay)
      setTimeout(() => setPhase(2), 1000 + (hackerLines.length * 180) + 500), // Hacker glitch to welcome message, dynamic based on lines
    ];
    return () => phaseTimers.forEach(clearTimeout);
  }, [hackerLines.length]);
  
  useEffect(() => {
    if (phase === 1) {
      const lineTimer = setInterval(() => {
        setCurrentLine(prev => {
          if (prev < hackerLines.length -1) {
            return prev + 1;
          }
          clearInterval(lineTimer);
          return prev;
        });
      }, 180); // Time per line
      return () => clearInterval(lineTimer);
    }
  }, [phase, hackerLines.length]);


  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center gradient-bg-hero" // Ensure high z-index
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.4 } }} 
    >
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div
            key="dots"
            className="flex items-center justify-center space-x-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '180ms' }}></div>
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '360ms' }}></div>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            key="hacker"
            className="font-mono text-green-400 text-xs sm:text-sm p-4 sm:p-6 max-w-lg w-full bg-black/60 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border border-green-700/50"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
          >
            {hackerLines.slice(0, currentLine + 1).map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }} // Quick reveal per line
                className="whitespace-nowrap overflow-hidden leading-relaxed"
              >
                <GlitchText text={line} />
              </motion.p>
            ))}
             <div className="mt-3 h-2.5 w-full bg-green-800/40 rounded overflow-hidden">
              <motion.div 
                className="h-full bg-green-400 rounded"
                initial={{ width: 0 }}
                animate={{ width: `${((currentLine + 1) / hackerLines.length) * 100}%`}}
                transition={{ duration: 0.18, ease: "linear"}}
              />
            </div>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 150 }}
          >
            <div className="glitch text-3xl sm:text-4xl md:text-5xl text-center px-4" data-text="Welcome to Sampark's Universe">
              Welcome to Sampark's Universe
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LoadingScreen;
