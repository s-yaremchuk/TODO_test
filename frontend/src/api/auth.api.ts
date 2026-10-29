import { apiClient } from './client';
import { AuthResponse, LoginInput, RegisterInput, User } from '../types/auth.types';

export const registerApi = async (data: RegisterInput): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const loginApi = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const getMeApi = async (): Promise<{ user: User }> => {
  const response = await apiClient.get<{ user: User }>('/auth/me');
  return response.data;
};
