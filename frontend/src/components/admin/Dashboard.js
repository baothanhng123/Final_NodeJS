import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, products: 0, categories: 0 });
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
          axios.get("/api/user", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/orders", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/products", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/categories", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStats({
          users: usersRes.data.length,
          orders: ordersRes.data.length,
          revenue: ordersRes.data.reduce((sum, o) => sum + (o.total || 0), 0),
          products: productsRes.data.length,
          categories: categoriesRes.data.length,
        });
        // Top selling products
        const productSales = {};
        ordersRes.data.forEach(order => {
          order.products.forEach(p => {
            const name = p.product?.name || "Unknown";
            productSales[name] = (productSales[name] || 0) + p.quantity;
          });
        });
        setTopProducts(Object.entries(productSales).map(([name, value], i) => ({ name, value, color: ["#3f51b5", "#26c6da", "#66bb6a", "#ffa726"][i % 4] })));
        // Sales by date
        const salesByDate = {};
        ordersRes.data.forEach(order => {
          const date = new Date(order.createdAt).toLocaleDateString();
          salesByDate[date] = (salesByDate[date] || 0) + 1;
        });
        setSalesData(Object.entries(salesByDate).map(([date, sales]) => ({ date, sales })));
      } catch (err) {
        // eslint-disable-next-line
        console.log(err);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Dashboard</Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="primary" fontWeight="bold">TOTAL USERS</Typography>
            <Typography variant="h5">{stats.users}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="primary" fontWeight="bold">TOTAL ORDERS</Typography>
            <Typography variant="h5">{stats.orders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="success.main" fontWeight="bold">TOTAL REVENUE</Typography>
            <Typography variant="h5">{stats.revenue.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="primary" fontWeight="bold">TOTAL PRODUCTS</Typography>
            <Typography variant="h5">{stats.products}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="warning.main" fontWeight="bold">TOTAL CATEGORIES</Typography>
            <Typography variant="h5">{stats.categories}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography>Sales by Date</Typography>
            <BarChart width={400} height={200} data={salesData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Bar dataKey="sales" fill="#3f51b5" />
            </BarChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography>Top selling products</Typography>
            <PieChart width={200} height={200}>
              <Pie
                data={topProducts}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                label
              >
                {topProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 