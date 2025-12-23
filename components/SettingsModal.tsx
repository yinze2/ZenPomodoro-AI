
import React from 'react';
import { TimerSettings } from '../types';
import { X, Clock, Zap, Target } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  setSettings: React.Dispatch<React.SetStateAction<TimerSettings>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, setSettings }) => {
  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-[#1e293b] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <h3 className="text-xl font-bold flex items-center gap-2">
             <Clock size={24} className="text-rose-500" />
             Settings
           </h3>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
             <X size={20} />
           </button>
        </div>

        <div className="p-8 space-y-8">
           <section>
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
               <Zap size={14} /> Durations (Minutes)
             </h4>
             <div className="grid grid-cols-3 gap-4">
               {[
                 { label: 'Focus', name: 'focusTime' as keyof TimerSettings },
                 { label: 'Short', name: 'shortBreakTime' as keyof TimerSettings },
                 { label: 'Long', name: 'longBreakTime' as keyof TimerSettings }
               ].map(field => (
                 <div key={field.name} className="flex flex-col gap-2">
                   <label className="text-xs text-slate-400 pl-1">{field.label}</label>
                   <input
                     type="number"
                     name={field.name}
                     value={settings[field.name] as number}
                     onChange={handleInputChange}
                     min="1"
                     max="60"
                     className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all mono text-center"
                   />
                 </div>
               ))}
             </div>
           </section>

           <section className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Target size={14} /> Automation
              </h4>
              
              <div className="flex items-center justify-between group">
                <div>
                  <p className="text-sm font-medium">Auto-start Breaks</p>
                  <p className="text-xs text-slate-500">Starts break timer automatically</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="autoStartBreaks"
                    checked={settings.autoStartBreaks}
                    onChange={handleInputChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between group">
                <div>
                  <p className="text-sm font-medium">Auto-start Pomodoros</p>
                  <p className="text-xs text-slate-500">Starts focus timer after a break</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="autoStartPomodoros"
                    checked={settings.autoStartPomodoros}
                    onChange={handleInputChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between group">
                <div>
                  <p className="text-sm font-medium">Long Break Interval</p>
                  <p className="text-xs text-slate-500">Sessions before a long break</p>
                </div>
                <input
                   type="number"
                   name="longBreakInterval"
                   value={settings.longBreakInterval}
                   onChange={handleInputChange}
                   min="1"
                   className="w-16 bg-white/5 border border-white/10 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all mono text-center text-sm"
                />
              </div>
           </section>
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5 text-center">
           <button 
             onClick={onClose}
             className="bg-rose-500 text-white font-bold py-3 px-8 rounded-2xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 active:scale-95"
           >
             Save & Close
           </button>
        </div>
      </div>
    </div>
  );
};
