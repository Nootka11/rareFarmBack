const Product = require("../models/Product")
// const fs = require('fs');
// const path = require('path');



exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find() // Busca todos los documentos en la colección 'Products'
         .populate('animalOrigin')       // Rellena el campo animalOrigin con el objeto completo
        .populate('vegetableOrigin');   // Rellena el campo vegetableOrigin con el objeto completo
        
        res.status(200).json(products);       // Envía la lista de Productes en formato JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // En caso de error, envía el mensaje con código 500
    }
};

// Create a new Product
exports.createProduct = async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ message: 'Aucune donnée reçue dans le corps de la requête' });
    }
    try {

        const {
            name,
            description,
            productType,
            category,
            price,
            oldPrice,
            quantityAvailable,
            soldOut,
            animalOrigin,
            vegetableOrigin,
            extraDetails
        } = req.body || {};

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const newProduct = new Product({
            name,
            description,
            imageUrl,
            productType,
            category,
            price,
            oldPrice,
            quantityAvailable,
            soldOut,
            animalOrigin: animalOrigin || null,
            vegetableOrigin: vegetableOrigin || null,
            extraDetails: extraDetails ? JSON.parse(extraDetails) : {}
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Error saving Product", error: error.message });
    }
};

exports.modifyProduct = async (req, res) => {
    console.log('en mofif product')

    try {
        const {
            name,
            description,
            productType,
            category,
            price,
            oldPrice,
            quantityAvailable,
            soldOut,
            animalOrigin,
            vegetableOrigin,
            extraDetails
        } = req.body || {};
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;


        const updatedFields = {
            name,
            description,
            productType,
            category,
            price,
            oldPrice,
            quantityAvailable,
            soldOut,
            animalOrigin: animalOrigin || null,
            vegetableOrigin: vegetableOrigin || null,
            extraDetails: extraDetails ? JSON.parse(extraDetails) : {}
        }

        if (imageUrl) {
            updatedFields.imageUrl = imageUrl;
        }
        await Product.updateOne({ _id: req.params.id }, updatedFields);
        res.status(200).json({ message: 'Product modified sucessfully !' })
    } catch (err) {
        res.status(400).json({ message: 'Erreur lors de la modification', error: error.message });

    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // If image exists, delete it
        if (product.imageUrl) {
            const filePath = path.join(__dirname, '..', product.imageUrl); // Adjust the path if needed
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting image:', err.message);
                }
            });
        }

        await Product.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Product', error: error.message });
    }
};