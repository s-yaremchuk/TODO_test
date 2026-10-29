import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Введіть коректну електронну адресу'),
  password: z.string().min(1, 'Введіть пароль'),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Ім'я має містити щонайменше 2 символи"),
    email: z.string().trim().email('Введіть коректну електронну адресу'),
    password: z.string().min(6, 'Пароль повинен бути не менше 6 символів'),
    confirmPassword: z.string().min(1, 'Підтвердіть пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не збігаються',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
