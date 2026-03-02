
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, Module, User, UserProgress, Certificate, Question } from '../types';
import { Language } from '../translations';
import { Play, CheckCircle, FileText, Lock, ChevronRight, Award, Brain, Sparkles, X } from 'lucide-react';
import { generateAIExam, generateCertificateVerification } from '../services/geminiService';

interface CourseViewerProps {
  user: User;
  courses: Course[];
  progress: UserProgress[];
  onUpdateProgress: (p: UserProgress) => void;
  onIssueCertificate: (c: Certificate) => void;
  lang: Language;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ user, courses, progress, onUpdateProgress, onIssueCertificate, lang }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c.id === courseId);
  const userProgress = progress.find(p => p.courseId === courseId && p.userId === user.id) || { userId: user.id, courseId: courseId!, completedModuleIds: [] };

  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examLoading, setExamLoading] = useState(false);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [certIssued, setCertIssued] = useState(false);

  if (!course) return <div className="p-20 text-center font-black">Course Not Found</div>;

  const allModulesCompleted = course.modules.length === userProgress.completedModuleIds.length;

  const handleCompleteModule = (id: string) => {
    if (!userProgress.completedModuleIds.includes(id)) {
      const newProgress = {
        ...userProgress,
        completedModuleIds: [...userProgress.completedModuleIds, id]
      };
      onUpdateProgress(newProgress);
    }
    if (activeModuleIdx < course.modules.length - 1) {
      setActiveModuleIdx(activeModuleIdx + 1);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";
    // Check if it's already an embed URL
    if (url.includes('youtube.com/embed/')) return url;
    // Handle standard watch URLs
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const startExam = async () => {
    setExamLoading(true);
    try {
      const questions = await generateAIExam(course.title, lang, 5);
      if (questions && questions.length > 0) {
        setExamQuestions(questions);
        setExamStarted(true);
      } else {
        alert("Could not generate exam questions. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating exam.");
    } finally {
      setExamLoading(false);
    }
  };

  const submitExam = async () => {
    const score = examQuestions.reduce((acc, q) => acc + (examAnswers[q.id] === q.answer ? 1 : 0), 0);
    const percentage = (score / examQuestions.length) * 100;

    if (percentage >= 75) {
      const poetic = await generateCertificateVerification(user.name, course.title);
      const newCert: Certificate = {
        id: Math.random().toString(36).substr(2, 9),
        courseId: course.id,
        courseTitle: course.title,
        studentName: user.name,
        issueDate: new Date().toLocaleDateString(),
        verificationId: `VER-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        poeticContent: poetic
      };
      onIssueCertificate(newCert);
      setCertIssued(true);
    } else {
      alert(`Score: ${percentage}%. Minimum 75% required for certificate. Keep studying!`);
      setExamStarted(false);
    }
  };

  const currentModule = course.modules[activeModuleIdx];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{course.title}</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Guided by {course.teacherName}</p>
        </div>
        <button onClick={() => navigate('/courses')} className="p-4 bg-white border-4 border-slate-900 rounded-2xl sketchy-shadow hover:bg-slate-50 transition-all"><X size={24}/></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {!examStarted && !certIssued ? (
            <div className="bg-white border-4 border-slate-900 rounded-[50px] overflow-hidden sketchy-shadow">
               <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
                  {currentModule.type === 'video' ? (
                    currentModule.url ? (
                      <iframe 
                        className="w-full h-full"
                        src={getYouTubeEmbedUrl(currentModule.url)}
                        title={currentModule.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-white">
                         <Play size={64} className="text-teal-400" />
                         <span className="font-black uppercase tracking-widest text-xs">Simulated Video Feed</span>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-white p-20 text-center overflow-y-auto max-h-full">
                       <FileText size={64} className="text-indigo-400" />
                       <h3 className="text-2xl font-black uppercase tracking-tight">{currentModule.title}</h3>
                       <div className="text-slate-400 text-sm font-bold leading-relaxed max-w-lg mt-4 whitespace-pre-wrap">
                         {currentModule.content || "Interactive reading material loaded for this module."}
                       </div>
                    </div>
                  )}
                  <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                    Module {activeModuleIdx + 1}
                  </div>
               </div>
               <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="max-w-md">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 leading-none">{currentModule.title}</h3>
                    <p className="text-sm font-bold text-slate-500">Master this module to unlock the next chapter in your learning journey.</p>
                  </div>
                  <button 
                    onClick={() => handleCompleteModule(currentModule.id)}
                    className={`px-10 py-4 border-4 border-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${userProgress.completedModuleIds.includes(currentModule.id) ? 'bg-teal-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
                  >
                    {userProgress.completedModuleIds.includes(currentModule.id) ? <span className="flex items-center gap-2"><CheckCircle size={18}/> Completed</span> : 'Mark Finished'}
                  </button>
               </div>
            </div>
          ) : examStarted ? (
            <div className="bg-white border-4 border-slate-900 rounded-[50px] p-12 sketchy-shadow space-y-10 animate-in zoom-in duration-300">
               <div className="text-center">
                 <Brain size={48} className="mx-auto text-indigo-600 mb-4" />
                 <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">COURSE CERTIFICATION EXAM</h2>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Pass score: 75% required</p>
               </div>
               <div className="space-y-8">
                 {examQuestions.map((q, i) => (
                   <div key={q.id || i} className="space-y-4 p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl">
                     <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{i+1}. {q.question}</p>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {q.options.map((opt, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setExamAnswers({...examAnswers, [q.id]: opt})}
                            className={`p-4 border-2 rounded-xl text-left font-bold text-sm transition-all ${examAnswers[q.id] === opt ? 'bg-indigo-600 text-white border-slate-900 shadow-lg' : 'bg-white border-slate-100 hover:border-slate-900'}`}
                          >
                            {opt}
                          </button>
                        ))}
                     </div>
                   </div>
                 ))}
               </div>
               <button onClick={submitExam} className="w-full py-5 bg-teal-500 text-white border-4 border-slate-900 rounded-3xl font-black uppercase tracking-widest shadow-xl hover:translate-y-[-2px] transition-all">Submit for Certification</button>
            </div>
          ) : (
            <div className="bg-white border-4 border-slate-900 rounded-[50px] p-16 sketchy-shadow text-center space-y-10 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-teal-400 via-amber-400 to-indigo-500" />
               <Award size={80} className="mx-auto text-amber-500 floating" />
               <div className="space-y-4">
                 <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">CONGRATULATIONS!</h2>
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">You have mastered {course.title}</p>
               </div>
               <div className="p-10 border-4 border-dashed border-amber-200 rounded-[40px] bg-amber-50 relative">
                  <div className="text-2xl font-serif italic text-slate-800 mb-6">"Your dedication to learning has shaped your path to success."</div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 border-t-2 border-slate-200 pt-4 flex justify-between">
                     <span>REAL CLASS AI CERTIFIED</span>
                     <span>{new Date().toLocaleDateString()}</span>
                  </div>
               </div>
               <button onClick={() => navigate('/courses')} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Back to Courses</button>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white border-4 border-slate-900 rounded-[40px] p-8 sketchy-shadow">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 border-b-4 border-slate-50 pb-4">Course Syllabus</h3>
              <div className="space-y-3">
                 {course.modules.map((m, i) => (
                   <button 
                    key={m.id}
                    onClick={() => !examStarted && !certIssued && setActiveModuleIdx(i)}
                    className={`w-full p-5 border-2 rounded-2xl flex items-center justify-between group transition-all ${activeModuleIdx === i ? 'border-slate-900 bg-teal-50' : 'border-slate-100 hover:border-slate-900 bg-white'}`}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${userProgress.completedModuleIds.includes(m.id) ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                           {userProgress.completedModuleIds.includes(m.id) ? <CheckCircle size={14}/> : i + 1}
                        </div>
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tight text-left">{m.title}</span>
                     </div>
                   </button>
                 ))}
                 
                 <div className="pt-6 mt-6 border-t-4 border-slate-50">
                    <button 
                      disabled={!allModulesCompleted || examStarted || certIssued}
                      onClick={startExam}
                      className={`w-full py-5 border-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${allModulesCompleted ? 'bg-indigo-600 text-white border-slate-900 sketchy-shadow hover:translate-y-[-2px]' : 'bg-slate-50 text-slate-300 border-slate-100'}`}
                    >
                      {examLoading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"/> : <><Sparkles size={18}/> {certIssued ? 'Completed' : 'Final Exam'}</>}
                    </button>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 text-white rounded-[40px] p-8 sketchy-shadow">
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Progress Visualizer</h4>
              <div className="flex items-center justify-between mb-4">
                 <span className="text-2xl font-black">{Math.round((userProgress.completedModuleIds.length / course.modules.length) * 100)}%</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase">{userProgress.completedModuleIds.length} / {course.modules.length} Modules</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="bg-teal-400 h-full transition-all duration-1000" style={{ width: `${(userProgress.completedModuleIds.length / course.modules.length) * 100}%` }} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
