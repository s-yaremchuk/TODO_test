import { TaskStatus } from '../types/task.types';

interface TaskFilterProps {
  currentFilter?: TaskStatus;
  onChange: (status?: TaskStatus) => void;
  counts?: {
    all: number;
    todo: number;
    inProgress: number;
    done: number;
  };
}

const filters: { label: string; value?: TaskStatus; key: 'all' | 'todo' | 'inProgress' | 'done' }[] = [
  { label: 'Всі', value: undefined, key: 'all' },
  { label: 'До виконання', value: 'TODO', key: 'todo' },
  { label: 'В процесі', value: 'IN_PROGRESS', key: 'inProgress' },
  { label: 'Виконано', value: 'DONE', key: 'done' },
];

export const TaskFilter = ({ currentFilter, onChange, counts }: TaskFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => {
        const isActive = currentFilter === f.value;
        const count = counts ? counts[f.key] : undefined;

        return (
          <button
            key={f.label}
            onClick={() => onChange(f.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span>{f.label}</span>
            {count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
