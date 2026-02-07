import React, { useState } from 'react';
import {  Search, X } from 'lucide-react';
import { useTaskEngine } from '../../hooks/useEngine';
import { TaskItem } from '../../components/ui/TaskItem';
import type { Category, Priority} from '../../types/task';

export const DashboardPage = () => {
  const { tasks,  actions } = useTaskEngine();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Work' as Category,
    priority: 'Medium' as Priority,
    dueDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      actions.updateTask(editId, form);
      setEditId(null);
    } else {
      actions.addTask(form.title, form.category, form.priority, form.dueDate);
    }
    setForm({ title: '', category: 'Work', priority: 'Medium', dueDate: '' });
    setIsFormOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 text-slate-800">
 
      <header className="border-b pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light ">My To-Dos</h1>
       
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-black text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
          >
            + Add Task
          </button>
        )}
      </header>

 
      {isFormOpen && (
        <section className="mb-10 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">{editId ? 'Edit Task' : 'New Task'}</h2>
            <button onClick={() => setIsFormOpen(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              className="w-full p-2 border rounded bg-white"
              placeholder="What is the task?"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
            <div className="grid grid-cols-3 gap-2">
              <select className="p-2 border rounded bg-white text-sm" value={form.category} onChange={e => setForm({...form, category: e.target.value as any})}>
                <option>Work</option><option>Personal</option><option>Home</option><option>Urgent</option>
              </select>
              <select className="p-2 border rounded bg-white text-sm" value={form.priority} onChange={e => setForm({...form, priority: e.target.value as any})}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
              <input type="date" className="p-2 border rounded bg-white text-sm" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
            </div>
            <button className="w-full bg-black text-white py-2 rounded font-medium ">
              {editId ? 'Update Task' : 'Save Task'}
            </button>
          </form>
        </section>
      )}

 
      <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input 
            onChange={(e) => actions.setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-b focus:border-blue-500 outline-none" 
            placeholder="Filter by name..." 
          />
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {['All', 'Overdue', 'Work'].map(f => (
              <button 
                key={f}
                onClick={() => actions.setFilter(f as any)}
                className="text-xs border px-3 py-1 rounded-md hover:bg-slate-50"
              >
                {f}
              </button>
            ))}
          </div>
          <select 
      
            onChange={(e) => actions.setSort(e.target.value as any)}
            className="text-xs border-none bg-transparent font-medium"
          >
            <option value="Default">Sort: Default</option>
            <option value="Priority">Sort: Priority</option>
            <option value="Date">Sort: Date</option>
          </select>
        </div>
      </div>

 
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-center py-10 text-slate-400 italic border border-dashed rounded">No tasks found.</p>
        ) : (
          tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={actions.toggleComplete} 
              onDelete={actions.deleteTask}
              onEdit={(t) => {
                setForm({ title: t.title, category: t.category, priority: t.priority, dueDate: t.dueDate });
                setEditId(t.id);
                setIsFormOpen(true);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};