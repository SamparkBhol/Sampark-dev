import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Power, Palette, HelpCircle, FileText, Linkedin, Github, Mail, ChevronRight } from 'lucide-react';
import { gameStates, initialGameOutput, processGameCommandLogic } from '@/components/contact/gameLogic';
import { commandActions } from '@/components/contact/commands';
import TerminalOutput from '@/components/contact/TerminalOutput';
import TerminalInput from '@/components/contact/TerminalInput';
import TerminalHeader from '@/components/contact/TerminalHeader';
import ContactLinks from '@/components/contact/ContactLinks';
import ProceduralTerrain from '@/components/ProceduralTerrain';

const ContactSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [isOn, setIsOn] = useState(true);
  const [theme, setTheme] = useState('matrix');
  const terminalRef = useRef(null);
  
  const [gameState, setGameState] = useState(gameStates.START);
  const [playerName, setPlayerName] = useState('');
  const [playerHasKey, setPlayerHasKey] = useState(false);
  const [playerHasRope, setPlayerHasRope] = useState(false);

  const themes = {
    matrix: { bg: 'bg-black/90', text: 'text-green-400', prompt: 'text-green-300', border: 'border-green-700/50', terrainColor1: 'hsl(120, 70%, 8%)', terrainColor2: 'hsl(120, 60%, 15%)' },
    amber: { bg: 'bg-amber-950/90', text: 'text-amber-300', prompt: 'text-amber-200', border: 'border-amber-700/50', terrainColor1: 'hsl(30, 70%, 8%)', terrainColor2: 'hsl(40, 60%, 15%)' },
    cyber: { bg: 'bg-purple-950/90', text: 'text-cyan-400', prompt: 'text-cyan-300', border: 'border-cyan-700/50', terrainColor1: 'hsl(270, 70%, 8%)', terrainColor2: 'hsl(180, 60%, 15%)' },
    cobalt: { bg: 'bg-blue-950/90', text: 'text-blue-300', prompt: 'text-blue-200', border: 'border-blue-700/50', terrainColor1: 'hsl(220, 70%, 8%)', terrainColor2: 'hsl(240, 60%, 15%)' },
    forest: { bg: 'bg-green-950/90', text: 'text-lime-300', prompt: 'text-lime-200', border: 'border-lime-700/50', terrainColor1: 'hsl(100, 50%, 8%)', terrainColor2: 'hsl(90, 40%, 15%)' },
    ocean: { bg: 'bg-sky-950/90', text: 'text-teal-300', prompt: 'text-teal-200', border: 'border-teal-700/50', terrainColor1: 'hsl(190, 60%, 8%)', terrainColor2: 'hsl(180, 50%, 15%)' }
  };
  const currentTheme = themes[theme];

  const addOutputLine = (text, type = 'output') => {
    setOutput(prev => [...prev, { type, text }]);
  };
  
  const addMultipleOutputLines = (texts, type = 'output') => {
    texts.forEach(text => addOutputLine(text, type));
  };

  const initializeTerminal = (keepGameState = false) => {
    if (!keepGameState) {
      setOutput(initialGameOutput);
      setGameState(gameStates.START);
      setPlayerName('');
      setPlayerHasKey(false);
      setPlayerHasRope(false);
    } else {
      setOutput([]); // Clear screen but keep game state
      addOutputLine(`Terminal cleared. Game still in progress. Type 'look' or 'help game' for current status.`, 'system');
    }
  };

  useEffect(() => {
    if (!isOn) return;
    initializeTerminal();
  }, [isOn]); // Re-initialize when powered on.

  const processCommand = (fullInput) => {
    const lowerInput = fullInput.toLowerCase().trim();
    const parts = lowerInput.split(' ');
    const command = parts[0];
    const arg = parts.slice(1).join(' ');

    if (gameState !== gameStates.START && command !== 'exit' && command !== 'restart' && command !== 'clear' && command !== 'theme' && command !== 'poweroff' && command !== 'help' && !commandActions[command]) {
      processGameCommandLogic(
        lowerInput, 
        gameState, 
        setGameState, 
        addMultipleOutputLines, 
        addOutputLine, 
        setPlayerName, 
        playerName, 
        setPlayerHasKey, 
        playerHasKey,
        setPlayerHasRope,
        playerHasRope,
        setOutput
      );
    } else if (commandActions[command]) {
      commandActions[command]({ 
        arg, 
        addOutputLine, 
        addMultipleOutputLines, 
        setTheme, 
        themes, 
        currentThemeName: theme, 
        setOutput, 
        setIsOn,
        gameState,
        initializeTerminal,
        setGameState,
        playerName,
        playerHasKey,
        playerHasRope
      });
       if (command === 'start' && gameState === gameStates.START) {
         processGameCommandLogic(lowerInput, gameState, setGameState, addMultipleOutputLines, addOutputLine, setPlayerName, playerName, setPlayerHasKey, playerHasKey, setPlayerHasRope, playerHasRope, setOutput);
      }
    } else {
      addOutputLine(`Command not found: ${command}. Type "help".`, 'error');
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || !isOn) return;

    addOutputLine(input, 'input');
    processCommand(input);
    
    let nextPrompt = '$ ';
    if (gameState === gameStates.INTRODUCTION) nextPrompt = 'Enter your name: ';
    else if (gameState === gameStates.GAME_WIN || gameState === gameStates.GAME_OVER_FOREST || gameState === gameStates.GAME_OVER_GATE || gameState === gameStates.GAME_OVER_CHASM) nextPrompt = 'Restart/Exit: ';
    else if (gameState !== gameStates.START) nextPrompt = `${playerName}'s move: `;
    
    setOutput(prev => [...prev, { type: 'prompt', text: nextPrompt }]);
    setInput('');
  };

  const powerOn = () => {
    setIsOn(true);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const terrainNoiseConfig = { 
    noiseScale: 9.0,
    waveSpeed: 0.015,
    waveHeight: 0.07,
    mouseInfluence: 0.015,
    timeFactor: 0.15,
    detailFactor: 3.5
  };
  const terrainSparklesConfig = { 
    count: 25,
    scale: 7,
    size: 3,
    speed: 0.01,
    opacity: 0.12,
  };

  if (!isOn) {
    return (
      <section id="contact" className="py-20 relative overflow-hidden bg-background min-h-screen flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
        <div className="text-center relative z-10">
          <motion.div
            className="power-off bg-black rounded-lg p-10 sm:p-20 border border-gray-600"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="text-white text-xl sm:text-2xl mb-4 sm:mb-8">System Shutting Down...</div>
          </motion.div>
          
          <motion.button
            onClick={powerOn}
            className="mt-8 bg-green-600 hover:bg-green-500 text-white p-3 sm:p-4 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <Power className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 opacity-35">
          <Suspense fallback={<div className="absolute inset-0 bg-gray-950 animate-pulse flex items-center justify-center"><span className="text-foreground text-lg">Initializing Interface...</span></div>}>
             <ProceduralTerrain 
                color1={currentTheme.terrainColor1} 
                color2={currentTheme.terrainColor2}
                noiseConfig={terrainNoiseConfig}
                sparklesConfig={terrainSparklesConfig}
             />
          </Suspense>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold text-foreground mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground">Interactive terminal interface</p>
        </motion.div>

        <motion.div
          className={`relative terminal ${currentTheme.bg} rounded-lg overflow-hidden border-2 ${currentTheme.border} shadow-2xl backdrop-blur-sm`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <TerminalHeader 
            currentThemeText={currentTheme.text} 
            onThemeChange={() => commandActions.theme({ arg: null, addOutputLine, setTheme, themes, currentThemeName: theme })} 
            onPowerOff={() => commandActions.poweroff({ setIsOn, addOutputLine })} 
          />
          
          <TerminalOutput 
            terminalRef={terminalRef}
            output={output}
            currentTheme={currentTheme}
          />
          
          <TerminalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            currentThemePrompt={currentTheme.prompt}
            currentThemeText={currentTheme.text}
            promptText={
              gameState === gameStates.INTRODUCTION ? 'Enter your name: ' :
              (gameState === gameStates.GAME_WIN || gameState === gameStates.GAME_OVER_FOREST || gameState === gameStates.GAME_OVER_GATE || gameState === gameStates.GAME_OVER_CHASM) ? 'Restart/Exit: ' :
              (gameState !== gameStates.START ? `${playerName || 'Adventurer'}'s move: ` : '$ ')
            }
          />
        </motion.div>
        <ContactLinks />
      </div>
    </section>
  );
};

export default ContactSection;