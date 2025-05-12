const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  description: { type: String, required: true, unique: true },
  state: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema); 