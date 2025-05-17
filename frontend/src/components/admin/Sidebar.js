import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, People, Inventory, Category, ShoppingCart } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { label: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
  { label: "Users", icon: <People />, path: "/admin/users" },
  { label: "Products", icon: <Inventory />, path: "/admin/products" },
  { label: "Categories", icon: <Category />, path: "/admin/categories" },
  { label: "Orders", icon: <ShoppingCart />, path: "/admin/orders" },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <Drawer variant="permanent" sx={{ width: 220, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box', background: "#233044", color: "#fff" } }}>
      <List>
        <ListItem>
          <ListItemText primary="Computer Store" primaryTypographyProps={{ fontWeight: "bold" }} />
        </ListItem>
        {menu.map((item) => (
          <ListItem
            button
            key={item.label}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{ color: "#fff" }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
} 