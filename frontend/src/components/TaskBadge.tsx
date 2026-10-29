import { TaskStatus } from '../types/task.types';

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  TODO: {
    label: 'До виконання',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  IN_PROGRESS: {
    label: 'В процесі',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  DONE: {
    label: 'Виконано',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};

export const TaskBadge = ({ status }: { status: TaskStatus }) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};
