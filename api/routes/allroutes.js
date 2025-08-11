const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth')
const roleAuthorization = require('../middleware/roleMiddleware')
const upload = require('../middleware/multer-config');

router.get('/hola', (req, res) => {
  res.send('¡Hola mundo desde Express!');
});


const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Animals
const animalController = require('../controllers/animalController');

router.get('/animals', animalController.getAllAnimals)
router.patch('/animals/:id/vote', animalController.voteAnimal);
router.get('/animals/:id', animalController.getOneAnimal)
router.post('/animals', auth, roleAuthorization('admin'), upload, animalController.createAnimal)
router.put('/animals/:id', auth, roleAuthorization('admin'), upload, animalController.modifyAnimal)
router.delete('/animals/:id', auth, roleAuthorization('admin'),  animalController.deleteAnimal)


// Vegetables
const vegetableController = require('../controllers/vegetableController');

router.get('/vegetables', vegetableController.getAllVegetables)
router.post('/vegetables',auth, roleAuthorization('admin'), upload, vegetableController.createVegetable)
router.put('/vegetables/:id',auth, roleAuthorization('admin'), upload, vegetableController.modifyVegetable)
router.delete('/vegetables/:id',auth, roleAuthorization('admin'), upload, vegetableController.deleteVegetable)


// Products 
const productController = require('../controllers/productController');

router.get('/products', productController.getAllProducts)
router.post('/products',auth, roleAuthorization('admin'), upload, productController.createProduct)
router.put('/products/:id',auth, roleAuthorization('admin'), upload, productController.modifyProduct)
router.delete('/products/:id',auth, roleAuthorization('admin'), upload, productController.deleteProduct)

module.exports = router;