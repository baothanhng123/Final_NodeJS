const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/', auth, isAdmin, categoryController.getAllCategories);
router.get('/:id', auth, isAdmin, categoryController.getCategoryById);
router.post('/', auth, isAdmin, categoryController.createCategory);
router.put('/:id', auth, isAdmin, categoryController.updateCategory);
router.delete('/:id', auth, isAdmin, categoryController.deleteCategory);

module.exports = router; 