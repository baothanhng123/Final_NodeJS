const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/', auth, isAdmin, orderController.getAllOrders);
router.get('/:id', auth, isAdmin, orderController.getOrderById);
router.post('/', auth, isAdmin, orderController.createOrder);
router.put('/:id', auth, isAdmin, orderController.updateOrder);
router.delete('/:id', auth, isAdmin, orderController.deleteOrder);

module.exports = router; 