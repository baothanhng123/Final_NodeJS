import React from 'react';
//import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  //const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="banner-section">
        <div className="banner-content">
          <h1>THIS IS A BANNER</h1>
          <h2>CHANGE IT LATER</h2>
        </div>
      </div>
      
      <div className="product-categories">
        <div className="category-card">
          <Link to="/pc-gaming">
            <img src="" alt="PC Gaming" />
            <h3>PC GAMING</h3>
            <p>High performance</p>
          </Link>
        </div>
        
        <div className="category-card">
          <Link to="/pc-amd">
            <img src="" alt="PC AMD Gaming" />
            <h3>PC AMD GAMING</h3>
          </Link>
        </div>
        
        <div className="category-card">
          <Link to="/pc-workstation">
            <img src="" alt="PC Workstation" />
            <h3>PC WORKSTATION</h3>
            <p>3D Render</p>
          </Link>
        </div>
      </div>
      
      <div className="featured-products">
        {/* Add featured products section here */}
      </div>
    </div>
  );
};

export default Home; 