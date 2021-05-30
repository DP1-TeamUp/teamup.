const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: 'Name already exists',
    required: 'Name is required',
  },
  color: { type: String, required: 'Color is required' },
  task: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Task' }],
  project: { type: mongoose.Types.ObjectId, required: true, ref: 'Project' },
});

module.exports = mongoose.model('Board', BoardSchema);
