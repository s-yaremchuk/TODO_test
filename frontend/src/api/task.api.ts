import { apiClient } from './client';
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../types/task.types';

export const getTasksApi = async (status?: TaskStatus): Promise<Task[]> => {
  const params = status ? { status } : {};
  const response = await apiClient.get<{ tasks: Task[] }>('/tasks', { params });
  return response.data.tasks;
};

export const createTaskApi = async (data: CreateTaskInput): Promise<Task> => {
  const response = await apiClient.post<{ message: string; task: Task }>('/tasks', data);
  return response.data.task;
};

export const updateTaskApi = async (id: string, data: UpdateTaskInput): Promise<Task> => {
  const response = await apiClient.patch<{ message: string; task: Task }>(`/tasks/${id}`, data);
  return response.data.task;
};

export const deleteTaskApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};
