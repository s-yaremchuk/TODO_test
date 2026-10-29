import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Введіть назву завдання').max(200, 'Назва занадто довга (максимум 200 символів)'),
  description: z.string().trim().max(1000, 'Опис занадто довгий (максимум 1000 символів)').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
