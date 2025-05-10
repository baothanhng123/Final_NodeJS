import React from 'react';
import './Footer.css';
import instagram_icon from '../Assets/instagram_icon.png';
import pintester_icon from '../Assets/pintester_icon.png';
import whatsapp_icon from '../Assets/whatsapp_icon.png';

const Footer = () => {
    return (
        <div className="footer">
            <ul className="footer-links">
                <li>Company</li>
                <li>Products</li>
                <li>Offices</li>
            </ul>
            <div className="footer-social-icon">
                <div className="footer-icons-container">
                    <img src={instagram_icon} alt="Instagram Icon" />
                </div>
                <div className="footer-icons-container">
                    <img src={pintester_icon} alt="Pinterest Icon" />
                </div>
                <div className="footer-icons-container">
                    <img src={whatsapp_icon} alt="WhatsApp Icon" />
                </div>
            </div>
            <div className="footer-copyright">
                <p>&copy; 2025 Electronics. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;