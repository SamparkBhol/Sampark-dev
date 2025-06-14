
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import { Toaster } from '@/components/ui/toaster';

const LazyAboutSection = React.lazy(() => import('@/components/AboutSection'));
const LazyExperienceSection = React.lazy(() => import('@/components/ExperienceSection'));
const LazyProjectsSection = React.lazy(() => import('@/components/ProjectsSection'));
const LazyNPMPackagesSection = React.lazy(() => import('@/components/NPMPackagesSection'));
const LazyResearchSection = React.lazy(() => import('@/components/ResearchSection'));
const LazyBlogsSection = React.lazy(() => import('@/components/BlogsSection'));
const LazyVolunteerSection = React.lazy(() => import('@/components/VolunteerSection'));
const LazySkillsSection = React.lazy(() => import('@/components/SkillsSection'));
const LazyCertificationsSection = React.lazy(() => import('@/components/CertificationsSection'));
const LazyContactSection = React.lazy(() => import('@/components/ContactSection'));


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        const element = document.getElementById(sectionId);
         if (element && sectionId !== 'contact' && sectionId !== 'home') { 
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(sectionId);
        } else {
          window.scrollTo(0, 0); 
          setActiveSection('home');
        }
      } else {
        window.scrollTo(0, 0); 
        setActiveSection('home');
      }
    }, 4500); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'experience', 'projects', 'npm-packages', 'research', 'blogs', 'volunteer', 'skills', 'certifications', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2.5; 

      let currentSection = 'home'; 
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = section;
            break;
          }
        }
      }
      if (activeSection !== currentSection) {
        setActiveSection(currentSection);
      }
    };

    if (!isLoading) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); 
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, activeSection]);

  const sectionFallBack = <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navigation activeSection={activeSection} />
          <main>
            <HeroSection />
            <Suspense fallback={sectionFallBack}><LazyAboutSection /></Suspense>
            <Suspense fallback={sectionFallBack}><LazyExperienceSection /></Suspense>
            <Suspense fallback={sectionFallBack}><LazyProjectsSection /></Suspense>
            <Suspense fallback={sectionFallBack}><LazyNPMPackagesSection /></Suspense>
            <Suspense fallback={sectionFallBack}><LazyResearchSection /></Suspense>
            <Suspense fallback={sectionFallBack}><LazyBlogsSection /></Suspense>
            <Suspense fallback={sectionFallBack}><LazyVolunteerSection /></Suspense>
            <Suspense fallback={sectionFallBack}><LazySkillsSection /></Suspense>
            <Suspense fallback={sectionFallBack}><LazyCertificationsSection /></Suspense>
            <Suspense fallback={sectionFallBack}><LazyContactSection /></Suspense>
          </main>
        </motion.div>
      )}
      
      <Toaster />
    </div>
  );
}

export default App;
