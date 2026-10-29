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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#161616] border-2 border-neutral-700 max-w-lg w-full p-6 text-white">
        <div className="flex justify-between items-center pb-3 border-b border-neutral-800 mb-5">
          <h3 className="font-sans font-bold uppercase tracking-tight text-sm text-white">
            {initialTask ? 'EDIT TASK' : 'CREATE TASK'}
          </h3>
          <button
            onClick={onClose}
            className="font-mono text-xs text-neutral-500 hover:text-white px-2 py-1"
          >
            [ESC / CLOSE]
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              TITLE *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="Введіть назву завдання"
              className="w-full px-3 py-2 bg-[#111111] border border-neutral-700 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD400] font-sans text-sm"
            />
            {errors.title && (
              <p className="mt-1 font-mono text-xs text-[#E5322D]">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              DESCRIPTION
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Додатковий опис або деталі..."
              className="w-full px-3 py-2 bg-[#111111] border border-neutral-700 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD400] font-sans text-sm resize-none"
            />
            {errors.description && (
              <p className="mt-1 font-mono text-xs text-[#E5322D]">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              STATUS
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 bg-[#111111] border border-neutral-700 text-white focus:outline-none focus:border-[#FFD400] font-mono text-xs"
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="font-mono text-xs uppercase px-4 py-2 border border-neutral-700 bg-[#1e1e1e] text-neutral-300 hover:bg-neutral-800 transition-colors duration-100"
            >
              СКАСУВАТИ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="font-mono text-xs uppercase font-bold px-5 py-2 bg-[#FFD400] text-black hover:bg-[#FFE033] disabled:opacity-50 transition-colors duration-100"
            >
              {isLoading ? 'ЗБЕРЕЖЕННЯ...' : initialTask ? 'ОНОВИТИ' : 'СТВОРИТИ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
