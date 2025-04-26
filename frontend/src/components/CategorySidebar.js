import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Paper,
  Collapse,
  
} from '@mui/material';
import {
  Computer,
  BusinessCenter,
  Build,
  Work,
  Memory,
  Speed,
  Laptop,
  Menu as MenuIcon,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

const categories = [
  { name: 'PC Gaming- Máy tính chơi game', icon: <Computer />, path: '/pc-gaming' },
  { name: 'PC Workstation', icon: <BusinessCenter />, path: '/pc-workstation' },
  { name: 'Tự Build Cấu Hình PC', icon: <Build />, path: '/pc-build' },
  { name: 'PC VĂN PHÒNG', icon: <Work />, path: '/pc-office' },
  { name: 'PC AMD GAMING', icon: <Memory />, path: '/pc-amd' },
  { name: 'PC Core Ultra', icon: <Speed />, path: '/pc-core-ultra' },
  { name: 'PC MINI', icon: <Laptop />, path: '/pc-mini' },
];

const CategorySidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Paper 
      elevation={2}
      sx={{
        width: 280,
        position: 'sticky',
        top: 80,
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
        backgroundColor: '#fff',
        borderRadius: 1,
        mr: 3
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: '#1976d2', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
        onClick={toggleDrawer}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MenuIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            Danh mục sản phẩm
          </Typography>
        </Box>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List>
          {categories.map((category, index) => (
            <ListItem
              key={index}
              component={Link}
              to={category.path}
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  '& .MuiListItemIcon-root': {
                    color: '#1976d2'
                  },
                  '& .MuiListItemText-primary': {
                    color: '#1976d2'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {category.icon}
              </ListItemIcon>
              <ListItemText 
                primary={category.name}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};

export default CategorySidebar; 