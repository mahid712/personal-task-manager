import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import './App.css';

export const App: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <Navbar
        onAddTask={() => setIsAddModalOpen(true)}
        pendingCount={0}
      />

      {/* Main Dashboard Container */}
      <main className="flex-grow-1">
        <Dashboard
          isAddModalOpen={isAddModalOpen}
          onCloseAddModal={() => setIsAddModalOpen(false)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-top py-3 mt-auto text-center text-secondary small">
        <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <span>
            <strong>Personal Task Manager</strong> &bull; Full Stack MERN Application
          </span>
          <div className="d-flex gap-2">
            <span className="badge bg-light text-dark border">React + TS + Vite</span>
            <span className="badge bg-light text-dark border">Bootstrap</span>
            <span className="badge bg-light text-dark border">Express</span>
            <span className="badge bg-light text-dark border">MongoDB</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
