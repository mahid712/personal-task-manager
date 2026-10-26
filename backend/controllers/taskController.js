const Task = require('../models/Task');
const fallbackStore = require('../config/fallbackStore');
const { isConnected } = require('../config/db');

// Helper to determine active data source
const getStore = () => {
  return isConnected() ? Task : fallbackStore;
};

// @desc    Get all tasks with optional filtering, search, and sorting
// @route   GET /api/tasks
// @access  Public
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, category, search, sortBy } = req.query;
    const store = getStore();

    if (isConnected()) {
      const filter = {};

      if (status && status !== 'All') {
        filter.status = status;
      }
      if (priority && priority !== 'All') {
        filter.priority = priority;
      }
      if (category && category !== 'All') {
        filter.category = category;
      }
      if (search && search.trim() !== '') {
        filter.$or = [
          { title: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } }
        ];
      }

      let query = Task.find(filter);

      // Sorting
      if (sortBy === 'dueDate_asc') {
        query = query.sort({ dueDate: 1 });
      } else if (sortBy === 'dueDate_desc') {
        query = query.sort({ dueDate: -1 });
      } else if (sortBy === 'priority') {
        // High -> Medium -> Low
        query = query.sort({ priority: 1 });
      } else if (sortBy === 'oldest') {
        query = query.sort({ createdAt: 1 });
      } else {
        // Default: newest first
        query = query.sort({ createdAt: -1 });
      }

      const tasks = await query.exec();
      return res.status(200).json({
        success: true,
        count: tasks.length,
        source: 'mongodb',
        data: tasks
      });
    } else {
      // Local fallback mode
      let tasks = await fallbackStore.find({
        status: status && status !== 'All' ? status : undefined,
        priority: priority && priority !== 'All' ? priority : undefined,
        category: category && category !== 'All' ? category : undefined,
        search: search && search.trim() !== '' ? search.trim() : undefined
      });

      // Sorting for fallback
      if (sortBy === 'dueDate_asc') {
        tasks.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      } else if (sortBy === 'dueDate_desc') {
        tasks.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        });
      } else if (sortBy === 'priority') {
        const order = { High: 1, Medium: 2, Low: 3 };
        tasks.sort((a, b) => (order[a.priority] || 4) - (order[b.priority] || 4));
      } else if (sortBy === 'oldest') {
        tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else {
        tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return res.status(200).json({
        success: true,
        count: tasks.length,
        source: 'local_fallback',
        data: tasks
      });
    }
  } catch (error) {
    console.error('Error in getTasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving tasks',
      error: error.message
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();

    let task;
    if (isConnected()) {
      task = await Task.findById(id);
    } else {
      task = await fallbackStore.findById(id);
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with id ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error in getTaskById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving task',
      error: error.message
    });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, category, status } = req.body;

    // Validation: Title is required
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const payload = {
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium',
      category: ['College', 'Work', 'Personal', 'Other'].includes(category) ? category : 'Personal',
      status: ['Pending', 'Completed'].includes(status) ? status : 'Pending'
    };

    let newTask;
    if (isConnected()) {
      newTask = await Task.create(payload);
    } else {
      newTask = await fallbackStore.create(payload);
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error) {
    console.error('Error in createTask:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating task',
      error: error.message
    });
  }
};

// @desc    Update a task (details or status)
// @route   PUT /api/tasks/:id
// @access  Public
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, category, status } = req.body;

    // Validation if title is provided
    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot be empty'
      });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (dueDate !== undefined) updateFields.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority !== undefined) {
      if (['Low', 'Medium', 'High'].includes(priority)) {
        updateFields.priority = priority;
      }
    }
    if (category !== undefined) {
      if (['College', 'Work', 'Personal', 'Other'].includes(category)) {
        updateFields.category = category;
      }
    }
    if (status !== undefined) {
      if (['Pending', 'Completed'].includes(status)) {
        updateFields.status = status;
      }
    }

    let updatedTask;
    if (isConnected()) {
      updatedTask = await Task.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true
      });
    } else {
      updatedTask = await fallbackStore.findByIdAndUpdate(id, updateFields);
    }

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: `Task with id ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error in updateTask:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating task',
      error: error.message
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    let deletedTask;
    if (isConnected()) {
      deletedTask = await Task.findByIdAndDelete(id);
    } else {
      deletedTask = await fallbackStore.findByIdAndDelete(id);
    }

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: `Task with id ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      id: id
    });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting task',
      error: error.message
    });
  }
};
