
import React, { useState } from 'react';
import { Sparkles, BrainCircuit, ChevronRight, MessageSquare, Info, Zap, CheckCircle, Upload, FileText, Trash2, AlignLeft } from 'lucide-react';
import { Concept, StudentProfile } from '../types';
import { getConceptExplanation } from '../services/geminiService';

interface ConceptCoachProps {
  student: StudentProfile;
  lang: string;
}

const ConceptCoach: React.FC<ConceptCoachProps> = ({ student, lang }) => {
  const [selectedConcept, setSelectedConcept] = useState<Concept>(student.concepts[1]);
  const [step, setStep] = useState(0);
  const [hints, setHints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [uploadedContext, setUploadedContext] = useState('');
  const [fileName, setFileName] = useState('');
  const [manualText, setManualText] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string || "Reference material text...";
        setUploadedContext(text);
        setManualText(text); // Sync to manual text area for preview/editing
      };
      reader.readAsText(file);
    }
  };

  const fetchStepwiseHelp = async () => {
    setLoading(true);
    const contextToUse = manualText || uploadedContext;
    const result = await getConceptExplanation(selectedConcept, lang, contextToUse);
    setExplanation(result || '');
    setLoading(false);
    setShowExplanation(true);
    // Simulate stepwise breakdown if not in original response
    setHints(["Break down the core structure.", "Analyze the examples from your reference material.", "Verify conceptual alignment."]);
  };

  const removeFile = () => {
    setFileName('');
    setUploadedContext('');
    setManualText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white border-4 border-slate-900 rounded-[50px] p-10 sketchy-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <BrainCircuit size={160} />
        </div>
        
        <div className="flex items-center gap-6 mb-10 relative z-10">
          <div className="w-16 h-16 bg-amber-400 border-4 border-slate-900 organic-shape flex items-center justify-center text-slate-900 sketchy-shadow">
            <Zap size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">CONCEPT COACH</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Focus:</span>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest underline underline-offset-4">{selectedConcept.name}</span>
            </div>
          </div>
        </div>

        {!showExplanation ? (
          <div className="space-y-8 relative z-10">
            <div className="p-8 bg-slate-50 border-4 border-slate-900 rounded-3xl sketchy-shadow flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white border-2 border-slate-900 organic-shape flex items-center justify-center mb-6 group cursor-pointer hover:rotate-6 transition-transform">
                <Info size={40} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">Knowledge Synthesis</h3>
              <p className="text-sm text-slate-500 font-medium max-w-sm mb-8">
                Paste your notes or upload a reference file for context-aware coaching.
              </p>

              <div className="w-full space-y-6 mb-8">
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2">
                    <AlignLeft size={14} /> Paste Your Notes
                  </label>
                  <textarea 
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Enter concept details, definitions, or tricky parts here..."
                    className="w-full h-32 p-4 bg-white border-2 border-slate-900 rounded-2xl text-sm font-medium outline-none focus:ring-4 ring-indigo-500/10 transition-all resize-none"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t-2 border-slate-200 border-dashed"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase text-slate-400">
                    <span className="px-3 bg-slate-50">OR UPLOAD</span>
                  </div>
                </div>

                {fileName ? (
                  <div className="flex items-center justify-between p-4 bg-teal-50 border-2 border-teal-600 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-teal-600" />
                      <span className="text-xs font-black text-teal-800 truncate max-w-[200px]">{fileName}</span>
                    </div>
                    <button onClick={removeFile} className="p-2 hover:bg-teal-200 rounded-lg transition-colors text-teal-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-4 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all group">
                    <Upload size={24} className="text-slate-400 mb-2 group-hover:text-teal-500 transition-colors" />
                    <span className="text-[10px] font-black uppercase text-slate-400">Upload Reference Material (PDF/TXT)</span>
                    <input type="file" className="hidden" accept=".pdf,.txt" onChange={handleFileUpload} />
                  </label>
                )}
              </div>

              <button 
                onClick={fetchStepwiseHelp}
                disabled={loading}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl"
              >
                {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Sparkles size={20} className="text-amber-400" />}
                {manualText || fileName ? "Coach with Context" : "Initialize Coach"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {student.concepts.slice(0, 4).map(c => (
                 <div 
                  key={c.id} 
                  onClick={() => setSelectedConcept(c)}
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedConcept.id === c.id ? 'border-slate-900 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-400'}`}
                 >
                    <h4 className="text-xs font-black text-slate-900 uppercase mb-1">{c.name}</h4>
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${c.mastery * 100}%` }} />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10 relative z-10">
            <div className="bg-white border-4 border-slate-900 rounded-3xl p-8 sketchy-shadow prose prose-slate max-w-none">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-4">
                <MessageSquare size={16} /> Tutor Insight {(fileName || manualText) && <span className="text-teal-600">(Ref: {fileName || 'Context Provided'})</span>}
              </div>
              <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {explanation}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" /> Mastery Checklist
              </h4>
              <div className="space-y-3">
                {hints.map((hint, idx) => (
                  <div 
                    key={idx} 
                    className={`p-6 border-2 border-slate-900 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${step >= idx ? 'bg-emerald-50' : 'bg-slate-50 opacity-50'}`}
                    onClick={() => setStep(idx)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg border-2 border-slate-900 flex items-center justify-center font-black text-sm ${step >= idx ? 'bg-emerald-400' : 'bg-white'}`}>
                        {idx + 1}
                      </div>
                      <span className="text-sm font-bold text-slate-800">{hint}</span>
                    </div>
                    {step > idx && <CheckCircle size={20} className="text-emerald-600" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t-2 border-slate-100">
               <button 
                onClick={() => { setShowExplanation(false); setFileName(''); setUploadedContext(''); setManualText(''); }}
                className="text-xs font-black text-slate-400 uppercase hover:text-slate-900 transition-colors"
               >
                Switch Topic
               </button>
               <button className="flex items-center gap-2 px-8 py-3 bg-teal-500 text-white rounded-xl border-2 border-slate-900 font-black text-xs uppercase tracking-widest sketchy-shadow hover:translate-y-[-2px] transition-all">
                Update Cognitive Twin <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptCoach;
