import React from 'react';
import { TaskStats } from '../types/task';

interface StatsOverviewProps {
  stats: TaskStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="mb-4">
      {/* Cards Row */}
      <div className="row g-3">
        <div className="col-6 col-lg-3">
          <div className="stats-card h-100">
            <div className="stats-icon-wrap bg-primary-subtle text-primary">
              <i className="bi bi-list-task"></i>
            </div>
            <div>
              <div className="text-secondary small fw-semibold text-uppercase">Total Tasks</div>
              <div className="fs-3 fw-bold text-dark">{stats.total}</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="stats-card h-100">
            <div className="stats-icon-wrap bg-warning-subtle text-warning-emphasis">
              <i className="bi bi-hourglass-split"></i>
            </div>
            <div>
              <div className="text-secondary small fw-semibold text-uppercase">Pending</div>
              <div className="fs-3 fw-bold text-dark">{stats.pending}</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="stats-card h-100">
            <div className="stats-icon-wrap bg-success-subtle text-success">
              <i className="bi bi-check2-circle"></i>
            </div>
            <div>
              <div className="text-secondary small fw-semibold text-uppercase">Completed</div>
              <div className="fs-3 fw-bold text-dark">{stats.completed}</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="stats-card h-100">
            <div className="stats-icon-wrap bg-danger-subtle text-danger">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <div>
              <div className="text-secondary small fw-semibold text-uppercase">Overdue</div>
              <div className="fs-3 fw-bold text-danger">{stats.overdue}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Row */}
      <div className="card mt-3 border-0 shadow-sm p-3 rounded-3 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="small fw-semibold text-secondary">
            <i className="bi bi-speedometer2 me-1"></i> Completion Progress
          </span>
          <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">
            {stats.completionRate}% Done ({stats.completed}/{stats.total})
          </span>
        </div>
        <div className="progress" style={{ height: '10px', borderRadius: '6px' }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-success"
            role="progressbar"
            style={{ width: `${stats.completionRate}%` }}
            aria-valuenow={stats.completionRate}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      </div>
    </div>
  );
};
