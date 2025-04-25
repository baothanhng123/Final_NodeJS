// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const { fullname, phone, addresses } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (phone) updateData.phone = phone;
    if (addresses) updateData.addresses = addresses;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -googleId -facebookId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
}; 