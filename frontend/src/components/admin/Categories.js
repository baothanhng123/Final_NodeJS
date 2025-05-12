import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import CategoryForm from "./CategoryForm";

export default function Categories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories", { headers: { Authorization: `Bearer ${token}` } });
      setCategories(res.data);
    } catch (err) {
      // eslint-disable-next-line
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await axios.delete(`/api/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const handleAdd = () => { setEditData(null); setOpenForm(true); };
  const handleEdit = (category) => { setEditData(category); setOpenForm(true); };

  const handleSave = async (data) => {
    try {
      if (editData) {
        await axios.put(`/api/categories/${editData._id}`, data, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("/api/categories", data, { headers: { Authorization: `Bearer ${token}` } });
      }
      setOpenForm(false);
      fetchCategories();
    } catch (err) {
      alert("Lưu thất bại!");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Categories</Typography>
      <Paper sx={{ p: 2 }}>
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleAdd}>Add Category</Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow> :
                categories.map(category => (
                  <TableRow key={category._id}>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{category.state}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(category._id)}><DeleteIcon /></IconButton>
                      <IconButton color="primary" onClick={() => handleEdit(category)}><EditIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <CategoryForm open={openForm} onClose={() => setOpenForm(false)} onSave={handleSave} initialData={editData} />
    </Box>
  );
} 