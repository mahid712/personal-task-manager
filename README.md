# 📋 Personal Task Manager

A responsive full-stack **Personal Task Manager** built with the recommended modern technology stack: **React**, **TypeScript**, **Vite**, **Bootstrap**, **Node.js**, **Express**, and **MongoDB**.

Organise daily tasks, coursework, and assignments with due dates, priority tiers, status tracking, overdue warnings, and live progress statistics.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose in Project |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript + Vite | Components, props, state, forms, events, lists, conditional rendering |
| **Styling** | Bootstrap 5 + Bootstrap Icons + CSS | Responsive layout (mobile & desktop), cards, forms, tables, badges, progress bar |
| **Backend** | Node.js + Express (JavaScript) | RESTful API routes, request validation, CRUD operations |
| **Database** | MongoDB (Mongoose Schema) | Persistent storage across reloads with local fallback resilience |
| **Connection** | Axios | Typed HTTP client connecting React frontend to Express API |

---

## 📂 Project Structure

```text
personal-task-manager/
├── backend/
│   ├── config/
│   │   ├── db.js             # Mongoose MongoDB connection & status
│   │   └── fallbackStore.js   # Resilient persistence fallback if local MongoDB is offline
│   ├── controllers/
│   │   └── taskController.js # CRUD handlers with input validation
│   ├── models/
│   │   └── Task.js           # Mongoose Document Schema
│   ├── routes/
│   │   └── taskRoutes.js     # Express REST API routes
│   ├── data/
│   │   └── tasks.json        # Persistent store for fallback mode
│   ├── .env                  # Environment variables (PORT, MONGODB_URI)
│   ├── .env.example
│   ├── server.js             # Express application entry point
│   ├── test-api.js           # Automated backend CRUD verification suite
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Header bar with quick action & stats
│   │   │   ├── StatsOverview.tsx      # Total, Pending, Completed, Overdue cards & progress bar
│   │   │   ├── TaskFilterBar.tsx      # Status pills, search bar, priority/category/sort filters
│   │   │   ├── TaskCard.tsx           # Task card with badge indicators & actions
│   │   │   ├── TaskList.tsx           # Grid and Table view switchers
│   │   │   ├── TaskModal.tsx          # Add & Edit form modal with input validation
│   │   │   ├── TaskDetailsModal.tsx   # Detailed inspection modal
│   │   │   ├── DeleteConfirmModal.tsx # Confirmation dialog before deletion
│   │   │   └── EmptyState.tsx         # Friendly empty/no-result view
│   │   ├── pages/
│   │   │   └── Dashboard.tsx          # Core dashboard page orchestrating state & API calls
│   │   ├── services/
│   │   │   └── taskService.ts         # Axios REST API client methods
│   │   ├── types/
│   │   │   └── task.ts                # TypeScript interfaces & types
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── package.json
└── README.md
```

---

## ✨ Features & Requirements Met

- [x] **Complete CRUD Operations**:
  - **Create**: Add tasks with Title (required), Description, Due Date, Priority (`Low`, `Medium`, `High`), and Category (`College`, `Work`, `Personal`, `Other`).
  - **Read**: Fetch all tasks, inspect individual task details, search, and filter.
  - **Update**: Edit task attributes or quickly toggle status (`Pending` ↔ `Completed`).
  - **Delete**: Remove tasks with a safety confirmation modal.
- [x] **Form Field Validation**:
  - Enforces mandatory `title` field on client and server.
  - Displays helpful error feedback in the form if submitted empty.
- [x] **Loading, Error & Empty States**:
  - Loading spinner while communicating with backend.
  - Error banner with a "Retry" button when network or server issues occur.
  - Dedicated empty states for new setups and for filter queries with zero matches.
- [x] **Overdue Highlight**:
  - Pending tasks whose due date has passed are highlighted in amber/red alert colors with an animated **Overdue** badge.
- [x] **Interactive Dashboard & Progress Bar**:
  - Displays real-time counts for Total, Pending, Completed, and Overdue tasks.
  - Animated completion progress bar calculating percentage done.
- [x] **Responsive Design**:
  - Seamless layout adjustments for laptops, tablets, and mobile smartphones.
  - Switch between Card Grid view and Table List view with one click.
- [x] **MongoDB Schema & Resilient Persistence**:
  - Official Mongoose model with `title`, `description`, `dueDate`, `priority`, `category`, `status`, and timestamps (`createdAt`, `updatedAt`).
  - Automatic zero-config fallback storage when local MongoDB service isn't active, guaranteeing the app works immediately out of the box while fully supporting any MongoDB URI / Atlas connection.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | List all tasks | Query params: `status`, `priority`, `category`, `search`, `sortBy` |
| `GET` | `/api/tasks/:id` | Fetch single task details | — |
| `POST` | `/api/tasks` | Create a new task | `{ title, description?, dueDate?, priority?, category?, status? }` |
| `PUT` | `/api/tasks/:id` | Update an existing task | `{ title?, description?, dueDate?, priority?, category?, status? }` |
| `DELETE` | `/api/tasks/:id` | Delete a task | — |
| `GET` | `/api/health` | Check API server status | — |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (optional, or MongoDB Atlas connection string)

### 2. Configure Backend (.env)
Check `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
NODE_ENV=development
```
> *Note: If MongoDB is not yet running on your computer, the backend automatically runs in persistent fallback mode, so you can test immediately without any errors.*

### 3. Start Backend Server
Open a terminal and run:
```bash
cd backend
npm install
npm start
```
The backend server runs on `http://localhost:5000`.

### 4. Start Frontend Client
Open a second terminal and run:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will start on `http://localhost:3000` (or `http://localhost:5173`).

---

## 🧪 Testing Backend API Suite

An automated CRUD verification suite is included. In the `backend` folder, run:
```bash
npm test
```
This tests:
1. `GET /api/tasks`
2. Form field validation (rejecting empty title with `400 Bad Request`)
3. `POST /api/tasks`
4. `GET /api/tasks/:id`
5. `PUT /api/tasks/:id`
6. `DELETE /api/tasks/:id`
