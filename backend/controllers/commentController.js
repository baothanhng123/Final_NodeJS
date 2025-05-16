const Comment = require('../models/Comment');
const Product = require('../models/Product');
exports.getCommentsByProductId = async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { text, rating } = req.body;

    const isAuthenticated = !!req.user;

    const username = isAuthenticated
      ? req.user.username || req.user.name || 'Anonymous'
      : 'User' + Math.floor(1000 + Math.random() * 9000); // User1234

    const commentData = {
      productId,
      text,
      username,
    };

    if (isAuthenticated && rating) {
      commentData.rating = rating;
      commentData.userId = req.user._id;
    }

    const comment = new Comment(commentData);
    await comment.save();

    if (rating) {
  const ratedComments = await Comment.find({ productId, rating: { $ne: null } });

  const totalRating = ratedComments.reduce((sum, c) => sum + c.rating, 0);
  const averageRating = Math.round((totalRating / ratedComments.length) * 10) / 10;

  // Update the product's rating
  await Product.findByIdAndUpdate(productId, { rating: averageRating }, { new: true });
}


    if (req.io) {
      req.io.emit('newComment', comment);
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to post comment' });
  }
};

