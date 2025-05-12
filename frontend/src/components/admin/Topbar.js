import React from "react";
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton, Tooltip } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        left: 220, // Sidebar width
        width: "calc(100% - 220px)",
        borderBottom: 1,
        borderColor: "divider",
        background: "#fff",
        zIndex: 1201 // above sidebar
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ mr: 1 }}>{user?.fullname || "Admin"}</Typography>
          <Avatar sx={{ width: 32, height: 32, mr: 2 }} src={user?.profileImage} />
          <Tooltip title="Logout">
            <IconButton color="error" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 