const mongoose = require('mongoose');

const ActiveSchema = new mongoose.Schema({
  projectId: { type: mongoose.Types.ObjectId, required: true, ref: 'Project' },
  image: { type: String, unique: true, required: true },
});

module.exports = mongoose.model('actives', ActiveSchema);
