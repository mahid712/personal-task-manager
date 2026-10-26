import React, { useState } from 'react';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onViewDetails: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleStatus,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <div>
      {/* View switch header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <span>Tasks</span>
          <span className="badge bg-secondary rounded-pill">{tasks.length}</span>
        </h6>

        <div className="btn-group btn-group-sm" role="group" aria-label="View switch">
          <button
            type="button"
            className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <i className="bi bi-grid-fill"></i>
          </button>
          <button
            type="button"
            className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <i className="bi bi-list-ul"></i>
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {tasks.map((task) => (
            <div key={task._id || task.id} className="col">
              <TaskCard
                task={task}
                onToggleStatus={onToggleStatus}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Table View for quick scanning */
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: '40px' }}></th>
                  <th scope="col">Title & Description</th>
                  <th scope="col">Category</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Due Date</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const isDone = task.status === 'Completed';
                  const isOverdue =
                    !isDone && task.dueDate && new Date(task.dueDate).getTime() < Date.now();

                  return (
                    <tr
                      key={task._id || task.id}
                      className={isOverdue ? 'table-danger-subtle' : ''}
                    >
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input cursor-pointer"
                          checked={isDone}
                          onChange={() => onToggleStatus(task)}
                        />
                      </td>
                      <td>
                        <div
                          className={`fw-semibold cursor-pointer ${
                            isDone ? 'text-decoration-line-through text-muted' : 'text-dark'
                          }`}
                          onClick={() => onViewDetails(task)}
                        >
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="small text-secondary text-truncate" style={{ maxWidth: '300px' }}>
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge rounded-pill badge-cat-${task.category} px-2 py-1`}>
                          {task.category}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill badge-priority-${task.priority} px-2 py-1`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        {task.dueDate ? (
                          <span className={`small ${isOverdue ? 'text-danger fw-bold' : 'text-secondary'}`}>
                            {new Date(task.dueDate).toLocaleDateString()}
                            {isOverdue && <span className="ms-1 badge bg-danger text-white">Overdue</span>}
                          </span>
                        ) : (
                          <span className="small text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            isDone ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'
                          } px-2 py-1`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="text-end pe-3">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => onViewDetails(task)}
                            title="View"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => onEdit(task)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => onDelete(task)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
