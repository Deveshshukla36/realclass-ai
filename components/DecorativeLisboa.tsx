
import React from 'react';

const DecorativeLisboa: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-teal-100/30 organic-shape blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-coral-100/30 organic-shape blur-3xl animate-pulse" />

      {/* Ferry Boat */}
      <div className="absolute bottom-[15%] left-[5%] w-64 h-20 animate-bounce" style={{ animationDuration: '8s' }}>
        <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60">
          <path d="M10 40H190L170 60H30L10 40Z" fill="#0f172a" />
          <path d="M30 20H170V40H30V20Z" fill="white" stroke="#0f172a" strokeWidth="2" />
          <path d="M120 10H140V20H120V10Z" fill="#fb7185" stroke="#0f172a" strokeWidth="2" />
          <rect x="50" y="25" width="20" height="10" fill="#fbbf24" stroke="#0f172a" strokeWidth="1" />
        </svg>
      </div>

      {/* Pointing Hand Element (From Images) */}
      <div className="absolute top-[20%] right-[-5%] w-80 h-80 opacity-20 rotate-[140deg] floating">
         <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M100 20 C 60 20, 40 60, 40 100 C 40 140, 60 180, 100 180 L 180 140 L 180 60 Z" fill="#fb7185" />
            <rect x="80" y="20" width="10" height="100" fill="#0f172a" rx="5" />
            <circle cx="100" cy="20" r="15" fill="#fb7185" stroke="#0f172a" strokeWidth="4" />
         </svg>
      </div>

      {/* Bridge Element */}
      <div className="absolute bottom-[20%] right-[-10%] w-[800px] h-[300px] opacity-20">
        <svg viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="100" y="50" width="8" height="150" fill="#fb7185" />
          <rect x="400" y="50" width="8" height="150" fill="#fb7185" />
          <path d="M0 80 Q 250 180 600 80" stroke="#fb7185" strokeWidth="12" fill="none" />
          <path d="M0 90 Q 250 190 600 90" stroke="#fb7185" strokeWidth="4" fill="none" opacity="0.5" />
        </svg>
      </div>

      {/* Floating Elements (Paper Planes/Birds) */}
      <div className="absolute top-[30%] left-[20%] animate-pulse" style={{ animationDelay: '2s' }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-teal-500 opacity-40">
           <path d="M2 20 L 38 2 L 18 38 L 18 22 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute top-[55%] right-[25%] animate-pulse" style={{ animationDelay: '4s' }}>
        <svg width="30" height="30" viewBox="0 0 40 40" fill="none" className="text-coral-500 opacity-40">
           <path d="M2 20 L 38 2 L 18 38 L 18 22 Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
};

export default DecorativeLisboa;
