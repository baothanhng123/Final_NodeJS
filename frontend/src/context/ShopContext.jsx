import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
//import { useAuth } from "./AuthContext";
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [all_product, setAllProduct] = useState([]);
    //const { token } = useAuth();
    const getDefaultCart = (products) => {
        let cart = {};
        if (products) {
            for (const product of products) {
                cart[product._id] = 0;
            }
        }
        return cart;
    };
    const [cartItems, setCartItems] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                //const res = await axios.get("/api/products", token ? { headers: { Authorization: `Bearer ${token}` } } : {});
                const res = await axios.get("/api/products?limit=all");

                setAllProduct(res.data.products);
                // Initialize cart items after products are fetched
                setCartItems(getDefaultCart(res.data.products));
            } catch (error) {
                console.error("Failed to fetch products:", error.response?.data || error.message);
            }
        };
        fetchProducts();
    }, []); // Empty dependency array to run only once on mount

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1, }));
        console.log(cartItems);
    }
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };


    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] > 0 ? prev[itemId] - 1 : 0, }));
    };

    useEffect(() => {
        console.log("cartItems state updated:", cartItems);
    }, [cartItems]);

    const contextValue = { getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;