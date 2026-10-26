import React from 'react';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onAddTask: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onClearFilters,
  onAddTask
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
      <div
        className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle mx-auto mb-3"
        style={{ width: '70px', height: '70px', fontSize: '2rem' }}
      >
        <i className={hasFilters ? 'bi bi-funnel' : 'bi bi-clipboard2-check'}></i>
      </div>

      <h5 className="fw-bold text-dark mb-1">
        {hasFilters ? 'No tasks match your filters' : 'No tasks added yet'}
      </h5>
      <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: '400px' }}>
        {hasFilters
          ? 'Try adjusting or clearing your filters or search terms to see more tasks.'
          : 'Stay organised by adding your first daily task, homework, or assignment.'}
      </p>

      <div className="d-flex justify-content-center gap-2">
        {hasFilters ? (
          <button
            type="button"
            className="btn btn-outline-primary rounded-3 px-4 d-flex align-items-center gap-2"
            onClick={onClearFilters}
          >
            <i className="bi bi-arrow-counterclockwise"></i>
            <span>Clear Filters</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary rounded-3 px-4 fw-semibold d-flex align-items-center gap-2"
            onClick={onAddTask}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Your First Task</span>
          </button>
        )}
      </div>
    </div>
  );
};
