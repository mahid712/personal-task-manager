import React, { useState, useEffect } from 'react';
import { Task, TaskFormData, TaskPriority, TaskCategory, TaskStatus } from '../types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TaskFormData) => Promise<void>;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask
}) => {
  const isEditing = Boolean(initialTask);

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    category: 'Personal',
    status: 'Pending'
  });

  const [errors, setErrors] = useState<{ title?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync state when editing task changes or modal opens
  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        dueDate: initialTask.dueDate ? initialTask.dueDate.substring(0, 10) : '',
        priority: initialTask.priority || 'Medium',
        category: initialTask.category || 'Personal',
        status: initialTask.status || 'Pending'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        category: 'Personal',
        status: 'Pending'
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { title?: string } = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required and cannot be empty.';
    } else if (formData.title.trim().length > 120) {
      newErrors.title = 'Title cannot exceed 120 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save task';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div
        className="modal-content-custom"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="taskModalTitle"
      >
        {/* Header */}
        <div className="modal-header border-bottom p-3 px-4 d-flex justify-content-between align-items-center bg-light">
          <h5 className="modal-title fw-bold text-dark m-0" id="taskModalTitle">
            <i className={`bi ${isEditing ? 'bi-pencil-square text-primary' : 'bi-plus-circle text-primary'} me-2`}></i>
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
            disabled={isSubmitting}
          ></button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body p-4">
            {submitError && (
              <div className="alert alert-danger d-flex align-items-center py-2 px-3 mb-3 small rounded-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>{submitError}</div>
              </div>
            )}

            {/* Task Title */}
            <div className="mb-3">
              <label htmlFor="taskTitle" className="form-label fw-semibold small text-secondary">
                Task Title <span className="text-danger">*</span>
              </label>
              <input
                id="taskTitle"
                type="text"
                className={`form-control rounded-3 ${errors.title ? 'is-invalid' : ''}`}
                placeholder="e.g., Complete Chapter 3 Notes"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                disabled={isSubmitting}
                autoFocus
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label htmlFor="taskDesc" className="form-label fw-semibold small text-secondary">
                Description (Optional)
              </label>
              <textarea
                id="taskDesc"
                rows={3}
                className="form-control rounded-3"
                placeholder="Add details, steps, or reference links..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isSubmitting}
              ></textarea>
            </div>

            {/* Due Date & Category */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label htmlFor="taskDueDate" className="form-label fw-semibold small text-secondary">
                  Due Date
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-secondary">
                    <i className="bi bi-calendar-event"></i>
                  </span>
                  <input
                    id="taskDueDate"
                    type="date"
                    className="form-control rounded-end-3"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <label htmlFor="taskCategory" className="form-label fw-semibold small text-secondary">
                  Category
                </label>
                <select
                  id="taskCategory"
                  className="form-select rounded-3"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
                  disabled={isSubmitting}
                >
                  <option value="Personal">Personal</option>
                  <option value="College">College</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Priority & Status */}
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label fw-semibold small text-secondary">Priority</label>
                <div className="d-flex gap-2">
                  {(['Low', 'Medium', 'High'] as TaskPriority[]).map((p) => {
                    const isSelected = formData.priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: p })}
                        className={`btn btn-sm flex-fill rounded-3 fw-medium ${
                          isSelected
                            ? p === 'High'
                              ? 'btn-danger text-white'
                              : p === 'Medium'
                              ? 'btn-warning text-dark'
                              : 'btn-info text-white'
                            : 'btn-outline-secondary'
                        }`}
                        disabled={isSubmitting}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <label htmlFor="taskStatus" className="form-label fw-semibold small text-secondary">
                  Status
                </label>
                <select
                  id="taskStatus"
                  className="form-select rounded-3"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  disabled={isSubmitting}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer border-top p-3 px-4 d-flex justify-content-end gap-2 bg-light">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-3 px-3"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary rounded-3 px-4 fw-semibold d-flex align-items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting && <span className="spinner-border spinner-border-sm" role="status"></span>}
              <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
