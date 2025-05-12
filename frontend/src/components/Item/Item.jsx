import React from 'react';
import './Item.css';

const Item = (props) => {
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
            <button className="view-more">Tìm hiểu thêm</button> {/* Added a button */}
            <button className="buy-button">Mua</button> {/* Added a buy button */}
        </div>
    );
};

export default Item;