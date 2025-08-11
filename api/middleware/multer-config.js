const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'api/uploads/'); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    const baseName = path.parse(file.originalname).name.replace(/\s+/g, '_'); // remove extension, replace spaces
    const extension = path.extname(file.originalname); // get the extension (.jpg, .webp, etc.)
    cb(null, `${baseName}_${Date.now()}${extension}`);
  }
});


// Filtro opcional: solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

module.exports = multer({ storage, fileFilter }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'imageTransparent', maxCount: 1 }
]);
