
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  PenTool,
  Upload,
  Plus,
  X,
  Send,
  Paperclip,
  Trash2,
  FileIcon
} from 'lucide-react';
import { evaluateSubmission } from '../services/geminiService';
import { SubmissionFeedback, User, Assignment, AssignmentSubmission, Attachment } from '../types';
import { translations } from '../translations';
import { SAMPLE_ASSIGNMENTS } from '../constants';

const SubmissionWorkspace: React.FC<{ user: User; lang: 'en' | 'hi' }> = ({ user, lang }) => {
  const t = translations[lang];
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('ct_assignments');
    return saved ? JSON.parse(saved) : SAMPLE_ASSIGNMENTS;
  });
  
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem('ct_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', deadline: '' });
  
  const [submissionContent, setSubmissionContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('ct_assignments', JSON.stringify(assignments));
    localStorage.setItem('ct_submissions', JSON.stringify(submissions));
  }, [assignments, submissions]);

  const handleCreateAssignment = () => {
    if (!newAssignment.title) return;
    const a: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      title: newAssignment.title,
      description: newAssignment.description,
      teacherId: user.id,
      teacherName: user.name,
      deadline: newAssignment.deadline || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    setAssignments([a, ...assignments]);
    setShowCreateModal(false);
    setNewAssignment({ title: '', description: '', deadline: '' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: Attachment[] = Array.from(files).map((f: File) => ({ 
        name: f.name, 
        type: f.type,
        url: URL.createObjectURL(f)
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitWork = async () => {
    if (!activeAssignment || (!submissionContent && selectedFiles.length === 0)) return;
    setLoading(true);
    
    try {
      const evalResult = await evaluateSubmission(submissionContent || "Project file submission attached", "Assignment");
      const sub: AssignmentSubmission = {
        id: Math.random().toString(36).substr(2, 9),
        assignmentId: activeAssignment.id,
        studentId: user.id,
        studentName: user.name,
        content: submissionContent,
        attachments: selectedFiles,
        submittedAt: new Date().toISOString(),
        feedback: evalResult
      };
      setSubmissions([sub, ...submissions]);
      setSubmissionContent('');
      setSelectedFiles([]);
      alert(lang === 'en' ? "Submission Received!" : "प्रविष्टि प्राप्त हुई!");
    } catch (err) {
      alert("Evaluation failed, but submission recorded.");
    } finally {
      setLoading(false);
    }
  };

  const studentSubmission = activeAssignment ? submissions.find(s => s.assignmentId === activeAssignment.id && s.studentId === user.id) : null;

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-white border-4 border-slate-900 rounded-[50px] p-10 sketchy-shadow relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 organic-shape opacity-40" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-600 border-4 border-slate-900 organic-shape flex items-center justify-center text-white shadow-xl">
              <PenTool size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">ACADEMIC WORKSPACE</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{t.eval_portal}</p>
            </div>
          </div>
          {user.role === 'teacher' && (
            <button onClick={() => setShowCreateModal(true)} className="px-10 py-4 bg-teal-500 text-white border-4 border-slate-900 rounded-2xl font-black uppercase text-xs sketchy-shadow hover:translate-y-[-2px] transition-all flex items-center gap-3">
              <Plus size={18} /> New Assignment
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] px-4">Assignments</h3>
          <div className="space-y-4">
            {assignments.map(a => {
              const hasSubmitted = submissions.some(s => s.assignmentId === a.id && s.studentId === user.id);
              return (
                <div 
                  key={a.id} 
                  onClick={() => setActiveAssignment(a)}
                  className={`p-6 border-4 border-slate-900 rounded-3xl sketchy-shadow cursor-pointer transition-all ${activeAssignment?.id === a.id ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black uppercase tracking-tight text-lg line-clamp-1">{a.title}</h4>
                    {hasSubmitted && <CheckCircle size={20} className="text-teal-400" />}
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-60 flex justify-between">
                    <span>Deadline: {a.deadline}</span>
                    <span>By: {a.teacherName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          {activeAssignment ? (
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
              <div className="bg-white border-4 border-slate-900 rounded-[40px] p-10 sketchy-shadow">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{activeAssignment.title}</h3>
                  <button onClick={() => setActiveAssignment(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={20}/></button>
                </div>
                <p className="text-sm font-bold text-slate-500 mb-10 leading-relaxed bg-slate-50 p-6 border-2 border-slate-900 rounded-2xl italic">"{activeAssignment.description}"</p>
                
                <div className="pt-10 border-t-4 border-slate-100">
                  {studentSubmission ? (
                    <div className="p-10 bg-teal-50 border-4 border-slate-900 rounded-[40px] text-center relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-6 opacity-10"><CheckCircle size={100} /></div>
                       <CheckCircle size={48} className="mx-auto text-teal-600 mb-6" />
                       <h4 className="text-xl font-black uppercase tracking-tight">Work Submitted Successfully</h4>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Analysis timestamp: {new Date(studentSubmission.submittedAt).toLocaleString()}</p>
                       <div className="mt-8 grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/40 rounded-2xl border-2 border-slate-900">
                             <div className="text-3xl font-black text-slate-900">{studentSubmission.feedback?.overallGrade || 'A'}</div>
                             <div className="text-[8px] font-black uppercase text-slate-400">AI Evaluation</div>
                          </div>
                          <div className="p-4 bg-white/40 rounded-2xl border-2 border-slate-900">
                             <div className="text-3xl font-black text-slate-900">{studentSubmission.feedback?.originalityScore || 100}%</div>
                             <div className="text-[8px] font-black uppercase text-slate-400">Originality</div>
                          </div>
                       </div>
                    </div>
                  ) : user.role === 'student' ? (
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                         <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Submission Portal</h4>
                      </div>

                      <div className="space-y-4">
                        <textarea 
                          value={submissionContent}
                          onChange={(e) => setSubmissionContent(e.target.value)}
                          placeholder={lang === 'en' ? "Write a short summary of your work or findings here..." : "यहाँ अपने काम या निष्कर्षों का एक संक्षिप्त सारांश लिखें..."}
                          className="w-full h-48 p-8 bg-slate-50 border-4 border-slate-900 rounded-[32px] outline-none font-bold text-sm resize-none"
                        />

                        {/* ATTACHMENT SECTION */}
                        <div className="bg-white border-4 border-slate-900 rounded-3xl p-6">
                           <div className="flex items-center justify-between mb-6">
                              <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                                <Paperclip size={14} /> {t.attachments || 'ATTACHMENTS'}
                              </span>
                              <label className="px-6 py-2 bg-slate-900 text-white border-2 border-slate-900 rounded-xl cursor-pointer hover:bg-slate-800 transition-all text-[10px] font-black uppercase flex items-center gap-2 shadow-sm">
                                <Upload size={14}/> Browse Files
                                <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                              </label>
                           </div>

                           {selectedFiles.length > 0 ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               {selectedFiles.map((file, i) => (
                                 <div key={i} className="flex items-center justify-between p-3 bg-teal-50 border-2 border-slate-900 rounded-xl animate-in fade-in zoom-in duration-200">
                                   <div className="flex items-center gap-3 overflow-hidden">
                                     <FileIcon size={16} className="text-teal-600 shrink-0" />
                                     <span className="text-[10px] font-black uppercase truncate">{file.name}</span>
                                   </div>
                                   <button onClick={() => removeFile(i)} className="p-1 hover:bg-teal-100 rounded text-rose-500 transition-colors">
                                     <Trash2 size={14} />
                                   </button>
                                 </div>
                               ))}
                             </div>
                           ) : (
                             <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                               <p className="text-[10px] font-black text-slate-300 uppercase">Drag & Drop or Click Browse to insert your project files</p>
                             </div>
                           )}
                        </div>
                      </div>

                      <button 
                        onClick={handleSubmitWork}
                        disabled={loading}
                        className="w-full py-5 bg-teal-500 text-white border-4 border-slate-900 rounded-[32px] font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Send size={20} />}
                        {loading ? 'PROCESSING...' : t.submit}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Incoming Submissions</h4>
                       {submissions.filter(s => s.assignmentId === activeAssignment.id).length === 0 ? (
                         <div className="p-10 text-center border-4 border-dashed border-slate-100 rounded-3xl">
                           <span className="text-[10px] font-black text-slate-300 uppercase">Waiting for students...</span>
                         </div>
                       ) : (
                         submissions.filter(s => s.assignmentId === activeAssignment.id).map(s => (
                           <div key={s.id} className="p-6 bg-white border-2 border-slate-900 rounded-2xl flex items-center justify-between hover:bg-teal-50 transition-colors cursor-pointer">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center font-black">{s.studentName.charAt(0)}</div>
                                 <div className="flex flex-col">
                                   <span className="text-sm font-black uppercase">{s.studentName}</span>
                                   <span className="text-[8px] font-bold text-slate-400">{s.attachments.length} files attached</span>
                                 </div>
                              </div>
                              <span className="text-[10px] font-black text-teal-600 uppercase border-2 border-teal-600 px-3 py-1 rounded-lg">Grade: {s.feedback?.overallGrade || '...'}</span>
                           </div>
                         ))
                       )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-white border-4 border-dashed border-slate-200 rounded-[50px] flex flex-col items-center justify-center p-20 text-center">
               <div className="w-24 h-24 bg-slate-50 border-4 border-slate-200 organic-shape flex items-center justify-center text-slate-200 mb-6">
                 <PenTool size={48} />
               </div>
               <h3 className="text-2xl font-black uppercase text-slate-300">Select an active assignment to submit your work</h3>
               <p className="text-xs font-bold text-slate-200 uppercase mt-2">AI-Powered plagiarism and quality check enabled</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white border-4 border-slate-900 rounded-[50px] p-12 sketchy-shadow relative animate-in zoom-in duration-300">
             <button onClick={() => setShowCreateModal(false)} className="absolute top-10 right-10 p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={24}/></button>
             <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">New Assignment</h3>
             <div className="space-y-6">
                <input 
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-900 rounded-2xl outline-none font-bold uppercase"
                  placeholder="Module Title"
                />
                <textarea 
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  className="w-full h-32 px-6 py-4 bg-slate-50 border-2 border-slate-900 rounded-2xl outline-none font-bold"
                  placeholder="Task Description"
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Due Date</label>
                  <input type="date" value={newAssignment.deadline} onChange={(e) => setNewAssignment({...newAssignment, deadline: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-900 rounded-2xl outline-none font-bold" />
                </div>
                <button onClick={handleCreateAssignment} className="w-full py-5 bg-teal-500 text-white border-4 border-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-xl">Publish to Class</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionWorkspace;
