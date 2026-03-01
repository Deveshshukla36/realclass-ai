
import React, { useState } from 'react';
import { MessageSquare, X, Send, Star, Smile, Meh, Frown } from 'lucide-react';

const FeedbackModal: React.FC<{ isOpen: boolean; onClose: () => void; lang: 'en' | 'hi' }> = ({ isOpen, onClose, lang }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('general');

  const categories = [
    { id: 'teacher', label: lang === 'en' ? 'Teacher' : 'शिक्षक' },
    { id: 'course', label: lang === 'en' ? 'Course' : 'पाठ्यक्रम' },
    { id: 'website', label: lang === 'en' ? 'Website' : 'वेबसाइट' },
    { id: 'exam', label: lang === 'en' ? 'Exams' : 'परीक्षा' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white border-4 border-slate-900 rounded-[50px] p-10 sketchy-shadow relative">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-xl transition-all">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-400 border-4 border-slate-900 organic-shape flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">
            {lang === 'en' ? 'Campus Feedback' : 'कैंपस प्रतिक्रिया'}
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            {lang === 'en' ? 'Help us evolve the twin cognition' : 'कॉग्निटिव ट्विन को बेहतर बनाने में मदद करें'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-2 justify-center mb-8">
            {[1, 2, 3, 4, 5].map(num => (
              <button 
                key={num} 
                onClick={() => setRating(num)}
                className={`p-4 border-2 rounded-2xl transition-all ${rating >= num ? 'bg-amber-400 border-slate-900 shadow-md' : 'bg-slate-50 border-slate-100'}`}
              >
                <Star size={24} fill={rating >= num ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(c => (
              <button 
                key={c.id} 
                onClick={() => setCategory(c.id)}
                className={`px-4 py-2 border-2 rounded-xl text-[10px] font-black uppercase transition-all ${category === c.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={lang === 'en' ? "Share your thoughts..." : "अपने विचार साझा करें..."}
            className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-900 rounded-2xl outline-none font-bold text-sm resize-none"
          />

          <button 
            onClick={() => { alert(lang === 'en' ? 'Feedback Received!' : 'प्रतिक्रिया प्राप्त हुई!'); onClose(); }}
            className="w-full py-4 bg-teal-500 text-white border-4 border-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3"
          >
            <Send size={18} /> {lang === 'en' ? 'Transmit Feedback' : 'प्रतिक्रिया भेजें'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
