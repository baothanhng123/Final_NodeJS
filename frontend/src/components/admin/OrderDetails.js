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

  if (!order) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate(-1)}>Back</Button>
      <Typography variant="h5" gutterBottom>Order Details</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography><b>Order ID:</b> {order._id}</Typography>
        <Typography><b>User:</b> {order.user?.fullname || order.user?.email}</Typography>
        <Typography><b>Total:</b> {order.total}</Typography>
        <Typography><b>Status:</b> {order.status}</Typography>
        <Typography><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</Typography>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Products</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.products.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.product?.name || "Unknown"}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.price * item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
} 