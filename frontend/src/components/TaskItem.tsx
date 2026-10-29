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
    if (confirm('Видалити завдання?')) {
      setIsDeleting(true);
      onDelete(task.id);
    }
  };

  const isDone = task.status === 'DONE';

  return (
    <div className="border border-neutral-800 bg-[#141414] hover:border-neutral-700 p-4 transition-colors duration-100">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-mono text-[11px] text-neutral-500">
              #{task.id.slice(-6)}
            </span>
            <TaskBadge status={task.status} />
            <h4
              className={`font-sans font-bold text-base text-white break-words ${
                isDone ? 'line-through text-neutral-500' : ''
              }`}
            >
              {task.title}
            </h4>
          </div>

          {task.description && (
            <p
              className={`text-sm text-neutral-400 mb-3 whitespace-pre-wrap break-words font-sans ${
                isDone ? 'line-through text-neutral-600' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="font-mono text-[11px] text-neutral-500">
            CREATED: {new Date(task.createdAt).toISOString().replace('T', ' ').slice(0, 16)}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="font-mono text-xs bg-[#111111] border border-neutral-700 text-neutral-200 px-2.5 py-1.5 focus:border-[#FFD400] focus:outline-none"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>

          <button
            onClick={() => onEdit(task)}
            className="font-mono text-xs uppercase px-3 py-1.5 border border-neutral-700 bg-[#1e1e1e] text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors duration-100"
          >
            EDIT
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="font-mono text-xs uppercase px-3 py-1.5 border border-red-900/60 bg-red-950/20 text-[#E5322D] hover:bg-red-950/40 disabled:opacity-50 transition-colors duration-100"
          >
            DEL
          </button>
        </div>
      </div>
    </div>
  );
};
