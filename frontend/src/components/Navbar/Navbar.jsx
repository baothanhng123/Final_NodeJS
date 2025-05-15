import React, { useState } from "react";
import "./Navbar.css";
import cart_icon from "../Assets/cart_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  AccountCircle,
  Person as PersonIcon,
} from "@mui/icons-material";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate("/login");
  };

  const menuId = "primary-search-account-menu";
  const isMenuOpen = Boolean(anchorEl);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate("/account"); }}>
        Thông tin tài khoản
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate("/account/addresses"); }}>
        Quản lý địa chỉ
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate("/account/changePassword"); }}>
        Đổi mật khẩu
      </MenuItem>
      <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
    </Menu>
  );

  const navItems = [
    { label: "Shop", path: "/", key: "shop" },
    { label: "Monitor", path: "/monitor", key: "monitor" },
    { label: "CPU", path: "/cpu", key: "cpu" },
    { label: "Computer", path: "/computer", key: "computer" },
    { label: "Accessories", path: "/accessories", key: "accessories" },
    { label: "Mainboard", path: "/main", key: "main" },
    { label: "Case", path: "/case", key: "case" },
    { label: "Power", path: "/power", key: "power" },
    { label: "Hardrive", path: "/hardrive", key: "hardrive" },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <div className="navbar">
            <Link to="/" className="nav-logo">
              <p>Electronics</p>
            </Link>

            <ul className="nav-menu">
              {navItems.map((item) => (
                <li
                  key={item.key}
                  className={menu === item.key ? "active" : ""}
                  onClick={() => setMenu(item.key)}
                >
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>

            <div className="nav-login-cart">
              {user ? (
                <>
                  <Typography
                    variant="body1"
                    sx={{
                      display: { xs: "none", sm: "block" },
                      ml: 2,
                      mr: 1,
                    }}
                  >
                    {user.fullname}
                  </Typography>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                </>
              ) : (
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  component={Link}
                  to="/login"
                >
                  <PersonIcon />
                </IconButton>
              )}
              <Link to="/cart">
                <img src={cart_icon} alt="Cart" />
              </Link>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* spacing below AppBar */}
      {renderMenu}
    </Box>
  );
};

export default Navbar;
