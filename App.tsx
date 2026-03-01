
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  Menu, X, LayoutDashboard, Zap, PenTool, Calendar, 
  BrainCircuit, Bell, Award, Wand2, LogOut, User as UserIcon, 
  BookOpen, Users, Camera, Mic, ClipboardList, Mail, Lock, UserPlus, BookCopy,
  ChevronRight, Megaphone, PlusCircle, Globe, MessageSquare, Terminal, FolderPlus
} from 'lucide-react';
import { StudentProfile, UserRole, User, Story, Exam, ExamResult, Course, UserProgress, Certificate, Notification } from './types';
import { INITIAL_STUDENT, SAMPLE_COURSES, SAMPLE_EXAMS, SAMPLE_RESULTS, SAMPLE_STORIES } from './constants';
import { translations, Language } from './translations';
import Dashboard from './components/Dashboard';
import SubmissionWorkspace from './components/SubmissionWorkspace';
import NotionPlanner from './components/NotionPlanner';
import ConceptCoach from './components/ConceptCoach';
import ScoreBoard from './components/ScoreBoard';
import Generator from './components/Generator';
import ExamPlayer from './components/ExamPlayer';
import CommunityHub from './components/CommunityHub';
import StoryCreator from './components/StoryCreator';
import VoiceStoryCreator from './components/VoiceStoryCreator';
import TeacherResults from './components/TeacherResults';
import CourseCreator from './components/CourseCreator';
import CourseViewer from './components/CourseViewer';
import LabWorkspace from './components/LabWorkspace';
import DecorativeLisboa from './components/DecorativeLisboa';
import FunFactBubble from './components/FunFactBubble';
import AboutProject from './components/AboutProject';
import FeedbackModal from './components/FeedbackModal';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('ct_lang') as Language) || 'en');
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ct_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [exams, setExams] = useState<Exam[]>(() => JSON.parse(localStorage.getItem('ct_exams') || JSON.stringify(SAMPLE_EXAMS)));
  const [courses, setCourses] = useState<Course[]>(() => JSON.parse(localStorage.getItem('ct_courses') || JSON.stringify(SAMPLE_COURSES)));
  const [stories, setStories] = useState<Story[]>(() => JSON.parse(localStorage.getItem('ct_stories') || JSON.stringify(SAMPLE_STORIES)));
  const [results, setResults] = useState<ExamResult[]>(() => JSON.parse(localStorage.getItem('ct_results') || JSON.stringify(SAMPLE_RESULTS)));
  const [userProgress, setUserProgress] = useState<UserProgress[]>(() => JSON.parse(localStorage.getItem('ct_user_progress') || '[]'));
  const [certificates, setCertificates] = useState<Certificate[]>(() => JSON.parse(localStorage.getItem('ct_certs') || '[]'));

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('ct_lang', lang);
    if (user) localStorage.setItem('ct_user', JSON.stringify(user));
    localStorage.setItem('ct_exams', JSON.stringify(exams));
    localStorage.setItem('ct_courses', JSON.stringify(courses));
    localStorage.setItem('ct_stories', JSON.stringify(stories));
    localStorage.setItem('ct_results', JSON.stringify(results));
    localStorage.setItem('ct_user_progress', JSON.stringify(userProgress));
    localStorage.setItem('ct_certs', JSON.stringify(certificates));
  }, [user, exams, courses, stories, results, userProgress, certificates, lang]);

  const languages: Language[] = ['en', 'hi', 'ta', 'te', 'bn'];
  const toggleLang = () => {
    const currentIndex = languages.indexOf(lang);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLang(languages[nextIndex]);
  };

  const handlePublishExam = (exam: Exam) => setExams(prev => [exam, ...prev]);
  const handlePostStory = (story: Story) => setStories(prev => [story, ...prev]);
  const handleExamResult = (result: ExamResult) => setResults(prev => [result, ...prev]);
  const handleDeleteExam = (id: string) => setExams(prev => prev.filter(e => e.id !== id));
  const handleDeleteStory = (id: string) => setStories(prev => prev.filter(s => s.id !== id));
  const handleSaveCourse = (c: Course) => setCourses(prev => [c, ...prev]);
  const handleUpdateProgress = (p: UserProgress) => {
    setUserProgress(prev => {
      const filtered = prev.filter(x => !(x.userId === p.userId && x.courseId === p.courseId));
      return [...filtered, p];
    });
  };
  const handleIssueCertificate = (c: Certificate) => setCertificates(prev => [c, ...prev]);

  if (!user) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-teal-50 overflow-hidden">
      <DecorativeLisboa />
      <div className="w-full max-w-md bg-white border-4 border-slate-900 rounded-[40px] p-10 sketchy-shadow relative z-10 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-amber-400 border-4 border-slate-900 organic-shape flex items-center justify-center mx-auto mb-10 font-black text-4xl shadow-xl floating">R</div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 mb-2 leading-none">{t.login_title}</h2>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-10">{t.login_subtitle}</p>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl border-2 border-slate-900 mb-8">
          <button 
            onClick={() => setIsSignup(false)} 
            className={`flex-1 py-2 font-black text-xs uppercase rounded-xl transition-all ${!isSignup ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
          >
            {t.signin}
          </button>
          <button 
            onClick={() => setIsSignup(true)} 
            className={`flex-1 py-2 font-black text-xs uppercase rounded-xl transition-all ${isSignup ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
          >
            {t.signup}
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <div className="space-y-4 text-left">
            {isSignup && (
              <div className="p-1 bg-slate-50 border-2 border-slate-900 rounded-xl flex items-center gap-3">
                <UserIcon size={16} className="ml-3 text-slate-400" />
                <input type="text" placeholder={t.full_name} className="w-full px-1 py-3 bg-transparent outline-none font-bold text-xs" />
              </div>
            )}
            <div className="p-1 bg-slate-50 border-2 border-slate-900 rounded-xl flex items-center gap-3">
              <Mail size={16} className="ml-3 text-slate-400" />
              <input type="email" placeholder={t.email} className="w-full px-1 py-3 bg-transparent outline-none font-bold text-xs" />
            </div>
            <div className="p-1 bg-slate-50 border-2 border-slate-900 rounded-xl flex items-center gap-3">
              <Lock size={16} className="ml-3 text-slate-400" />
              <input type="password" placeholder="PASSWORD" className="w-full px-1 py-3 bg-transparent outline-none font-bold text-xs" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setUser({ id: 'st-001', name: 'Alex Rivera', role: 'student', avatar: '' })}
            className="py-5 bg-teal-500 text-white border-4 border-slate-900 rounded-2xl font-black uppercase tracking-widest hover:translate-y-[-4px] transition-all shadow-lg flex flex-col items-center justify-center gap-2"
          >
            <UserIcon size={24} /> <span className="text-[10px]">{t.student_entry}</span>
          </button>
          <button 
            onClick={() => setUser({ id: 'teach-001', name: 'Prof. Sarah', role: 'teacher', avatar: '' })}
            className="py-5 bg-slate-900 text-white border-4 border-slate-900 rounded-2xl font-black uppercase tracking-widest hover:translate-y-[-4px] transition-all shadow-lg flex flex-col items-center justify-center gap-2"
          >
            <Zap size={24} className="text-amber-400" /> <span className="text-[10px]">{t.teacher_entry}</span>
          </button>
        </div>
        
        <div className="mt-8">
           <button onClick={toggleLang} className="text-[10px] font-black uppercase text-slate-400 hover:text-teal-600 tracking-widest">
             {translations[languages[(languages.indexOf(lang) + 1) % languages.length]].language}
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        <DecorativeLisboa />
        
        {/* Sidebar */}
        <div className={`fixed inset-0 z-[60] transition-all duration-300 ${isSidebarOpen ? 'visible' : 'invisible'}`}>
          <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsSidebarOpen(false)} />
          <aside className={`absolute left-0 top-0 bottom-0 w-80 bg-white border-r-4 border-slate-900 p-8 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-amber-400 border-2 border-slate-900 organic-shape flex items-center justify-center font-black">R</div>
                 <span className="font-black text-slate-900 text-lg tracking-tighter">REAL CLASS AI</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
            </div>
            <nav className="space-y-3 flex-1 overflow-y-auto scrollbar-hide">
              {[
                { path: '/', label: t.dashboard, icon: <LayoutDashboard /> },
                { path: '/courses', label: t.courses, icon: <BookCopy /> },
                { path: '/lab', label: t.lab, icon: <Terminal /> },
                { path: '/workspace', label: t.workspace, icon: <PenTool /> },
                { path: '/practice', label: t.practice, icon: <Zap /> },
                { path: '/community', label: t.community, icon: <Users /> },
                { path: '/planner', label: t.planner, icon: <Calendar /> },
                { path: '/scores', label: t.scores, icon: <Award /> },
              ].map(item => (
                <Link key={item.path} to={item.path} onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 hover:bg-teal-50 rounded-2xl border-2 border-transparent hover:border-slate-900 font-black uppercase text-[11px] transition-all">
                  {item.icon} {item.label}
                </Link>
              ))}
              {user.role === 'teacher' && (
                <>
                  <Link to="/courses/create" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 hover:bg-amber-50 rounded-2xl border-2 border-transparent hover:border-slate-900 font-black uppercase text-[11px]">
                    <FolderPlus size={18} /> CREATE COURSE
                  </Link>
                  <Link to="/generator" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 hover:bg-amber-50 rounded-2xl border-2 border-transparent hover:border-slate-900 font-black uppercase text-[11px]">
                    <Wand2 /> {t.generator}
                  </Link>
                </>
              )}
            </nav>
            <div className="pt-10 border-t-2 border-slate-100">
              <button onClick={() => { setUser(null); localStorage.removeItem('ct_user'); }} className="flex items-center gap-4 p-4 w-full text-rose-500 font-black uppercase text-xs hover:bg-rose-50 rounded-2xl transition-all">
                <LogOut /> {t.logout}
              </button>
            </div>
          </aside>
        </div>

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-24 px-10 flex items-center justify-between z-40 bg-white border-b-4 border-slate-900 shadow-sm">
          <div className="flex-1 flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="w-14 h-14 bg-white border-4 border-slate-900 sketchy-shadow rounded-2xl flex items-center justify-center shrink-0">
              <Menu size={24} />
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none transform -translate-y-1">
              REAL CLASS AI
            </span>
          </div>
          <div className="flex-1 flex items-center justify-end gap-4">
            <button 
              onClick={toggleLang}
              className="px-6 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl font-black uppercase text-[10px] hover:bg-white transition-all shadow-sm flex items-center gap-2"
            >
              <Globe size={14} /> {translations[lang].language}
            </button>
            <div className="w-14 h-14 bg-white border-4 border-slate-900 rounded-2xl sketchy-shadow flex items-center justify-center relative">
              <Bell size={24} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-slate-900 rounded-full" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pt-36 pb-32 px-10 max-w-[1600px] mx-auto w-full relative z-10">
          <Routes>
            <Route path="/" element={<Dashboard user={user} exams={exams} stories={stories} results={results} onDeleteExam={handleDeleteExam} onDeleteStory={handleDeleteStory} lang={lang} />} />
            <Route path="/courses" element={
              <div className="space-y-10">
                <div className="flex items-center justify-between bg-white border-4 border-slate-900 rounded-[40px] p-10 sketchy-shadow">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">COURSE LIBRARY</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Explore modular learning paths</p>
                  </div>
                  {user.role === 'teacher' && (
                    <Link to="/courses/create" className="px-8 py-3 bg-teal-500 text-white border-4 border-slate-900 rounded-2xl font-black uppercase text-xs sketchy-shadow hover:translate-y-[-2px] transition-all">
                      Add New Course
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courses.map(course => (
                    <div key={course.id} className="bg-white border-4 border-slate-900 rounded-[40px] p-8 sketchy-shadow hover:translate-y-[-4px] transition-all flex flex-col justify-between">
                      <div>
                        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 border-2 border-slate-900">
                          <BookCopy size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">{course.title}</h3>
                        <p className="text-sm font-bold text-slate-500 mb-8 line-clamp-3">{course.description}</p>
                      </div>
                      <Link to={`/courses/${course.id}`} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest text-center hover:bg-slate-800 transition-all">
                        View Modules
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            } />
            <Route path="/courses/create" element={<CourseCreator user={user} onSave={handleSaveCourse} />} />
            <Route path="/courses/:courseId" element={<CourseViewer user={user} courses={courses} progress={userProgress} onUpdateProgress={handleUpdateProgress} onIssueCertificate={handleIssueCertificate} lang={lang} />} />
            <Route path="/lab" element={<LabWorkspace user={user} lang={lang} />} />
            <Route path="/workspace" element={<SubmissionWorkspace user={user} lang={lang} />} />
            <Route path="/community" element={<CommunityHub user={user} />} />
            <Route path="/planner" element={<NotionPlanner initialConcepts={INITIAL_STUDENT.concepts} />} />
            <Route path="/scores" element={<ScoreBoard results={results} user={user} />} />
            <Route path="/practice" element={<ConceptCoach student={INITIAL_STUDENT} lang={lang} />} />
            {user.role === 'teacher' && (
              <>
                <Route path="/generator" element={<Generator onPublish={handlePublishExam} exams={exams} lang={lang} />} />
                <Route path="/stories/create/video" element={<StoryCreator user={user} onPost={handlePostStory} lang={lang} />} />
                <Route path="/stories/create/voice" element={<VoiceStoryCreator user={user} onPost={handlePostStory} lang={lang} />} />
              </>
            )}
            <Route path="/exam/:examId" element={<ExamPlayer exams={exams} onResult={handleExamResult} user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <div className="flex flex-col items-center mt-20 gap-8">
            <AboutProject />
            <button 
              onClick={() => setIsFeedbackOpen(true)}
              className="group relative px-20 py-8 bg-amber-400 border-4 border-slate-900 rounded-[40px] sketchy-shadow hover:translate-y-[-10px] transition-all w-full max-w-3xl"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white border-4 border-slate-900 organic-shape flex items-center justify-center text-slate-900 transition-transform group-hover:rotate-12 shadow-lg">
                  <MessageSquare size={36} />
                </div>
                <div className="text-left">
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{t.feedback_btn}</h3>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-2">Help us evolve the twin cognition</p>
                </div>
              </div>
            </button>
          </div>
        </main>

        <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} lang={lang} />
        <FunFactBubble />
      </div>
    </Router>
  );
};

export default App;
