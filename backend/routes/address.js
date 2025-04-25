const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get all addresses for the current user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.addresses || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new address
router.post('/', auth, async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ message: 'Vui lòng nhập địa chỉ' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.addresses) {
      user.addresses = [];
    }
    
    user.addresses.push(address);
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm địa chỉ' });
  }
});

// Update an address
router.put('/:index', auth, async (req, res) => {
  try {
    const { address } = req.body;
    const index = parseInt(req.params.index);

    if (!address) {
      return res.status(400).json({ message: 'Vui lòng nhập địa chỉ' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.addresses || index < 0 || index >= user.addresses.length) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }

    user.addresses[index] = address;
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật địa chỉ' });
  }
});

// Delete an address
router.delete('/:index', auth, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.addresses || index < 0 || index >= user.addresses.length) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }

    user.addresses.splice(index, 1);
    await user.save();

    res.json({ message: 'Đã xóa địa chỉ', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa địa chỉ' });
  }
});

module.exports = router; 