
import React from 'react';
import { motion } from 'framer-motion';
import { Power, Terminal, Palette } from 'lucide-react';

const TerminalHeader = ({ currentThemeText, onThemeChange, onPowerOff }) => {
  return (
    <div className="terminal-header bg-black/50 px-4 py-3 flex items-center justify-between border-b-2 border-current">
      <div className="flex items-center space-x-2">
        <div className="terminal-dot red"></div>
        <div className="terminal-dot yellow"></div>
        <div className="terminal-dot green"></div>
      </div>
      <div className={`flex items-center space-x-2 ${currentThemeText}`}>
        <Terminal className="w-4 h-4" />
        <span className="text-sm">Sampark Terminal</span>
      </div>
      <div className="flex items-center space-x-2">
        <motion.button
          onClick={onThemeChange}
          className={`${currentThemeText} hover:opacity-70 p-1`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Change Theme"
        >
          <Palette className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={onPowerOff}
          className="text-red-500 hover:text-red-400 p-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Power Off"
        >
          <Power className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default TerminalHeader;
