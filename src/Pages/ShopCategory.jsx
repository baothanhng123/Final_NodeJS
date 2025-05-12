import React, { useContext, useState } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Item/Item";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const { category } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const productsPerPage = 8;

  let filtered_products = all_product
    .filter((e) => e.category === category)
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter((product) =>
    selectedCategory === "all" || product.category === selectedCategory
  )
  .filter((product) => {
    const price = product.new_price;
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    return (
      (isNaN(min) || price >= min) &&
      (isNaN(max) || price <= max)
    );
  })
    ;

  // Sort logic
  if (sortOrder === "low-to-high") {
    filtered_products.sort((a, b) => a.new_price - b.new_price);
  } else if (sortOrder === "high-to-low") {
    filtered_products.sort((a, b) => b.new_price - a.new_price);
  } else if (sortOrder === "name-asc") {
    filtered_products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === "name-desc") {
    filtered_products.sort((a, b) => b.name.localeCompare(a.name));
  }else if (sortOrder === "newest") {
  filtered_products.sort((a, b) => b.id - a.id); // Highest ID first
} else if (sortOrder === "oldest") {
  filtered_products.sort((a, b) => a.id - b.id); // Lowest ID first
}

  const totalPages = Math.ceil(filtered_products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filtered_products.slice(startIndex, startIndex + productsPerPage);

  const getAnimatedImageSource = () => {
    switch (category) {
      case "main": return require("../Components/Assets/video3.mp4");
      case "cpu": return require("../Components/Assets/video1.mp4");
      case "computer": return require("../Components/Assets/Mac.mp4");
      case "case": return require("../Components/Assets/video3.mp4");
      case "power": return require("../Components/Assets/video5.mp4");
      case "monitor": return require("../Components/Assets/Mac.mp4");
      case "hardrive": return require("../Components/Assets/video1.mp4");
      case "accessories": return require("../Components/Assets/video2.mp4");
      default: return null;
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
              loop
              muted
              autoPlay
              playsInline
              className="category-animated-image"
            />
            <div className="shopcategory-indexSort">
              <p>
                Showing {startIndex + 1}-
                {Math.min(startIndex + productsPerPage, filtered_products.length)}{" "}
                out of {filtered_products.length} products
              </p>
              <div className="shopcategory-search">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to page 1 on search
                  }}
                />
              </div>

                  <div className="shopcategory-filters">
  <div className="price-filter">
    <label>Price:</label>
    <input
      type="number"
      placeholder="Min"
      value={minPrice}
      onChange={(e) => setMinPrice(e.target.value)}
    />
    <input
      type="number"
      placeholder="Max"
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
    />
  </div>

  {/* <div className="category-filter">
    <label>Category:</label>
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="all">All</option>
      <option value="cpu">CPU</option>
      <option value="computer">Computer</option>
      <option value="case">Case</option>
      <option value="power">Power</option>
      <option value="monitor">Monitor</option>
      <option value="hardrive">Hard Drive</option>
      <option value="accessories">Accessories</option>
    </select>
  </div> */}
  <button
  onClick={() => {
    setSearchTerm("");
    setSortOrder("default");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory("all");
    setCurrentPage(1);
  }}
>
  Reset All Filters
</button>
</div>


              <div className="shopcategory-sort">
                <label htmlFor="sort">Sort by: </label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1); // Reset to page 1 on sort
                  }}
                >
                  <option value="default">Default</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>       
                  <option value="oldest">Oldest First</option> 
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="shopcategory-products">
        {currentProducts.length > 0 ? (
          currentProducts.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
            />
          ))
        ) : (
          <div className="no-products-message">
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* Pagination UI */}
      <div className="shopcategory-pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopCategory;
