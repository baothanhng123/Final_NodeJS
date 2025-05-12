import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const { user, updateProfile, uploadProfileImage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    defaultAddress: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (user) {
      const defaultAddress = user.addresses?.find(addr => addr.isDefault)?.address || '';
      setFormData({
        fullname: user.fullname || '',
        phone: user.phone || '',
        defaultAddress: defaultAddress
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Update user info
      const updateResult = await updateProfile({
        fullname: formData.fullname,
        phone: formData.phone
      });

      if (!updateResult.success) {
        throw new Error(updateResult.message);
      }

      // Update profile image if selected
      if (selectedImage) {
        const imageResult = await uploadProfileImage(selectedImage);
        if (!imageResult.success) {
          throw new Error(imageResult.message);
        }
      }

      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công' });
      setSelectedImage(null);
    } catch (error) {
      console.error('Error updating account:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Có lỗi xảy ra khi cập nhật thông tin'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Thông tin tài khoản
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user?.profileImage}
              alt={user?.fullname}
              sx={{ width: 100, height: 100 }}
            />
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="icon-button-file">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
              </label>
              {selectedImage && (
                <Typography variant="body2" color="textSecondary">
                  Đã chọn: {selectedImage.name}
                </Typography>
              )}
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Họ và tên"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={user?.email || ''}
            disabled
            sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000000' } }}
          />

          <TextField
            fullWidth
            label="Địa chỉ mặc định"
            name="defaultAddress"
            value={formData.defaultAddress}
            disabled
            sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000000' } }}
          />

          <TextField
            fullWidth
            label="Số điện thoại"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Cập nhật thông tin'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Account; 