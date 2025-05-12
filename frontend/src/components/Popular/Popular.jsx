import React from 'react';
import './Popular.css';
import data_product from '../Assets/data.js';
import Item from '../Item/Item';
import shop5 from '../Assets/banner5.webp';
import shop6 from '../Assets/banner6.webp';
import shop7 from '../Assets/banner7.webp';
import shop8 from '../Assets/banner8.webp';

const Popular = () => {
    return (
        <div className="popular">
            <h1>BEST SELLERS</h1>
            <hr />
            <div className="popular-item">
                {data_product.map((item, i) => (
                    <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
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