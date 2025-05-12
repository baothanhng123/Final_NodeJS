const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const config = require('../config/main');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Validation middleware
const validateRegistration = [
  body('email').isEmail().withMessage('Vui lòng nhập email hợp lệ'),
  body('fullname').notEmpty().withMessage('Vui lòng nhập họ tên'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('shippingAddress').notEmpty().withMessage('Vui lòng nhập địa chỉ giao hàng')
];

// Register route
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, fullname, password, shippingAddress } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Create new user with initial address in addresses array
    user = new User({
      email,
      fullname,
      password,
      addresses: [{
        address: shippingAddress,
        isDefault: true // First address is default
      }],
      authType: 'local'
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Vui lòng nhập email hợp lệ'),
  body('password').exists().withMessage('Vui lòng nhập mật khẩu')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Check auth type first
    if (user.authType !== 'local') {
      return res.status(400).json({ 
        message: `Tài khoản này sử dụng đăng nhập qua ${user.authType}. Vui lòng đăng nhập bằng ${user.authType}.`
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Create token
    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });

    // Send response with user data
    res.json({
      token,
      user: {
        id: user.id,
        name: user.fullname,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        addresses: user.addresses,
        authType: user.authType
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Forgot password route
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Vui lòng nhập email hợp lệ')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này' });
    }

    // Check if user is using social login
    if (user.authType !== 'local') {
      return res.status(400).json({ 
        message: `Tài khoản này sử dụng đăng nhập qua ${user.authType}. Không thể đặt lại mật khẩu.`
      });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create transporter with config
    const transporter = nodemailer.createTransport(config.emailService);

    const mailOptions = {
      to: user.email,
      from: config.emailService.auth.user,
      subject: 'Đặt lại mật khẩu',
      text: `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.\n\n
        Vui lòng nhấp vào liên kết sau, hoặc dán vào trình duyệt để hoàn tất quá trình:\n\n
        ${config.clientURL}/reset-password/${token}\n\n
        Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.\n`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email đặt lại mật khẩu đã được gửi' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi gửi email đặt lại mật khẩu' });
  }
});

// Reset password route
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Create JWT token
      const payload = {
        user: {
          id: req.user.id
        }
      };

      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });

      // Redirect to frontend with token
      res.redirect(`${config.clientURL}?token=${token}`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${config.clientURL}/login?error=auth_failed`);
    }
  }
);

// Facebook auth routes
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.userId = req.user._id;
    req.session.loggedIn = true;
    res.redirect(config.clientURL);
  }
);

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Update password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Check if user is using social login
    if (user.authType === 'google' || user.authType === 'facebook') {
      return res.status(400).json({ 
        message: 'Tài khoản đăng nhập bằng Google/Facebook không thể đổi mật khẩu' 
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Cập nhật mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

module.exports = router; 