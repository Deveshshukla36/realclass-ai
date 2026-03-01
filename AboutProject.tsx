
import React, { useState } from 'react';
import { Info, X, Heart, Globe, Brain, Zap, Rocket, Hammer } from 'lucide-react';

const AboutProject: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-20 flex flex-col items-center">
      <button 
        onClick={() => setIsOpen(true)}
        className="group relative px-20 py-8 bg-white border-4 border-slate-900 rounded-[40px] sketchy-shadow hover:translate-y-[-10px] transition-all"
      >
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-100 border-4 border-slate-900 organic-shape flex items-center justify-center text-indigo-600 transition-transform group-hover:rotate-12 shadow-lg">
            <Info size={36} />
          </div>
          <div className="text-left">
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">About REAL CLASS AI</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">The AMD Slingshot Hackathon Edition</p>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-3xl bg-white border-4 border-slate-900 rounded-[50px] p-12 sketchy-shadow relative max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-2xl border-2 border-slate-900 transition-all"
            >
              <X size={24} />
            </button>
            
            <div className="space-y-12">
              <div className="text-center">
                 <div className="w-24 h-24 bg-teal-500 border-4 border-slate-900 organic-shape flex items-center justify-center text-white text-5xl font-black mx-auto mb-8 shadow-2xl floating">R</div>
                 <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">REAL CLASS AI</h2>
                 <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em] mt-4">AMD SLINGSHOT HACKATHON: HUMAN IMAGINATION BUILT WITH AI</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-bold text-slate-600 leading-relaxed">
                 <div className="space-y-4">
                   <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3"><Rocket size={20} className="text-indigo-500"/> The Slingshot Mission</h4>
                   <p>Created for the <strong>AMD Slingshot Hackathon</strong>, REAL CLASS AI is powered by <strong>Hack to Skill</strong>. It represents the intersection of human pedagogical imagination and cutting-edge generative intelligence.</p>
                 </div>
                 <div className="space-y-4">
                   <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3"><Hammer size={20} className="text-amber-500"/> Powering Skills</h4>
                   <p>By leveraging the Google Gemini API, we've built a system that doesn't just present data—it understands student cognition, predicts mastery decay, and issues verifiable AI-generated certifications.</p>
                 </div>
              </div>

              <div className="p-10 bg-teal-50 border-4 border-slate-900 rounded-[40px] sketchy-shadow">
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3"><Heart size={18} className="text-rose-500"/> Core Pillars</h4>
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-xs font-black text-slate-900 uppercase">
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-teal-500"/> AI Course Syllabi</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-teal-500"/> Verifiable AI Certificates</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-teal-500"/> Predictive Retention Engine</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-teal-500"/> Voice-Native Announcements</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-teal-500"/> Concept Coaching with PDF Context</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-teal-500"/> Integrity Guard Integrity Suite</li>
                 </ul>
              </div>

              <div className="text-center pt-8 border-t-4 border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 italic">"Human imagination build with AI and powered by hack to skill"</p>
                 <button 
                  onClick={() => setIsOpen(false)}
                  className="px-12 py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                 >
                   Return to Campus
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutProject;
