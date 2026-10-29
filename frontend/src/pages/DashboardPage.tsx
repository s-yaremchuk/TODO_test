import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navbar } from '../components/Navbar';
import { TaskFilter } from '../components/TaskFilter';
import { TaskItem } from '../components/TaskItem';
import { TaskModal } from '../components/TaskModal';
import { getTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from '../api/task.api';
import { Task, TaskStatus } from '../types/task.types';
import { TaskFormData } from '../schemas/task.schema';

export const DashboardPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Status from URL search params
  const urlStatus = searchParams.get('status') as TaskStatus | null;
  const filterStatus: TaskStatus | undefined =
    urlStatus && ['TODO', 'IN_PROGRESS', 'DONE'].includes(urlStatus)
      ? urlStatus
      : undefined;

  // Single query for all tasks: prevents duplicate network requests and 304 responses
  const {
    data: allTasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasksApi(),
  });

  // Calculate counts from the single dataset
  const counts = useMemo(
    () => ({
      all: allTasks.length,
      todo: allTasks.filter((t) => t.status === 'TODO').length,
      inProgress: allTasks.filter((t) => t.status === 'IN_PROGRESS').length,
      done: allTasks.filter((t) => t.status === 'DONE').length,
    }),
    [allTasks]
  );

  // Client-side filtering from the cached dataset (instant reaction, zero network roundtrips)
  const filteredTasks = useMemo(() => {
    if (!filterStatus) return allTasks;
    return allTasks.filter((t) => t.status === filterStatus);
  }, [allTasks, filterStatus]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: createTaskApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskFormData }) => updateTaskApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
      setEditingTask(null);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskApi(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleFilterChange = (status?: TaskStatus) => {
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    statusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const completionPercent =
    allTasks.length > 0 ? Math.round((counts.done / allTasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#111111] text-[#f4f4f5] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-800 mb-6">
          <div>
            <div className="font-mono text-xs uppercase text-[#FFD400] mb-1">
              SYSTEM // TASKS
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              СПИСОК ЗАВДАНЬ
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="font-mono text-xs text-neutral-400 border border-neutral-800 bg-[#161616] px-3 py-2">
              COMPLETED: <span className="text-white font-bold">{completionPercent}%</span>
            </div>

            <button
              onClick={handleOpenCreate}
              className="font-mono text-xs uppercase font-bold px-4 py-2 bg-[#FFD400] text-black hover:bg-[#FFE033] transition-colors duration-100 flex items-center gap-1.5"
            >
              <span>+</span>
              <span>НОВЕ ЗАВДАННЯ</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <TaskFilter
            currentFilter={filterStatus}
            onChange={handleFilterChange}
            counts={counts}
          />
        </div>

        {isLoading ? (
          <div className="border border-neutral-800 bg-[#141414] p-12 text-center font-mono text-xs text-neutral-500">
            LOADING DATA...
          </div>
        ) : isError ? (
          <div className="border border-red-900/60 bg-red-950/20 p-6 text-center font-mono text-xs text-[#E5322D]">
            ERROR: НЕ ВДАЛОСЯ ЗАВАНТАЖИТИ ЗАВДАННЯ. ПЕРЕВІРТЕ ПІДКЛЮЧЕННЯ ДО СЕРВЕРА.
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="border border-neutral-800 bg-[#141414] p-12 text-center">
            <p className="font-mono text-xs uppercase text-neutral-500 mb-4">
              {filterStatus ? `НЕМАЄ ЗАВДАНЬ ЗІ СТАТУСОМ [${filterStatus}]` : 'СПИСОК ПОРОЖНІЙ'}
            </p>
            <button
              onClick={handleOpenCreate}
              className="font-mono text-xs uppercase px-4 py-2 border border-neutral-700 bg-[#1e1e1e] text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors duration-100"
            >
              ДОДАТИ ПЕРШЕ ЗАВДАННЯ
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleModalSubmit}
        initialTask={editingTask}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};
