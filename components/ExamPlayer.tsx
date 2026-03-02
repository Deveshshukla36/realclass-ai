
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Exam, Question, ExamResult, User } from '../types';
import { CheckCircle, Clock, ShieldCheck, ChevronRight, Brain } from 'lucide-react';
// Removed detectCheating from imports as it is not exported from geminiService.
import { analyzeExamResult } from '../services/geminiService';

const ExamPlayer: React.FC<{ exams: Exam[]; onResult: (res: ExamResult) => void; user: User }> = ({ exams, onResult, user }) => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const exam = exams.find(e => e.id === examId);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<{grade: string, analysis: string} | null>(null);

  useEffect(() => {
    if (exam && examStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && examStarted) {
      handleFinish();
    }
  }, [examStarted, timeLeft]);

  const handleStart = () => {
    setExamStarted(true);
    setTimeLeft(exam ? exam.duration * 60 : 1800);
  };

  const handleFinish = async () => {
    setExamFinished(true);
    setLoadingAnalysis(true);
    const score = exam ? exam.questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0) : 0;
    const total = exam ? exam.questions.length : 0;
    
    // Call Gemini for result analysis
    const res = await analyzeExamResult(score, total, exam?.topic || "General", answers);
    setAnalysis(res);
    setLoadingAnalysis(false);

    // Record the result
    onResult({
      id: Math.random().toString(36).substr(2, 9),
      examId: exam?.id || '',
      examTitle: exam?.title || '',
      studentId: user.id,
      studentName: user.name,
      score,
      totalQuestions: total,
      grade: res.grade,
      analysis: res.analysis,
      timestamp: new Date().toISOString()
    });
  };

  if (!exam) return <div className="p-20 text-center font-black uppercase text-slate-900">Exam not found</div>;

  if (!examStarted) {
    return (
      <div className="max-w-2xl mx-auto bg-white border-4 border-slate-900 rounded-[40px] p-12 sketchy-shadow text-center">
        <h2 className="text-3xl font-black mb-4 uppercase text-slate-900 tracking-tighter">{exam.title}</h2>
        <p className="text-slate-500 font-bold uppercase text-xs mb-10 tracking-widest">Assessment on {exam.topic}</p>
        <div className="grid grid-cols-2 gap-4 mb-10">
           <div className="p-6 bg-slate-50 border-2 border-slate-900 rounded-2xl text-slate-900">
              <Clock size={24} className="mx-auto mb-2 text-teal-600" />
              <div className="text-[10px] font-black uppercase">Duration</div>
              <div className="text-lg font-black">{exam.duration} Min</div>
           </div>
           <div className="p-6 bg-slate-50 border-2 border-slate-900 rounded-2xl text-slate-900">
              <ShieldCheck size={24} className="mx-auto mb-2 text-indigo-600" />
              <div className="text-[10px] font-black uppercase">Guardian AI</div>
              <div className="text-lg font-black">Online</div>
           </div>
        </div>
        <button onClick={handleStart} className="w-full py-5 bg-teal-500 text-white border-4 border-slate-900 rounded-2xl font-black uppercase hover:scale-105 transition-all shadow-xl">Start Exam</button>
      </div>
    );
  }

  if (examFinished) {
    const score = exam.questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);
    const percentage = Math.round((score / exam.questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white border-4 border-slate-900 rounded-[40px] p-12 sketchy-shadow text-center">
          <CheckCircle size={64} className="mx-auto text-teal-500 mb-6" />
          <h2 className="text-3xl font-black mb-8 uppercase text-slate-900 tracking-tighter">Evaluation Complete</h2>
          <div className="flex items-center justify-around bg-slate-50 border-4 border-slate-900 rounded-3xl p-8 mb-10">
            <div>
              <div className="text-5xl font-black text-slate-900">{percentage}%</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Score Accuracy</div>
            </div>
            <div className="w-1 bg-slate-900/10 h-16 rounded-full" />
            <div>
              <div className="text-5xl font-black text-indigo-600">{analysis?.grade || '...'}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Letter Grade</div>
            </div>
          </div>
          {loadingAnalysis ? (
            <div className="p-10 text-slate-400 font-black uppercase tracking-widest animate-pulse">Generating AI Cognitive Analysis...</div>
          ) : (
            <div className="bg-teal-50 border-2 border-teal-600 rounded-3xl p-8 text-left mb-10">
              <h4 className="text-xs font-black text-teal-800 uppercase tracking-widest mb-4 flex items-center gap-2"><Brain size={16} /> Tutor Insight</h4>
              <p className="text-sm font-bold text-teal-900 leading-relaxed italic">{analysis?.analysis}</p>
            </div>
          )}
          <button onClick={() => navigate('/')} className="w-full py-5 bg-slate-900 text-white border-4 border-slate-900 rounded-2xl font-black uppercase hover:scale-105 transition-all shadow-xl">Return to Campus</button>
        </div>
      </div>
    );
  }

  const currentQ = exam.questions[currentStep];
  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2, '0')}`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center font-black text-slate-900">{currentStep + 1}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {currentStep + 1} of {exam.questions.length}</div>
        </div>
        <div className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-sm flex items-center gap-2">
          <Clock size={16} /> {formatTime(timeLeft)}
        </div>
      </div>
      <div className="bg-white border-4 border-slate-900 rounded-[40px] p-12 sketchy-shadow mb-10">
        <h3 className="text-2xl font-black text-slate-900 mb-10 leading-snug">{currentQ.question}</h3>
        <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((opt, idx) => (
            <button 
              key={idx} 
              onClick={() => setAnswers(prev => ({...prev, [currentQ.id]: opt}))}
              className={`p-6 border-4 rounded-2xl text-left font-bold transition-all flex items-center justify-between ${answers[currentQ.id] === opt ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-900'}`}
            >
              <span>{opt}</span>
              {answers[currentQ.id] === opt && <CheckCircle size={20} />}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-6 px-4">
         <button disabled={currentStep === 0} onClick={() => setCurrentStep(prev => prev - 1)} className="flex-1 py-4 bg-white border-4 border-slate-900 rounded-2xl font-black uppercase hover:bg-slate-50 transition-all disabled:opacity-30">Previous</button>
         {currentStep < exam.questions.length - 1 ? (
           <button disabled={!answers[currentQ.id]} onClick={() => setCurrentStep(prev => prev + 1)} className="flex-1 py-4 bg-slate-900 text-white border-4 border-slate-900 rounded-2xl font-black uppercase flex items-center justify-center gap-2 hover:scale-105 transition-all">Next <ChevronRight size={18} /></button>
         ) : (
           <button onClick={handleFinish} className="flex-1 py-4 bg-teal-500 text-white border-4 border-slate-900 rounded-2xl font-black uppercase hover:scale-105 transition-all shadow-xl">Finish Exam</button>
         )}
      </div>
    </div>
  );
};

export default ExamPlayer;
