
import React from 'react';

const TerminalInput = ({ input, setInput, handleSubmit, currentThemePrompt, currentThemeText, promptText }) => {
  return (
    <form onSubmit={handleSubmit} className={`border-t-2 ${currentThemePrompt.split(' ')[0].replace('text-', 'border-')} p-4`}>
      <div className="flex items-center space-x-2">
        <span className={`${currentThemePrompt} font-mono text-sm`}>
          {promptText}
        </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`flex-1 bg-transparent ${currentThemeText} font-mono text-sm outline-none placeholder-${currentThemeText.split(' ')[0].replace('text-','placeholder-')}/50`}
          placeholder="Type a command..."
          autoFocus
        />
      </div>
    </form>
  );
};

export default TerminalInput;
