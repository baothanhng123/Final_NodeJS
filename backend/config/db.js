const mongoose = require('mongoose');

const connectDB = async (mongoURL) => {
  try {
    const options = {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4  // Force IPv4
    };

    await mongoose.connect(mongoURL, options);
    console.log('MongoDB Connected Successfully');

    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    // Don't exit process, let it retry
    throw error;
  }
};

module.exports = connectDB;