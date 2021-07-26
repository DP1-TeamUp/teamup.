const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SprintSchema = new mongoose.Schema({
  sprintNo: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  pending: [{ type: mongoose.Types.ObjectId, ref: 'Task' }],
  ongoing: [{ type: mongoose.Types.ObjectId, ref: 'Task' }],
  completed: [{ type: mongoose.Types.ObjectId, ref: 'Task' }],
  velocity: { type: Number },
});

module.exports = mongoose.model('Sprint', SprintSchema);
