const mongoose = require('mongoose');

const vegetableSchema = new mongoose.Schema({
  commonName: { type: String, required: true },       // e.g. "Purple Carrot"
  scientificName: String,
  description: String,
  originRegion: String,                                // e.g. "America"
  uses: [String],                                      // e.g. ["food", "medicine"]
  isProcessed: { type: Boolean, default: false },     // whether it's sold processed as product
  productTypes: [String],
  imageUrl: String,
  imageTransparentUrl: String,
  extraDetails: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Vegetable', vegetableSchema);
