import axios from 'axios';
import { Task, TaskFormData, TaskFilterState } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const taskService = {
  // Fetch tasks with optional filters and sorting
  getTasks: async (filters?: Partial<TaskFilterState>): Promise<Task[]> => {
    const params: Record<string, string> = {};
    if (filters?.status && filters.status !== 'All') params.status = filters.status;
    if (filters?.priority && filters.priority !== 'All') params.priority = filters.priority;
    if (filters?.category && filters.category !== 'All') params.category = filters.category;
    if (filters?.search && filters.search.trim()) params.search = filters.search.trim();
    if (filters?.sortBy) params.sortBy = filters.sortBy;

    const response = await api.get<{ success: boolean; data: Task[] }>('/tasks', { params });
    return response.data.data;
  },

  // Get single task by ID
  getTaskById: async (id: string): Promise<Task> => {
    const response = await api.get<{ success: boolean; data: Task }>(`/tasks/${id}`);
    return response.data.data;
  },

  // Create a new task
  createTask: async (taskData: TaskFormData): Promise<Task> => {
    const response = await api.post<{ success: boolean; message: string; data: Task }>('/tasks', {
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate ? taskData.dueDate : null,
      priority: taskData.priority,
      category: taskData.category,
      status: taskData.status
    });
    return response.data.data;
  },

  // Update existing task
  updateTask: async (id: string, taskData: Partial<TaskFormData | { status: 'Pending' | 'Completed' }>): Promise<Task> => {
    const payload: Record<string, unknown> = { ...taskData };
    if ('dueDate' in payload) {
      payload.dueDate = payload.dueDate ? payload.dueDate : null;
    }
    const response = await api.put<{ success: boolean; message: string; data: Task }>(`/tasks/${id}`, payload);
    return response.data.data;
  },

  // Toggle task completion status
  toggleTaskStatus: async (id: string, currentStatus: 'Pending' | 'Completed'): Promise<Task> => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    return taskService.updateTask(id, { status: newStatus });
  },

  // Delete task by ID
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  }
};
