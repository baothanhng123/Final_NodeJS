import React, { useContext } from 'react';
import './Item.css';
import { ShopContext } from '../../Context/ShopContext';
import { Link } from 'react-router-dom';
const Item = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    return (
        <div className="item">
            <Link to={`/product/${props.id}`}><img src={props.image} alt={props.name} /></Link>
            <h3>{props.name}</h3> {/* Changed <p> to <h3> for the name, assuming it's a title */}
            <div className="prices"> {/* Changed className to "prices" for better semantic meaning */}
                <span className="new-price">${props.new_price}</span> {/* Used <span> for inline styling */}
                {props.old_price && ( // Conditionally render old price if it exists
                    <span className="old-price">${props.old_price}</span>
                )}
            </div>
            <button className="view-more">Tìm hiểu thêm</button> {/* Added a button */}
            <button onClick={() => { addToCart(props.id) }} className="buy-button">Mua</button> {/* Added a buy button */}
        </div>
    );
};

export default Item;