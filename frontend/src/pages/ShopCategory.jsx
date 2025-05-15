import React, { useContext, useState } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../context/ShopContext";
import Item from "../components/Item/Item";
//import dropdown_icon from "../components/Assets/dropdown_icon.png";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const { category } = props;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");

  const productsPerPage = 8;

  // Filter
  let filtered_products = all_product
    .filter((e) => e.category === category)
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (product) =>
        selectedCategory === "all" || product.category === selectedCategory
    )
    .filter((product) => {
      const price = product.price;
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      return (isNaN(min) || price >= min) && (isNaN(max) || price <= max);
    });

  // Extract dynamic brands from the above filtered list
  const availableBrands = [
    ...new Set(
      filtered_products.map((product) => product.brand).filter(Boolean)
    ),
  ];

  // Now filter by brand
  filtered_products = filtered_products.filter(
    (product) => selectedBrand === "all" || product.brand === selectedBrand
  );

  filtered_products = filtered_products.filter((product) => {
  return (
    selectedRating === "all" || product.rating >= parseInt(selectedRating)
  );
});

  // Sort
  if (sortOrder === "low-to-high") {
    filtered_products.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-to-low") {
    filtered_products.sort((a, b) => b.price - a.price);
  } else if (sortOrder === "name-asc") {
    filtered_products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === "name-desc") {
    filtered_products.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOrder === "newest") {
    filtered_products.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else if (sortOrder === "oldest") {
    filtered_products.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  } else if (sortOrder === "brand-asc") {
    filtered_products.sort((a, b) =>
      (a.brand || "").localeCompare(b.brand || "")
    );
  } else if (sortOrder === "brand-desc") {
    filtered_products.sort((a, b) =>
      (b.brand || "").localeCompare(a.brand || "")
    );
  }

  const totalPages = Math.ceil(filtered_products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filtered_products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const getAnimatedImageSource = () => {
    switch (category) {
      case "main":
        return require("../components/Assets/video3.mp4");
      case "cpu":
        return require("../components/Assets/video1.mp4");
      case "computer":
        return require("../components/Assets/Mac.mp4");
      case "case":
        return require("../components/Assets/video3.mp4");
      case "power":
        return require("../components/Assets/video5.mp4");
      case "monitor":
        return require("../components/Assets/Mac.mp4");
      case "hardrive":
        return require("../components/Assets/video1.mp4");
      case "accessories":
        return require("../components/Assets/video2.mp4");
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
              width="auto"
              height="auto"
              loop
              muted
              autoPlay
              playsInline
              className="category-animated-image"
            />
            <div className="shopcategory-indexSort">
              <p>
                Showing {startIndex + 1}-
                {Math.min(
                  startIndex + productsPerPage,
                  filtered_products.length
                )}{" "}
                out of {filtered_products.length} products
              </p>

              <div className="shopcategory-search">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Filters and Sorting */}
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
              <div className="brand-filter">
                <label>Brand:</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All</option>
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rating-filter">
  <label>Rating:</label>
  <select
    value={selectedRating}
    onChange={(e) => {
      setSelectedRating(e.target.value);
      setCurrentPage(1);
    }}
  >
    <option value="all">All</option>
    <option value="5">5★ & up</option>
    <option value="4">4★ & up</option>
    <option value="3">3★ & up</option>
    <option value="2">2★ & up</option>
    <option value="1">1★ & up</option>
  </select>
</div>

              {/* Uncomment this if you want to show category filter */}
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
                  setSelectedBrand("all");
                  setSelectedRating("all");
                }}
              >
                Reset All Filters
              </button>

              <div className="shopcategory-sort">
                <label htmlFor="sort">Sort by: </label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="default">Default</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="brand-asc">Brand: A to Z</option>
                  <option value="brand-desc">Brand: Z to A</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product list */}
      <div className="shopcategory-products">
        {currentProducts.length > 0 ? (
          currentProducts.map((item) => (
            <Item
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.photo}
              new_price={item.price}
              rating={item.rating}
              
            />
          ))
        ) : (
          <div className="no-products-message">
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
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
