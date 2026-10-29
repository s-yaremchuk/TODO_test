import { useState } from 'react';
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
  const [filterStatus, setFilterStatus] = useState<TaskStatus | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch all tasks for counting
  const { data: allTasks = [] } = useQuery({
    queryKey: ['tasks', 'all'],
    queryFn: () => getTasksApi(),
  });

  // Fetch filtered tasks
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tasks', filterStatus],
    queryFn: () => getTasksApi(filterStatus),
  });

  // Calculate counts
  const counts = {
    all: allTasks.length,
    todo: allTasks.filter((t) => t.status === 'TODO').length,
    inProgress: allTasks.filter((t) => t.status === 'IN_PROGRESS').length,
    done: allTasks.filter((t) => t.status === 'DONE').length,
  };

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Мої завдання</h1>
            <p className="text-sm text-gray-500 mt-1">
              Керуйте щоденними завданнями та відстежуйте їх прогрес
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            + Додати завдання
          </button>
        </div>

        <div className="mb-6">
          <TaskFilter
            currentFilter={filterStatus}
            onChange={setFilterStatus}
            counts={counts}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-sm text-red-700">
            Не вдалося завантажити завдання. Перевірте з'єднання із сервером.
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-12 text-center">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Завдань не знайдено
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {filterStatus
                ? 'Немає завдань із вибраним статусом.'
                : 'У вас ще немає завдань. Створіть своє перше завдання!'}
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center px-3.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
            >
              Створити завдання
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
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
