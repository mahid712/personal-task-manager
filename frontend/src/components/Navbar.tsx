import React from 'react';

interface NavbarProps {
  onAddTask: () => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onAddTask, pendingCount }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-2">
      <div className="container-fluid px-3 px-md-4">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <span className="badge bg-primary p-2 rounded-3">
            <i className="bi bi-check2-circle fs-5 text-white"></i>
          </span>
          <span className="fw-bold tracking-tight">TaskPilot</span>
          <span className="badge bg-secondary text-uppercase fw-normal ms-1" style={{ fontSize: '0.65rem' }}>
            Personal
          </span>
        </a>

        <div className="d-flex align-items-center gap-3">
          {pendingCount > 0 && (
            <span className="d-none d-sm-inline-flex align-items-center gap-1 badge bg-warning text-dark py-2 px-3 rounded-pill fw-semibold">
              <i className="bi bi-clock-history"></i>
              {pendingCount} Pending
            </span>
          )}

          <button
            onClick={onAddTask}
            className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3 shadow-sm"
          >
            <i className="bi bi-plus-lg fs-6"></i>
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
