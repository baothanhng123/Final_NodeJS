import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import UserForm from "./UserForm";

export default function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/user", { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) {
      // eslint-disable-next-line
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    try {
      await axios.delete(`/api/user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const handleAdd = () => { setEditData(null); setOpenForm(true); };
  const handleEdit = (user) => { setEditData(user); setOpenForm(true); };

  const handleSave = async (data, selectedFile) => {
    try {
      let profileImageUrl = data.profileImage;
      let userId = editData?._id;
      // Nếu là thêm mới user
      if (!userId) {
        const res = await axios.post("/api/user", data, { headers: { Authorization: `Bearer ${token}` } });
        userId = res.data._id;
        profileImageUrl = res.data.profileImage;
      } else {
        await axios.put(`/api/user/${userId}`, data, { headers: { Authorization: `Bearer ${token}` } });
      }
      // Nếu có file ảnh thì upload
      if (selectedFile) {
        const formData = new FormData();
        formData.append('profileImage', selectedFile);
        await axios.post(`/api/user/${userId}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setOpenForm(false);
      fetchUsers();
    } catch (err) {
      alert("Lưu thất bại!");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Users</Typography>
      <Paper sx={{ p: 2 }}>
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleAdd}>Add User</Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow> :
                users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell><img src={user.profileImage || "https://via.placeholder.com/40"} alt="avatar" width={40} height={40} /></TableCell>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>ACTIVE</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(user._id)}><DeleteIcon /></IconButton>
                      <IconButton color="primary" onClick={() => handleEdit(user)}><EditIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <UserForm open={openForm} onClose={() => setOpenForm(false)} onSave={handleSave} initialData={editData} />
    </Box>
  );
} 