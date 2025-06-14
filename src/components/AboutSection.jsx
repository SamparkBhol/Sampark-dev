
import React, { Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
import ProceduralTerrain from '@/components/ProceduralTerrain';

const SectionWrapper = ({ children, id }) => {
  return (
    <section
      id={id}
      className="py-20 relative overflow-hidden bg-background min-h-screen flex items-center"
    >
      <div className="absolute inset-0 z-0 opacity-80"> {/* Slightly increased opacity */}
        <Suspense fallback={<div className="absolute inset-0 bg-gray-950 animate-pulse flex items-center justify-center"><span className="text-foreground text-lg">Loading Nebula...</span></div>}>
          <ProceduralTerrain color1="hsl(250, 25%, 10%)" color2="hsl(280, 35%, 15%)" /> {/* More distinct nebula colors */}
        </Suspense>
      </div>
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
};


const AboutSection = () => {
  return (
    <SectionWrapper id="about">
      {[...Array(12)].map((_, i) => ( 
        <motion.div
          key={i}
          className="constellation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: Math.random() * 2.2 }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2.5}s`
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 sm:mb-8" style={{ textShadow: '0 0 10px hsla(var(--primary),0.5)' }}>About Me</h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
          >
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A dedicated 4th-year Computer Science student with expertise in software development, system reliability engineering, and AI research. Passionate about building scalable systems while exploring innovative AI solutions for real-world problems. <span className="pencil-highlight text-foreground">Combines engineering fundamentals with research-driven approaches to deliver quality software solutions and advance technology through published research and practical implementations.</span>
            </p>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 sm:gap-12 items-start">
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          >
            <div className="bg-card/85 backdrop-blur-lg rounded-xl p-6 border border-border shadow-xl transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4">Education</h3>
              <div className="space-y-2">
                <div>
                  <h4 className="text-md sm:text-lg font-semibold text-foreground">B.Tech in Computer Science & Engineering</h4>
                  <p className="text-primary/95 text-sm">Blockchain Specialization</p>
                  <p className="text-muted-foreground text-sm">VIT Vellore (2022–Present)</p>
                </div>
              </div>
            </div>

            <div className="bg-card/85 backdrop-blur-lg rounded-xl p-6 border border-border shadow-xl transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl sm:text-2xl font-bold text-pink-400 mb-4">Research Focus</h3>
              <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
                {["Artificial Intelligence & Machine Learning", "Wireless Sensor Networks", "Blockchain Technology", "Software Engineering"].map(item => (
                  <li key={item} className="flex items-center">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
          >
            <div className="bg-card/85 backdrop-blur-lg rounded-xl p-6 sm:p-8 border border-border shadow-xl relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="scan-line absolute inset-0 opacity-35"></div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Philosophy</h3>
              <blockquote className="text-md sm:text-lg text-muted-foreground italic leading-relaxed">
                "Technology is best when it brings people together and solves real-world problems. My approach combines rigorous research with practical implementation to create solutions that matter."
              </blockquote>
              <div className="mt-6 flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-bold text-lg sm:text-xl">S</span>
                </div>
                <div>
                  <p className="text-foreground font-semibold text-base sm:text-lg">Sampark Bhol</p>
                  <p className="text-muted-foreground text-sm">Student & Developer</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-primary/10 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 border border-primary/25 hidden md:block">
              <code className="text-primary/60 text-[0.6rem] sm:text-xs font-mono leading-tight">
                while(alive) &#123;<br />
                &nbsp;&nbsp;learn();<br />
                &nbsp;&nbsp;create();<br />
                &nbsp;&nbsp;evolve();<br />
                &#125;
              </code>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
