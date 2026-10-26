const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    dueDate: {
      type: Date,
      default: null
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High'
      },
      default: 'Medium'
    },
    category: {
      type: String,
      enum: {
        values: ['College', 'Work', 'Personal', 'Other'],
        message: 'Category must be College, Work, Personal, or Other'
      },
      default: 'Personal'
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Completed'],
        message: 'Status must be Pending or Completed'
      },
      default: 'Pending'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Task', TaskSchema);
