import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Box, Container } from '@mui/material';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import AddressManagement from './pages/AddressManagement';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import Navbar from './components/Navbar';
import CategorySidebar from './components/CategorySidebar';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

// Create a wrapper component to handle the sidebar visibility
const AppContent = () => {
  const location = useLocation();
  const hideOnPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const shouldShowSidebar = !hideOnPaths.includes(location.pathname);

  return (
    <div className="app">
      <Navbar />
      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: 3, 
          display: 'flex',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {shouldShowSidebar && (
          <Box
            component="aside"
            sx={{
              display: { xs: 'none', md: 'block' }
            }}
          >
            <CategorySidebar />
          </Box>
        )}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: 2
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />
            <Route
              path="/account/addresses"
              element={
                <PrivateRoute>
                  <AddressManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/account/changePassword"
              element={
                <PrivateRoute>
                  <ChangePassword />
                </PrivateRoute>
              }
            />
            
            {/* Category routes */}
            <Route path="/pc-gaming" element={<div>PC Gaming Page</div>} />
            <Route path="/pc-workstation" element={<div>PC Workstation Page</div>} />
            <Route path="/pc-build" element={<div>PC Build Page</div>} />
            <Route path="/pc-office" element={<div>PC Office Page</div>} />
            <Route path="/pc-amd" element={<div>PC AMD Gaming Page</div>} />
            <Route path="/pc-core-ultra" element={<div>PC Core Ultra Page</div>} />
            <Route path="/pc-mini" element={<div>PC Mini Page</div>} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Container>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
