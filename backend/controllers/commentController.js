const Comment = require('../models/Comment');
const Product = require('../models/Product');
exports.getCommentsByProductId = async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.productId }).sort({ createdAt: -1 }).populate('userId', 'fullname');
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
      ? req.user.fullname || req.user.username || req.user.name || 'Anonymous'
      : 'User' + Math.floor(1000 + Math.random() * 9000);

    const commentData = {
      productId,
      text,
      rating: isAuthenticated ? rating : null,
      userId: isAuthenticated ? req.user._id : null,
      username,
    };

    const comment = new Comment(commentData);
    console.log("Received comment:", commentData);
    await comment.save();

    let averageRating = null;
    if (isAuthenticated && rating) {
      const ratedComments = await Comment.find({ productId, rating: { $ne: null } });
      const totalRating = ratedComments.reduce((sum, c) => sum + c.rating, 0);
      averageRating = Math.round((totalRating / ratedComments.length) * 10) / 10;

      await Product.findByIdAndUpdate(productId, { rating: averageRating }, { new: true });
    }

    if (req.io) {
      req.io.emit('newComment', comment);
    }

    // Only include newRating if it exists
    res.status(201).json(averageRating ? { comment, newRating: averageRating } : { comment });

  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(500).json({ message: 'Failed to post comment' });
  }
};

