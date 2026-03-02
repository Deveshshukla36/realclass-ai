
import React, { useState } from 'react';
import { Sparkles, Brain, X } from 'lucide-react';

const NUGGETS = [
  "Dijkstra's algorithm was conceived by Edsger Dijkstra in 20 minutes while having coffee.",
  "Human brain capacity is estimated at 2.5 petabytes—enough for 3 million hours of TV.",
  "Lisbon is one of the oldest cities in Western Europe, predating London and Paris!",
  "Pomodoro technique uses 25-minute sprints because humans peak focus in that window.",
  "Spaced Repetition can increase memory retention by up to 200%.",
  "The best time to study tricky concepts is right before sleep for memory consolidation.",
  "Visualizing a problem as a physical path helps the hippocampus map abstract logic.",
  "Dynamic Programming is basically recursion with a sticky-note (memoization)."
];

const FunFactBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNugget, setCurrentNugget] = useState(0);

  const nextNugget = () => {
    setCurrentNugget((prev) => (prev + 1) % NUGGETS.length);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-72 bg-white border-4 border-slate-900 rounded-[32px] p-6 sketchy-shadow animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase text-teal-600 tracking-widest flex items-center gap-2">
              <Brain size={14} /> Revision Nugget
            </span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
              <X size={16} />
            </button>
          </div>
          <p className="text-sm font-bold text-slate-900 leading-relaxed italic mb-4">
            "{NUGGETS[currentNugget]}"
          </p>
          <button 
            onClick={nextNugget}
            className="w-full py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors"
          >
            Next Fact
          </button>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 bg-amber-400 border-4 border-slate-900 rounded-2xl flex items-center justify-center text-slate-900 sketchy-shadow transition-all ${isOpen ? 'rotate-12 translate-y-[-4px]' : 'hover:scale-110'}`}
      >
        <Sparkles size={32} className={isOpen ? 'animate-spin-slow' : ''} />
      </button>
    </div>
  );
};

export default FunFactBubble;
