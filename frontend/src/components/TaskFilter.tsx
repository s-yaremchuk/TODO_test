import { TaskStatus } from '../types/task.types';

interface TaskFilterProps {
  currentFilter?: TaskStatus;
  onChange: (status?: TaskStatus) => void;
  counts: {
    all: number;
    todo: number;
    inProgress: number;
    done: number;
  };
}

const filters: { label: string; value?: TaskStatus; key: 'all' | 'todo' | 'inProgress' | 'done' }[] = [
  { label: 'ALL', value: undefined, key: 'all' },
  { label: 'TODO', value: 'TODO', key: 'todo' },
  { label: 'IN PROGRESS', value: 'IN_PROGRESS', key: 'inProgress' },
  { label: 'DONE', value: 'DONE', key: 'done' },
];

export const TaskFilter = ({ currentFilter, onChange, counts }: TaskFilterProps) => {
  return (
    <div className="flex flex-wrap border border-neutral-800 bg-[#141414]">
      {filters.map((f, idx) => {
        const isActive = currentFilter === f.value;
        const count = counts[f.key];

        return (
          <button
            key={f.label}
            onClick={() => onChange(f.value)}
            className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors duration-100 ${
              idx > 0 ? 'border-l border-neutral-800' : ''
            } ${
              isActive
                ? 'bg-[#FFD400] text-black font-bold'
                : 'bg-transparent text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`px-1.5 py-0.5 text-[10px] ${
                isActive ? 'bg-black text-[#FFD400]' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
