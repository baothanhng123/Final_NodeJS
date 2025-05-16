import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShopContext } from "../context/ShopContext";
import { io } from "socket.io-client";
import axios from "axios";
import "../styles/ProductDetail.css";

const socket = io("http://localhost:5000");

const ProductDetail = () => {
  const { productId } = useParams();
  const { all_product } = useContext(ShopContext);
  const product = all_product.find((p) => p._id === productId);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(`/api/comments/${productId}`);
      setComments(res.data);
    };

    fetchComments();

    socket.on("newComment", (comment) => {
      if (comment.productId === productId) {
        setComments((prev) => [comment, ...prev]);
      }
    });

    return () => socket.off("newComment");
  }, [productId]);

  if (!product) {
    return (
      <div className="product-detail">
        <h2>Product not found</h2>
      </div>
    );
  }

  const renderStars = (rating) => {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++)
      stars.push(<span key={"full" + i}>★</span>);
    if (halfStar) stars.push(<span key="half">☆</span>);
    for (let i = 0; i < emptyStars; i++)
      stars.push(<span key={"empty" + i}>✩</span>);
    return stars;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;
    

    const username = user?.fullname || user?.username || user?.email || `User${Math.floor(1000 + Math.random() * 9000)}`;
    console.log("Username:", username);
    const commentData = {
      text: newComment,
      rating: newRating, // Only allow ratings if logged in
      username,
    };

    try {
      await axios.post(`/api/comments/${productId}`, commentData);
      setNewComment("");
      setNewRating(0);
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  return (
    <div className="product-detail">
      <img src={product.photo} alt={product.name} />
      <div className="product-info">
        <h2>{product.name}</h2>
        <p>
          <strong>Brand:</strong> {product.brand}
        </p>
        <p>
          <strong>Price:</strong> ${product.price}
        </p>
        {product.old_price && (
          <p>
            <strong>Old Price:</strong> <s>${product.old_price}</s>
          </p>
        )}
        <div className="rating">
          <strong>Rating:</strong> {renderStars(product.rating)}
        </div>
        <p>
          <strong>Description:</strong>
        </p>
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
                onClick={() => {
                  if (isAuthenticated) setNewRating(star);
                  else alert("Login to rate this product.");
                }}
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
      <p className="comment-user">
        <strong>{c.username}</strong>
      </p>

      {/* Only show rating stars if a rating exists */}
      {c.rating && (
        <div className="comment-rating">
          {renderStars(c.rating)} ({c.rating}/5)
        </div>
      )}

      <p className="comment-text">{c.text}</p>
      <p className="comment-date">
        {c.date || new Date(c.createdAt).toLocaleString()}
      </p>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default ProductDetail;
