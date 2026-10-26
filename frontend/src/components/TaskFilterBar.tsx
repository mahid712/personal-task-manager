import React from 'react';
import {
  TaskFilterState,
  FilterStatus,
  FilterPriority,
  FilterCategory,
  SortOption
} from '../types/task';

interface TaskFilterBarProps {
  filters: TaskFilterState;
  onFilterChange: (newFilters: Partial<TaskFilterState>) => void;
  onResetFilters: () => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  counts
}) => {
  const hasActiveFilters =
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.category !== 'All' ||
    filters.search !== '' ||
    filters.sortBy !== 'newest';

  return (
    <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
      {/* Top row: Status Tabs & Search Input */}
      <div className="row g-3 align-items-center mb-3">
        {/* Status Pills */}
        <div className="col-12 col-md-6">
          <ul className="nav nav-pills gap-1 p-1 bg-light rounded-3 d-inline-flex">
            {(['All', 'Pending', 'Completed'] as FilterStatus[]).map((status) => {
              const isActive = filters.status === status;
              const count =
                status === 'All'
                  ? counts.all
                  : status === 'Pending'
                  ? counts.pending
                  : counts.completed;

              return (
                <li key={status} className="nav-item">
                  <button
                    type="button"
                    onClick={() => onFilterChange({ status })}
                    className={`nav-link py-1 px-3 rounded-2 fw-medium btn-sm d-flex align-items-center gap-2 ${
                      isActive ? 'active bg-primary text-white shadow-sm' : 'text-secondary'
                    }`}
                  >
                    <span>{status}</span>
                    <span
                      className={`badge rounded-pill ${
                        isActive ? 'bg-white text-primary' : 'bg-secondary-subtle text-secondary'
                      }`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Search Bar */}
        <div className="col-12 col-md-6">
          <div className="search-input-group">
            <i className="bi bi-search"></i>
            <input
              type="text"
              className="form-control form-control-sm py-2"
              placeholder="Search tasks by title or description..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
            />
            {filters.search && (
              <button
                type="button"
                className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y text-secondary text-decoration-none me-2"
                onClick={() => onFilterChange({ search: '' })}
                title="Clear search"
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: Dropdowns for Priority, Category, Sorting, and Reset */}
      <div className="row g-2 align-items-center pt-2 border-top">
        {/* Priority Filter */}
        <div className="col-6 col-sm-4 col-md-3">
          <label className="form-label text-secondary small mb-1 fw-semibold">
            <i className="bi bi-flag me-1"></i> Priority
          </label>
          <select
            className="form-select form-select-sm rounded-2"
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value as FilterPriority })}
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="col-6 col-sm-4 col-md-3">
          <label className="form-label text-secondary small mb-1 fw-semibold">
            <i className="bi bi-tag me-1"></i> Category
          </label>
          <select
            className="form-select form-select-sm rounded-2"
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value as FilterCategory })}
          >
            <option value="All">All Categories</option>
            <option value="College">College</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="col-8 col-sm-4 col-md-4">
          <label className="form-label text-secondary small mb-1 fw-semibold">
            <i className="bi bi-sort-down me-1"></i> Sort By
          </label>
          <select
            className="form-select form-select-sm rounded-2"
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
          >
            <option value="newest">Recently Added</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDate_asc">Due Date (Earliest)</option>
            <option value="dueDate_desc">Due Date (Furthest)</option>
            <option value="priority">Priority (High to Low)</option>
          </select>
        </div>

        {/* Reset button */}
        <div className="col-4 col-sm-12 col-md-2 d-flex align-items-end mt-sm-auto">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="btn btn-outline-secondary btn-sm w-100 rounded-2 d-flex align-items-center justify-content-center gap-1"
              title="Reset all filters"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
