require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const config = require('./config/main');
const addressRoutes = require('./routes/address');
const fs = require('fs');
const User = require('./models/User');


// Initialize Express app
const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB(config.mongoURL);

// Tạo tài khoản admin mặc định nếu chưa có
(async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = '123456';
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        email: adminEmail,
        fullname: 'Admin',
        password: adminPassword,
        role: 'admin',
        authType: 'local',
        addresses: [],
      });
      console.log('Admin account created: admin@gmail.com / 123456');
    } else {
      console.log('Admin account already exists');
    }
  } catch (err) {
    console.error('Error creating admin account:', err);
  }
})();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: config.clientURL,
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
//app.use('/api/', limiter);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
const profileDir = path.join(uploadsDir, 'profile');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir);
}

// Serve static files in uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/addresses', addressRoutes);
app.use('/api/products', require('./routes/product'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});