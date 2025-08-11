const Animal = require("../models/Animal");
const fs = require('fs');
const path = require('path');



exports.getAllAnimals = async (req, res) => {
    try {
        const animals = await Animal.find(); // Busca todos los documentos en la colección 'animals'
        res.status(200).json(animals);       // Envía la lista de animales en formato JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // En caso de error, envía el mensaje con código 500
    }
};
exports.getOneAnimal = async (req, res, next ) =>{
     Animal.findOne({ _id: req.params.id })
    .then(animal => res.status(200).json(animal))
    .catch(error => res.status(400).json(error));

}
// Create a new Animal
exports.createAnimal = async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ message: 'Aucune donnée reçue dans le corps de la requête' });
    }
    try {

        const {
            commonName,
            scientificName,
            description,
            mainUse,
            originRegion,
            conservationStatus,
            productTypes,
            extraDetails,
        } = req.body || {};

        if (!commonName) {
            return res.status(400).json({ message: "Common name is required" });
        }
        const imageUrl = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : '';
        const imageTransparentUrl  = req.files['imageTransparent'] ? `/uploads/${req.files['imageTransparent'][0].filename}` : '';
        const newAnimal = new Animal({
            commonName,
            scientificName,
            description,
            imageUrl,
            imageTransparentUrl,
            mainUse,
            originRegion,
            conservationStatus,
            productTypes: productTypes ? productTypes.split(',').map(p => p.trim()) : [],
            extraDetails: extraDetails ? JSON.parse(extraDetails) : {}
        });
        await newAnimal.save();
        res.status(201).json(newAnimal);
    } catch (error) {
        res.status(500).json({ message: "Error saving animal", error: error.message });
    }
};

exports.modifyAnimal = async (req, res) => {

    try {
        const {
            commonName,
            scientificName,
            description,
            mainUse,
            originRegion,
            conservationStatus,
            productTypes,
            extraDetails,
        } = req.body || {};
        
        const imageUrl = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : '';
        const imageTransparentUrl  = req.files['imageTransparent'] ? `/uploads/${req.files['imageTransparent'][0].filename}` : '';


        const updatedFields = {
            commonName,
            scientificName,
            description,
            mainUse,
            originRegion,
            conservationStatus,
            productTypes: productTypes ? productTypes.split(',').map(p => p.trim()) : [],
            extraDetails: extraDetails ? JSON.parse(extraDetails) : {}

        }

        if (imageUrl) {
            updatedFields.imageUrl = imageUrl;
        }
        if (imageTransparentUrl) {
            updatedFields.imageTransparentUrl = imageTransparentUrl;
        } 
        await Animal.updateOne({ _id: req.params.id }, updatedFields);
        res.status(200).json({ message: 'Animal modified sucessfully !' })
    } catch (err) {
        res.status(400).json({ message: 'Erreur lors de la modification', error: error.message });

    }
}

exports.deleteAnimal = async (req, res, next) => {
  try {
    const animal = await Animal.findById(req.params.id);

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    // If image exists, delete it
    // if (animal.imageUrl) {
    //   const filePath = path.join(__dirname, '..', animal.imageUrl); // Adjust the path if needed
    //   fs.unlink(filePath, (err) => {
    //     if (err) {
    //       console.error('Error deleting image:', err.message);
    //     }
    //   });
    // }

    ['imageUrl', 'imageTransparentUrl'].forEach((key) => {
  if (animal[key]) {
    const filePath = path.join(__dirname, '..', animal[key]);
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting ${key}:`, err.message);
    });
  }
});

    await Animal.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Animal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting animal', error: error.message });
  }
};

// PATCH /animals/:id/vote
exports.voteAnimal = async (req, res) => {
    
  try {
    const { direction } = req.body;

    if (!['plus', 'minus'].includes(direction)) {
      return res.status(400).json({ message: 'Invalid vote direction' });
    }

    

    const update = direction === 'plus' ? { $inc: { votes: 1 } } : { $inc: { votes: -1 } };

    // const updatedAnimal = await Animal.findByIdAndUpdate(req.params.id, update, { new: true });
    // const updatedAnimal = await Animal.updateOne({ _id: req.params.id }, update);
     const updatedAnimal = await Animal.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!updatedAnimal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    res.status(200).json(updatedAnimal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
