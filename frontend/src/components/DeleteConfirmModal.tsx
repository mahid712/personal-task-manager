import React from 'react';
import { Task } from '../types/task';

interface DeleteConfirmModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm,
  isDeleting
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div
        className="modal-content-custom"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: '440px' }}
      >
        <div className="p-4 text-center">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle mb-3"
            style={{ width: '60px', height: '60px', fontSize: '1.75rem' }}
          >
            <i className="bi bi-trash3"></i>
          </div>

          <h5 className="fw-bold text-dark mb-2">Delete Task?</h5>
          <p className="text-secondary small mb-3">
            Are you sure you want to delete <span className="fw-semibold text-dark">"{task.title}"</span>?
            This operation cannot be undone.
          </p>

          <div className="d-flex justify-content-center gap-2 pt-2">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-3 px-4"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger rounded-3 px-4 fw-semibold d-flex align-items-center gap-2"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <span className="spinner-border spinner-border-sm" role="status"></span>}
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
