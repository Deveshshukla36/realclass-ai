
import React, { useState, useEffect, useMemo } from 'react';
import { Concept } from '../types';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  BellRing, 
  X, 
  Target, 
  Layout, 
  Search, 
  ArrowUpRight, 
  Filter, 
  ArrowDownAZ,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface NotionPlannerProps {
  initialConcepts: Concept[];
}

const NotionPlanner: React.FC<NotionPlannerProps> = ({ initialConcepts }) => {
  const [concepts, setConcepts] = useState<Concept[]>(() => {
    const saved = localStorage.getItem('ct_planner_concepts');
    return saved ? JSON.parse(saved) : initialConcepts;
  });
  const [view, setView] = useState<'board' | 'calendar'>('board');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'dueDate' | 'mastery'>('dueDate');
  
  // Modal Form State
  const [newTask, setNewTask] = useState({
    name: '',
    state: 'new' as Concept['learningState'],
    priority: 'medium' as Concept['priority'],
    dueDate: new Date().toISOString().split('T')[0],
    dependencies: [] as string[]
  });

  useEffect(() => {
    localStorage.setItem('ct_planner_concepts', JSON.stringify(concepts));
  }, [concepts]);

  // Derived filtered and sorted concepts
  const processedConcepts = useMemo(() => {
    let result = concepts.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterPriority === 'all' || c.priority === filterPriority)
    );

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'mastery') return b.mastery - a.mastery;
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

    return result;
  }, [concepts, searchQuery, filterPriority, sortBy]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.name.trim()) return;
    
    const concept: Concept = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTask.name,
      mastery: 0,
      retention: 0,
      dependencies: newTask.dependencies,
      lastReviewed: new Date().toISOString().split('T')[0],
      nextReview: newTask.dueDate,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      learningState: newTask.state,
      averageResponseTime: 0,
      confidenceTrend: []
    };
    
    setConcepts(prev => [...prev, concept]);
    setIsModalOpen(false);
    setNewTask({
      name: '',
      state: 'new',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      dependencies: []
    });
  };

  const deleteConcept = (id: string) => {
    if (confirm("Remove this target?")) {
      setConcepts(prev => prev.filter(c => c.id !== id));
    }
  };

  const columns = [
    { id: 'new', label: 'Queued', color: 'border-slate-300', bg: 'bg-slate-50', icon: <Circle size={18} className="text-slate-400" /> },
    { id: 'learning', label: 'Learning', color: 'border-teal-400', bg: 'bg-teal-50', icon: <div className="w-4 h-4 rounded-full bg-teal-500 border-2 border-slate-900" /> },
    { id: 'review', label: 'Review', color: 'border-amber-400', bg: 'bg-amber-50', icon: <Clock size={18} className="text-amber-800" /> },
    { id: 'mastered', label: 'Mastered', color: 'border-indigo-400', bg: 'bg-indigo-50', icon: <CheckCircle2 size={18} className="text-indigo-800" /> },
  ] as const;

  // Calendar Logic
  const currentMonth = new Date();
  const calendarDays = useMemo(() => {
    const days = [];
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i).toISOString().split('T')[0];
      days.push({
        day: i,
        dateStr,
        tasks: processedConcepts.filter(c => c.dueDate === dateStr)
      });
    }
    return days;
  }, [currentMonth, processedConcepts]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header with Tools */}
      <div className="bg-white border-4 border-slate-900 rounded-[50px] p-10 sketchy-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
           <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-teal-500 border-4 border-slate-900 rounded-[32px] flex items-center justify-center font-black text-4xl text-white sketchy-shadow transform -rotate-3">P</div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">REAL PLANNER</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                  <Layout size={12} className="text-teal-500" /> Collaborative learning path architect
                </p>
              </div>
           </div>
           
           <div className="flex flex-wrap gap-4">
              <div className="flex p-1 bg-slate-100 border-2 border-slate-900 rounded-2xl">
                 <button onClick={() => setView('board')} className={`px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase transition-all ${view === 'board' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
                    <Layout size={14} /> Board
                 </button>
                 <button onClick={() => setView('calendar')} className={`px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase transition-all ${view === 'calendar' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
                    <CalendarIcon size={14} /> Calendar
                 </button>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 bg-teal-500 text-white border-4 border-slate-900 rounded-2xl font-black uppercase text-xs hover:translate-y-[-2px] transition-all sketchy-shadow">
                 <Plus size={18} className="inline mr-2" /> New Target
              </button>
           </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 pt-8 border-t-2 border-slate-50">
           <div className="flex-1 relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search logical path..." 
                className="w-full pl-12 pr-6 py-3 bg-slate-50 border-2 border-slate-900 rounded-2xl text-xs font-bold outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
           </div>
           <div className="flex gap-4 w-full md:w-auto">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select 
                  className="pl-10 pr-6 py-3 bg-white border-2 border-slate-900 rounded-2xl text-[10px] font-black uppercase appearance-none cursor-pointer outline-none"
                  value={filterPriority}
                  onChange={e => setFilterPriority(e.target.value)}
                >
                   <option value="all">All Priority</option>
                   <option value="high">High</option>
                   <option value="medium">Medium</option>
                   <option value="low">Low</option>
                </select>
              </div>
              <div className="relative">
                <ArrowDownAZ className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select 
                  className="pl-10 pr-6 py-3 bg-white border-2 border-slate-900 rounded-2xl text-[10px] font-black uppercase appearance-none cursor-pointer outline-none"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                >
                   <option value="dueDate">By Due Date</option>
                   <option value="name">By Name</option>
                   <option value="mastery">By Mastery</option>
                </select>
              </div>
           </div>
        </div>
      </div>

      {/* Main View Area */}
      {view === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 overflow-x-auto pb-10 scrollbar-hide">
          {columns.map(col => (
            <div key={col.id} className="space-y-8 min-w-[320px]">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl border-2 border-slate-900 ${col.bg} shadow-[4px_4px_0px_0px_#1e293b]`}>{col.icon}</div>
                  <span className="text-sm font-black text-slate-900 uppercase tracking-widest">{col.label}</span>
                </div>
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[11px] font-black border-2 border-slate-900">
                  {processedConcepts.filter(c => c.learningState === col.id).length}
                </div>
              </div>
              <div className="space-y-6">
                {processedConcepts.filter(c => c.learningState === col.id).map(concept => (
                  <div key={concept.id} className={`bg-white border-4 border-slate-900 rounded-[32px] p-8 sketchy-shadow group animate-in slide-in-from-bottom-4 duration-300 relative notion-card ${col.color}`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="space-y-1">
                        <div className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border border-slate-900 inline-block ${concept.priority === 'high' ? 'bg-rose-100 text-rose-600' : concept.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-teal-100 text-teal-600'}`}>
                          {concept.priority}
                        </div>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-tight">{concept.name}</h4>
                      </div>
                      <button onClick={() => deleteConcept(concept.id)} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><X size={16}/></button>
                    </div>

                    {concept.dependencies.length > 0 && (
                      <div className="mb-6 flex flex-wrap gap-2">
                        {concept.dependencies.map(depId => {
                          const dep = concepts.find(c => c.id === depId);
                          return (
                            <div key={depId} className="flex items-center gap-1 px-3 py-1 bg-slate-50 border-2 border-slate-200 rounded-lg text-[8px] font-black uppercase text-slate-400">
                               <LinkIcon size={10} /> {dep?.name || 'Unknown'}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t-2 border-slate-50">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={12} className="text-slate-400" />
                        <span className={`text-[10px] font-black uppercase ${new Date(concept.dueDate || '') < new Date() ? 'text-rose-500' : 'text-slate-900'}`}>
                          {concept.dueDate ? new Date(concept.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Date'}
                        </span>
                      </div>
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">{Math.round(concept.mastery * 100)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-4 border-slate-900 rounded-[50px] p-10 sketchy-shadow">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter">August 2024</h3>
              <div className="flex gap-2">
                <button className="p-2 border-2 border-slate-900 rounded-xl hover:bg-slate-50"><ChevronLeft size={20}/></button>
                <button className="p-2 border-2 border-slate-900 rounded-xl hover:bg-slate-50"><ChevronRight size={20}/></button>
              </div>
           </div>
           <div className="grid grid-cols-7 gap-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-black uppercase text-slate-400 pb-4">{d}</div>
              ))}
              {calendarDays.map((dayObj, i) => (
                <div key={i} className={`min-h-[120px] p-4 border-2 border-slate-100 rounded-2xl transition-all ${dayObj ? 'hover:border-slate-900' : 'bg-slate-50 opacity-20'}`}>
                   {dayObj && (
                     <>
                        <span className="text-xs font-black text-slate-300">{dayObj.day}</span>
                        <div className="mt-2 space-y-2">
                           {dayObj.tasks.map(task => (
                             <div key={task.id} className="p-2 bg-teal-50 border border-teal-600 rounded-lg text-[8px] font-black uppercase text-teal-900 line-clamp-1 truncate">
                               {task.name}
                             </div>
                           ))}
                        </div>
                     </>
                   )}
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="w-full max-w-xl bg-white border-4 border-slate-900 rounded-[50px] p-12 sketchy-shadow relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 p-2 hover:bg-slate-50 rounded-xl"><X size={24}/></button>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-10">Define New Logical Target</h3>
              
              <form onSubmit={handleAddTask} className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Target Name</label>
                    <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 border-2 border-slate-900 rounded-[20px]">
                      <Target className="text-teal-500" size={24} />
                      <input 
                        required 
                        autoFocus
                        value={newTask.name}
                        onChange={e => setNewTask({...newTask, name: e.target.value})}
                        className="bg-transparent outline-none w-full font-black text-slate-900 uppercase"
                        placeholder="e.g. Dijkstra optimization"
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Due Date</label>
                      <input 
                        type="date"
                        value={newTask.dueDate}
                        onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                        className="w-full px-6 py-4 bg-white border-2 border-slate-900 rounded-[20px] text-xs font-black uppercase outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Priority</label>
                      <select 
                        value={newTask.priority}
                        onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                        className="w-full px-6 py-4 bg-white border-2 border-slate-900 rounded-[20px] text-[10px] font-black uppercase outline-none appearance-none"
                      >
                         <option value="low">Low</option>
                         <option value="medium">Medium</option>
                         <option value="high">High</option>
                      </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Logical Dependencies</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-2">
                       {concepts.map(c => (
                         <button
                           key={c.id}
                           type="button"
                           onClick={() => {
                             const exists = newTask.dependencies.includes(c.id);
                             setNewTask({
                               ...newTask,
                               dependencies: exists ? newTask.dependencies.filter(id => id !== c.id) : [...newTask.dependencies, c.id]
                             });
                           }}
                           className={`px-4 py-2 rounded-xl border-2 text-[8px] font-black uppercase transition-all ${newTask.dependencies.includes(c.id) ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-900'}`}
                         >
                           {c.name}
                         </button>
                       ))}
                    </div>
                 </div>

                 <button type="submit" className="w-full py-5 bg-teal-500 text-white border-4 border-slate-900 rounded-[30px] font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-xl">
                    Publish to Logic Stream
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default NotionPlanner;
