import React from 'react';
import { Trash2, Edit2, CheckCircle, Circle, Clock } from 'lucide-react';
import type { Task } from '../../types/task';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<Props> = ({ task, onToggle, onDelete, onEdit }) => {
  const isOverdue = !task.completed && task.dueDate && task.dueDate < new Date().toISOString().split('T')[0];

  const getPriorityStyle = () => {
    if (task.priority === 'High') return 'text-red-600';
    if (task.priority === 'Medium') return 'text-amber-600';
    return 'text-blue-600';
  };

  return (
    <div className={`
      group flex items-center gap-4 py-3 px-2 border-b border-slate-100 transition-colors
      ${task.completed ? 'bg-transparent' : 'hover:bg-slate-50/50'}
    `}>
      {/* 1. Left: Toggle Button */}
      <button 
        onClick={() => onToggle(task.id)} 
        className="flex-shrink-0 transition-transform active:scale-90"
      >
        {task.completed 
          ? <CheckCircle className="text-slate-300" size={20} /> 
          : <Circle className="text-slate-400 hover:text-slate-600" size={20} />
        }
      </button>

      {/* 2. Middle: Content Wrapper - Title and Meta on one line */}
      <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-hidden">
        <span className={`text-sm sm:text-base truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {task.title}
        </span>
        
        {/* Meta info aligned to the right of the title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-current opacity-70 ${getPriorityStyle()}`}>
            {task.priority}
          </span>

          <span className="text-[11px] text-slate-400 font-medium">
            {task.category}
          </span>

          {task.dueDate && (
            <span className={`text-[11px] flex items-center gap-1 min-w-[70px] ${isOverdue ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
              <Clock size={10} />
              {task.dueDate}
            </span>
          )}
        </div>
      </div>

      {/* 3. Right: Action Buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        <button 
          onClick={() => onEdit(task)} 
          className="p-1 text-slate-400 hover:text-slate-900"
          title="Edit"
        >
          <Edit2 size={14} />
        </button>
        <button 
          onClick={() => onDelete(task.id)} 
          className="p-1 text-slate-400 hover:text-red-600"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};