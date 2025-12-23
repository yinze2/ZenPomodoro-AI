
import React, { useState } from 'react';
import { Task } from '../types';
// Fix: Added missing Layout icon to imports
import { Plus, Check, Trash2, GripVertical, Target, Layout } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, activeTaskId, setActiveTaskId }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle.trim(),
      completed: false,
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      createdAt: Date.now()
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    if (tasks.length === 0) setActiveTaskId(newTask.id);
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col h-[500px] overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Target size={20} className="text-rose-500" />
          Tasks
        </h3>
        <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-md">
          {tasks.filter(t => t.completed).length}/{tasks.length} Done
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 space-y-2">
            <Layout size={40} strokeWidth={1} />
            <p className="text-sm">No tasks added yet.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              onClick={() => !task.completed && setActiveTaskId(task.id)}
              className={`group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                activeTaskId === task.id && !task.completed
                  ? 'bg-rose-500/10 border-rose-500/40' 
                  : 'bg-white/5 border-transparent hover:border-white/10'
              } ${task.completed ? 'opacity-40 grayscale' : ''}`}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
                className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                  task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20 hover:border-white/40'
                }`}
              >
                {task.completed && <Check size={14} />}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                   <div className="flex gap-1">
                      {Array.from({ length: Math.max(task.estimatedPomodoros, task.completedPomodoros) }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full ${i < task.completedPomodoros ? 'bg-rose-500' : 'bg-white/20'}`} 
                        />
                      ))}
                   </div>
                </div>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-500 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={addTask} className="p-4 bg-white/[0.01] border-t border-white/5">
        <div className="relative">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What are you working on?"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500/40 transition-all text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1.5 p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-lg"
          >
            <Plus size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};