import { useState } from 'react';
import { Task, TaskStatus } from '../types/task.types';
import { TaskBadge } from './TaskBadge';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export const TaskItem = ({ task, onEdit, onDelete, onStatusChange }: TaskItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (confirm('Ви впевнені, що хочете видалити це завдання?')) {
      setIsDeleting(true);
      onDelete(task.id);
    }
  };

  const isDone = task.status === 'DONE';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <h4
              className={`text-base font-semibold text-gray-900 break-words ${
                isDone ? 'line-through text-gray-400' : ''
              }`}
            >
              {task.title}
            </h4>
            <TaskBadge status={task.status} />
          </div>

          {task.description && (
            <p
              className={`text-sm text-gray-600 mb-3 whitespace-pre-wrap break-words ${
                isDone ? 'line-through text-gray-400' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>
              Створено: {new Date(task.createdAt).toLocaleDateString('uk-UA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="TODO">До виконання</option>
            <option value="IN_PROGRESS">В процесі</option>
            <option value="DONE">Виконано</option>
          </select>

          <button
            onClick={() => onEdit(task)}
            title="Редагувати"
            className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            Змінити
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Видалити"
            className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
};
