const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  
  name: { type: String, required: true },
  description: String,
  imageUrl: String,             
  productType: String, 
  category: { type: String, enum: ["Rare Animals", "Exotic Eggs", "Heritage Vegetables", "Unusual Dairy", "Fermented Drinks"] },    
  price: Number,
  oldPrice: Number,
  quantityAvailable: Number,
  soldOut:{type:Boolean, default:false},
  
  // Optional references to origin:
  animalOrigin: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', default: null },
  vegetableOrigin: { type: mongoose.Schema.Types.ObjectId, ref: 'Vegetable', default: null },

  extraDetails: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Product', productSchema);
