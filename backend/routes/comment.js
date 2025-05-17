const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.get('/:productId', commentController.getCommentsByProductId);
// Authenticated users (login required)
router.post('/:productId', auth, commentController.addComment);
// Guest users (no login required)
router.post('/guest/:productId', commentController.addComment);

module.exports = router;
