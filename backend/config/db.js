const mongoose = require('mongoose');

const connectDB = async (mongoURL) => {
  try {
    await mongoose.connect(mongoURL);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 