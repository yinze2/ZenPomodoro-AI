
import { TimerMode, TimerSettings } from './types';

export const DEFAULT_SETTINGS: TimerSettings = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};

export const THEME_COLORS = {
  [TimerMode.FOCUS]: {
    primary: 'text-rose-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    accent: 'bg-rose-500',
    ring: 'ring-rose-500/30'
  },
  [TimerMode.SHORT_BREAK]: {
    primary: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    accent: 'bg-emerald-500',
    ring: 'ring-emerald-500/30'
  },
  [TimerMode.LONG_BREAK]: {
    primary: 'text-sky-500',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    accent: 'bg-sky-500',
    ring: 'ring-sky-500/30'
  }
};
