
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, TimerSettings } from '../types';
import { THEME_COLORS } from '../constants';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface TimerDisplayProps {
  mode: TimerMode;
  settings: TimerSettings;
  onComplete: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ mode, settings, onComplete }) => {
  const getInitialTime = useCallback(() => {
    switch (mode) {
      case TimerMode.FOCUS: return settings.focusTime * 60;
      case TimerMode.SHORT_BREAK: return settings.shortBreakTime * 60;
      case TimerMode.LONG_BREAK: return settings.longBreakTime * 60;
      default: return 25 * 60;
    }
  }, [mode, settings]);

  const [timeLeft, setTimeLeft] = useState(getInitialTime());
  const [isActive, setIsActive] = useState(false);
  // Fix: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> to avoid namespace errors in browser environments
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimeLeft(getInitialTime());
    setIsActive(false);
  }, [getInitialTime]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete();
      // Browser notification or sound could go here
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getInitialTime());
  };

  const skipTimer = () => {
    setIsActive(false);
    onComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = getInitialTime();
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        {/* Progress Circle SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className="stroke-white/5 fill-transparent"
            strokeWidth="8"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className={`fill-transparent transition-all duration-300 ${THEME_COLORS[mode].primary} stroke-current`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Time Display */}
        <div className="text-center z-10">
          <span className="text-7xl md:text-8xl font-bold tracking-tighter mono">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-12">
        <button
          onClick={resetTimer}
          className="p-3 text-slate-500 hover:text-white transition-colors"
          title="Reset"
        >
          <RotateCcw size={24} />
        </button>

        <button
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-all ring-offset-4 ring-offset-[#0f172a] hover:ring-4 ${THEME_COLORS[mode].accent} ${THEME_COLORS[mode].ring} text-white`}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <button
          onClick={skipTimer}
          className="p-3 text-slate-500 hover:text-white transition-colors"
          title="Skip"
        >
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
};