const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({
  story: {
    type: String,
    required: 'Name is required',
  },
  boardId: { type: mongoose.Types.ObjectId, required: true, ref: 'Board' },
  color: { type: String, trim: true },
  points: { type: Number },
  comments: [],
  assignedTo: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  projectId: { type: mongoose.Types.ObjectId, required: true, ref: 'Project' },
  status: { type: String, trim: true },
  image: { type: String },
});

module.exports = mongoose.model('Task', TaskSchema);
