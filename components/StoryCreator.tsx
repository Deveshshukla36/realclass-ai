
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Square, RefreshCw, CheckCircle, Video, Shield, Users as UsersIcon, Lock, MonitorPlay, FlipHorizontal } from 'lucide-react';
import { User, Story } from '../types';
import { useNavigate } from 'react-router-dom';
import { translations } from '../translations';

interface StoryCreatorProps {
  user: User;
  onPost: (story: Story) => void;
  lang: 'en' | 'hi';
}

const StoryCreator: React.FC<StoryCreatorProps> = ({ user, onPost, lang }) => {
  const navigate = useNavigate();
  const t = translations[lang];
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [visibility, setVisibility] = useState<Story['visibility']>('all');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [facingMode]);

  const startCamera = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode }, 
        audio: true 
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedVideo(URL.createObjectURL(blob));
    };
    mr.start();
    setMediaRecorder(mr);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop();
    setRecording(false);
  };

  const handlePublish = () => {
    if (!recordedVideo) return;
    const newStory: Story = {
      id: Math.random().toString(36).substr(2, 9),
      author: user.name,
      type: 'video',
      content: 'Teacher Insights Video',
      timestamp: new Date().toISOString(),
      url: recordedVideo,
      visibility
    };
    onPost(newStory);
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900 flex flex-col items-center justify-center p-0 overflow-hidden">
      <div className="absolute inset-0 bg-slate-800">
        {!recordedVideo ? (
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        ) : (
          <video src={recordedVideo} autoPlay loop playsInline className="w-full h-full object-cover" />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10 p-10 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
              <MonitorPlay className="text-teal-400" /> {t.video_insight}
            </h2>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Broadcasting as {user.name}</p>
          </div>
          <button onClick={() => navigate('/')} className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-rose-500 hover:scale-110 transition-all text-white rounded-full backdrop-blur-md border border-white/20 shadow-2xl">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-10">
          {!recordedVideo && stream && (
             <div className="flex flex-col items-center gap-8">
               <div className="flex gap-4">
                 {(['all', 'groups', 'private'] as const).map(v => (
                   <button 
                    key={v}
                    onClick={() => setVisibility(v)}
                    className={`px-6 py-3 border-2 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${visibility === v ? 'bg-white text-slate-900 border-slate-900' : 'bg-black/40 text-white/40 border-white/20 hover:border-teal-400'}`}
                   >
                     {v === 'all' ? <UsersIcon size={12}/> : v === 'groups' ? <Shield size={12}/> : <Lock size={12}/>}
                     {v}
                   </button>
                 ))}
               </div>
               
               <div className="flex items-center gap-6">
                <button 
                  onClick={toggleCamera} 
                  className="w-16 h-16 bg-white/10 text-white border-2 border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-md"
                  title={t.swap_camera}
                >
                  <FlipHorizontal size={24} />
                </button>

                {!recording ? (
                  <button onClick={startRecording} className="group relative">
                    <div className="absolute inset-0 bg-rose-500 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="w-24 h-24 bg-rose-500 border-8 border-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-2xl relative z-10">
                      <div className="w-10 h-10 bg-white rounded-full" />
                    </div>
                  </button>
                ) : (
                  <button onClick={stopRecording} className="w-24 h-24 bg-slate-900 border-8 border-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-2xl animate-pulse relative z-10">
                    <Square size={36} fill="white" className="text-white" />
                  </button>
                )}
                
                <div className="w-16" /> {/* Spacer for symmetry */}
               </div>
               {recording && <div className="bg-rose-500 text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 animate-pulse"><div className="w-2 h-2 rounded-full bg-white" /> RECORDING LIVE</div>}
             </div>
          )}

          {recordedVideo && (
            <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-8 pb-10">
              <button onClick={() => { setRecordedVideo(null); startCamera(); }} className="py-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border-4 border-white rounded-[32px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4">
                <RefreshCw size={24} /> Retake
              </button>
              <button onClick={handlePublish} className="py-6 bg-teal-500 text-white border-4 border-slate-900 rounded-[32px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all flex items-center justify-center gap-4 shadow-2xl">
                <CheckCircle size={24} /> {t.submit}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryCreator;
