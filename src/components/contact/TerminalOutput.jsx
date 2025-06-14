import React from 'react';

const TerminalOutput = ({ terminalRef, output, currentTheme }) => {
  return (
    <div 
      ref={terminalRef}
      className={`p-4 h-96 overflow-y-auto font-mono text-sm ${currentTheme.text}`}
    >
      {output.map((line, index) => {
        let content;
        const isLastLine = index === output.length - 1;

        switch(line.type) {
            case 'input':
                content = (
                    <div className="flex items-start">
                        <span className={`${currentTheme.prompt} mr-2 flex-shrink-0`}>$</span>
                        <span className={currentTheme.text}>{line.text}</span>
                    </div>
                );
                break;
            case 'prompt':
            case 'game_prompt':
                content = (
                    <div className={`flex items-start ${currentTheme.prompt}`}>
                        <span>{line.text}</span>
                        {isLastLine && <span className="typing-cursor-red ml-1 animate-pulse">|</span>}
                    </div>
                );
                break;
            case 'error':
                content = (
                    <div className="flex items-start text-red-400">
                        <span className="font-bold mr-2 flex-shrink-0">[ERR]</span>
                        <span>{line.text}</span>
                    </div>
                );
                break;
            case 'system':
                content = (
                    <div className="flex items-start text-gray-500 italic">
                        <span className="mr-2 flex-shrink-0">--</span>
                        <span>{line.text}</span>
                    </div>
                );
                break;
            case 'story':
                 content = (
                    <div className={`flex items-start ${currentTheme.text} opacity-90`}>
                        <span className="opacity-70 mr-2 flex-shrink-0">&gt;</span>
                        <span className="italic">{line.text}</span>
                    </div>
                );
                break;
            case 'matrix_rain':
                content = (
                    <div className={`flex items-start text-green-500 opacity-70 overflow-hidden whitespace-nowrap font-courier tracking-widest`}>
                        {line.text}
                    </div>
                );
                break;
            default: // 'output'
                content = (
                    <div className={`flex items-start ${currentTheme.text}`}>
                        <span className="opacity-70 mr-2 flex-shrink-0">&gt;</span>
                        <span>{line.text}</span>
                    </div>
                );
        }
        return <div key={index} className="whitespace-pre-wrap mb-1">{content}</div>;
      })}
    </div>
  );
};

export default TerminalOutput;