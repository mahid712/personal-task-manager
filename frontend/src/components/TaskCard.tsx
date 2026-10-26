import React from 'react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onViewDetails: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  const isCompleted = task.status === 'Completed';

  // Check if overdue: pending and due date is past today
  const isOverdue = React.useMemo(() => {
    if (isCompleted || !task.dueDate) return false;
    const due = new Date(task.dueDate);
    const today = new Date();
    // Compare date timestamps
    return due.getTime() < today.getTime();
  }, [task.dueDate, isCompleted]);

  // Format due date
  const formattedDueDate = React.useMemo(() => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [task.dueDate]);

  return (
    <div
      className={`card task-card h-100 p-3 ${
        isCompleted ? 'task-completed' : isOverdue ? 'task-overdue' : 'task-pending'
      }`}
    >
      {/* Top Header: Category, Priority, and Overdue Indicator */}
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-1">
        <div className="d-flex align-items-center gap-1">
          <span className={`badge rounded-pill px-2 py-1 badge-cat-${task.category} small`}>
            {task.category}
          </span>
          <span className={`badge rounded-pill px-2 py-1 badge-priority-${task.priority} small`}>
            {task.priority}
          </span>
        </div>

        {isOverdue && (
          <span className="badge badge-overdue rounded-pill px-2 py-1 small d-flex align-items-center gap-1">
            <i className="bi bi-exclamation-octagon-fill"></i>
            <span>Overdue</span>
          </span>
        )}

        {isCompleted && (
          <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1 small d-flex align-items-center gap-1">
            <i className="bi bi-check-circle-fill"></i>
            <span>Done</span>
          </span>
        )}
      </div>

      {/* Main Content: Checkbox & Title */}
      <div className="d-flex align-items-start gap-2 mb-2">
        <div className="form-check mt-1">
          <input
            className="form-check-input cursor-pointer"
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleStatus(task)}
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            style={{ width: '1.25rem', height: '1.25rem' }}
          />
        </div>
        <div className="flex-grow-1 min-w-0">
          <h6
            onClick={() => onViewDetails(task)}
            className={`task-title mb-1 fw-bold cursor-pointer text-break text-truncate-2 ${
              isCompleted ? 'text-decoration-line-through text-muted' : 'text-dark'
            }`}
            title="Click to view details"
          >
            {task.title}
          </h6>
          {task.description && (
            <p className="text-secondary small mb-0 text-truncate-2" style={{ maxHeight: '2.8rem' }}>
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Info: Due Date and Action Buttons */}
      <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
        <div className="small">
          {formattedDueDate ? (
            <span
              className={`d-inline-flex align-items-center gap-1 ${
                isOverdue ? 'text-danger fw-semibold' : 'text-secondary'
              }`}
            >
              <i className="bi bi-calendar-event"></i>
              <span>{formattedDueDate}</span>
            </span>
          ) : (
            <span className="text-muted fst-italic">No due date</span>
          )}
        </div>

        <div className="d-flex align-items-center gap-1">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary p-1 px-2 rounded-2"
            onClick={() => onViewDetails(task)}
            title="View Task Details"
          >
            <i className="bi bi-eye"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary p-1 px-2 rounded-2"
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <i className="bi bi-pencil-square"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger p-1 px-2 rounded-2"
            onClick={() => onDelete(task)}
            title="Delete Task"
          >
            <i className="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
