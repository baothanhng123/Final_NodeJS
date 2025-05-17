const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');


// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Search by name
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
      console.log('Search query:', query.$or);
    }

    // Filter by brand
    if (req.query.brand && req.query.brand !== 'all') {
      query.brand = req.query.brand;
      console.log('Brand filter:', query.brand);
    }

    // Filter by category
    if (req.query.category && req.query.category !== 'all') {
      try {
        const categoryQuery = req.query.category;
        //console.log('Filtering by category:', categoryQuery);

        if (mongoose.Types.ObjectId.isValid(categoryQuery)) {
          // If it's a valid ID, check if an active category exists with this ID
          const categoryById = await Category.findOne({
            _id: categoryQuery,
            state: 'ACTIVE'
          });

          if (categoryById) {
            query.category = categoryById._id;
            //console.log('Found active category by ID:', categoryById.description);
          } else {
            query.category = null; // Force no results if category not found
            //console.log('No active category found with ID:', categoryQuery);
          }
        } else {
          // If not a valid ID, search by description
          const category = await Category.findOne({
            description: new RegExp(`^${categoryQuery}$`, 'i'),
            state: 'ACTIVE'
          });

          if (category) {
            query.category = category._id;
            //console.log('Found active category by description:', category.description);
          } else {
            // Try partial match as last resort
            const categories = await Category.find({
              description: new RegExp(categoryQuery, 'i'),
              state: 'ACTIVE'
            });

            if (categories.length > 0) {
              query.category = { $in: categories.map(c => c._id) };
              //console.log('Found categories by partial match:', categories.map(c => c.description));
            } else {
              query.category = null;
              //console.log('No matching active categories found');
            }
          }
        }
      } catch (err) {
        //console.error('Error in category filter:', err);
        query.category = null;
      }
    }

    // Build sort options
    let sort = {};
    if (req.query.sort) {
      const order = req.query.order === 'desc' ? -1 : 1;
      sort[req.query.sort] = order;
      //console.log('Sort options:', { field: req.query.sort, order: req.query.order });
    } else {
      sort.name = 1;
    }

    //console.log('Final query:', JSON.stringify(query));
    //console.log('Final sort:', JSON.stringify(sort));

    // Execute query with populated category
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate({
          path: 'category',
          select: 'description state',
          match: { state: 'ACTIVE' }
        })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    // Transform products to include category information
    const formattedProducts = products
      .filter(product => product.category) // Only include products with active categories
      .map(product => {
        const productObj = product.toObject();
        return {
          ...productObj,
          category: {
            _id: productObj.category._id,
            description: productObj.category.description
          }
        };
      });

    res.json({
      products: formattedProducts,
      total: formattedProducts.length,
      page,
      totalPages: Math.ceil(formattedProducts.length / limit)
    });
  } catch (err) {
    //console.error('Error in getAllProducts:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    // Look up category by its description (like "CPU", "Monitor", etc.)
    const category = await Category.findOne({ description: new RegExp(`^${categoryName}$`, 'i') });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find products with this category._id
    const products = await Product.find({ category: category._id })
      .populate('category') // to get the full category object
      .sort({ createdAt: -1 }); // optional: latest first

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getProductByCategory = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'description');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getLatestProducts  = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 }) // Newest first
      .limit(8); // Only 8 items

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
// Get top 6 highest rated products
exports.getTopRatedProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ rating: -1 }) // Sort by rating descending
      .limit(6); // Limit to 6 products

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch top rated products", error });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};