const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: 'Name already exists',
    required: 'Name is required',
  },
  board: { type: mongoose.Types.ObjectId, required: true, ref: 'Board' },
  color: { type: String, trim: true },
  points: { type: Number },
  comments: [],
  assignedTo: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  status: { type: String, trim: true },
});

module.exports = mongoose.model('Task', TaskSchema);
