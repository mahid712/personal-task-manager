export type TaskPriority = 'Low' | 'Medium' | 'High';

export type TaskStatus = 'Pending' | 'Completed';

export type TaskCategory = 'College' | 'Work' | 'Personal' | 'Other';

export interface Task {
  _id: string;
  id?: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
}

export type FilterStatus = 'All' | 'Pending' | 'Completed';
export type FilterPriority = 'All' | TaskPriority;
export type FilterCategory = 'All' | TaskCategory;
export type SortOption = 'newest' | 'oldest' | 'dueDate_asc' | 'dueDate_desc' | 'priority';

export interface TaskFilterState {
  status: FilterStatus;
  priority: FilterPriority;
  category: FilterCategory;
  search: string;
  sortBy: SortOption;
}

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  completionRate: number;
}
