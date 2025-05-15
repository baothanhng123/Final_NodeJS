import React from 'react';
import './Item.css';
import { useNavigate } from 'react-router-dom';
const Item = (props) => {
    const navigate = useNavigate(); // Assuming you're using react-router-dom for navigation
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
    return (
        <div className="item">
            <img src={props.image} alt={props.name} />
            <h3>{props.name}</h3> {/* Changed <p> to <h3> for the name, assuming it's a title */}
            <div className="prices"> {/* Changed className to "prices" for better semantic meaning */}
                <span className="new-price">${props.new_price}</span> {/* Used <span> for inline styling */}
                {props.old_price && ( // Conditionally render old price if it exists
                    <span className="old-price">${props.old_price}</span>
                )}
            </div>
            <div className="rating">{renderStars(props.rating || 0)}</div> {/* Rating line */}
            <button className="view-more" onClick={() => navigate(`/product/${props.id}`)}>Tìm hiểu thêm</button> {/* Added a button */}
            <button className="buy-button">Mua</button> {/* Added a buy button */}
        </div>
    );
};

export default Item;