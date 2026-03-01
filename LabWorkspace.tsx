
import React, { useState, useEffect } from 'react';
import { Terminal, Code, FileText, Layout, Play, Save, CheckCircle, RefreshCw, X, Plus, Brackets } from 'lucide-react';
import { Lab, User } from '../types';
import { Language, translations } from '../translations';
import { SAMPLE_LABS } from '../constants';

const LabWorkspace: React.FC<{ user: User; lang: Language }> = ({ user, lang }) => {
  const t = translations[lang];
  const [labs, setLabs] = useState<Lab[]>(() => {
    const saved = localStorage.getItem('ct_labs');
    return saved ? JSON.parse(saved) : SAMPLE_LABS;
  });
  const [activeLab, setActiveLab] = useState<Lab | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // For Teacher Create Lab
  const [newLab, setNewLab] = useState<Partial<Lab>>({ title: '', type: 'code', language: 'python', prompt: '' });

  useEffect(() => {
    if (activeLab) {
      setCode(activeLab.template || '');
      setOutput('');
    }
  }, [activeLab]);

  const runCode = () => {
    setRunning(true);
    setTimeout(() => {
      if (activeLab?.language === 'python') {
        setOutput(">>> Executing Python 3.11 Interpreter...\n>>> Found 1000 items.\n>>> Sorting complete.\n>>> Time: 0.002s\n>>> Output: [3, 9, 10, 27, 38, 43, 82]");
      } else if (activeLab?.language === 'cpp') {
        setOutput(">>> clang++ main.cpp -o main\n>>> ./main\n>>> List Initialized...\n>>> Node(0x7ffd) created.\n>>> Process exited with code 0.");
      } else if (activeLab?.language === 'java') {
        setOutput(">>> javac Database.java\n>>> java Main\n>>> Singleton instance created at 0x4f12\n>>> Connection pool initialized.");
      } else {
        setOutput(">>> Natural Language Processing Complete.\n>>> Content depth score: 88%\n>>> Grammatical accuracy: 94%\n>>> Feedback: Strong argument structure found.");
      }
      setRunning(false);
    }, 1200);
  };

  const handleCreateLab = () => {
    if (!newLab.title) return;
    const lab: Lab = {
      ...newLab as Lab,
      id: Math.random().toString(36).substr(2, 9),
      teacherId: user.id
    };
    const updated = [lab, ...labs];
    setLabs(updated);
    localStorage.setItem('ct_labs', JSON.stringify(updated));
    setShowCreate(false);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="bg-white border-4 border-slate-900 rounded-[50px] p-10 sketchy-shadow flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 border-4 border-slate-900 organic-shape flex items-center justify-center text-white shadow-xl">
            <Terminal size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{t.lab_title}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{t.lab_desc}</p>
          </div>
        </div>
        {user.role === 'teacher' && (
          <button onClick={() => setShowCreate(true)} className="px-8 py-4 bg-teal-500 text-white border-4 border-slate-900 rounded-2xl font-black uppercase text-xs flex items-center gap-2 sketchy-shadow">
            <Plus size={18} /> Design New Lab
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Lab List */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4">Available Lab Instances</h3>
          <div className="space-y-3">
            {labs.map(lab => (
              <div 
                key={lab.id} 
                onClick={() => setActiveLab(lab)}
                className={`p-6 border-4 border-slate-900 rounded-3xl cursor-pointer transition-all ${activeLab?.id === lab.id ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {lab.type === 'code' ? <Brackets size={18} /> : <FileText size={18} />}
                  <h4 className="font-black uppercase text-sm tracking-tighter truncate">{lab.title}</h4>
                </div>
                <div className="text-[8px] font-black uppercase tracking-widest opacity-60">
                  {lab.type === 'code' ? `${lab.language?.toUpperCase()} RUNTIME` : 'DOCUMENTATION TASK'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-9">
          {activeLab ? (
            <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
              <div className="bg-white border-4 border-slate-900 rounded-[40px] p-8 sketchy-shadow overflow-hidden">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-black uppercase tracking-tighter">{activeLab.title}</h3>
                   <div className="flex items-center gap-4">
                      {activeLab.type === 'code' && (
                        <button 
                          onClick={runCode}
                          disabled={running}
                          className="px-6 py-2 bg-slate-900 text-white border-2 border-slate-900 rounded-xl font-black uppercase text-[10px] flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50"
                        >
                          {running ? <RefreshCw className="animate-spin" size={14}/> : <Play size={14}/>} {t.compile}
                        </button>
                      )}
                      <button className="px-6 py-2 bg-teal-500 text-white border-2 border-slate-900 rounded-xl font-black uppercase text-[10px] flex items-center gap-2 sketchy-shadow">
                        <CheckCircle size={14}/> {t.submit}
                      </button>
                   </div>
                 </div>
                 
                 <div className="p-5 bg-teal-50 border-2 border-slate-900 rounded-2xl mb-8">
                    <p className="text-xs font-bold text-teal-900 italic">Task: {activeLab.prompt}</p>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                   <div className="lg:col-span-8">
                      <div className="relative border-4 border-slate-900 rounded-3xl overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 z-10 opacity-20 group-hover:opacity-100 transition-opacity">
                           <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">{activeLab.language || 'Text'} Editor</span>
                        </div>
                        <textarea 
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          spellCheck={false}
                          className="w-full h-[500px] p-10 bg-[#0f172a] text-teal-300 font-mono text-sm outline-none resize-none leading-relaxed"
                        />
                      </div>
                   </div>
                   <div className="lg:col-span-4 flex flex-col">
                      <div className="flex-1 bg-slate-100 border-4 border-slate-900 rounded-3xl p-8 font-mono text-xs overflow-y-auto max-h-[500px] shadow-inner">
                         <div className="text-slate-400 uppercase font-black mb-6 flex items-center gap-2">
                           <Terminal size={12} /> Standard Output
                         </div>
                         <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                           {output || ">>> IO STREAM READY\n>>> Waiting for compiler..."}
                         </div>
                      </div>
                   </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-white border-4 border-dashed border-slate-200 rounded-[50px] flex flex-col items-center justify-center p-20 text-center">
               <div className="w-24 h-24 bg-slate-50 border-4 border-slate-200 organic-shape flex items-center justify-center text-slate-200 mb-6">
                 <Terminal size={48} />
               </div>
               <h3 className="text-2xl font-black uppercase text-slate-300">Choose a Lab Runtime to Initialize</h3>
            </div>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white border-4 border-slate-900 rounded-[50px] p-10 sketchy-shadow relative">
             <div className="flex justify-between mb-8">
               <h3 className="text-2xl font-black uppercase">Lab Architect</h3>
               <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={24}/></button>
             </div>
             <div className="space-y-6">
                <input 
                  placeholder="Lab Module Title" 
                  className="w-full p-4 border-2 border-slate-900 rounded-xl font-bold uppercase"
                  onChange={e => setNewLab({...newLab, title: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="w-full p-4 border-2 border-slate-900 rounded-xl font-black uppercase text-xs"
                    onChange={e => setNewLab({...newLab, type: e.target.value as any})}
                  >
                    <option value="code">Coding Lab</option>
                    <option value="essay">Report Lab</option>
                  </select>
                  {newLab.type === 'code' && (
                    <select 
                      className="w-full p-4 border-2 border-slate-900 rounded-xl font-black uppercase text-xs"
                      onChange={e => setNewLab({...newLab, language: e.target.value as any})}
                    >
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                  )}
                </div>
                <textarea 
                  placeholder="Technical prompt or challenge requirements..." 
                  className="w-full h-32 p-4 border-2 border-slate-900 rounded-xl font-bold text-sm"
                  onChange={e => setNewLab({...newLab, prompt: e.target.value})}
                />
                <button onClick={handleCreateLab} className="w-full py-4 bg-teal-500 text-white border-4 border-slate-900 rounded-2xl font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all">Deploy Lab Module</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabWorkspace;
