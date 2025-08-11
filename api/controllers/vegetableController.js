const Vegetable = require("../models/Vegetable");
const fs = require('fs');
const path = require('path');



exports.getAllVegetables = async (req, res) => {
    try {
        const vegetables = await Vegetable.find(); // Busca todos los documentos en la colección 'animals'
        res.status(200).json(vegetables);       // Envía la lista de animales en formato JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // En caso de error, envía el mensaje con código 500
    }
};

// Create a new Animal
exports.createVegetable = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: 'No data received in the request body' });
    }
    try {
        //const vegetableData = req.body;  // Esperamos recibir JSON con al menos commonName e imageUrl
        const {
            commonName,
            scientificName,
            description,
            originRegion,
            uses,
            isProcessed,
            productTypes,
            extraDetails

        } = req.body || {};

        const isProcessedBool = isProcessed === 'true';
        const imageUrl = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : '';
        const imageTransparentUrl  = req.files['imageTransparent'] ? `/uploads/${req.files['imageTransparent'][0].filename}` : '';
        const newVegetable = new Vegetable(
            {
            commonName,
            scientificName,
            description,
            imageUrl,
            imageTransparentUrl,
            originRegion,
            uses,
            isProcessed: isProcessedBool,
            productTypes : productTypes ? productTypes.split(',').map(p => p.trim()) : [],
            extraDetails : extraDetails ? JSON.parse(extraDetails) : {}
            }
        );
        await newVegetable.save();
        res.status(201).json(newVegetable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.modifyVegetable = async (req, res) => {
    console.log('moficar vegetal')

    try {
        const {
            commonName,
            scientificName,
            description,
            originRegion,
            uses,
            isProcessed,
            productTypes,
            extraDetails
        } = req.body || {};
        const isProcessedBool = isProcessed === 'true';
      
        const imageUrl = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : '';
        const imageTransparentUrl  = req.files['imageTransparent'] ? `/uploads/${req.files['imageTransparent'][0].filename}` : '';

        const updatedFields = {
             commonName,
            scientificName,
            description,
            originRegion,
            uses,
            isProcessed: isProcessedBool,
            productTypes : productTypes ? productTypes.split(',').map(p => p.trim()) : [],
            extraDetails : extraDetails ? JSON.parse(extraDetails) : {}
        }
         if (imageUrl) {
            updatedFields.imageUrl = imageUrl;
        } 
         if (imageTransparentUrl) {
            updatedFields.imageTransparentUrl = imageTransparentUrl;
        } 
        await Vegetable.updateOne({ _id: req.params.id }, updatedFields);
        res.status(200).json({ message: 'Vegetable modified sucessfully !' })
    } catch (err) {
         res.status(400).json({ message: 'Erreur lors de la modification', error: error.message });
    }
}

exports.deleteVegetable = async (req, res, next) => {
  try {
    const vegetable = await Vegetable.findById(req.params.id);

    if (!vegetable) {
      return res.status(404).json({ message: 'Vegetable not found' });
    }

    // If image exists, delete it
    // if (vegetable.imageUrl) {
    //   const filePath = path.join(__dirname, '..', vegetable.imageUrl); // Adjust the path if needed
    //   fs.unlink(filePath, (err) => {
    //     if (err) {
    //       console.error('Error deleting image:', err.message);
    //     }
    //   });
    // }

    ['imageUrl', 'imageTransparentUrl'].forEach((key) => {
  if (vegetable[key]) {
    const filePath = path.join(__dirname, '..', vegetable[key]);
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting ${key}:`, err.message);
    });
  }
});

    await Vegetable.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Vegetable deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vegetable', error: error.message });
  }
};