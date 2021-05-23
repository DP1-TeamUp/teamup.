const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: 'Name is required' },
  description: { type: String, required: 'Description is' },
  admin: { type: Schema.Types.ObjectId, ref: 'User' },
  members: [],
  tasks: [],
});

module.exports = mongoose.model('Project', ProjectSchema);
