import { gameStates, initialGameOutput, processGameCommandLogic } from '@/components/contact/gameLogic';

const techQuotes = [
  "The science of today is the technology of tomorrow. - Edward Teller",
  "Any sufficiently advanced technology is indistinguishable from magic. - Arthur C. Clarke",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "The Web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past. - Tim Berners-Lee",
  "It's not a faith in technology. It's faith in people. - Steve Jobs",
  "Code is like humor. When you have to explain it, it’s bad. – Cory House",
  "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life. - Bill Gates"
];

const displayMatrixRain = (addOutputLine, duration = 3000) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+[]{}|;':\",./<>?";
  const lines = 10; 
  const intervalId = setInterval(() => {
    let rainLine = "";
    for (let i = 0; i < 60; i++) { 
      rainLine += chars[Math.floor(Math.random() * chars.length)] + " ";
    }
    addOutputLine(rainLine, 'matrix_rain'); 
  }, 100);

  setTimeout(() => {
    clearInterval(intervalId);
    addOutputLine("Matrix effect complete.", 'system');
  }, duration);
};

export const commandActions = {
  help: ({ addMultipleOutputLines, gameState }) => {
    const baseCommands = [
      'Available commands:',
      '  help          - Show this help message',
      '  start         - Begin the interactive story game',
      '  contact       - Contact information',
      '  socials       - View GitHub/LinkedIn profiles',
      '  theme <name>  - Change terminal theme (matrix, amber, cyber, cobalt, forest, ocean)',
      '  clear         - Clear terminal',
      '  poweroff      - Shutdown terminal',
      '  quote         - Display a random tech quote',
      '  matrix        - Display a Matrix digital rain effect',
      '  date          - Show the current date',
      '  calc <expr>   - Simple calculator (e.g. calc 2 + 2)',
    ];
    const gameCommands = [
      '',
      'Game specific commands (when in game):',
      '  look          - Describe your surroundings',
      '  inventory     - Check your items',
      '  help game     - Show detailed game commands & current objective',
      '  exit          - Exit game mode',
      '  restart       - Restart the game'
    ];
    if (gameState !== gameStates.START) {
      addMultipleOutputLines([...baseCommands, ...gameCommands]);
    } else {
      addMultipleOutputLines(baseCommands);
    }
  },
  'help game': ({ addOutputLine, gameState, playerName, playerHasKey, playerHasRope }) => {
    if (gameState === gameStates.START) {
      addOutputLine('Game not started. Type "start" to begin.', 'error');
      return;
    }
    addOutputLine('--- Game Help ---', 'system');
    addOutputLine('Use simple commands like "go north", "take item", "use key".', 'system');
    addOutputLine('Common actions: look, take, use, talk, open, north, south, east, west, forest, road, climb, search, pull, inspect.', 'system');
    addOutputLine('Type "inventory" to see your items.', 'system');
    addOutputLine('Type "look" to get a description of your current location.', 'system');
    
    let objective = "Objective: Unknown. Type 'look'.";
    switch(gameState) {
        case gameStates.INTRODUCTION: objective = `Objective: Enter your name, ${playerName || 'Adventurer'}.`; break;
        case gameStates.CHOICE_PATH: objective = `Objective: Choose a path - "forest" or "road".`; break;
        case gameStates.FOREST_ENCOUNTER: objective = `Objective: Deal with the gnarled tree - "climb", "search", or "use item_name".`; break;
        case gameStates.CASTLE_GATE: objective = `Objective: Open the castle gate - "pull", "inspect", or "use key".`; break;
        case gameStates.CHASM_CROSSING: objective = `Objective: Cross the chasm - "jump", "search", or "use item_name".`; break;
        case gameStates.TREASURE_ROOM: objective = `Objective: "take" the artifact.`; break;
        default: break;
    }
    addOutputLine(objective, 'story');
  },
  contact: ({ addMultipleOutputLines }) => {
    addMultipleOutputLines([
      'Contact Information:',
      '📧 Email: sampark.bhol@example.com',
      '🔗 Or find direct links below the terminal.'
    ]);
  },
  socials: ({ addMultipleOutputLines }) => {
    addMultipleOutputLines([
      'Find my profiles:',
      '🐙 GitHub: Use the button below or visit github.com/SamparkBhol',
      '🔗 LinkedIn: Use the button below or visit linkedin.com/in/samparkbhol',
    ]);
  },
  theme: ({ arg, addOutputLine, setTheme, themes, currentThemeName }) => {
    const themeNames = Object.keys(themes);
    if (arg && themes[arg]) {
      setTheme(arg);
      addOutputLine(`Theme changed to: ${arg}`);
    } else if (arg) {
      addOutputLine(`Theme "${arg}" not found. Available: ${themeNames.join(', ')}`, 'error');
    } else {
      const currentIndex = themeNames.indexOf(currentThemeName);
      const nextTheme = themeNames[(currentIndex + 1) % themeNames.length];
      setTheme(nextTheme);
      addOutputLine(`Theme changed to: ${nextTheme}. Try "theme <name>" for specific theme.`);
    }
  },
  clear: ({ setOutput, addOutputLine, gameState, initializeTerminal }) => {
    initializeTerminal(gameState !== gameStates.START);
  },
  poweroff: ({ setIsOn, addOutputLine }) => {
    addOutputLine('System shutting down...', 'system');
    setTimeout(() => setIsOn(false), 500); 
  },
  start: ({ gameState, addOutputLine }) => {
    if (gameState === gameStates.START) {
      // Game logic will be handled by processGameCommandLogic
    } else {
      addOutputLine('Game already in progress. Type "restart" to start over, or "exit" to leave game mode.', 'error');
    }
  },
  restart: ({ initializeTerminal, addOutputLine }) => { // Added addOutputLine here
    initializeTerminal(false);
    addOutputLine('Game restarting...', 'system');
  },
  exit: ({ initializeTerminal, addOutputLine }) => { 
    addOutputLine('Exiting story mode. Type "help" for standard commands.', 'system');
    initializeTerminal(false); 
  },
  quote: ({ addOutputLine }) => {
    const randomQuote = techQuotes[Math.floor(Math.random() * techQuotes.length)];
    addOutputLine(`"${randomQuote}"`, 'story');
  },
  matrix: ({ addOutputLine }) => {
    addOutputLine("Initiating Matrix digital rain sequence...", 'system');
    displayMatrixRain(addOutputLine);
  },
  date: ({ addOutputLine }) => {
    addOutputLine(new Date().toString(), 'system');
  },
  calc: ({ arg, addOutputLine }) => {
    if (!arg) {
      addOutputLine('Usage: calc <expression>. E.g., calc 2 + 2 * 3', 'error');
      return;
    }
    try {
      const sanitizedArg = arg.replace(/[^-()\d/*+.]/g, '');
      // eslint-disable-next-line no-eval
      const result = eval(sanitizedArg);
      addOutputLine(`Result: ${result}`, 'output');
    } catch (e) {
      addOutputLine('Invalid expression or calculation error.', 'error');
    }
  },
  look: ({ gameState, addOutputLine, processGameCommandLogic, setGameState, setPlayerName, playerName, setPlayerHasKey, playerHasKey, setPlayerHasRope, playerHasRope, setOutput}) => {
    if (gameState === gameStates.START) {
      addOutputLine('You are in the main terminal. Type "start" to begin the game.', 'system');
      return;
    }
    processGameCommandLogic("look", gameState, setGameState, (msgs, type) => msgs.forEach(m => addOutputLine(m,type)), addOutputLine, setPlayerName, playerName, setPlayerHasKey, playerHasKey, setPlayerHasRope, playerHasRope, setOutput);
  },
  inventory: ({ addOutputLine, playerHasKey, playerHasRope }) => {
    addOutputLine('You check your belongings:', 'system');
    if (!playerHasKey && !playerHasRope) {
      addOutputLine('  - Empty pockets.', 'story');
    }
    if (playerHasKey) {
      addOutputLine('  - An ornate key.', 'story');
    }
    if (playerHasRope) {
      addOutputLine('  - A sturdy rope.', 'story');
    }
  }
};