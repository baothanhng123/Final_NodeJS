import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ChangePassword = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Check if user is using social login
  if (user?.authType === 'google' || user?.authType === 'facebook') {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Đổi mật khẩu
          </Typography>
          <Alert severity="info">
            Tài khoản đăng nhập bằng {user.authType === 'google' ? 'Google' : 'Facebook'} không thể đổi mật khẩu.
            Vui lòng sử dụng tính năng quản lý mật khẩu của {user.authType === 'google' ? 'Google' : 'Facebook'}.
          </Alert>
        </Paper>
      </Container>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/auth/password', 
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage({ type: 'success', text: response.data.message });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Đổi mật khẩu
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
          <TextField
            fullWidth
            label="Mật khẩu hiện tại"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Mật khẩu mới"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Đổi mật khẩu'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChangePassword; 