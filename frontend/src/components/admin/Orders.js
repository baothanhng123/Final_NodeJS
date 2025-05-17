import React, { useEffect, useState, useCallback } from "react";
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, MenuItem, Select, FormControl, InputLabel, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'yesterday', label: 'Hôm qua' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'range', label: 'Khoảng ngày' },
];

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const navigate = useNavigate();

  // Thêm useCallback để tối ưu hóa fetchOrders
  const fetchOrders = useCallback(async (pageNum = 1, filterVal = filter, startVal = start, endVal = end) => {
    setLoading(true);
    try {
      let url = `/api/orders?page=${pageNum}&limit=20`;
      if (filterVal && filterVal !== 'all') {
        url += `&filter=${filterVal}`;
        if (filterVal === 'range' && startVal && endVal) {
          url += `&start=${startVal}&end=${endVal}`;
        }
      }
      const res = await axios.get(url, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || 1);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
      setTotalPages(1);
      setPage(1);
    } finally {
      setLoading(false);
    }
  }, [token, filter, start, end]);

  useEffect(() => { fetchOrders(1, filter, start, end); }, [fetchOrders]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    try {
      await axios.delete(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchOrders(page, filter, start, end);
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    if (newFilter !== 'range') {
      setStart('');
      setEnd('');
    }
  };

  const handleStartChange = (e) => setStart(e.target.value);
  const handleEndChange = (e) => setEnd(e.target.value);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Orders</Typography>
      <Paper sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" mb={2} gap={2}>
          <FormControl size="small">
            <InputLabel>Lọc theo thời gian</InputLabel>
            <Select
              value={filter}
              label="Lọc theo thời gian"
              onChange={(e) => handleFilterChange(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              {FILTER_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {filter === 'range' && (
            <>
              <TextField
                size="small"
                type="date"
                label="Từ ngày"
                InputLabelProps={{ shrink: true }}
                value={start}
                onChange={handleStartChange}
              />
              <TextField
                size="small"
                type="date"
                label="Đến ngày"
                InputLabelProps={{ shrink: true }}
                value={end}
                onChange={handleEndChange}
              />
              <Button
                variant="contained"
                onClick={() => fetchOrders(1, filter, start, end)}
                disabled={!start || !end}
              >Lọc</Button>
            </>
          )}
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow> :
                (Array.isArray(orders) && orders.length > 0 ? orders.map(order => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.user ? order.user.fullname : 'N/A'}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => navigate(`/admin/orders/${order._id}`)}><VisibilityIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(order._id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={6}>Không có đơn hàng</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            disabled={page === 1}
            onClick={() => fetchOrders(page - 1, filter, start, end)}
          >Trang trước</Button>
          <Typography variant="body1" mx={2}>Trang {page} / {totalPages}</Typography>
          <Button
            disabled={page === totalPages}
            onClick={() => fetchOrders(page + 1, filter, start, end)}
          >Trang sau</Button>
        </Box>
      </Paper>
    </Box>
  );
}