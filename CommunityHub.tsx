
import React, { useState, useEffect, useRef } from 'react';
import { Users, Send, MessageCircle, Heart, Share2, Info, Brain, Upload, FileText, Trash2, Megaphone, ShieldAlert, Pin, Mic, Square, Play, Pause } from 'lucide-react';
import { User, CommunityPost, Attachment } from '../types';
import { SAMPLE_COMMUNITY_FEED } from '../constants';

const CommunityHub: React.FC<{ user: User }> = ({ user }) => {
  const [postContent, setPostContent] = useState('');
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [recording, setRecording] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [feed, setFeed] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('ct_community_feed');
    return saved ? JSON.parse(saved) : SAMPLE_COMMUNITY_FEED;
  });

  useEffect(() => {
    localStorage.setItem('ct_community_feed', JSON.stringify(feed));
  }, [feed]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setVoiceUrl(URL.createObjectURL(blob));
      };
      mr.start();
      setMediaRecorder(mr);
      setRecording(true);
    } catch (err) { alert("Mic access denied"); }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
    mediaRecorder?.stream.getTracks().forEach(t => t.stop());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map((file: File) => ({
        name: file.name,
        type: file.type
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const handlePost = () => {
    if (!postContent.trim() && !voiceUrl) return;
    const newPost: CommunityPost = {
      id: Math.random().toString(36).substr(2, 9),
      author: user.name,
      authorId: user.id,
      role: user.role,
      content: postContent || (voiceUrl ? "Voice announcement posted." : ""),
      likes: 0,
      replies: 0,
      timestamp: 'Just now',
      isAnnouncement: user.role === 'teacher' ? isAnnouncement : false,
      isVoiceAnnouncement: !!voiceUrl,
      voiceUrl: voiceUrl || undefined,
      attachments: attachments.length > 0 ? attachments : undefined
    };

    setFeed(prev => [newPost, ...prev]);
    setPostContent('');
    setAttachments([]);
    setVoiceUrl(null);
    setIsAnnouncement(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-3 space-y-8">
        <div className="bg-white border-4 border-slate-900 rounded-[40px] p-8 sketchy-shadow">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Channels</h3>
          <div className="space-y-2">
            {['General Feed', 'Questions', 'Resource Hub', 'Syllabus Help'].map((ch, i) => (
              <button key={i} className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-tight transition-all ${i === 0 ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-teal-50'}`}>
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 space-y-10">
        <div className="bg-white border-4 border-slate-900 rounded-[40px] p-8 sketchy-shadow">
          <div className="flex gap-4 items-start">
            <div className="w-14 h-14 bg-teal-100 border-2 border-slate-900 rounded-2xl flex items-center justify-center font-black text-xl text-slate-900">{user.name.charAt(0)}</div>
            <div className="flex-1">
              <textarea 
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={user.role === 'teacher' ? "Post an announcement..." : "Ask the campus..."}
                className="w-full bg-slate-50 border-4 border-slate-900 rounded-[32px] p-6 text-sm font-bold text-slate-900 outline-none focus:ring-4 ring-teal-500/10 resize-none h-32 transition-all"
              />
              
              {voiceUrl && (
                <div className="mt-4 p-4 bg-amber-50 border-2 border-slate-900 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <Mic size={18} className="text-amber-600"/>
                     <span className="text-xs font-black uppercase">Voice Note Ready</span>
                   </div>
                   <button onClick={() => setVoiceUrl(null)} className="text-rose-500"><Trash2 size={16}/></button>
                </div>
              )}

              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-3">
                  <label className="p-3 bg-white border-2 border-slate-100 rounded-xl hover:border-slate-900 transition-all cursor-pointer">
                    <Upload size={18} />
                    <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                  </label>
                  {user.role === 'teacher' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={recording ? stopRecording : startRecording}
                        className={`p-3 border-2 rounded-xl transition-all ${recording ? 'bg-rose-500 text-white animate-pulse border-slate-900' : 'bg-white border-slate-100'}`}
                      >
                        {recording ? <Square size={18}/> : <Mic size={18}/>}
                      </button>
                      <button 
                        onClick={() => setIsAnnouncement(!isAnnouncement)}
                        className={`p-3 border-2 rounded-xl text-[10px] font-black uppercase ${isAnnouncement ? 'bg-teal-500 text-white border-slate-900' : 'bg-white border-slate-100 text-slate-400'}`}
                      >
                        Announcement
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={handlePost} className="px-8 py-3 bg-slate-900 text-white border-2 border-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">Broadcast</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {feed.map(item => (
            <div key={item.id} className={`bg-white border-4 border-slate-900 rounded-[40px] p-8 sketchy-shadow group relative ${item.isAnnouncement ? 'border-teal-500' : ''}`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 border-2 rounded-2xl flex items-center justify-center font-black ${item.isAnnouncement ? 'bg-teal-500 text-white border-slate-900' : 'bg-slate-100'}`}>{item.author.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.author} {item.isAnnouncement && "📣"}</div>
                    <div className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{item.role}</div>
                  </div>
                </div>
              </div>
              <p className="text-base font-bold text-slate-900 leading-relaxed mb-6">{item.content}</p>
              {item.isVoiceAnnouncement && (
                <div className="mb-6 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                   <audio src={item.voiceUrl} controls className="w-full h-10" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 space-y-10">
        <div className="bg-indigo-600 text-white border-4 border-slate-900 rounded-[40px] p-8 sketchy-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Brain size={100} /></div>
          <h4 className="text-xl font-black uppercase tracking-tighter mb-4 relative z-10">Campus Pulse</h4>
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-8 relative z-10">Interaction Density</p>
          <div className="flex items-end gap-2 h-24 relative z-10">
            {[40, 70, 45, 90, 65, 85].map((h, i) => (<div key={i} className="flex-1 bg-white/20 rounded-t-lg" style={{ height: `${h}%` }} />))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
