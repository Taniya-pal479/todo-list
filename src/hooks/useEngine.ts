import { useState, useEffect, useMemo } from 'react';
import type{ Task, FilterOption, SortOption, Priority, Category } from '../types/task';
import { loadTasks, saveTasks } from '../utils/storage';

export const useTaskEngine = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterOption>('All');
  const [sort, setSort] = useState<SortOption>('Default');
  const [error, setError] = useState<string | null>(null);

  // Auto-save
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Actions
  const addTask = (title: string, category: Category, priority: Priority, dueDate: string) => {
    // Real-time Validation (Flow 1)
    if (!title.trim()) {
      setError("Task title cannot be empty!");
      return false;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      category,
      priority,
      dueDate,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks(prev => [newTask, ...prev]);
    setError(null);
    return true;
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const processedTasks = useMemo(() => {
    let result = tasks;

    if (search) {
      result = result.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    }
    const today = new Date().toISOString().split('T')[0];
    if (filter === 'Overdue') {
      result = result.filter(t => !t.completed && t.dueDate < today && t.dueDate !== '');
    } else if (filter === 'Work') {
      result = result.filter(t => t.category === 'Work');
    } else if (filter === 'Urgent') {
      result = result.filter(t => t.priority === 'High');
    }

    if (sort === 'Priority') {
      const weights = { High: 3, Medium: 2, Low: 1 };
      result = [...result].sort((a, b) => weights[b.priority] - weights[a.priority]);
    } else if (sort === 'Date') {
      result = [...result].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }

    return result;
  }, [tasks, search, filter, sort]);

  return {
    tasks: processedTasks,
    error,
    actions: { addTask, deleteTask, toggleComplete, updateTask, setSearch, setFilter, setSort, setError }
  };
};