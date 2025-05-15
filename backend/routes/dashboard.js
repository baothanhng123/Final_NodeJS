const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/stats', auth, isAdmin, dashboardController.getDashboardStats);

module.exports = router;
