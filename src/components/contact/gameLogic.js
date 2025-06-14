export const gameStates = {
  START: 'START',
  INTRODUCTION: 'INTRODUCTION',
  CHOICE_PATH: 'CHOICE_PATH',
  FOREST_ENCOUNTER: 'FOREST_ENCOUNTER',
  CASTLE_GATE: 'CASTLE_GATE',
  CHASM_CROSSING: 'CHASM_CROSSING',
  TREASURE_ROOM: 'TREASURE_ROOM',
  GAME_OVER_FOREST: 'GAME_OVER_FOREST',
  GAME_OVER_GATE: 'GAME_OVER_GATE',
  GAME_OVER_CHASM: 'GAME_OVER_CHASM',
  GAME_WIN: 'GAME_WIN',
};

export const initialGameOutput = [
  { type: 'system', text: 'Sampark Terminal v3.0.0 (Story Mode)' },
  { type: 'system', text: 'Type "start" to begin your adventure or "help" for other commands.' },
  { type: 'prompt', text: '$ ' }
];

const describeLocation = (gameState, addOutputs, playerHasKey, playerHasRope) => {
  switch(gameState) {
    case gameStates.INTRODUCTION:
      addOutputs(['You are at the edge of the Whispering Woods. A crumbling scroll lies nearby.', 'What is your name, hero?'], 'story');
      break;
    case gameStates.CHOICE_PATH:
      addOutputs(['Two paths diverge before you: the dark Forest and the old Road to the Castle.'], 'story');
      break;
    case gameStates.FOREST_ENCOUNTER:
      addOutputs(['You are deep in the shadowy forest. A gnarled tree blocks your path.', playerHasRope ? 'You have a rope.' : 'You see some sturdy vines nearby.'], 'story');
      break;
    case gameStates.CASTLE_GATE:
      addOutputs(['You stand before the imposing gates of Castle Rendarr. A rusty lever is visible.', playerHasKey ? 'You have an ornate key that might fit the gate.' : 'You notice a keyhole.'], 'story');
      break;
    case gameStates.CHASM_CROSSING:
       addOutputs(['A wide, dark chasm blocks your path inside the castle. It looks too far to jump.', playerHasRope ? 'You have a rope that might be useful.' : 'There\'s a sturdy-looking beam overhead, just out of reach.'], 'story');
      break;
    case gameStates.TREASURE_ROOM:
      addOutputs(['You are in a grand hall. The Sunstone of Eldoria rests on a pedestal!'], 'story');
      break;
    default:
      addOutputs(['You look around, but your location is unclear.'], 'story');
  }
};


export const processGameCommandLogic = (cmd, currentGameState, setGameState, addOutputs, addOutput, setPlayerName, playerName, setPlayerHasKey, playerHasKey, setPlayerHasRope, playerHasRope, setOutput) => {
  cmd = cmd.toLowerCase().trim();

  if (cmd === 'look') {
    describeLocation(currentGameState, addOutputs, playerHasKey, playerHasRope);
    return;
  }

  switch (currentGameState) {
    case gameStates.START:
      if (cmd === 'start') {
        setGameState(gameStates.INTRODUCTION);
        addOutputs([
          'The air grows cold. A chilling wind whispers through the skeletal branches of the Whispering Woods.',
          'Before you, a tattered scroll, clutched in a skeletal hand, flutters precariously.',
          'It speaks of the Sunstone of Eldoria, an artifact of immense power, hidden within the accursed Castle Rendarr.',
          'Many have sought it. None have returned.',
          'What name shall the bards sing of, should you survive, brave adventurer?',
        ], 'story');
        setOutput(prev => [...prev.filter(line => line.type !== 'prompt'), {type: 'prompt', text: 'Enter your name: '}]);
      } else {
        addOutput('Type "start" to begin your perilous journey.', 'error');
      }
      break;
    
    case gameStates.INTRODUCTION:
      const formattedPlayerName = cmd.charAt(0).toUpperCase() + cmd.slice(1);
      setPlayerName(formattedPlayerName);
      setGameState(gameStates.CHOICE_PATH);
      addOutputs([
        `Welcome, ${formattedPlayerName}. Your courage is noted, though perhaps misplaced.`,
        'The path to Castle Rendarr is twofold, each promising its own despair:',
        '1. The Forest Path: Through the gnarled heart of the Whispering Woods, where shadows dance and sanity frays (type "forest").',
        '2. The Old Road: A supposedly direct route, yet suspiciously untouched, leading straight to the Castle Gate (type "road").',
        'Choose your poison.',
      ], 'story');
      break;

    case gameStates.CHOICE_PATH:
      if (cmd === 'forest') {
        setGameState(gameStates.FOREST_ENCOUNTER);
        addOutputs([
          'You plunge into the oppressive gloom of the forest. Twisted trees leer like ancient sentinels.',
          'Sunlight is a forgotten memory here. An unnatural silence hangs heavy, broken only by the snap of a twig underfoot... or was it something else?',
          'Ahead, a colossal, gnarled tree, its branches like skeletal arms, blocks your way. It seems to pulse with a faint, sickly light.',
          'You could try to "climb" its treacherous bark, "search" for a passage around its base, or perhaps there is another way if you have the right tool ("use item_name").',
        ], 'story');
      } else if (cmd === 'road') {
        setGameState(gameStates.CHASM_CROSSING); // Changed to lead to chasm first
        addOutputs([
          'The Old Road stretches before you, unnervingly clear of debris. The air is stale, carrying the scent of decay and ancient stone.',
          'You soon find yourself inside a crumbling antechamber of the castle. The main gate must be further in.',
          'A gaping chasm splits the floor of this chamber, its depths lost in shadow. A faint breeze rises from it, carrying a chilling moan.',
          'It is too wide to "jump". Perhaps you can "search" for another way or "use item_name" if you have something suitable.',
        ], 'story');
      } else {
        addOutput('Hesitation can be fatal. Type "forest" or "road".', 'error');
      }
      break;
    
    case gameStates.FOREST_ENCOUNTER:
      if (cmd === 'climb') {
        setGameState(gameStates.GAME_OVER_FOREST);
        addOutputs([
          'You attempt to climb the monstrous tree. Its bark is slick with an unnatural ichor.',
          'A branch, thicker than your torso, suddenly animates, swatting you to the ground with bone-jarring force.',
          'GAME OVER. The Whispering Woods guards its secrets jealously.',
          'Type "restart" if you dare.',
        ], 'story');
      } else if (cmd === 'search') {
        addOutputs([
          'You cautiously search around the base of the malevolent tree.',
          'Amongst the gnarled roots, you find a coil of surprisingly sturdy Rope, seemingly dropped by a previous unfortunate soul.',
          'You also uncover a narrow, almost hidden path winding deeper into the woods.',
        ], 'story');
        setPlayerHasRope(true);
        addOutput('You take the rope. The path leads you further. You eventually emerge near the Castle Gate.', 'system');
        setGameState(gameStates.CASTLE_GATE);
        describeLocation(gameStates.CASTLE_GATE, addOutputs, playerHasKey, playerHasRope);

      } else if (cmd === 'use rope' && playerHasRope) {
         addOutput('You have a rope, but there is nothing here to use it on effectively.', 'story');
      }
      else {
        addOutput('The tree seems to mock your indecision. "climb", "search", or "use item_name".', 'error');
      }
      break;

    case gameStates.CHASM_CROSSING:
      if (cmd === 'jump') {
        setGameState(gameStates.GAME_OVER_CHASM);
        addOutputs([
          'Driven by desperation, you attempt the impossible jump. For a moment, you are airborne... then gravity reclaims you.',
          'You plummet into the darkness, your scream swallowed by the abyss.',
          'GAME OVER. Some gaps are not meant to be crossed.',
          'Type "restart".',
        ], 'story');
      } else if (cmd === 'search') {
          addOutputs([
            'You scan the edges of the chasm. The stonework is old and crumbling.',
            'You find nothing to aid your crossing here, but notice a glint of metal near a loose stone on the far side.',
          ], 'story');
      } else if (cmd === 'use rope' && playerHasRope) {
          addOutputs([
            'You skillfully fashion a makeshift grappling hook with a loose stone and your sturdy rope.',
            'With a mighty heave, you toss it across. It catches on a protruding gargoyle!',
            'You carefully cross the chasm, the rope groaning under your weight.',
          ], 'story');
          addOutput('You have successfully crossed the chasm. The path leads to the Castle Gate.', 'system');
          setGameState(gameStates.CASTLE_GATE);
          describeLocation(gameStates.CASTLE_GATE, addOutputs, playerHasKey, playerHasRope);
      } else if (cmd === 'use rope' && !playerHasRope) {
          addOutput('You need a rope to attempt that.', 'story');
      }
      else {
        addOutput('The chasm yawns before you. "jump", "search", or "use item_name".', 'error');
      }
      break;

    case gameStates.CASTLE_GATE:
      if (cmd === 'pull') {
        setGameState(gameStates.GAME_OVER_GATE);
        addOutputs([
          'You grasp the rusty lever and pull with all your might. A grating sound echoes, followed by a sharp click.',
          'The ground beneath your feet vanishes! A trapdoor swings open, and you fall into a pit lined with cruel spikes.',
          'GAME OVER. Castle Rendarr does not welcome guests kindly.',
          'Type "restart" to face your doom again.',
        ], 'story');
      } else if (cmd === 'inspect') {
         addOutputs([
          'The gate is forged from black, unyielding iron, etched with unsettling runes.',
          'A prominent keyhole, shaped like a coiled serpent, is set beside the lever.',
          'The gate seems impervious to brute force.',
        ], 'story');
      } else if (cmd === 'use key' && playerHasKey) {
        setGameState(gameStates.TREASURE_ROOM);
        addOutputs([
          'The ornate key, cold to the touch, slides into the serpent-shaped keyhole.',
          'With a deep groan of protesting metal, the massive gates swing inward, revealing the heart of Castle Rendarr.',
          'A vast, dust-filled hall stretches before you. At its center, on a obsidian pedestal, bathed in an eerie light, lies the Sunstone of Eldoria!',
          'Its glow pulses with an almost malevolent power.',
          'Do you dare "take" the artifact?',
        ], 'story');
      } else if (cmd === 'use key' && !playerHasKey) {
        if (Math.random() < 0.3) { // Chance to find key if inspecting gate first
            setPlayerHasKey(true);
            addOutputs([
                'While inspecting the gate, you notice a loose stone near the keyhole.',
                'Prying it open, you find a hidden Ornate Key!',
                'You take the key.',
            ], 'story');
        } else {
            addOutput('You have no key to use. The gate remains sealed.', 'story');
        }
      } else {
        addOutput('The silent gate awaits your decision. "pull", "inspect", or "use key".', 'error');
      }
      break;

    case gameStates.TREASURE_ROOM:
      if (cmd === 'take') {
        setGameState(gameStates.GAME_WIN);
        addOutputs([
          `With trembling hands, ${playerName}, you reach out and grasp the Sunstone of Eldoria.`,
          'A blinding light erupts, then subsides, leaving you bathed in a warm, empowering glow. The castle around you seems to sigh, its curse lifted.',
          'You have succeeded where countless others have failed!',
          'Your legend is forged in triumph!',
          'YOU WIN!',
          'Type "restart" to relive your glory or "exit" game mode.',
        ], 'story');
      } else {
        addOutput('The artifact hums with power. Only one action seems appropriate: "take".', 'error');
      }
      break;
    
    case gameStates.GAME_OVER_FOREST:
    case gameStates.GAME_OVER_GATE:
    case gameStates.GAME_OVER_CHASM:
    case gameStates.GAME_WIN:
      if (cmd === 'restart') {
        setGameState(gameStates.START);
        setPlayerName('');
        setPlayerHasKey(false);
        setPlayerHasRope(false);
        setOutput(initialGameOutput);
      } else if (cmd === 'exit') {
          addOutput('Exiting story mode. The mortal realm awaits.', 'system');
          setGameState(gameStates.START);
          setPlayerName('');
          setPlayerHasKey(false);
          setPlayerHasRope(false);
          setOutput(prev => initialGameOutput.slice(0,2).concat(prev.filter(line => line.type === 'prompt').slice(-1) || {type: 'prompt', text: '$ '}));
      } else {
        addOutput('Your adventure has concluded. Type "restart" or "exit".', 'error');
      }
      break;
    default:
      addOutput('A ripple in the fabric of fate. Something is amiss. Please type "restart".', 'error');
      break;
  }
};