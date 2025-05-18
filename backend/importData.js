require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const config = require('./config/main');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const mongoose = require('mongoose');

(async () => {
  console.log('Importing data...');
  try {
    await connectDB(config.mongoURL); // Connect to DB

    const categories = JSON.parse(fs.readFileSync('./datatest/Ecommerce.categories.json', 'utf-8'));
    //console.log(`Read ${categories.length} categories from JSON.`);
    const products = JSON.parse(fs.readFileSync('./datatest/Ecommerce.products.json', 'utf-8'));
    //console.log(`Read ${products.length} products from JSON.`);
    const users = JSON.parse(fs.readFileSync('./datatest/Ecommerce.users.json', 'utf-8'));
    //console.log(`Read ${users.length} users from JSON.`);
    const orders = JSON.parse(fs.readFileSync('./datatest/Ecommerce.orders.json', 'utf-8'));
    //console.log(`Read ${orders.length} orders from JSON.`);

    // Separate admin user from other users for special handling
    const adminUserJson = users.find(user => user.email === process.env.ADMIN_EMAIL);
    const otherUsersJson = users.filter(user => user.email !== process.env.ADMIN_EMAIL);

    // Transform data to match Mongoose schema expectations
    const transformedCategories = categories
      .filter(cat => cat._id && typeof cat._id === 'object' && cat._id.$oid) // Filter for valid _id
      .map(cat => ({
      _id: cat._id.$oid, // Extract ObjectId string
      description: cat.description,
      state: cat.state,
      createdAt: (cat.createdAt && typeof cat.createdAt === 'object' && cat.createdAt.$date) ? new Date(cat.createdAt.$date) : new Date(), // Safe access and convert date string to Date object
      __v: cat.__v
    }));
    //console.log(`Transformed ${transformedCategories.length} categories.`);

    const transformedProducts = products
      .filter(prod => prod._id && typeof prod._id === 'object' && prod._id.$oid) // Filter for valid _id
      .filter(prod => prod.category && typeof prod.category === 'object' && prod.category.hasOwnProperty('$oid')) // Add filter for valid category
      .map(prod => {
        try {
          return {
            _id: prod._id.$oid, // Extract ObjectId string
            name: prod.name,
            brand: prod.brand,
            description: prod.description,
            category: (prod.category && typeof prod.category === 'object' && prod.category.hasOwnProperty('$oid')) ? prod.category.$oid : null, // Explicitly check if $oid property exists
            quantity: prod.quantity,
            price: prod.price,
            barcode: prod.barcode,
            photo: prod.photo,
            state: prod.state,
            createdAt: (prod.createdAt && typeof prod.createdAt === 'object' && prod.createdAt.hasOwnProperty('$date')) ? new Date(prod.createdAt.$date) : new Date(), // Explicitly check if $date property exists
            rating: prod.rating,
            __v: prod.__v // Include __v if present in JSON
          };
        } catch (error) {
          console.error('Error transforming product:', prod);
          throw error; // Re-throw the error after logging
        }
      });
    //console.log(`Transformed ${transformedProducts.length} products.`);

    const transformedOrders = orders
       // Remove strict filter for _id.$oid, keep filter for _id existence and object type
       // .filter(order => order._id && typeof order._id === 'object' && order._id.$oid) // Removed
       // .filter(order => order._id !== undefined && order._id !== null) // Add basic check for _id existence
      .map(order => {
        try { // Add try-catch block
          return { // Move the return object inside try
            // Try to use $oid if it exists, otherwise use _id directly (assuming it might be a string)
            _id: order._id ? (typeof order._id === 'object' && order._id.$oid ? order._id.$oid : order._id) : null, // Simplified _id handling: use $oid if object, otherwise use _id directly if exists
            user: (order.user && typeof order.user === 'object' && order.user.$oid) ? order.user.$oid : null, // Safe access user OID
            products: order.products && Array.isArray(order.products) ? order.products.map(item => ({
              product: (item.product && typeof item.product === 'object' && item.product.$oid) ? item.product.$oid : null, // Safe access product OID
              quantity: item.quantity,
              price: item.price
            })).filter(item => item.product !== null) : [], // Filter out items with invalid product OID
            total: order.total,
            status: order.status,
            createdAt: (order.createdAt && typeof order.createdAt === 'object' && order.createdAt.$date) ? new Date(order.createdAt.$date) : new Date(), // Safe access and convert createdAt
            updatedAt: (order.updatedAt && typeof order.updatedAt === 'object' && order.updatedAt.$date) ? new Date(order.updatedAt.$date) : new Date(), // Safe access and convert updatedAt
            __v: order.__v // Include __v if present in JSON
          };
        } catch (error) { // Catch any error during transformation
          console.error('Error transforming order:', order, 'Error:', error.message);
          return null; // Return null for invalid order entries
        }
      }).filter(order => order !== null); // Filter out nulls after mapping
     console.log(`Transformed ${transformedOrders.length} orders.`);

     const transformedUsers = otherUsersJson
       .filter(user => user._id && typeof user._id === 'object' && user._id.$oid) // Filter for valid _id
       // Filter out users who require a password based on schema logic but don't have a non-empty password string
       .filter(user => {
          // Check for existence and non-empty string for googleId or facebookId in JSON
          const requiresPassword = !(user.googleId && typeof user.googleId === 'string' && user.googleId.length > 0) && !(user.facebookId && typeof user.facebookId === 'string' && user.facebookId.length > 0);
          // Keep user if password is not required, or if password is required and is a non-empty string
          //console.log(`User ${user.email}: requiresPassword = ${requiresPassword}, password exists = ${typeof user.password === 'string' && user.password.length > 0}`); // Log password check result
          return !requiresPassword || (typeof user.password === 'string' && user.password.length > 0);
       })
      .map(async user => { // Keep map as async
        try {
           // Create a new object for transformed user data
           const userData = {
            _id: user._id.$oid, // Extract ObjectId string
            fullname: user.fullname,
            email: user.email,
            // Keep original password for manual hashing if required and present
            password: user.password,
            role: user.role,
            // Set authType to 'local' if not provided and user has no social IDs
            authType: user.authType || ((user.googleId && typeof user.googleId === 'string' && user.googleId.length > 0) || (user.facebookId && typeof user.facebookId === 'string' && user.facebookId.length > 0) ? user.authType : 'local'),
            googleId: user.googleId, // Include googleId
            facebookId: user.facebookId, // Include facebookId
            // Ensure addresses is an array and filter out invalid address objects/strings within it
            addresses: user.addresses && Array.isArray(user.addresses) ? user.addresses.map(addr => {
                // Ensure addr is an object before accessing properties
                if (addr && typeof addr === 'object') {
                    return {
                       _id: (addr._id && typeof addr._id === 'object' && addr._id.$oid) ? addr._id.$oid : null, // Safe access address _id OID
                       // Explicitly check for required address field as a non-empty string
                       address: (typeof addr.address === 'string' && addr.address.length > 0) ? addr.address : null,
                       street: addr.street, // Assuming street might exist but is not required by schema snippet
                       city: addr.city,
                       state: addr.state,
                       zip: addr.zip,
                       country: addr.country,
                       isDefault: addr.isDefault,
                    };
                } else {
                    return null; // Return null for invalid address entries
                }
            }).filter(addr => addr !== null && addr.address !== null) : [], // Filter out null entries and addresses without a valid non-empty address string
            createdAt: (user.createdAt && typeof user.createdAt === 'object' && user.createdAt.$date) ? new Date(user.createdAt.$date) : new Date(), // Safe access and convert createdAt
            updatedAt: (user.updatedAt && typeof user.updatedAt === 'object' && user.updatedAt.$date) ? new Date(user.updatedAt.$date) : new Date(), // Safe access and convert updatedAt
            __v: user.__v // Include __v if present in JSON
           };

           // Pass password to Mongoose middleware for hashing
           // We are not manually hashing here anymore

          return userData; // Return the transformed user object
        } catch (error) {
          console.error('Error transforming user:', user, 'Error:', error.message);
          return null; // Return null for invalid user entries
        }
      });

    // Wait for all user transformations to complete
     const finalTransformedUsers = (await Promise.all(transformedUsers)).filter(user => user !== null); // Wait for promises and filter out nulls
     //console.log(`Transformed ${finalTransformedUsers.length} other users.`);

    // Clear existing data
    console.log('Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({}); // Clear all users, including admin
    console.log('Existing data cleared.');

    // Insert new data
    console.log('Inserting new data...');
    await Category.insertMany(transformedCategories);
    //console.log('Categories imported successfully!');
    await Product.insertMany(transformedProducts);
    //console.log('Products imported successfully!');
    try { // Add try-catch around order insertion
      if (transformedOrders.length > 0) {
         await Order.insertMany(transformedOrders);
         console.log('Orders imported successfully!');
      } else {
         console.log('No valid orders to import.');
      }
    } catch (error) {
      console.error('Error inserting orders:', error);
    }

    // Handle admin user separately
    if (adminUserJson) {
      try {
          console.log('Importing admin user...');
          const adminDoc = new User({
               _id: adminUserJson._id.$oid, // Extract ObjectId string
               fullname: adminUserJson.fullname,
               email: adminUserJson.email,
               password: adminUserJson.password, // Mongoose middleware will hash this
               role: adminUserJson.role,
               authType: adminUserJson.authType || 'local', // Default to local if not provided
               googleId: adminUserJson.googleId,
               facebookId: adminUserJson.facebookId,
               addresses: adminUserJson.addresses && Array.isArray(adminUserJson.addresses) ? adminUserJson.addresses.map(addr => {
                    if (addr && typeof addr === 'object') {
                         return {
                             _id: (addr._id && typeof addr._id === 'object' && addr._id.$oid) ? addr._id.$oid : null,
                             address: (typeof addr.address === 'string' && addr.address.length > 0) ? addr.address : null,
                             street: addr.street,
                             city: addr.city,
                             state: addr.state,
                             zip: addr.zip,
                             country: addr.country,
                             isDefault: addr.isDefault,
                         };
                     } else {
                         return null;
                     }
               }).filter(addr => addr !== null && addr.address !== null) : [],
               createdAt: (adminUserJson.createdAt && typeof adminUserJson.createdAt === 'object' && adminUserJson.createdAt.$date) ? new Date(adminUserJson.createdAt.$date) : new Date(),
               updatedAt: (adminUserJson.updatedAt && typeof adminUserJson.updatedAt === 'object' && adminUserJson.updatedAt.$date) ? new Date(adminUserJson.updatedAt.$date) : new Date(),
               __v: adminUserJson.__v
          });
          await adminDoc.save(); // Save admin user individually to trigger middleware and validation
          console.log('Admin user imported successfully!');
      } catch (error) {
          console.error('Error importing admin user:', adminUserJson, 'Error:', error.message);
      }
    } else {
       console.log('Admin user JSON not found, skipping admin import.');
    }

    // Insert other processed users
    if (finalTransformedUsers.length > 0) {
       await User.insertMany(finalTransformedUsers);
       console.log('Other users imported successfully!');
    } else {
       console.log('No other valid users to import.');
    }

    console.log('Data import process finished.');
  } catch (error) {
    console.error('Error during data import:', error);
  } finally {
    mongoose.connection.close(); // Close DB connection
    console.log('MongoDB connection closed.');
  }
})(); 