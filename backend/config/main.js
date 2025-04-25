require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/user_management',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  facebookAppID: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  emailService: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },
  clientURL: process.env.CLIENT_URL || 'http://localhost:3000'
}; 