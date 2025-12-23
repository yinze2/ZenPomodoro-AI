
import React, { useState, useEffect } from 'react';
import { TimerMode, Task } from '../types';
import { getFocusCoachAdvice } from '../services/geminiService';
import { Sparkles, RefreshCw } from 'lucide-react';

interface FocusCoachProps {
  mode: TimerMode;
  activeTask: Task | null;
  sessionsCompleted: number;
}

export const FocusCoach: React.FC<FocusCoachProps> = ({ mode, activeTask, sessionsCompleted }) => {
  const [advice, setAdvice] = useState<string>("Ready to make today count?");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdvice = async () => {
    setIsLoading(true);
    const newAdvice = await getFocusCoachAdvice(activeTask, mode, sessionsCompleted);
    setAdvice(newAdvice);
    setIsLoading(false);
  };

  useEffect(() => {
    // Fetch advice whenever mode changes or active task changes (debounced if needed, but simple for now)
    fetchAdvice();
  }, [mode, activeTask?.id]);

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-6 relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <Sparkles size={24} className="text-indigo-400 opacity-30 group-hover:opacity-100 transition-opacity animate-pulse" />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 shadow-xl shadow-indigo-500/20">
          <Sparkles size={24} className="text-white" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">AI Focus Coach</p>
          <p className={`text-slate-200 leading-relaxed font-medium ${isLoading ? 'opacity-50 animate-pulse' : ''}`}>
            {advice}
          </p>
        </div>

        <button 
          onClick={fetchAdvice}
          disabled={isLoading}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-white disabled:opacity-30"
          title="Refresh Advice"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  );
};
