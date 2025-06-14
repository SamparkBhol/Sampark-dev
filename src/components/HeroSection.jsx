import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import CompleteBlackHoleEffect from '@/components/BlackHoleEffect';

const HeroSection = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = [
    'AI Enthusiast',
    'Aspiring Software Developer',
    'CS Student',
    'Research Enthusiast'
  ];

  useEffect(() => {
    const typingSpeed = isDeleting ? 45 : 110; 
    const delayAfterTyping = 1800; 

    const timeout = setTimeout(() => {
      const currentFullText = texts[currentIndex];
      
      if (isDeleting) {
        setCurrentText(currentFullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(currentFullText.substring(0, currentText.length + 1));
      }

      if (!isDeleting && currentText === currentFullText) {
        setTimeout(() => setIsDeleting(true), delayAfterTyping);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-bg-hero z-[-1]"></div>
      
       <div className="absolute inset-0 z-0 pointer-events-none">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-transparent"><div className="text-foreground text-lg">Summoning the Void...</div></div>}>
          <CompleteBlackHoleEffect />
        </Suspense>
      </div>


      <div className="relative z-10 text-center px-4">
        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 md:mb-8 tracking-tight text-red-500"
          style={{ fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 15px hsla(0,100%,50%,0.4), 0 0 30px hsla(0,100%,50%,0.3)' }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          SAMPARK BHOL
        </motion.h1>
        
        <motion.div
          className="text-xl sm:text-2xl md:text-3xl h-12 md:h-16 flex items-center justify-center text-cyan-400 font-bold italic"
          style={{ fontFamily: "'Source Code Pro', 'CMOC Sans', monospace", textShadow: '0 0 8px hsla(180,100%,50%,0.3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <span className="mr-2 text-cyan-500/80">&gt;</span>
          <span>{currentText}</span>
          <span className="typing-cursor ml-1 text-cyan-500">|</span>
        </motion.div>

        <motion.div
          className="mt-10 md:mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
        >
          <motion.button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-7 py-3 md:px-8 md:py-4 bg-gradient-to-r from-primary to-pink-500 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-primary/40 transition-all duration-300 text-base md:text-lg transform hover:scale-105"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px hsla(var(--primary), 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            Explore My Universe
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-cyan-500/50 rounded-full flex justify-center pt-1 md:pt-2 hover:border-cyan-500/70 transition-colors">
          <div className="w-1 h-2 md:w-1 md:h-3 bg-cyan-500/50 rounded-full group-hover:bg-cyan-500/70 transition-colors"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;