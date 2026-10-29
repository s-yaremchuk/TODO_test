import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema, TaskFormData } from '../schemas/task.schema';
import { Task } from '../types/task.types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialTask?: Task | null;
  isLoading?: boolean;
}

export const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  isLoading,
}: TaskModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
    },
  });

  useEffect(() => {
    if (initialTask) {
      reset({
        title: initialTask.title,
        description: initialTask.description ?? '',
        status: initialTask.status,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'TODO',
      });
    }
  }, [initialTask, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {initialTask ? 'Редагувати завдання' : 'Нове завдання'}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Назва
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="Наприклад: Підготувати звіт"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Опис (необов’язково)
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Додаткові деталі або нотатки..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
            >
              <option value="TODO">До виконання</option>
              <option value="IN_PROGRESS">В процесі</option>
              <option value="DONE">Виконано</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Збереження...' : initialTask ? 'Оновити' : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
