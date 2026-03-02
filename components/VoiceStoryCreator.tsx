
import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Square, RefreshCw, CheckCircle, Play, Pause, Users as UsersIcon, Shield, Lock, Radio, Sparkles, Languages } from 'lucide-react';
import { User, Story } from '../types';
import { useNavigate } from 'react-router-dom';
import { transcribeAndTranslate } from '../services/geminiService';

interface VoiceStoryCreatorProps {
  user: User;
  onPost: (story: Story) => void;
  lang: string;
}

const VoiceStoryCreator: React.FC<VoiceStoryCreatorProps> = ({ user, onPost, lang }) => {
  const navigate = useNavigate();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [visibility, setVisibility] = useState<Story['visibility']>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const startMic = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(s);
    } catch (err) {
      alert("Please allow microphone access.");
    }
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setRecordedAudio(URL.createObjectURL(blob));
    };
    mr.start();
    setMediaRecorder(mr);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop();
    setRecording(false);
  };

  const handleTranscribe = async () => {
    if (!recordedAudio) return;
    setIsProcessing(true);
    try {
      const response = await fetch(recordedAudio);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result?.toString().split(',')[1];
        if (base64data) {
          const result = await transcribeAndTranslate(base64data, lang);
          setTranscription(result || "Transcription failed.");
        }
        setIsProcessing(false);
      };
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handlePublish = () => {
    const newStory: Story = {
      id: Math.random().toString(36).substr(2, 9),
      author: user.name,
      type: 'voice',
      content: transcription || 'Teacher Voice Note',
      timestamp: new Date().toISOString(),
      url: recordedAudio || '',
      visibility
    };
    onPost(newStory);
    alert("Voice note published!");
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-teal-500 flex flex-col items-center justify-between p-10 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-400 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/30 rounded-full blur-[100px]" />

      <div className="w-full max-w-5xl flex items-center justify-between relative z-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
            <Radio size={48} className="text-amber-400 animate-pulse" /> Voice Studio
          </h2>
          <p className="text-xs font-bold text-teal-100 uppercase tracking-[0.3em]">Capturing Insights as {user.name}</p>
        </div>
        <button onClick={() => navigate('/')} className="w-16 h-16 flex items-center justify-center bg-white/20 hover:bg-rose-500 hover:scale-110 transition-all text-white rounded-[24px] backdrop-blur-md border border-white/40 shadow-2xl">
          <X size={32} />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center gap-12 relative z-10 flex-1 w-full">
        {!stream && !recordedAudio && (
          <button onClick={startMic} className="flex flex-col items-center gap-8 group">
            <div className="w-48 h-48 bg-white border-8 border-slate-900 rounded-[60px] flex items-center justify-center sketchy-shadow group-hover:translate-y-[-10px] transition-all">
              <Mic size={80} className="text-teal-600" />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-widest bg-slate-900 px-8 py-3 rounded-2xl">Initialize Microphone</span>
          </button>
        )}

        {stream && !recordedAudio && (
          <div className="flex flex-col items-center gap-16 w-full">
             <div className="flex items-end gap-3 h-48">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                  <div 
                    key={i} 
                    className={`w-4 bg-white rounded-full transition-all duration-100 ${recording ? 'animate-bounce' : 'h-8 opacity-40'}`} 
                    style={{ 
                      height: recording ? `${20 + Math.random() * 80}%` : '20%',
                      animationDelay: `${i * 100}ms`
                    }} 
                  />
                ))}
             </div>
             
             <div className="flex flex-col items-center gap-8">
               <div className="flex gap-4">
                 {(['all', 'groups', 'private'] as const).map(v => (
                   <button 
                    key={v}
                    onClick={() => setVisibility(v)}
                    className={`px-8 py-4 border-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${visibility === v ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-teal-600 border-white/60'}`}
                   >
                     {v === 'all' ? <UsersIcon size={16}/> : v === 'groups' ? <Shield size={16}/> : <Lock size={16}/>}
                     {v}
                   </button>
                 ))}
               </div>

               <div className="flex items-center justify-center">
                {!recording ? (
                  <button onClick={startRecording} className="w-32 h-32 bg-white border-8 border-slate-900 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-2xl sketchy-shadow">
                    <Mic size={48} className="text-teal-600" />
                  </button>
                ) : (
                  <button onClick={stopRecording} className="w-32 h-32 bg-rose-500 border-8 border-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-2xl animate-pulse">
                    <Square size={48} fill="white" className="text-white" />
                  </button>
                )}
               </div>
               {recording && <span className="font-black text-white text-xl uppercase tracking-[0.4em] animate-pulse">Recording Audio...</span>}
             </div>
          </div>
        )}

        {recordedAudio && (
          <div className="flex flex-col items-center gap-16 w-full max-w-4xl">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
               <div className="bg-white border-8 border-slate-900 rounded-[50px] p-12 sketchy-shadow flex flex-col items-center">
                  <audio ref={audioRef} src={recordedAudio} onEnded={() => setIsPlaying(false)} className="hidden" />
                  <button 
                    onClick={() => { if(audioRef.current){ if(isPlaying) audioRef.current.pause(); else audioRef.current.play(); setIsPlaying(!isPlaying); } }}
                    className="w-32 h-32 bg-teal-500 border-4 border-slate-900 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-all"
                  >
                    {isPlaying ? <Pause size={56} /> : <Play size={56} className="ml-3" />}
                  </button>
                  <div className="mt-8 flex flex-col items-center gap-2">
                    <span className="font-black text-slate-900 text-xl uppercase tracking-tighter">Audio Preview</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ready for Broadcast</span>
                  </div>
                  
                  <button 
                    onClick={handleTranscribe}
                    disabled={isProcessing}
                    className="mt-10 w-full py-4 bg-amber-400 border-4 border-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all shadow-md disabled:opacity-50"
                  >
                    {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <Languages size={18} />}
                    {isProcessing ? "Processing..." : "AI Transcribe & Translate"}
                  </button>
               </div>

               <div className="bg-slate-900 border-8 border-slate-900 rounded-[50px] p-12 sketchy-shadow flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Sparkles size={120} className="text-amber-400" />
                  </div>
                  <div className="relative z-10 w-full">
                    <h4 className="text-amber-400 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                      <Radio size={14} /> AI Insight Output
                    </h4>
                    <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-3xl p-6 min-h-[150px] text-white font-medium text-sm leading-relaxed">
                      {transcription || "Click 'AI Transcribe' to generate text from your voice note in the system language."}
                    </div>
                  </div>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                <button onClick={() => { setRecordedAudio(null); setStream(null); setTranscription(null); }} className="py-6 bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white border-4 border-white rounded-[32px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4">
                  <RefreshCw size={24} /> Retake
                </button>
                <button onClick={handlePublish} className="py-6 bg-slate-900 text-white border-4 border-slate-900 rounded-[32px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-2xl">
                  <CheckCircle size={24} /> Broadcast Post
                </button>
             </div>
          </div>
        )}
      </div>
      <div className="relative z-10 w-full flex justify-center pb-4 opacity-40">
        <span className="text-[10px] font-black text-white uppercase tracking-[1em]">Cognitive Twin Audio Engine</span>
      </div>
    </div>
  );
};

export default VoiceStoryCreator;
