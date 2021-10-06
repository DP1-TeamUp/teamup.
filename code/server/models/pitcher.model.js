const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PitcherSchema = new mongoose.Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  pitcherType: { type: String, required: true },
  pitcherContent: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

module.exports = mongoose.model('Pitcher', PitcherSchema);
