import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, SkipForward, 
  Settings as SettingsIcon, Check, Plus, Trash2, 
  Clock, Target, X 
} from 'lucide-react';

// --- Types ---
enum TimerMode {
  FOCUS = 'FOCUS',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK'
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

// --- Constants ---
const MODE_DATA = {
  [TimerMode.FOCUS]: { label: 'Focus', color: 'rose', time: 25 },
  [TimerMode.SHORT_BREAK]: { label: 'Short Break', color: 'emerald', time: 5 },
  [TimerMode.LONG_BREAK]: { label: 'Long Break', color: 'sky', time: 15 }
};

const App: React.FC = () => {
  // --- State ---
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MODE_DATA[TimerMode.FOCUS].time * 60);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings
  const [durations, setDurations] = useState({
    [TimerMode.FOCUS]: 25,
    [TimerMode.SHORT_BREAK]: 5,
    [TimerMode.LONG_BREAK]: 15
  });

  const timerRef = useRef<number | null>(null);

  // --- Timer Logic ---
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(durations[mode] * 60);
  }, [mode, durations]);

  useEffect(() => {
    resetTimer();
  }, [mode, durations, resetTimer]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert(`${MODE_DATA[mode].label} session complete!`);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- Task Logic ---
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), title: newTaskTitle, completed: false }]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // --- Styles ---
  const themeColor = MODE_DATA[mode].color;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-rose-500/30 p-4 md:p-8">
      {/* Background Glow */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none transition-colors duration-1000 ${
        themeColor === 'rose' ? 'bg-rose-500' : themeColor === 'emerald' ? 'bg-emerald-500' : 'bg-sky-500'
      }`} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-${themeColor}-500 text-white`}>
              <Clock size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ZenPomodoro</h1>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <SettingsIcon size={20} className="text-slate-400" />
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Timer Section */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12 text-center">
              {/* Mode Switcher */}
              <div className="flex justify-center gap-2 mb-12">
                {(Object.keys(TimerMode) as Array<keyof typeof TimerMode>).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(TimerMode[m])}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      mode === TimerMode[m] 
                        ? `bg-${themeColor}-500/20 text-${themeColor}-500 border border-${themeColor}-500/30` 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {MODE_DATA[TimerMode[m]].label}
                  </button>
                ))}
              </div>

              {/* Time Display */}
              <div className="mb-12">
                <div className="text-8xl md:text-9xl font-bold mono tracking-tighter tabular-nums">
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6">
                <button onClick={resetTimer} className="p-3 text-slate-500 hover:text-white transition-colors">
                  <RotateCcw size={24} />
                </button>
                <button
                  onClick={toggleTimer}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
                    themeColor === 'rose' ? 'bg-rose-500' : themeColor === 'emerald' ? 'bg-emerald-500' : 'bg-sky-500'
                  } text-white ring-8 ring-white/5`}
                >
                  {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
                <button onClick={() => setTimeLeft(0)} className="p-3 text-slate-500 hover:text-white transition-colors">
                  <SkipForward size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Task Section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold flex items-center gap-2 text-slate-300">
                  <Target size={18} className="text-rose-500" /> Tasks
                </h2>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  {tasks.filter(t => t.completed).length} / {tasks.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 custom-scrollbar">
                {tasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 italic text-sm">
                    No tasks yet. Add one below.
                  </div>
                ) : (
                  tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`group flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] transition-all ${task.completed ? 'opacity-40' : ''}`}
                    >
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
                        }`}
                      >
                        {task.completed && <Check size={12} className="text-white" />}
                      </button>
                      <span className={`flex-1 text-sm truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                      <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-rose-500 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={addTask} className="relative">
                <input
                  type="text"
                  placeholder="Add a task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
                <button type="submit" className="absolute right-2 top-2 p-1.5 bg-rose-500 rounded-lg text-white hover:bg-rose-600 transition-colors">
                  <Plus size={18} />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Simplified Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="bg-[#1e293b] border border-white/10 w-full max-w-sm rounded-3xl p-6 relative shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Timer Settings</h3>
              <button onClick={() => setIsSettingsOpen(false)}><X size={20}/></button>
            </div>
            
            <div className="space-y-6">
              {(Object.keys(TimerMode) as Array<keyof typeof TimerMode>).map((m) => (
                <div key={m} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{MODE_DATA[TimerMode[m]].label} (min)</span>
                  <input
                    type="number"
                    value={durations[TimerMode[m]]}
                    onChange={(e) => setDurations({ ...durations, [TimerMode[m]]: parseInt(e.target.value) || 1 })}
                    className="w-16 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center mono text-sm"
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="w-full mt-8 bg-rose-500 py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Essential TailWind classes for dynamic colors */}
      <div className="hidden bg-rose-500 bg-emerald-500 bg-sky-500 text-rose-500 text-emerald-500 text-sky-500 border-rose-500/30 border-emerald-500/30 border-sky-500/30 bg-rose-500/20 bg-emerald-500/20 bg-sky-500/20" />
    </div>
  );
};

export default App;