
import React, { useState } from 'react';
import { Plus, X, Video, FileText, AlignLeft, CheckCircle, Save, FolderPlus, Link as LinkIcon, MonitorPlay } from 'lucide-react';
import { Course, Module, User } from '../types';
import { useNavigate } from 'react-router-dom';

interface CourseCreatorProps {
  user: User;
  onSave: (course: Course) => void;
}

const CourseCreator: React.FC<CourseCreatorProps> = ({ user, onSave }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [activeModule, setActiveModule] = useState<Partial<Module>>({ title: '', type: 'text', url: '', content: '' });
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const addModule = () => {
    if (!activeModule.title) return;
    setModules([...modules, { ...activeModule, id: Math.random().toString(36).substr(2, 9) } as Module]);
    setActiveModule({ title: '', type: 'text', url: '', content: '' });
    setVideoPreview(null);
  };

  const removeModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setActiveModule({ ...activeModule, type: 'video', url });
      setVideoPreview(url);
    }
  };

  const handleSaveCourse = () => {
    if (!title || modules.length === 0) return;
    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      teacherId: user.id,
      teacherName: user.name,
      modules,
      createdAt: new Date().toISOString()
    };
    onSave(newCourse);
    navigate('/courses');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in zoom-in duration-500 pb-20">
      <div className="bg-white border-4 border-slate-900 rounded-[50px] p-12 sketchy-shadow">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-600 border-4 border-slate-900 organic-shape flex items-center justify-center text-white shadow-xl">
              <FolderPlus size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">COURSE ARCHITECT</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Design structured modules & content</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="p-4 hover:bg-slate-100 rounded-2xl border-2 border-slate-900 transition-all"><X size={24} /></button>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="p-2 bg-slate-50 border-4 border-slate-900 rounded-3xl">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course Title (e.g. Advanced Calculus)"
                className="w-full px-6 py-4 bg-transparent outline-none font-black text-lg uppercase tracking-widest"
              />
            </div>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what students will master..."
              className="w-full h-32 p-6 bg-slate-50 border-4 border-slate-900 rounded-3xl outline-none font-bold text-sm"
            />
          </div>

          <div className="pt-10 border-t-4 border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Build Modules</h3>
            
            <div className="bg-slate-50 border-4 border-slate-900 rounded-[32px] p-8 space-y-6">
               <div className="flex flex-col gap-6">
                  <div className="p-2 bg-white border-2 border-slate-900 rounded-2xl">
                    <input 
                      type="text" 
                      value={activeModule.title}
                      onChange={(e) => setActiveModule({...activeModule, title: e.target.value})}
                      placeholder="Module Title..."
                      className="w-full px-4 py-2 bg-transparent outline-none font-bold text-sm"
                    />
                  </div>
                  
                  <div className="flex gap-4 p-1 bg-white border-2 border-slate-900 rounded-2xl w-fit">
                    {(['video', 'file', 'text'] as const).map(type => (
                      <button 
                        key={type}
                        onClick={() => setActiveModule({...activeModule, type})}
                        className={`px-6 py-2 rounded-xl transition-all font-black text-[10px] uppercase ${activeModule.type === type ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {activeModule.type === 'video' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">YouTube Link or Direct Video</label>
                        <input 
                          type="text"
                          value={activeModule.url}
                          onChange={(e) => setActiveModule({...activeModule, url: e.target.value})}
                          placeholder="https://youtube.com/..."
                          className="w-full px-4 py-3 bg-white border-2 border-slate-900 rounded-xl outline-none text-xs font-bold"
                        />
                        <div className="relative">
                          <label className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-slate-900 transition-all text-xs font-black uppercase text-slate-400">
                             <Plus size={16} className="mr-2" /> Upload Video File
                             <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
                          </label>
                        </div>
                      </div>
                      <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-slate-900">
                        {videoPreview || activeModule.url ? (
                          <video src={videoPreview || activeModule.url} className="w-full h-full object-cover" controls />
                        ) : (
                          <div className="text-white/20 text-[10px] font-black uppercase flex flex-col items-center gap-2">
                             <MonitorPlay size={32} /> Video Preview
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeModule.type === 'text' && (
                    <textarea 
                      value={activeModule.content}
                      onChange={(e) => setActiveModule({...activeModule, content: e.target.value})}
                      placeholder="Module content text..."
                      className="w-full h-48 p-4 bg-white border-2 border-slate-900 rounded-2xl outline-none font-bold text-sm resize-none"
                    />
                  )}
               </div>
               <button 
                onClick={addModule}
                className="w-full py-4 bg-slate-900 text-white border-2 border-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
               >
                 <Plus size={16} /> Add Module to Syllabus
               </button>
            </div>

            <div className="mt-8 space-y-4">
               {modules.map((m, i) => (
                 <div key={m.id} className="p-6 bg-white border-2 border-slate-900 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-black text-[10px]">{i+1}</div>
                       <span className="text-sm font-black text-slate-900 uppercase">{m.title}</span>
                       <span className="text-[8px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{m.type}</span>
                    </div>
                    <button onClick={() => removeModule(m.id)} className="text-rose-500"><X size={18}/></button>
                 </div>
               ))}
            </div>
          </div>

          <button 
            onClick={handleSaveCourse}
            disabled={!title || modules.length === 0}
            className="w-full py-5 bg-teal-500 text-white border-4 border-slate-900 rounded-3xl font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-50"
          >
            <Save size={24} /> Finalize & Publish Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCreator;
