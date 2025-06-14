
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const GlitchTextEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const glyphs = "!@#$%^&*()_+=-{}[]|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  useEffect(() => {
    let intervalId;
    let timeoutId;

    const animate = () => {
      let iteration = 0;
      clearInterval(intervalId);

      intervalId = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((_letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return glyphs[Math.floor(Math.random() * glyphs.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(intervalId);
          setDisplayText(text); // Ensure it ends on the correct text
          // Schedule next animation cycle
          timeoutId = setTimeout(() => {
             if (document.visibilityState === 'visible') {
                animate();
             }
          }, 2500 + Math.random() * 3500); // Random delay between 2.5s and 6s
        }
        iteration += 1 / 2.5; // Control speed of reveal
      }, 55); // Control frame rate of glitch
    };
    
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            animate();
        } else {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            setDisplayText(text); // Reset to original text when tab is hidden
        }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    animate(); // Start animation

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [text]);

  return <span className="glitch-effect-text" data-text={text}>{displayText}</span>;
};


const Navigation = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'npm-packages', label: 'NPM Packages' },
    { id: 'research', label: 'Research' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'volunteer', label: 'Volunteer' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            <GlitchTextEffect text="Sampark.dev" />
          </motion.div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-purple-600/20 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          className="md:hidden bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-purple-600/20 hover:text-white'
                }`}
                whileHover={{ x: 10 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navigation;
