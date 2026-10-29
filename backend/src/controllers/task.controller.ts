import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '../schemas/task.schema';
import { ZodError } from 'zod';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { status } = taskQuerySchema.parse(req.query);

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ tasks });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Некоректні параметри запиту',
        errors: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
      return;
    }

    console.error('getTasks error:', error);
    res.status(500).json({ message: 'Помилка отримання завдань' });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      res.status(404).json({ message: 'Завдання не знайдено' });
      return;
    }

    res.json({ task });
  } catch (error) {
    console.error('getTaskById error:', error);
    res.status(500).json({ message: 'Помилка отримання завдання' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const parsed = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        status: parsed.status,
        userId,
      },
    });

    res.status(201).json({ message: 'Завдання створено', task });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Помилка валідації даних',
        errors: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
      return;
    }

    console.error('createTask error:', error);
    res.status(500).json({ message: 'Помилка створення завдання' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const parsed = updateTaskSchema.parse(req.body);

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      res.status(404).json({ message: 'Завдання не знайдено' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(parsed.title !== undefined ? { title: parsed.title } : {}),
        ...(parsed.description !== undefined ? { description: parsed.description } : {}),
        ...(parsed.status !== undefined ? { status: parsed.status } : {}),
      },
    });

    res.json({ message: 'Завдання оновлено', task: updatedTask });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Помилка валідації даних',
        errors: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
      return;
    }

    console.error('updateTask error:', error);
    res.status(500).json({ message: 'Помилка оновлення завдання' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      res.status(404).json({ message: 'Завдання не знайдено' });
      return;
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: 'Завдання видалено' });
  } catch (error) {
    console.error('deleteTask error:', error);
    res.status(500).json({ message: 'Помилка видалення завдання' });
  }
};
