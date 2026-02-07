export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'Work' | 'Personal' | 'Urgent' | 'Home';

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  dueDate: string; 
  completed: boolean;
  createdAt: number;
}

export type FilterOption = 'All' | 'Overdue' | 'Work' | 'Urgent';
export type SortOption = 'Default' | 'Priority' | 'Date';