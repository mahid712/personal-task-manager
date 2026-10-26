import React from 'react';
import { Task } from '../types/task';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  if (!task) return null;

  const isCompleted = task.status === 'Completed';
  const isOverdue =
    !isCompleted && task.dueDate && new Date(task.dueDate).getTime() < Date.now();

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div
        className="modal-content-custom"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header border-bottom p-3 px-4 d-flex justify-content-between align-items-center bg-light">
          <div className="d-flex align-items-center gap-2">
            <span className={`badge rounded-pill badge-cat-${task.category} px-2 py-1 small`}>
              {task.category}
            </span>
            <span className={`badge rounded-pill badge-priority-${task.priority} px-2 py-1 small`}>
              {task.priority} Priority
            </span>
          </div>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
        </div>

        <div className="modal-body p-4">
          <div className="d-flex align-items-start gap-2 mb-3">
            <div className="form-check mt-1">
              <input
                className="form-check-input cursor-pointer"
                type="checkbox"
                checked={isCompleted}
                onChange={() => onToggleStatus(task)}
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
            </div>
            <h5
              className={`fw-bold mb-0 text-break ${
                isCompleted ? 'text-decoration-line-through text-muted' : 'text-dark'
              }`}
            >
              {task.title}
            </h5>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="text-secondary small fw-semibold text-uppercase mb-1 d-block">
              Description
            </label>
            <div className="p-3 bg-light rounded-3 text-secondary small" style={{ minHeight: '60px', whiteSpace: 'pre-wrap' }}>
              {task.description ? task.description : <span className="fst-italic text-muted">No description provided.</span>}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="row g-3 small">
            <div className="col-6">
              <div className="text-secondary fw-semibold">Due Date</div>
              <div className={isOverdue ? 'text-danger fw-bold' : 'text-dark'}>
                {task.dueDate ? (
                  <>
                    <i className="bi bi-calendar-event me-1"></i>
                    {new Date(task.dueDate).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                    {isOverdue && <span className="badge bg-danger ms-1">Overdue</span>}
                  </>
                ) : (
                  <span className="text-muted">No deadline</span>
                )}
              </div>
            </div>

            <div className="col-6">
              <div className="text-secondary fw-semibold">Current Status</div>
              <div>
                <span
                  className={`badge rounded-pill ${
                    isCompleted ? 'bg-success text-white' : 'bg-warning text-dark'
                  } px-2 py-1`}
                >
                  {task.status}
                </span>
              </div>
            </div>

            <div className="col-6">
              <div className="text-secondary fw-semibold">Created</div>
              <div className="text-muted">
                {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}
              </div>
            </div>

            <div className="col-6">
              <div className="text-secondary fw-semibold">Last Updated</div>
              <div className="text-muted">
                {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer border-top p-3 px-4 d-flex justify-content-between bg-light">
          <button
            type="button"
            className="btn btn-outline-danger btn-sm rounded-3 px-3 d-flex align-items-center gap-1"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
          >
            <i className="bi bi-trash"></i> Delete
          </button>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm rounded-3 px-3 d-flex align-items-center gap-1"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              <i className="bi bi-pencil"></i> Edit
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm rounded-3 px-3"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
