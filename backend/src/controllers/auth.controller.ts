import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { ZodError } from 'zod';

const generateToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ userId, email }, secret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.email.toLowerCase() },
    });

    if (existingUser) {
      res.status(409).json({ message: 'Користувач із таким email вже існує' });
      return;
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.create({
      data: {
        email: parsed.email.toLowerCase(),
        password: hashedPassword,
        name: parsed.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    const token = generateToken(user.id, user.email);

    res.status(201).json({
      message: 'Реєстрація успішна',
      user,
      token,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Помилка валідації даних',
        errors: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
      return;
    }

    console.error('Registration error:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: parsed.email.toLowerCase() },
    });

    if (!user) {
      res.status(401).json({ message: 'Невірний email або пароль' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(parsed.password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Невірний email або пароль' });
      return;
    }

    const token = generateToken(user.id, user.email);

    res.json({
      message: 'Вхід успішний',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Помилка валідації даних',
        errors: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
      return;
    }

    console.error('Login error:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Не авторизовано' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'Користувача не знайдено' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};
