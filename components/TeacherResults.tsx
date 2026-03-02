
import React from 'react';
import { ExamResult } from '../types';
import { ClipboardList, Users, TrendingUp, Search, Brain } from 'lucide-react';

const TeacherResults: React.FC<{ results: ExamResult[] }> = ({ results }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-white border-4 border-slate-900 rounded-[50px] p-12 sketchy-shadow flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-10">
          <div className="w-24 h-24 bg-slate-900 border-4 border-slate-900 rounded-[32px] flex items-center justify-center text-white sketchy-shadow transform rotate-3">
            <ClipboardList size={40} />
          </div>
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Class Analytics</h2>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-4 flex items-center gap-3">
              <TrendingUp size={16} className="text-teal-500" /> Cognitive progress tracking enabled
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="px-8 py-4 bg-teal-50 border-2 border-slate-900 rounded-2xl text-center">
              <div className="text-2xl font-black text-slate-900">{results.length}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase">Submissions</div>
           </div>
           <div className="px-8 py-4 bg-amber-50 border-2 border-slate-900 rounded-2xl text-center">
              <div className="text-2xl font-black text-slate-900">
                 {results.length ? (results.reduce((acc, r) => acc + (r.score/r.totalQuestions), 0) / results.length * 100).toFixed(0) : 0}%
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase">Avg Mastery</div>
           </div>
        </div>
      </div>

      <div className="bg-white border-4 border-slate-900 rounded-[40px] p-8 sketchy-shadow overflow-hidden">
        <div className="flex items-center justify-between mb-8 px-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Performance Log</h3>
           <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search student..." className="pl-12 pr-6 py-3 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none text-xs font-bold" />
           </div>
        </div>

        {results.length === 0 ? (
          <div className="p-20 text-center font-black uppercase text-slate-300">No results recorded yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-4 border-slate-900">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Student</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Assessment</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Grade</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Score</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">AI Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {results.map(r => (
                  <tr key={r.id} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="px-6 py-6 font-black text-sm text-slate-900">{r.studentName}</td>
                    <td className="px-6 py-6 text-xs font-bold text-slate-500">{r.examTitle}</td>
                    <td className="px-6 py-6">
                       <span className={`px-4 py-1 rounded-lg border-2 border-slate-900 font-black text-xs ${r.grade === 'A' ? 'bg-teal-400' : r.grade === 'B' ? 'bg-amber-400' : 'bg-rose-400'}`}>
                         {r.grade}
                       </span>
                    </td>
                    <td className="px-6 py-6 text-sm font-black text-slate-900">{r.score}/{r.totalQuestions}</td>
                    <td className="px-6 py-6 max-w-xs">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 italic line-clamp-2">
                         <Brain size={14} className="text-indigo-400 shrink-0" />
                         {r.analysis}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherResults;
