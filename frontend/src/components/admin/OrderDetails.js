import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setOrder(res.data);
      } catch (err) {
        // eslint-disable-next-line
        console.log(err);
      }
    };
    fetchOrder();
  }, [id, token]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await axios.put(
        `/api/orders/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setOrder(res.data);
    } catch (err) {
      alert('Cập nhật trạng thái thất bại!');
    }
  };

  if (!order) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate(-1)}>Back</Button>
      <Typography variant="h5" gutterBottom>Order Details</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography><b>Order ID:</b> {order._id}</Typography>
        <Typography><b>User:</b> {order.user?.fullname || order.user?.email}</Typography>
        <Typography><b>Total:</b> {order.total}</Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography><b>Status:</b></Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button 
              variant={order.status === 'PENDING' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => handleStatusChange('PENDING')}
            >
              Pending
            </Button>
            <Button 
              variant={order.status === 'COMPLETED' ? 'contained' : 'outlined'}
              color="success"
              onClick={() => handleStatusChange('COMPLETED')}
            >
              Completed
            </Button>
            <Button 
              variant={order.status === 'CANCELLED' ? 'contained' : 'outlined'}
              color="error"
              onClick={() => handleStatusChange('CANCELLED')}
            >
              Cancelled
            </Button>
          </Box>
        </Box>
        <Typography><b>Created At:</b> {new Date(order.createdAt).toLocaleString()}</Typography>
        
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Products</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.products.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.quantity * item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}