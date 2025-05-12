import React, { useState } from "react"
import './Navbar.css'
import cart_icon from '../Assets/cart_icon.png'
import { Link , useNavigate} from "react-router-dom"
import { useAuth } from '../../context/AuthContext';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Box,
  styled,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle,
  Person as PersonIcon
} from '@mui/icons-material';
const LogoImage = styled('img')({
  height: 40,
  marginRight: 16,
});
const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    //   const [searchQuery, setSearchQuery] = useState('');

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
        navigate('/login');
    };
    const menuId = 'primary-search-account-menu';
    const isMenuOpen = Boolean(anchorEl);

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/account'); }}>
                Thông tin tài khoản
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/account/addresses'); }}>
                Quản lý địa chỉ
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/account/changePassword'); }}>
                Đổi mật khẩu
            </MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
    );
    return (
        <Box sx={{ flexGrow: 1 }}>
              <AppBar position="fixed">
                <Toolbar>
                <div className="navbar">
                  <Link to="/">
                        <div className="nav-logo">
                            <p>Electronics</p>
                        </div>
                  </Link>
                    <ul className="nav-menu">
                          <li onClick={() => { setMenu("shop") }}><Link to='/'>Shop</Link>{menu === "shop" ? <h /> : <></>}</li>
                                 <li onClick={() => { setMenu("monitor") }}><Link to='/monitor'>Monitor</Link>{menu === "monitor" ? <h /> : <></>}</li>
                                 <li onClick={() => { setMenu("cpu") }}><Link to='/cpu'>CPU</Link>{menu === "cpu" ? <h /> : <></>}</li>
                                 <li onClick={() => { setMenu("computer") }}><Link to='/computer'>Computer</Link>{menu === "computer" ? <h /> : <></>}</li>
                                 <li onClick={() => { setMenu("accessories") }}><Link to='/accessories'>Accessories</Link>{menu === "accessories" ? <h /> : <></>}</li>
                                 <li onClick={() => { setMenu("main") }}><Link to='/main'>Mainboard</Link>{menu === "main" ? <h /> : <></>}</li>
                                 <li onClick={() => { setMenu("case") }}><Link to='/case'>Case</Link>{menu === "case" ? <h /> : <></>}</li>
                                 <li onClick={() => { setMenu("power") }}><Link to='/power'>Power</Link>{menu === "power" ? <h /> : <></>}</li>
                                 <li onClick={() => { setMenu("hardrive") }}><Link to='/hardrive'>Hardrive</Link>{menu === "hardrive" ? <h /> : <></>}</li>       
                        </ul>
                  
                    <div className="nav-login-cart">
                    
                    <Link to='/cart'><img src={cart_icon} alt="" /></Link>
        
                    {user ? (
                      <>

                        <Typography
                          variant="body1"
                          sx={{
                            display: { xs: 'none', sm: 'block' },
                            marginLeft: 2,
                            marginRight: 1
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
                  
                    </div>
                  
                  </div>
                </Toolbar>
                
              </AppBar>
              <Toolbar /> {/* This is for spacing below fixed AppBar */}
              {renderMenu}
            </Box>
        // <div className="navbar">
        //     <div className="nav-logo">
        //         <p>Electronics</p>
        //     </div>
        //     <ul className="nav-menu">
        //         <li onClick={() => { setMenu("shop") }}><Link to='/'>Shop</Link>{menu === "shop" ? <h /> : <></>}</li>
        //         <li onClick={() => { setMenu("monitor") }}><Link to='/monitor'>Monitor</Link>{menu === "monitor" ? <h /> : <></>}</li>
        //         <li onClick={() => { setMenu("cpu") }}><Link to='/cpu'>CPU</Link>{menu === "cpu" ? <h /> : <></>}</li>
        //         <li onClick={() => { setMenu("computer") }}><Link to='/computer'>Computer</Link>{menu === "computer" ? <h /> : <></>}</li>
        //         <li onClick={() => { setMenu("accessories") }}><Link to='/accessories'>Accessories</Link>{menu === "accessories" ? <h /> : <></>}</li>
        //         <li onClick={() => { setMenu("main") }}><Link to='/main'>Mainboard</Link>{menu === "main" ? <h /> : <></>}</li>
        //         <li onClick={() => { setMenu("case") }}><Link to='/case'>Case</Link>{menu === "case" ? <h /> : <></>}</li>
        //         <li onClick={() => { setMenu("power") }}><Link to='/power'>Power</Link>{menu === "power" ? <h /> : <></>}</li>
        //         <li onClick={() => { setMenu("hardrive") }}><Link to='/hardrive'>Hardrive</Link>{menu === "hardrive" ? <h /> : <></>}</li>
        //     </ul>
        //     <div className="nav-login-cart">
        //         <Link to='/login'><button>Login</button></Link>
        //         <Link to='/cart'><img src={cart_icon} alt="" /></Link>
        //         <div className="nav-cart-count">0</div>
        //     </div>
        // </div>
    )
}

export default Navbar;