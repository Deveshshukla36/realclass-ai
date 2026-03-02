
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Story, Exam, ExamResult, CommunityPost, Attachment } from '../types';
import DailyBrief from './DailyBrief';
import { Language, translations } from '../translations';
import { 
  Video, Mic, Link as LinkIcon, Plus, ChevronRight, Play, BookOpen, AlertCircle, Sparkles, Zap, Brain, Wand2, Shield, X, Megaphone, FileText, Trash2, Layout, Camera, PlusCircle
} from 'lucide-react';

interface DashboardProps {
  user: User;
  exams: Exam[];
  stories: Story[];
  results: ExamResult[];
  onDeleteExam?: (id: string) => void;
  onDeleteStory?: (id: string) => void;
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ user, exams, stories, results, onDeleteExam, onDeleteStory, lang }) => {
  const navigate = useNavigate();
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [announcements, setAnnouncements] = useState<CommunityPost[]>([]);
  const [notices, setNotices] = useState<CommunityPost[]>([]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ content: '', isAnnouncement: false });
  const t = translations[lang];

  useEffect(() => {
    const savedFeed = localStorage.getItem('ct_community_feed');
    if (savedFeed) {
      const feed: CommunityPost[] = JSON.parse(savedFeed);
      setAnnouncements(feed.filter(p => p.isAnnouncement).slice(0, 3));
      setNotices(feed.filter(p => !p.isAnnouncement).slice(0, 5));
    }
  }, []);

  const handlePostNotice = () => {
    if (!newNotice.content) return;
    const post: CommunityPost = {
      id: Math.random().toString(36).substr(2, 9),
      author: user.name,
      authorId: user.id,
      role: user.role,
      content: newNotice.content,
      likes: 0,
      replies: 0,
      timestamp: 'Just now',
      isAnnouncement: newNotice.isAnnouncement
    };

    const savedFeed = localStorage.getItem('ct_community_feed');
    const feed = savedFeed ? JSON.parse(savedFeed) : [];
    const updatedFeed = [post, ...feed];
    localStorage.setItem('ct_community_feed', JSON.stringify(updatedFeed));
    
    if (post.isAnnouncement) setAnnouncements([post, ...announcements]);
    else setNotices([post, ...notices]);
    
    setNewNotice({ content: '', isAnnouncement: false });
    setShowNoticeModal(false);
  };

  const formatTimeAgo = (isoString: string) => {
    if (isoString === 'Just now') return isoString;
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const filteredStories = stories.filter(s => {
    if (user.role === 'teacher') return true;
    return s.visibility === 'all';
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-0 lg:p-10 animate-in zoom-in fade-in duration-300">
          <div className="absolute top-8 right-8 z-[110] flex gap-4">
            {user.role === 'teacher' && onDeleteStory && (
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDeleteStory(activeStory.id); 
                  setActiveStory(null);
                }} 
                className="w-14 h-14 bg-white/10 hover:bg-rose-500 hover:rotate-90 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-2xl"
              >
                <Trash2 size={24} />
              </button>
            )}
            <button 
              onClick={() => setActiveStory(null)} 
              className="w-14 h-14 bg-white/10 hover:bg-rose-500 hover:rotate-90 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-2xl"
            >
              <X size={28} />
            </button>
          </div>
          
          <div className="w-full h-full lg:max-w-4xl lg:h-[80vh] bg-slate-900 lg:rounded-[50px] lg:border-8 border-white/10 relative overflow-hidden flex flex-col items-center justify-center shadow-[0px_0px_100px_rgba(0,0,0,0.5)]">
             {activeStory.type === 'video' ? (
                <video src={activeStory.url} autoPlay controls className="w-full h-full object-contain" />
             ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-teal-500/20 p-12 text-center">
                   <div className="w-48 h-48 bg-teal-500 border-8 border-white/20 rounded-full flex items-center justify-center shadow-2xl mb-12 animate-pulse">
                      <Mic size={80} className="text-white" />
                   </div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{activeStory.author}'s Insight</h2>
                   <audio src={activeStory.url} autoPlay controls className="w-full max-w-md mt-4" />
                </div>
             )}
          </div>
        </div>
      )}
      
      {/* Story Feed */}
      <div className="bg-white/80 backdrop-blur-md border-4 border-slate-900 rounded-[50px] p-8 sketchy-shadow overflow-hidden relative">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" /> {t.campus_stories}
        </h3>
        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
          {user.role === 'teacher' && (
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer group">
                <div onClick={() => navigate('/stories/create/video')} className="w-24 h-24 bg-teal-100 border-4 border-dashed border-teal-300 rounded-full flex items-center justify-center hover:bg-teal-200 transition-all">
                  <Camera size={36} className="text-teal-600" />
                </div>
                <span className="text-[10px] font-black text-slate-900 uppercase">{t.video_insight}</span>
              </div>
              <div className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer group">
                <div onClick={() => navigate('/stories/create/voice')} className="w-24 h-24 bg-amber-100 border-4 border-dashed border-amber-300 rounded-full flex items-center justify-center hover:bg-amber-200 transition-all">
                  <Mic size={36} className="text-amber-600" />
                </div>
                <span className="text-[10px] font-black text-slate-900 uppercase">{t.voice_insight}</span>
              </div>
            </div>
          )}
          {filteredStories.map(s => (
            <div key={s.id} onClick={() => setActiveStory(s)} className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer group animate-in slide-in-from-right-10 duration-500 relative">
              <div className="p-1 bg-gradient-to-tr from-teal-500 to-indigo-500 rounded-full group-hover:scale-110 transition-transform relative shadow-lg">
                <div className="w-22 h-22 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                  {s.type === 'video' ? <Video size={30} className="text-teal-600" /> : s.type === 'voice' ? <Mic size={30} className="text-coral-500" /> : <LinkIcon size={30} className="text-indigo-600" />}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{s.author}</div>
                <div className="text-[8px] font-bold text-slate-400 uppercase">{formatTimeAgo(s.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                  <Megaphone size={16} /> {t.announcements}
                </h3>
                {user.role === 'teacher' && (
                  <button 
                    onClick={() => { setNewNotice({ content: '', isAnnouncement: true }); setShowNoticeModal(true); }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-teal-600 hover:text-teal-700 transition-all"
                  >
                    <PlusCircle size={14} /> {t.post_announcement}
                  </button>
                )}
             </div>
             <div className="space-y-4">
                {announcements.length > 0 ? announcements.map(ann => (
                  <div key={ann.id} className="bg-amber-100 border-4 border-slate-900 rounded-[40px] p-8 sketchy-shadow group hover:translate-y-[-2px] transition-all relative">
                     <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">{ann.author.charAt(0)}</div>
                           <div>
                              <div className="text-[11px] font-black text-slate-900 uppercase">{ann.author}</div>
                              <div className="text-[8px] font-bold text-amber-800 uppercase">{t.official}</div>
                           </div>
                        </div>
                        <span className="text-[8px] font-black text-slate-400 uppercase">{formatTimeAgo(ann.timestamp)}</span>
                     </div>
                     <p className="text-sm font-bold text-slate-900 leading-relaxed">{ann.content}</p>
                  </div>
                )) : (
                  <div className="p-10 text-center bg-white border-4 border-dashed border-slate-200 rounded-[40px] font-black uppercase text-slate-300">
                    No active announcements
                  </div>
                )}
             </div>
          </div>

          <DailyBrief />
          
          <div className="space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] px-2 flex items-center gap-3"><BookOpen size={16} /> {t.exam_hub}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exams.map(exam => (
                <div key={exam.id} onClick={() => navigate(`/exam/${exam.id}`)} className="bg-white border-4 border-slate-900 rounded-[40px] p-8 sketchy-shadow hover:bg-teal-50 transition-all cursor-pointer relative group">
                  <h4 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter">{exam.title}</h4>
                  <p className="text-sm font-bold text-slate-500 mb-8">{exam.questions.length} Questions on {exam.topic}</p>
                  <div className="flex items-center gap-3 text-xs font-black uppercase text-teal-600">
                    {t.start_test} <ChevronRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
           <div className="bg-slate-900 text-white rounded-[50px] p-10 border-4 border-slate-900 sketchy-shadow relative overflow-hidden group">
              <h4 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3"><Zap size={24} className="text-amber-400" /> {t.ready}</h4>
              <div className="flex items-center justify-center mb-10">
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#1e293b" strokeWidth="16" />
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#2dd4bf" strokeWidth="16" strokeDasharray="439.8" strokeDashoffset="132" strokeLinecap="round" className="transition-all duration-1000" />
                    </svg>
                    <span className="absolute text-5xl font-black">72</span>
                 </div>
              </div>
           </div>
           
           <div className="bg-white border-4 border-slate-900 rounded-[40px] p-8 sketchy-shadow">
              <div className="flex items-center justify-between mb-8 border-b-4 border-slate-100 pb-4">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t.notices}</h4>
                {user.role === 'teacher' && (
                  <button 
                    onClick={() => { setNewNotice({ content: '', isAnnouncement: false }); setShowNoticeModal(true); }}
                    className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus size={14} className="inline mr-1" /> {t.post_notice}
                  </button>
                )}
              </div>
              <div className="space-y-6">
                 {notices.length > 0 ? notices.map(notice => (
                   <div key={notice.id} className="p-5 bg-teal-50 border-2 border-slate-900 rounded-3xl flex items-start gap-4 hover:bg-white transition-colors cursor-pointer group">
                      <div className="p-3 bg-white border-2 border-slate-900 rounded-xl group-hover:rotate-6 transition-transform"><AlertCircle size={20} className="text-teal-600" /></div>
                      <div>
                        <div className="text-[10px] font-black text-teal-600 mb-1 uppercase">{notice.author}</div>
                        <div className="text-sm font-black text-slate-900 leading-tight">{notice.content}</div>
                        <div className="text-[8px] font-bold text-slate-400 mt-2 uppercase">{formatTimeAgo(notice.timestamp)}</div>
                      </div>
                   </div>
                 )) : (
                   <div className="text-center p-10 font-black text-slate-200 uppercase text-[10px]">No active notices</div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Notice/Announcement Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white border-4 border-slate-900 rounded-[50px] p-10 sketchy-shadow relative">
             <button onClick={() => setShowNoticeModal(false)} className="absolute top-10 right-10"><X size={24}/></button>
             <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">{newNotice.isAnnouncement ? t.post_announcement : t.post_notice}</h3>
             <textarea 
               value={newNotice.content}
               onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
               placeholder="Type content here..."
               className="w-full h-40 p-6 bg-slate-50 border-4 border-slate-900 rounded-3xl outline-none font-bold text-sm mb-6"
             />
             <button onClick={handlePostNotice} className="w-full py-5 bg-teal-500 text-white border-4 border-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-xl">Broadcast to Campus</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
