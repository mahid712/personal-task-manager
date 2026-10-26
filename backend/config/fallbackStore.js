const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'tasks.json');

// Ensure data folder and file exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
  const initialSeed = [
    {
      _id: '670000000000000000000001',
      id: '670000000000000000000001',
      title: 'Complete Web Development Assignment',
      description: 'Build and test the React frontend and Express backend for task management.',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      priority: 'High',
      category: 'College',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '670000000000000000000002',
      id: '670000000000000000000002',
      title: 'Submit Lab Report',
      description: 'Review calculations, format graphs, and export to PDF.',
      dueDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // Overdue
      priority: 'High',
      category: 'College',
      status: 'Pending',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '670000000000000000000003',
      id: '670000000000000000000003',
      title: 'Buy Groceries & Essentials',
      description: 'Milk, oats, fruits, and notebook refills.',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'Low',
      category: 'Personal',
      status: 'Completed',
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  fs.writeFileSync(dataFile, JSON.stringify(initialSeed, null, 2), 'utf-8');
}

function readData() {
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading fallback tasks:', err);
    return [];
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing fallback tasks:', err);
  }
}

const fallbackStore = {
  find: async (query = {}) => {
    let tasks = readData();

    if (query.status) {
      tasks = tasks.filter((t) => t.status.toLowerCase() === query.status.toLowerCase());
    }
    if (query.priority) {
      tasks = tasks.filter((t) => t.priority.toLowerCase() === query.priority.toLowerCase());
    }
    if (query.category) {
      tasks = tasks.filter((t) => t.category.toLowerCase() === query.category.toLowerCase());
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    return tasks;
  },

  findById: async (id) => {
    const tasks = readData();
    const task = tasks.find((t) => t._id === id || t.id === id);
    return task || null;
  },

  create: async (taskData) => {
    const tasks = readData();
    const hexId = crypto.randomBytes(12).toString('hex');
    const now = new Date().toISOString();
    const newTask = {
      _id: hexId,
      id: hexId,
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
      priority: taskData.priority || 'Medium',
      category: taskData.category || 'Personal',
      status: taskData.status || 'Pending',
      createdAt: now,
      updatedAt: now
    };
    tasks.unshift(newTask);
    writeData(tasks);
    return newTask;
  },

  findByIdAndUpdate: async (id, updateData, options = {}) => {
    const tasks = readData();
    const index = tasks.findIndex((t) => t._id === id || t.id === id);
    if (index === -1) return null;

    const existing = tasks[index];
    const updated = {
      ...existing,
      ...updateData,
      _id: existing._id,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };

    if (updateData.title !== undefined) updated.title = updateData.title.trim();
    if (updateData.description !== undefined) updated.description = updateData.description.trim();
    if (updateData.dueDate !== undefined) {
      updated.dueDate = updateData.dueDate ? new Date(updateData.dueDate).toISOString() : null;
    }

    tasks[index] = updated;
    writeData(tasks);
    return updated;
  },

  findByIdAndDelete: async (id) => {
    const tasks = readData();
    const index = tasks.findIndex((t) => t._id === id || t.id === id);
    if (index === -1) return null;
    const [deleted] = tasks.splice(index, 1);
    writeData(tasks);
    return deleted;
  }
};

module.exports = fallbackStore;
