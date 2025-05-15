import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NewCollections.css";
import Item from "../Item/Item";

const NewCollections = () => {
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await axios.get('/api/products/latest');
        setNewProducts(response.data);
      } catch (error) {
        console.error("Error fetching new products:", error);
      }
    };

    fetchNewProducts();
  }, []);

  return (
    <div className="new-collections">
      <h1>NEW PRODUCTS</h1>
      <hr />
      <div className="collections">
        {newProducts.map((item, i) => (
          <Item
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.photo}
            new_price={item.price}
            rating={item.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default NewCollections;
