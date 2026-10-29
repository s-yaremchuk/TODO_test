import { TaskStatus } from '../types/task.types';

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  TODO: {
    label: 'TODO',
    className: 'border-neutral-700 bg-neutral-900 text-neutral-400',
  },
  IN_PROGRESS: {
    label: 'IN PROGRESS',
    className: 'border-blue-500/60 bg-blue-950/40 text-blue-400',
  },
  DONE: {
    label: 'DONE',
    className: 'border-emerald-500/60 bg-emerald-950/40 text-emerald-400',
  },
};

export const TaskBadge = ({ status }: { status: TaskStatus }) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-mono tracking-wider uppercase border ${config.className}`}
    >
      {config.label}
    </span>
  );
};
