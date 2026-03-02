
import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Radar as RadarIcon, Award as AwardIcon, CheckCircle, ExternalLink, ShieldCheck, Download } from 'lucide-react';
import { ExamResult, User, Certificate } from '../types';

const skillData = [
  { subject: 'Logic', A: 92, fullMark: 100 },
  { subject: 'Speed', A: 78, fullMark: 100 },
  { subject: 'Accuracy', A: 85, fullMark: 100 },
  { subject: 'Retention', A: 65, fullMark: 100 },
  { subject: 'Ethics', A: 98, fullMark: 100 },
];

const ScoreBoard: React.FC<{ results: ExamResult[], user: User }> = ({ results, user }) => {
  const userResults = results.filter(r => r.studentId === user.id);
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    const savedCerts = localStorage.getItem('ct_certs');
    if (savedCerts) {
      setCerts(JSON.parse(savedCerts));
    }
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 border-4 border-slate-900 organic-shape flex items-center justify-center text-white shadow-xl">
            <RadarIcon size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">SCORE BOARD</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Multi-dimensional cognitive analysis & credentials</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white border-2 border-slate-900 rounded-2xl flex items-center gap-3 sketchy-shadow">
              <AwardIcon className="text-amber-500" size={20} />
              <div className="text-left">
                <div className="text-xs font-black text-slate-900 uppercase leading-none">{certs.length}</div>
                <div className="text-[8px] font-bold text-slate-400 uppercase">Verified Badges</div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Cognitive Skill Analysis */}
        <div className="bg-white border-4 border-slate-900 rounded-[40px] p-10 sketchy-shadow">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 border-b-2 border-slate-50 pb-4">Cognitive Skill Radar</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} />
                <Radar name="Cognitive" dataKey="A" stroke="#0d9488" fill="#0d9488" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest mt-6 italic">Last analyzed 2 hours ago via Twin Engine</p>
        </div>

        {/* Verifiable Certificates */}
        <div className="bg-white border-4 border-slate-900 rounded-[40px] p-10 sketchy-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-50 pb-4 flex-1">Verifiable Certificates</h3>
            <ShieldCheck className="text-teal-500 mb-4" size={24} />
          </div>
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {certs.length === 0 ? (
              <div className="p-20 text-center border-4 border-dashed border-slate-100 rounded-[32px]">
                 <AwardIcon size={48} className="mx-auto text-slate-200 mb-4" />
                 <p className="text-xs font-black uppercase text-slate-300">No credentials issued yet</p>
              </div>
            ) : (
              certs.map(cert => (
                <div key={cert.id} className="p-6 bg-slate-900 text-white rounded-[32px] border-4 border-slate-900 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                    <AwardIcon size={80} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 bg-amber-400 text-slate-900 rounded-lg text-[8px] font-black uppercase">Verified</div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">{cert.issueDate}</span>
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-tighter mb-1">{cert.courseTitle}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Credential ID: {cert.verificationId}</p>
                    <div className="flex gap-4">
                      <button className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2">
                        <Download size={14} /> Download
                      </button>
                      <button className="p-3 bg-teal-500 rounded-xl text-white hover:scale-105 transition-all">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Result History Table */}
      <div className="bg-white border-4 border-slate-900 rounded-[40px] p-10 sketchy-shadow overflow-hidden">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 border-b-2 border-slate-50 pb-4">Examination History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Assessment</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Accuracy</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {userResults.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-300 font-black uppercase">No test records found</td>
                </tr>
              ) : (
                userResults.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-6 font-black text-slate-900 uppercase text-sm">{r.examTitle}</td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-3">
                          <div className="text-lg font-black text-indigo-600">{Math.round((r.score/r.totalQuestions)*100)}%</div>
                          <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-[10px]">{r.grade}</div>
                       </div>
                    </td>
                    <td className="px-6 py-6 text-xs font-bold text-teal-600 uppercase flex items-center gap-2">
                       <CheckCircle size={14} /> Recorded
                    </td>
                    <td className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase">{new Date(r.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
