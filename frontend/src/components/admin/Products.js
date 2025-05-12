import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ProductForm from "./ProductForm";

export default function Products() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products", { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);
    } catch (err) {
      // eslint-disable-next-line
      console.log(err);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await axios.get("/api/categories", { headers: { Authorization: `Bearer ${token}` } });
    setCategories(res.data);
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const handleAdd = () => { setEditData(null); setOpenForm(true); };
  const handleEdit = (product) => { setEditData(product); setOpenForm(true); };

  const handleSave = async (data, selectedFile) => {
    try {
      let photoUrl = data.photo;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const res = await axios.post('/api/products/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        photoUrl = res.data.imageUrl;
      }
      const productData = { ...data, photo: photoUrl };
      if (editData) {
        await axios.put(`/api/products/${editData._id}`, productData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("/api/products", productData, { headers: { Authorization: `Bearer ${token}` } });
      }
      setOpenForm(false);
      fetchProducts();
    } catch (err) {
      alert("Lưu thất bại!");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Products</Typography>
      <Paper sx={{ p: 2 }}>
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleAdd}>Add Product</Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Barcode</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={9}>Loading...</TableCell></TableRow> :
                products.map(product => (
                  <TableRow key={product._id}>
                    <TableCell><img src={product.photo || "https://via.placeholder.com/40"} alt="product" width={40} height={40} /></TableCell>
                    <TableCell>{product.barcode}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.state}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(product._id)}><DeleteIcon /></IconButton>
                      <IconButton color="primary" onClick={() => handleEdit(product)}><EditIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <ProductForm open={openForm} onClose={() => setOpenForm(false)} onSave={handleSave} initialData={editData} categories={categories} />
    </Box>
  );
} 