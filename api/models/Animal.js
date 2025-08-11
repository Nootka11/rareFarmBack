const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  commonName: { type: String, required: true },       // e.g. "Konik Mare"
  scientificName: String,                              // optional
  description: String, 
  imageUrl: String, 
  imageTransparentUrl: String,  
  votes: { type: Number, default: 0 },                        
  mainUse: String,                                    // e.g. "Milk for cheese"
  originRegion: String,                               // e.g. "Central Asia"
  conservationStatus: String,                          // e.g. "Rare", "Endangered"
  productTypes: [String],                             // e.g. ["milk", "meat", "eggs"]
  extraDetails: mongoose.Schema.Types.Mixed           // any additional info
});

module.exports = mongoose.model('Animal', animalSchema);
