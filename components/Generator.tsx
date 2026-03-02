
import React, { useState } from 'react';
import { Wand2, Sparkles, Plus, Zap, CheckCircle, Trash2, Calendar, FileText, ChevronRight } from 'lucide-react';
import { generateAIExam } from '../services/geminiService';
import { Exam, Question } from '../types';
import { Language, translations } from '../translations';

interface GeneratorProps {
  onPublish: (exam: Exam) => void;
  exams: Exam[];
  lang: Language;
}

const Generator: React.FC<GeneratorProps> = ({ onPublish, exams, lang }) => {
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const t = translations[lang];

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    const result = await generateAIExam(topic, lang);
    setQuestions(result);
    setLoading(false);
  };

  const handlePublish = () => {
    if (!questions || !title) return;
    const newExam: Exam = {
      id: Math.random().toString(36).substr(2, 9),
      title: title || `${topic} Assessment`,
      topic,
      questions,
      duration: 30,
      published: true,
      createdAt: new Date().toISOString(),
      deadline: deadline ? new Date(deadline).toISOString() : undefined
    };
    onPublish(newExam);
    setQuestions(null);
    setTopic('');
    setTitle('');
    setDeadline('');
    alert("Exam Published to Students!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-20">
      <div className="bg-white border-4 border-slate-900 rounded-[40px] p-12 sketchy-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 organic-shape -mr-24 -mt-24" />
        <div className="flex items-center gap-6 mb-10 relative z-10">
           <div className="w-16 h-16 bg-amber-400 border-4 border-slate-900 organic-shape flex items-center justify-center text-slate-900 shadow-xl">
             <Wand2 size={32} />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{t.generator}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Generate papers for your class</p>
           </div>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-2 bg-slate-50 border-4 border-slate-900 rounded-3xl">
               <input 
                 type="text" 
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="Exam Title..."
                 className="w-full px-6 py-4 bg-transparent outline-none font-bold text-sm uppercase tracking-widest"
               />
            </div>
            <div className="p-2 bg-slate-50 border-4 border-slate-900 rounded-3xl">
               <input 
                 type="text" 
                 value={topic}
                 onChange={(e) => setTopic(e.target.value)}
                 placeholder="Topic..."
                 className="w-full px-6 py-4 bg-transparent outline-none font-bold text-sm uppercase tracking-widest"
               />
            </div>
            <div className="p-2 bg-slate-50 border-4 border-slate-900 rounded-3xl flex items-center">
               <Calendar size={20} className="ml-4 text-slate-400" />
               <input 
                 type="date" 
                 value={deadline}
                 onChange={(e) => setDeadline(e.target.value)}
                 className="w-full px-4 py-4 bg-transparent outline-none font-bold text-sm uppercase tracking-widest"
               />
            </div>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full py-5 bg-slate-900 text-white border-4 border-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "Synthesizing Exam..." : <><Sparkles size={20} className="text-amber-400" /> Generate Questions</>}
          </button>
        </div>
      </div>

      {questions && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between px-4">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Review Generated Content</h3>
             <button 
              onClick={handlePublish}
              className="px-8 py-3 bg-teal-500 text-white border-2 border-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-600 transition-all flex items-center gap-2"
             >
               <CheckCircle size={16} /> Publish to Students
             </button>
          </div>
          {questions.map((q, i) => (
             <div key={q.id} className="bg-white border-4 border-slate-900 rounded-[32px] p-8 sketchy-shadow">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-10 h-10 bg-slate-100 border-2 border-slate-900 rounded-xl flex items-center justify-center font-black text-sm">{i+1}</div>
                   <h4 className="text-lg font-black text-slate-900 leading-tight">{q.question}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {q.options.map((opt, idx) => (
                     <div key={idx} className={`p-4 border-2 border-slate-900 rounded-2xl font-bold text-sm ${opt === q.answer ? 'bg-teal-50 text-teal-700 border-teal-600' : 'bg-slate-50 text-slate-600'}`}>
                        {opt}
                     </div>
                   ))}
                </div>
             </div>
          ))}
        </div>
      )}

      {/* Previously Generated Exams Section */}
      <div className="space-y-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4 flex items-center gap-2">
          <FileText size={16} /> {t.previous_exams}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {exams.map(exam => (
            <div key={exam.id} className="bg-white border-4 border-slate-900 rounded-[32px] p-8 sketchy-shadow group hover:translate-y-[-2px] transition-all">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-1">{exam.title}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exam.topic}</p>
                 </div>
                 <div className="px-3 py-1 bg-teal-50 text-teal-600 border-2 border-teal-600 rounded-lg text-[8px] font-black uppercase">Published</div>
               </div>
               <div className="flex items-center justify-between pt-6 border-t-2 border-slate-50">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{exam.questions.length} Questions</div>
                  <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase">
                    View Submissions <ChevronRight size={14} />
                  </div>
               </div>
            </div>
          ))}
          {exams.length === 0 && (
            <div className="col-span-2 py-20 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[40px] text-center">
              <p className="text-xs font-black text-slate-300 uppercase">No exams generated yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;
