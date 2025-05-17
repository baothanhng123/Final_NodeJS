import React, { useContext } from 'react';
import './CartItems.css';
import remove_icon from '../Assets/cart_cross_icon.png';
import { ShopContext } from '../../context/ShopContext';

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

    console.log("all_product in CartItems:", all_product.map(p => p._id));
    console.log("cartItems with quantity > 0 in CartItems:", Object.keys(cartItems).filter(key => cartItems[key] > 0));

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e) => {
                console.log(`Checking product ${e._id}: quantity in cartItems is ${cartItems[e._id]}`);
                if (cartItems[e._id] > 0) {
                    console.log(`Product ID: ${e._id}, Name: ${e.name}, Price: ${e.price}, Quantity: ${cartItems[e._id]}`);
                    console.log(`Type of e.price: ${typeof e.price}, Type of cartItems[e._id]: ${typeof cartItems[e._id]}`);
                    return <div>
                        <div className="cartitems-format cartitems-format-main">
                            <img src={e.image} alt="" className="carticon-product-icon" />
                            <p>{e.name}</p>
                            <p>${e.price}</p>
                            <button className="cartitems-quantity">{cartItems[e._id]}</button>
                            <p>${e.price * cartItems[e._id]}</p>
                            <img className='cartitems-remove-icon' src={remove_icon} onClick={() => removeFromCart(e._id)} alt="" />
                        </div>
                        <hr />
                    </div>
                }
                return null;
            })}
            <div className='cartitems-down'>
                <div>
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className='cartitems-total-item'>
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    <button className="cartitems-total-button">PROCEED TO CHECKOUT</button>
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, Enter it here</p>
                    <div className="cartitems-promobox">
                        <input type="text" placeholder="promo code" />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;