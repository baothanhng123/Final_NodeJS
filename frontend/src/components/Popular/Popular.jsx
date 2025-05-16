import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Popular.css";
import Item from "../Item/Item";
import shop5 from "../Assets/banner5.webp";
import shop6 from "../Assets/banner6.webp";
import shop7 from "../Assets/banner7.webp";
import shop8 from "../Assets/banner8.webp";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await axios.get('/api/products/top-rated');
        setPopularProducts(response.data);
      } catch (error) {
        console.error("Error fetching popular products:", error);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <div className="popular">
      <h1>BEST SELLERS</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item) => (
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
      <div className="image-grid">
        <div className="grid-item middle-left">
          <img src={shop5} alt="Middle Left Product" />
        </div>
        <div className="grid-item middle-right">
          <img src={shop6} alt="Middle Right Product" />
        </div>
        <div className="grid-item bottom-left">
          <img src={shop7} alt="Bottom Left Product" />
        </div>
        <div className="grid-item bottom-right">
          <img src={shop8} alt="Bottom Right Product" />
        </div>
      </div>
    </div>
  );
};

export default Popular;
