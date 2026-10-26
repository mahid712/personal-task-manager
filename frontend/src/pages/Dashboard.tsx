import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Task,
  TaskFormData,
  TaskFilterState,
  TaskStats
} from '../types/task';
import { taskService } from '../services/taskService';
import { StatsOverview } from '../components/StatsOverview';
import { TaskFilterBar } from '../components/TaskFilterBar';
import { TaskList } from '../components/TaskList';
import { TaskModal } from '../components/TaskModal';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { EmptyState } from '../components/EmptyState';

const initialFilters: TaskFilterState = {
  status: 'All',
  priority: 'All',
  category: 'All',
  search: '',
  sortBy: 'newest'
};

interface DashboardProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilterState>(initialFilters);

  // Modals state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);

  const showToast = (text: string, type: 'success' | 'danger' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Fetch tasks
  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks(filters);
      setTasks(data);
    } catch (err: any) {
      console.error('Failed to load tasks:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to fetch tasks from server.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Compute overall stats across all tasks
  // (We can compute dynamically or fetch all tasks for stats)
  const [allTasksForStats, setAllTasksForStats] = useState<Task[]>([]);
  const loadAllTasksForStats = useCallback(async () => {
    try {
      const all = await taskService.getTasks();
      setAllTasksForStats(all);
    } catch (err) {
      console.warn('Could not load global stats:', err);
    }
  }, []);

  useEffect(() => {
    loadAllTasksForStats();
  }, [loadAllTasksForStats, tasks]);

  const stats: TaskStats = useMemo(() => {
    const list = allTasksForStats.length > 0 ? allTasksForStats : tasks;
    const total = list.length;
    const completed = list.filter((t) => t.status === 'Completed').length;
    const pending = list.filter((t) => t.status === 'Pending').length;
    const now = Date.now();
    const overdue = list.filter(
      (t) => t.status === 'Pending' && t.dueDate && new Date(t.dueDate).getTime() < now
    ).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      pending,
      completed,
      overdue,
      completionRate
    };
  }, [allTasksForStats, tasks]);

  const filterCounts = useMemo(() => {
    const list = allTasksForStats.length > 0 ? allTasksForStats : tasks;
    return {
      all: list.length,
      pending: list.filter((t) => t.status === 'Pending').length,
      completed: list.filter((t) => t.status === 'Completed').length
    };
  }, [allTasksForStats, tasks]);

  // Create or Update
  const handleSaveTask = async (formData: TaskFormData) => {
    if (editingTask) {
      const id = editingTask._id || editingTask.id!;
      const updated = await taskService.updateTask(id, formData);
      setTasks((prev) => prev.map((t) => (t._id === id || t.id === id ? updated : t)));
      showToast('Task updated successfully!');
      setEditingTask(null);
    } else {
      const created = await taskService.createTask(formData);
      setTasks((prev) => [created, ...prev]);
      showToast('Task created successfully!');
      onCloseAddModal();
    }
    loadAllTasksForStats();
  };

  // Toggle Status
  const handleToggleStatus = async (task: Task) => {
    const id = task._id || task.id!;
    const nextStatus = task.status === 'Pending' ? 'Completed' : 'Pending';

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === id || t.id === id ? { ...t, status: nextStatus } : t))
    );
    if (viewingTask && (viewingTask._id === id || viewingTask.id === id)) {
      setViewingTask({ ...viewingTask, status: nextStatus });
    }

    try {
      const updated = await taskService.toggleTaskStatus(id, task.status);
      setTasks((prev) => prev.map((t) => (t._id === id || t.id === id ? updated : t)));
      showToast(
        nextStatus === 'Completed' ? 'Task marked as completed! 🎉' : 'Task marked as pending.'
      );
      loadAllTasksForStats();
    } catch (err: any) {
      // Revert optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === id || t.id === id ? task : t))
      );
      showToast('Failed to update task status.', 'danger');
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;
    const id = deletingTask._id || deletingTask.id!;
    setIsDeleting(true);
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id && t.id !== id));
      showToast('Task deleted successfully.');
      setDeletingTask(null);
      loadAllTasksForStats();
    } catch (err: any) {
      showToast('Failed to delete task.', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<TaskFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters =
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.category !== 'All' ||
    filters.search !== '' ||
    filters.sortBy !== 'newest';

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`position-fixed bottom-0 end-0 p-3`}
          style={{ zIndex: 1100 }}
        >
          <div
            className={`alert alert-${toastMessage.type} shadow-lg rounded-3 d-flex align-items-center gap-2 m-0 py-2 px-3`}
            role="alert"
          >
            <i className={`bi ${toastMessage.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`}></i>
            <span className="small fw-semibold">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Dashboard Top Stats */}
      <StatsOverview stats={stats} />

      {/* Filter & Search Bar */}
      <TaskFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        counts={filterCounts}
      />

      {/* Error state */}
      {error && (
        <div className="alert alert-danger rounded-3 shadow-sm d-flex align-items-center justify-content-between p-3 mb-4" role="alert">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-octagon-fill fs-4 text-danger"></i>
            <div>
              <div className="fw-bold">Unable to reach task server</div>
              <div className="small">{error}</div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm rounded-2"
            onClick={loadTasks}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading tasks...</span>
          </div>
          <p className="text-secondary small mt-3">Loading your tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <EmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={handleResetFilters}
          onAddTask={onOpenAddModal}
        />
      ) : (
        /* Task List */
        <TaskList
          tasks={tasks}
          onToggleStatus={handleToggleStatus}
          onEdit={(task) => setEditingTask(task)}
          onDelete={(task) => setDeletingTask(task)}
          onViewDetails={(task) => setViewingTask(task)}
        />
      )}

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isAddModalOpen || Boolean(editingTask)}
        onClose={() => {
          onCloseAddModal();
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={viewingTask}
        onClose={() => setViewingTask(null)}
        onEdit={(task) => setEditingTask(task)}
        onToggleStatus={handleToggleStatus}
        onDelete={(task) => setDeletingTask(task)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        task={deletingTask}
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};
