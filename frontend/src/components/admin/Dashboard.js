import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  CircularProgress
} from '@mui/material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const timeframeOptions = [
  { value: 'year', label: 'Năm' },
  { value: 'quarter', label: 'Quý' },
  { value: 'month', label: 'Tháng' },
  { value: 'week', label: 'Tuần' },
  { value: 'custom', label: 'Tùy chỉnh' }
];

export default function Dashboard() {
  const { token } = useAuth();
  const [timeframe, setTimeframe] = useState('year');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [timeframe, startDate, endDate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      let url = `/api/dashboard/stats?timeframe=${timeframe}`;
      if (timeframe === 'custom' && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
    if (event.target.value !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <Typography variant="h5">Dashboard</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select value={timeframe} onChange={handleTimeframeChange}>
            {timeframeOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {timeframe === 'custom' && (
          <>
            <TextField
              size="small"
              type="date"
              label="Từ ngày"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              size="small"
              type="date"
              label="Đến ngày"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </>
        )}
      </Box>

      {stats && (
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Tổng đơn hàng</Typography>
              <Typography variant="h4">{stats.summary.totalOrders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Doanh thu</Typography>
              <Typography variant="h4">{stats.summary.totalRevenue.toLocaleString()}$</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Giá trị trung bình/đơn</Typography>
              <Typography variant="h4">{Math.round(stats.summary.avgOrderValue).toLocaleString()}$</Typography>
            </Paper>
          </Grid>

          {/* Revenue Over Time Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Doanh thu theo thời gian</Typography>
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <LineChart width={800} height={300} data={stats.timeStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="_id" 
                    tickFormatter={(date) => {
                      const d = new Date(date.year, date.month - 1, date.day);
                      return d.toLocaleDateString();
                    }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu" />
                  <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Số đơn hàng" />
                </LineChart>
              </Box>
            </Paper>
          </Grid>

          {/* Top Products Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Top sản phẩm bán chạy</Typography>
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <BarChart width={500} height={300} data={stats.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#8884d8" name="Số lượng" />
                  <Bar dataKey="revenue" fill="#82ca9d" name="Doanh thu" />
                </BarChart>
              </Box>
            </Paper>
          </Grid>

          {/* Category Distribution Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Phân bố theo danh mục</Typography>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <PieChart width={500} height={300}>
                  <Pie
                    data={stats.categoryStats}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.categoryStats.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}