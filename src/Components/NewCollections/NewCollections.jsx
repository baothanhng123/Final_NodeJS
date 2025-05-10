import React from 'react';
import './NewCollections.css';
import new_collection from '../Assets/new_collections';
import Item from '../Item/Item'; // Assuming you'll reuse the Item component
import shop from '../Assets/Iphone15.jpg'; // Import hình ảnh bạn muốn

const NewCollections = () => {
    return (
        <div className="new-collections">
            <h1>NEW PRODUCTS</h1>
            <hr />
            <div className="collections">
                {new_collection.map((item, i) => (
                    <Item
                        key={i}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        new_price={item.new_price}
                    />
                ))}
            </div>
        </div>
    );
};

export default NewCollections;