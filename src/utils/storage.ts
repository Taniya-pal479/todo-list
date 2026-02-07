import type { Task } from '../types/task';

const KEY = 'tasks_db';

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(KEY, JSON.stringify(tasks));
};

export const loadTasks = (): Task[] => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};