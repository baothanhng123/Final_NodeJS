import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Box, Container } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import AddressManagement from './pages/AddressManagement';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import Navbar from './components/Navbar/Navbar';
import Shop from './pages/Shop';
import ShopCategory from './pages/ShopCategory';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import Users from "./components/admin/Users";
import Products from "./components/admin/Products";
import Categories from "./components/admin/Categories";
import Orders from "./components/admin/Orders";
import OrderDetails from "./components/admin/OrderDetails";
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import './App.css';

// Create a wrapper component to handle the sidebar visibility
const AppContent = () => {
  const location = useLocation();
  const hideOnPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAdminPage = location.pathname.startsWith('/admin');
  const shouldShowSidebar = !hideOnPaths.includes(location.pathname) && !isAdminPage;

  return (
    <div className="app">
      {!isAdminPage && <Navbar />}
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
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path='/' element={<Shop />} />
            <Route path='/monitor' element={<ShopCategory category="monitor" />} />
            <Route path='/cpu' element={<ShopCategory category="cpu" />} />
            <Route path='/computer' element={<ShopCategory category="computer" />} />
            <Route path='/main' element={<ShopCategory category="main" />} />
            <Route path='/accessories' element={<ShopCategory category="accessories" />} />
            <Route path='/case' element={<ShopCategory category="case" />} />
            <Route path='/power' element={<ShopCategory category="power" />} />
            <Route path='/hardrive' element={<ShopCategory category="hardrive" />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path='/cart' element={<Cart />} />
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
            
            {/* Admin routes */}
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="products" element={<Products />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/:id" element={<OrderDetails />} />
                  </Routes>
                </AdminLayout>
              </AdminRoute>
            } />
            
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
