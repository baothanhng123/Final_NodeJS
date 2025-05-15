import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [all_product, setAllProduct] = useState([]);
    const { token } = useAuth();
    useEffect(() => {
    if (!token) return; // skip if no token

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/api/products", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllProduct(res.data);
        } catch (error) {
            console.error("Failed to fetch products:", error.response?.data || error.message);
        }
    };

    fetchProducts();
}, [token]);

    const contextValue = { all_product };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
