import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().email('Некоректний формат email'),
  password: z.string().min(6, 'Пароль повинен містити щонайменше 6 символів'),
  name: z.string().trim().min(2, "Ім'я повинно містити щонайменше 2 символи"),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Некоректний формат email'),
  password: z.string().min(1, 'Пароль обов’язковий'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
