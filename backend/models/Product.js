  const mongoose = require('mongoose');

  const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    quantity: { type: Number, default: 0 },
    price: { type: Number, required: true },
    barcode: { type: String, unique: true },
    photo: { type: String, default: '' },
    state: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    createdAt: { type: Date, default: Date.now },
    rating: { type: Number, default: 0 }
  });

  module.exports = mongoose.model('Product', productSchema);
