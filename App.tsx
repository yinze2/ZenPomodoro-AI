
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, Task, TimerSettings, SessionStats } from './types';
import { DEFAULT_SETTINGS, THEME_COLORS } from './constants';
import { TimerDisplay } from './components/TimerDisplay';
import { TaskList } from './components/TaskList';
import { FocusCoach } from './components/FocusCoach';
import { SettingsModal } from './components/SettingsModal';
import { 
  Settings as SettingsIcon, 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  BrainCircuit,
  Layout
} from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [stats, setStats] = useState<SessionStats>({
    totalFocusTime: 0,
    completedSessions: 0,
    dailyGoal: 8
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeTask = tasks.find(t => t.id === activeTaskId) || null;

  const onSessionComplete = useCallback(() => {
    if (mode === TimerMode.FOCUS) {
      setStats(prev => ({
        ...prev,
        completedSessions: prev.completedSessions + 1,
        totalFocusTime: prev.totalFocusTime + settings.focusTime
      }));

      // Update active task progress
      if (activeTaskId) {
        setTasks(prev => prev.map(t => 
          t.id === activeTaskId 
            ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
            : t
        ));
      }

      // Determine next mode
      const nextMode = (stats.completedSessions + 1) % settings.longBreakInterval === 0 
        ? TimerMode.LONG_BREAK 
        : TimerMode.SHORT_BREAK;
      
      setMode(nextMode);
    } else {
      setMode(TimerMode.FOCUS);
    }
  }, [mode, activeTaskId, stats.completedSessions, settings]);

  return (
    <div className="min-h-screen transition-colors duration-500 selection:bg-rose-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className={`absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${THEME_COLORS[mode].bg}`} />
        <div className={`absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${THEME_COLORS[mode].bg}`} />
      </div>

      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/5 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${THEME_COLORS[mode].accent} text-white transition-all`}>
            <Clock size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">ZenPomodoro <span className="text-rose-500">AI</span></span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 mr-6 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
             <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>{stats.completedSessions}/{stats.dailyGoal}</span>
             </div>
             <div className="w-px h-4 bg-white/20" />
             <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-sky-500" />
                <span>{stats.totalFocusTime}m</span>
             </div>
          </div>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <SettingsIcon size={22} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Timer & Coach */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
             <div className="flex justify-center gap-4 mb-12">
                {[TimerMode.FOCUS, TimerMode.SHORT_BREAK, TimerMode.LONG_BREAK].map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      mode === m 
                        ? `${THEME_COLORS[m].bg} ${THEME_COLORS[m].primary} border border-white/10` 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {m.replace('_', ' ')}
                  </button>
                ))}
             </div>

             <TimerDisplay 
               mode={mode} 
               settings={settings} 
               onComplete={onSessionComplete}
             />

             {activeTask && (
               <div className="mt-8 text-center">
                 <p className="text-slate-400 text-sm mb-1 uppercase tracking-widest font-semibold">Focusing on</p>
                 <h2 className="text-xl font-medium">{activeTask.title}</h2>
               </div>
             )}
          </div>

          <FocusCoach mode={mode} activeTask={activeTask} sessionsCompleted={stats.completedSessions} />
        </div>

        {/* Right Column: Tasks */}
        <div className="lg:col-span-5 flex flex-col gap-8 h-full">
           <TaskList 
             tasks={tasks} 
             setTasks={setTasks} 
             activeTaskId={activeTaskId} 
             setActiveTaskId={setActiveTaskId} 
           />
           
           {/* Summary Stats Mini-Board */}
           <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-slate-400">
                <BarChart2 size={18} />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Stats</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-2xl font-bold text-rose-500">{stats.completedSessions}</p>
                    <p className="text-xs text-slate-500">Total Sessions</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-2xl font-bold text-sky-500">{stats.totalFocusTime}m</p>
                    <p className="text-xs text-slate-500">Focus Time</p>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings} 
        setSettings={setSettings} 
      />
    </div>
  );
};

export default App;
