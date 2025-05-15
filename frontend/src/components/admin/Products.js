import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // New state for search, filter and sort
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchProducts = async (pageNum = 1) => {
    setLoading(true);
    try {
      let url = `/api/products?page=${pageNum}`;
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      if (selectedBrand !== "all") {
        url += `&brand=${selectedBrand}`;
      }
      if (selectedCategory !== "all") {
        url += `&category=${selectedCategory}`;
      }
      url += `&sort=${sortField}&order=${sortOrder}`;

      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(Array.isArray(res.data.products) ? res.data.products : []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || 1);
    } catch (err) {
      setProducts([]);
      setTotalPages(1);
      setPage(1);
      console.log(err);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await axios.get("/api/categories", { headers: { Authorization: `Bearer ${token}` } });
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts(page);
    fetchCategories();
  }, [token, page, searchTerm, selectedBrand, selectedCategory, sortField, sortOrder]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts(page);
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
      fetchProducts(page);
    } catch (err) {
      alert("Lưu thất bại!");
    }
  };

  // Get unique brands from products
  const brands = ["all", ...new Set(products.map(p => p.brand).filter(Boolean))];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Products</Typography>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            label="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Brand</InputLabel>
            <Select
              value={selectedBrand}
              label="Brand"
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <MenuItem value="all">All Brands</MenuItem>
              {brands.map(brand => brand && (
                <MenuItem key={brand} value={brand}>{brand}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat._id} value={cat.description}>{cat.description}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortField}
              label="Sort By"
              onChange={(e) => setSortField(e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="brand">Brand</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="quantity">Quantity</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              label="Order"
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleAdd}>Add Product</Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Barcode</TableCell>
                <TableCell>Name</TableCell>
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
                (Array.isArray(products) && products.length > 0 ? products.map(product => (
                  <TableRow key={product._id}>
                    <TableCell><img src={product.photo || "https://via.placeholder.com/40"} alt="product" width={40} height={40} /></TableCell>
                    <TableCell>{product.barcode}</TableCell>
                    <TableCell>{product.name}</TableCell>
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
                )) : <TableRow><TableCell colSpan={9}>Không có sản phẩm</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            disabled={page === 1}
            onClick={() => fetchProducts(page - 1)}
          >Trang trước</Button>
          <Typography variant="body1" mx={2}>Trang {page} / {totalPages}</Typography>
          <Button
            disabled={page === totalPages}
            onClick={() => fetchProducts(page + 1)}
          >Trang sau</Button>
        </Box>
      </Paper>
      <ProductForm open={openForm} onClose={() => setOpenForm(false)} onSave={handleSave} initialData={editData} categories={categories} />
    </Box>
  );
}