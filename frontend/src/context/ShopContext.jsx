import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [all_product, setAllProduct] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("/api/products");
                if (Array.isArray(res.data.products)) {
                    setAllProduct(res.data.products);
                } else if (Array.isArray(res.data)) {
                    setAllProduct(res.data);
                } else {
                    setAllProduct([]);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error.response?.data || error.message);
                setAllProduct([]);
            }
        };

        fetchProducts();
    }, []);

    const contextValue = { all_product };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
