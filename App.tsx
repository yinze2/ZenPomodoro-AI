import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, SkipForward, 
  Settings as SettingsIcon, Check, Plus, Trash2, 
  Clock, Target, X 
} from 'lucide-react';

// --- 模式定义 ---
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

// --- 显式定义样式，确保 Tailwind 构建时不丢失 ---
const THEME_CONFIG = {
  [TimerMode.FOCUS]: {
    label: '专注',
    bg: 'bg-rose-500',
    text: 'text-rose-500',
    glow: 'bg-rose-500',
    lightBg: 'bg-rose-500/20',
    border: 'border-rose-500/30'
  },
  [TimerMode.SHORT_BREAK]: {
    label: '短休',
    bg: 'bg-emerald-500',
    text: 'text-emerald-500',
    glow: 'bg-emerald-500',
    lightBg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30'
  },
  [TimerMode.LONG_BREAK]: {
    label: '长休',
    bg: 'bg-sky-500',
    text: 'text-sky-500',
    glow: 'bg-sky-500',
    lightBg: 'bg-sky-500/20',
    border: 'border-sky-500/30'
  }
};

const App: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [isActive, setIsActive] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [durations, setDurations] = useState({
    [TimerMode.FOCUS]: 25,
    [TimerMode.SHORT_BREAK]: 5,
    [TimerMode.LONG_BREAK]: 15
  });

  const [timeLeft, setTimeLeft] = useState(durations[TimerMode.FOCUS] * 60);
  const timerRef = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
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
      if (timerRef.current) clearInterval(timerRef.current);
      new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(() => {});
      alert(`${THEME_CONFIG[mode].label} 完成！`);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentTheme = THEME_CONFIG[mode];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
      {/* 背景光晕 */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-10 pointer-events-none transition-colors duration-1000 ${currentTheme.glow}`} />

      <div className="w-full max-w-4xl relative z-10">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${currentTheme.bg} text-white transition-colors duration-500 shadow-lg`}>
              <Clock size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ZenPomodoro</h1>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all">
            <SettingsIcon size={20} />
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* 计时器 */}
          <div className="lg:col-span-3">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-10 md:p-16 text-center backdrop-blur-md shadow-2xl">
              <div className="flex justify-center gap-3 mb-12">
                {(Object.keys(TimerMode) as Array<keyof typeof TimerMode>).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(TimerMode[m])}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                      mode === TimerMode[m] 
                        ? `${THEME_CONFIG[TimerMode[m]].lightBg} ${THEME_CONFIG[TimerMode[m]].text} border ${THEME_CONFIG[TimerMode[m]].border}` 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {THEME_CONFIG[TimerMode[m]].label}
                  </button>
                ))}
              </div>

              <div className="mb-14">
                <div className="text-8xl md:text-[10rem] font-bold tracking-tighter tabular-nums leading-none">
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="flex items-center justify-center gap-8">
                <button onClick={resetTimer} className="p-3 text-slate-500 hover:text-white transition-colors"><RotateCcw size={28} /></button>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${currentTheme.bg} text-white ring-[12px] ring-white/5`}
                >
                  {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                </button>
                <button onClick={() => setTimeLeft(0)} className="p-3 text-slate-500 hover:text-white transition-colors"><SkipForward size={28} /></button>
              </div>
            </div>
          </div>

          {/* 任务列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 flex flex-col h-[480px] backdrop-blur-md">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold flex items-center gap-2 text-slate-200"><Target size={20} className="text-rose-500" /> 今日计划</h2>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-500 font-bold">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
                {tasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 italic text-sm text-center">专注当下，从添加一个任务开始</div>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className={`group flex items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.04] ${task.completed ? 'opacity-40' : ''}`}>
                      <button 
                        onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-white/40'}`}
                      >
                        {task.completed && <Check size={14} className="text-white" />}
                      </button>
                      <span className={`flex-1 text-sm truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.title}</span>
                      <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); if(!newTaskTitle.trim())return; setTasks([...tasks, {id: Date.now().toString(), title: newTaskTitle, completed: false}]); setNewTaskTitle(''); }} className="relative">
                <input
                  type="text"
                  placeholder="想做点什么？"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all placeholder:text-slate-600 shadow-inner"
                />
                <button type="submit" className={`absolute right-2 top-2 p-2 ${currentTheme.bg} rounded-xl text-white shadow-lg`}>
                  <Plus size={20} />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* 设置弹窗 */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="absolute inset-0 bg-slate-950/60" onClick={() => setIsSettingsOpen(false)} />
          <div className="bg-[#1e293b] border border-white/10 w-full max-w-sm rounded-[2.5rem] p-10 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-bold text-2xl tracking-tight">时间偏好</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
            </div>
            <div className="space-y-8">
              {(Object.keys(TimerMode) as Array<keyof typeof TimerMode>).map((m) => (
                <div key={m} className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">{THEME_CONFIG[TimerMode[m]].label} (分钟)</span>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={durations[TimerMode[m]]}
                    onChange={(e) => setDurations({ ...durations, [TimerMode[m]]: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-20 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-center font-bold text-lg focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
            <button onClick={() => setIsSettingsOpen(false)} className="w-full mt-12 bg-rose-500 py-4 rounded-2xl font-bold text-lg hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 active:scale-[0.98]">
              应用并保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;