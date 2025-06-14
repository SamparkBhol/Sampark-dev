import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Lightbulb, Users, Edit3 } from 'lucide-react';
import ProceduralTerrain from '@/components/ProceduralTerrain';

const BlogsSection = () => {
  const blogs = [
    {
      title: 'NeuroSymbolic AI : A view',
      link: 'https://medium.com/@samparkbhol2005/neurosymbolic-ai-a-view-328617188529',
      description: 'Exploring the integration of neural networks and symbolic reasoning in AI. This piece delves into the potential of hybrid models to overcome limitations of purely data-driven or rule-based approaches.',
      imageUrl: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8F0R2QJM9R4Y2Y7Z2J9A_w.jpeg',
      icon: <Brain className="w-6 h-6 text-purple-300" />
    },
    {
      title: 'Quantum-Enhanced NLP: The Future of Cloud AI',
      link: 'https://medium.com/@samparkbhol2005/quantum-enhanced-nlp-the-future-of-cloud-ai-aff15f85f274',
      description: 'Delving into how quantum computing can revolutionize Natural Language Processing tasks such as sentiment analysis, translation, and complex query understanding. The synergy with cloud AI is highlighted.',
      imageUrl: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QpZfD_L9zD7zWqUaO_ZpFA.png',
      icon: <Lightbulb className="w-6 h-6 text-blue-300" />
    },
    {
      title: 'CERN in October: A Month of Milestones and Marvels',
      link: 'https://medium.com/@samparkbhol2005/cern-in-october-a-month-of-milestones-and-marvels-c289c5c140f3',
      description: 'A recap of significant achievements, experiments, and groundbreaking discoveries at CERN during a pivotal month. Insights into the world of particle physics and fundamental research.',
      imageUrl: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*sH2j_uZpY4XzW9N0uXp_gA.jpeg', 
      icon: <Users className="w-6 h-6 text-orange-300" />
    },
    {
      title: 'Quantum-driven gaming: AI meets the future',
      link: 'https://medium.com/@samparkbhol2005/quantum-driven-gaming-ai-meets-the-future-of-limitless-possibilities-in-the-cusp-of-new-tech-era-7e4226b894b8',
      description: 'Exploring the exciting intersection of quantum computing, artificial intelligence, and the future of gaming. Potential for vastly more complex simulations and intelligent NPCs.',
      imageUrl: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N3F_c_5fP6E0tXf3B_s8Xg.jpeg', 
      icon: <Edit3 className="w-6 h-6 text-green-300" />
    }
  ];

  const terrainNoiseConfig = { 
    noiseScale: 7.0, 
    waveSpeed: 0.045,
    waveHeight: 0.18,
    mouseInfluence: 0.04,
    timeFactor: 0.35,
    detailFactor: 2.5,
    baseOpacity: 0.7, 
  };
  const terrainSparklesConfig = { 
    count: 70, 
    scale: 14,
    size: 8,
    speed: 0.045,
    opacity: 0.25,
  };

  return (
    <section id="blogs" className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 opacity-65"> 
        <Suspense fallback={<div className="absolute inset-0 bg-gray-950 animate-pulse flex items-center justify-center"><span className="text-foreground text-lg">Loading Scribe's Archives...</span></div>}>
          <ProceduralTerrain 
            color1="hsl(35, 40%, 12%)" 
            color2="hsl(55, 45%, 18%)" 
            noiseConfig={terrainNoiseConfig}
            sparklesConfig={terrainSparklesConfig}
            />
        </Suspense>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-3" style={{ textShadow: '0 0 10px hsla(200, 60%, 60%,0.4)'}}>Insights & Articles</h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">Sharing knowledge and explorations in the world of technology.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {blogs.map((blog, index) => (
            <motion.article
              key={index}
              className="bg-card/90 backdrop-blur-lg rounded-xl overflow-hidden border border-border group cursor-pointer shadow-xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.12 + 0.15, ease: "easeOut" }}
              whileHover={{ y: -6, boxShadow: `0 14px 30px hsla(var(--primary), 0.3)` }}
            >
              <a href={blog.link} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative overflow-hidden h-52 sm:h-60">
                  <img  
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    alt={`Cover image for ${blog.title}`}
                    src="https://images.unsplash.com/photo-1504983875-d3b163aba9e6" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute top-4 right-4 p-2.5 bg-card/75 backdrop-blur-md rounded-full shadow-lg">
                    {blog.icon}
                  </div>
                </div>
                
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-4 leading-relaxed h-20 sm:h-24 overflow-y-auto scrollbar-thin">{blog.description}</p>
                  
                  <div
                    className="inline-flex items-center text-primary font-medium group-hover:text-primary/80 transition-colors duration-200 text-sm"
                  >
                    <span className="mr-1.5">Read More</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </a>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
        >
          <motion.a
            href="https://medium.com/@samparkbhol2005"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-primary to-pink-500 text-primary-foreground font-semibold rounded-lg hover:from-primary/90 hover:to-pink-500/90 transition-all duration-300 shadow-xl text-base transform hover:scale-105"
            whileHover={{ scale: 1.03, y: -2, boxShadow: '0 10px 22px hsla(var(--primary), 0.45)' }}
            whileTap={{ scale: 0.97 }}
          >
            View All Articles on Medium
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogsSection;