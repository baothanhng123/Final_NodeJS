import React, { useContext } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';

const ShopCategory = (props) => {
    const { all_product } = useContext(ShopContext);
    const { category } = props;

    const filtered_products = all_product.filter((e) => e.category === category);

    const getAnimatedImageSource = () => {
        switch (category) {
            case 'main':
                return require('../Components/Assets/video3.mp4');
            case 'cpu':
                return require('../Components/Assets/video1.mp4');
            case 'computer':
                return require('../Components/Assets/Mac.mp4');
            case 'case':
                return require('../Components/Assets/video3.mp4');
            case 'power':
                return require('../Components/Assets/video5.mp4');
            case 'monitor':
                return require('../Components/Assets/Mac.mp4');
            case 'hardrive':
                return require('../Components/Assets/video1.mp4');
            case 'accessories':
                return require('../Components/Assets/video2.mp4');
            default:
                return null;
        }
    };

    const animatedImageSource = getAnimatedImageSource();

    return (
        <div className="shop-category">
            <div className="shop-category-hero">
                <h2>{category}</h2>
                <hr />
                {animatedImageSource && (
                    <div className="animated-image-container">
                        <video
                            src={animatedImageSource}
                            width="auto" // Adjust as needed
                            height="auto" // Adjust as needed
                            loop
                            muted
                            autoPlay
                            playsInline
                            className="category-animated-image"
                        />
                        <div className='shopcategory-indexSort'>
                            <p>
                                <span>Showing 1-12</span> out of 36 products
                            </p>
                            <div className='shopcategory-sort'>
                                Sort by <img src={dropdown_icon} alt=" " />
                            </div>

                        </div>
                    </div>
                )}
            </div>
            <div className="shopcategory-products">
                {filtered_products.map((item, i) => (
                    <Item
                        key={i}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        new_price={item.new_price}
                    />
                ))}
            </div>
            <div className="shopcategory-loadmore">
                Explore More
            </div>
        </div>

    );
};

export default ShopCategory;