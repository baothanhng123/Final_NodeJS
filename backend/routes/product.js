const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const multer = require('multer');
const uploadProduct = multer({ dest: 'uploads/product/' });

router.get('/', productController.getAllProducts);
router.get('/', auth, isAdmin, productController.getAllProducts);
router.get('/:id', auth, isAdmin, productController.getProductById);
router.post('/', auth, isAdmin, productController.createProduct);
router.put('/:id', auth, isAdmin, productController.updateProduct);
router.delete('/:id', auth, isAdmin, productController.deleteProduct);

// Upload ảnh cho product (admin)
router.post('/upload-image', auth, isAdmin, uploadProduct.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ imageUrl: `/uploads/product/${req.file.filename}` });
});

module.exports = router; 