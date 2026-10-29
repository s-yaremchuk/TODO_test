import { z } from 'zod';
import { TaskStatus } from '@prisma/client';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Назва завдання обов’язкова').max(200, 'Назва не повинна перевищувати 200 символів'),
  description: z.string().trim().max(1000, 'Опис не повинен перевищувати 1000 символів').optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Назва завдання не може бути порожньою').max(200, 'Назва не повинна перевищувати 200 символів').optional(),
  description: z.string().trim().max(1000, 'Опис не повинен перевищувати 1000 символів').nullable().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

export const taskQuerySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
