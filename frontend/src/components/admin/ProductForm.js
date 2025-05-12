// src/components/admin/ProductForm.js
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from "@mui/material";

export default function ProductForm({ open, onClose, onSave, initialData, categories }) {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    quantity: 0,
    price: 0,
    barcode: "",
    photo: "",
    state: "ACTIVE"
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setPreview(initialData.photo || "");
    } else {
      setForm({
        name: "",
        brand: "",
        description: "",
        category: "",
        quantity: 0,
        price: 0,
        barcode: "",
        photo: "",
        state: "ACTIVE"
      });
      setPreview("");
    }
    setSelectedFile(null);
  }, [initialData, open]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = () => {
    onSave(form, selectedFile);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? "Edit Product" : "Add Product"}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          {preview && <img src={preview} alt="preview" style={{ width: 80, height: 80, marginBottom: 8 }} />}
          <Button variant="outlined" component="label">
            Chọn ảnh
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>
        </Box>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="dense" />
        <TextField label="Brand" name="brand" value={form.brand} onChange={handleChange} fullWidth margin="dense" />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="dense" />
        <TextField select label="Category" name="category" value={form.category} onChange={handleChange} fullWidth margin="dense">
          {categories.map(cat => <MenuItem key={cat._id} value={cat.description}>{cat.description}</MenuItem>)}
        </TextField>
        <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} fullWidth margin="dense" />
        <TextField label="Price" name="price" type="number" value={form.price} onChange={handleChange} fullWidth margin="dense" />
        <TextField label="Barcode" name="barcode" value={form.barcode} onChange={handleChange} fullWidth margin="dense" />
        <TextField select label="State" name="state" value={form.state} onChange={handleChange} fullWidth margin="dense">
          <MenuItem value="ACTIVE">ACTIVE</MenuItem>
          <MenuItem value="INACTIVE">INACTIVE</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? "Update" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
}