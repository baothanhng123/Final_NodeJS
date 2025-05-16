const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.get('/:productId', commentController.getCommentsByProductId);
router.post('/:productId', commentController.addComment);

module.exports = router;
