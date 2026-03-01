
import React, { useState, useRef } from 'react';
import { Play, Pause, Globe, Volume2, Sparkles } from 'lucide-react';
import { generateAudioBrief } from '../services/geminiService';

// Standard decode implementation for Base64 strings to bytes
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Audio decoding logic for raw PCM data returned by Gemini TTS
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const DailyBrief: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const briefingText = lang === 'en' 
    ? "Good morning, Alex. Your cognitive twin has detected a slight decay in your 'Dynamic Programming' mastery. We've scheduled a high-intensity review session for today at 4 PM."
    : "सुप्रभात, एलेक्स। आपके 'कॉग्निटिव ट्विन' ने 'डायनेमिक प्रोग्रामिंग' में महारत में थोड़ी गिरावट दर्ज की है। हमने आज शाम ४ बजे एक गहन समीक्षा सत्र निर्धारित किया है।";

  const toggleBrief = async () => {
    if (loading) return;

    if (isPlaying) {
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
      setIsPlaying(false);
      return;
    }

    setLoading(true);
    try {
      const base64Audio = await generateAudioBrief(briefingText);
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        }
        const ctx = audioContextRef.current;
        const audioBytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        sourceRef.current = source;
        source.start(0);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio playback error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lisboa-gradient rounded-3xl p-10 text-white border-4 border-slate-900 sketchy-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-10 transform group-hover:scale-125 transition-transform">
        <Globe size={160} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/20 backdrop-blur-xl border border-white/40 rounded-full text-xs font-black uppercase tracking-widest">
            <Volume2 size={16} /> Audio Briefing
          </div>
          <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/20">
            {(['en', 'hi'] as const).map(l => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-xs font-black transition-all ${lang === l ? 'bg-white text-teal-600 shadow-lg' : 'text-white/60 hover:text-white'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <h3 className="text-3xl font-black leading-tight mb-8 max-w-lg tracking-tighter">
          {lang === 'en' ? "Today's learning trajectory is ready for your unique cognition." : "आपका सीखने का पथ आज के लिए तैयार है।"}
        </h3>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleBrief}
            disabled={loading}
            className="w-16 h-16 bg-white text-teal-600 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] transition-all disabled:opacity-50"
          >
            {loading ? <div className="animate-spin w-6 h-6 border-4 border-teal-600 border-t-transparent rounded-full" /> : isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-teal-100">
               <span>Pedagogical Stream</span>
               <span>{isPlaying ? 'Streaming...' : loading ? 'Synthesizing...' : 'Ready'}</span>
            </div>
            <div className="h-3 bg-white/20 border-2 border-slate-900/20 rounded-full overflow-hidden">
              <div className={`h-full bg-white transition-all duration-[8000ms] ease-linear ${isPlaying ? 'w-full' : 'w-0'}`} />
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex gap-4 items-start group">
          <div className="w-10 h-10 bg-amber-400 border-2 border-slate-900 rounded-xl flex items-center justify-center text-slate-900 flex-shrink-0 floating">
            <Sparkles size={20} />
          </div>
          <p className="text-sm font-medium text-teal-50 italic leading-relaxed">
            "{briefingText}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyBrief;
