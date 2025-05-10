import React from 'react';
import './Hero.css';
import shop from '../Assets/Iphone15.jpg';
import shop1 from '../Assets/banner1.webp';
import shop2 from '../Assets/banner2.webp';
import shop3 from '../Assets/banner3.webp';
import shop4 from '../Assets/banner4.webp';

const Hero = () => {
    return (
        <div className="hero">
            <div className="hero-grid-3-rows">
                <div className="grid-item top-banner">
                    <img src={shop} alt="Top Banner" />
                </div>
                <div className="grid-item middle-left">
                    <img src={shop1} alt="Middle Left Product" />
                    {/* Add text or other content here */}
                </div>
                <div className="grid-item middle-right">
                    <img src={shop2} alt="Middle Right Product" />
                    {/* Add text or other content here */}
                </div>
                <div className="grid-item bottom-left">
                    <img src={shop3} alt="Bottom Left Product" />
                    {/* Add text or other content here */}
                </div>
                <div className="grid-item bottom-right">
                    <img src={shop4} alt="Bottom Right Product" />
                    {/* Add text or other content here */}
                </div>
            </div>
        </div>
    );
};

export default Hero;
