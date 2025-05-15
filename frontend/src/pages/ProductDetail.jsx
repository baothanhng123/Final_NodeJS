import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import "../styles/ProductDetail.css"; // Assuming you have a CSS file for styling

const ProductDetail = () => {
  const { productId } = useParams();
  const { all_product } = useContext(ShopContext);
  const product = all_product.find((p) => p._id === productId);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  if (!product) {
    return <div className="product-detail"><h2>Product not found</h2></div>;
  }

  const renderStars = (rating) => {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++) stars.push(<span key={"full" + i}>★</span>);
    if (halfStar) stars.push(<span key="half">☆</span>);
    for (let i = 0; i < emptyStars; i++) stars.push(<span key={"empty" + i}>✩</span>);
    return stars;
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment || newRating === 0) return;
    const comment = {
      text: newComment,
      rating: newRating,
      date: new Date().toLocaleString(),
    };
    setComments([comment, ...comments]);
    setNewComment("");
    setNewRating(0);
  };

  return (
    <div className="product-detail">
      <img src={product.photo} alt={product.name} />
      <div className="product-info">
        <h2>{product.name}</h2>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        {product.old_price && (
          <p><strong>Old Price:</strong> <s>${product.old_price}</s></p>
        )}
        <div className="rating"><strong>Rating:</strong> {renderStars(product.rating)}</div>
        <p><strong>Description:</strong></p>
        <p>{product.description}</p>
        <button className="buy-button">Buy Now</button>
      </div>

      {/* Comment Section */}
      <div className="product-comments">
        <h3>User Reviews</h3>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= newRating ? "selected" : ""}
                onClick={() => setNewRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <button type="submit">Submit</button>
        </form>

        <div className="comment-list">
          {comments.length === 0 && <p>No comments yet.</p>}
          {comments.map((c, i) => (
            <div key={i} className="comment">
              <div className="comment-rating">{renderStars(c.rating)}</div>
              <p className="comment-text">{c.text}</p>
              <p className="comment-date">{c.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
