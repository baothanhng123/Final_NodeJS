import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPendingRedirect(false);
    const res = await login(formData.email, formData.password);
    if (res.success) {
      const loggedInUser = res.user || user;
      if (loggedInUser && loggedInUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (loggedInUser && loggedInUser.role) {
        navigate(location.state?.from || "/");
      } else {
        // Nếu chưa có user ngay lập tức, đợi context cập nhật
        setPendingRedirect(true);
      }
    } else {
      setError(res.message);
    }
  };

  // Theo dõi user context để redirect nếu cần
  useEffect(() => {
    if (pendingRedirect && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(location.state?.from || "/");
      }
      setPendingRedirect(false);
    }
    // eslint-disable-next-line
  }, [pendingRedirect, user]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  // const handleFacebookLogin = () => {
  //   window.location.href = 'http://localhost:5000/api/auth/facebook';
  // };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Đăng nhập
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Địa chỉ email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng nhập
            </Button>
          </form>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
              <Typography color="primary" align="center">
                Quên mật khẩu?
              </Typography>
            </Link>
          </Box>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ mb: 1 }}
          >
            Đăng nhập với Google
          </Button>

          {/* <Button
            fullWidth
            variant="outlined"
            startIcon={<FacebookIcon />}
            onClick={handleFacebookLogin}
            sx={{ mb: 2 }}
          >
            Sign in with Facebook
          </Button> */}

          <Box sx={{ mt: 2 }}>
            <Typography align="center">
              Không có tài khoản?{' '}
              <Link to="/register" style={{ textDecoration: 'none' }}>
                Đăng ký
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 