
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Linkedin, Github, Mail } from 'lucide-react';

const ContactLinks = () => {
  const links = [
    { href: "https://drive.google.com/file/d/1Chgh7Nx_Tza_1JdMCtlrUAwDbW_sQTvF/view?usp=sharing", icon: FileText, label: "Resume", style: "bg-primary/10 hover:bg-primary/20 text-primary border-primary/30" },
    { href: "https://github.com/samparkbhol", icon: Github, label: "GitHub", style: "bg-gray-700/20 hover:bg-gray-600/30 text-gray-300 border-gray-600/50" },
    { href: "www.linkedin.com/in/sampark-bhol-118560251", icon: Linkedin, label: "LinkedIn", style: "bg-blue-600/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/50" },
    { href: "mailto:samparkaccess1234@gmail.com", icon: Mail, label: "Email", style: "bg-red-600/20 hover:bg-red-500/30 text-red-300 border-red-500/50" },
  ];

  return (
    <motion.div
      className="mt-10 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="flex flex-wrap justify-center gap-4">
        {links.map(link => (
          <motion.a 
            key={link.label}
            href={link.href} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${link.style}`}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <link.icon size={18} /> <span>{link.label}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default ContactLinks;
