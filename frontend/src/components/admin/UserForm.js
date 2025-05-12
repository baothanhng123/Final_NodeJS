import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Avatar, Box } from "@mui/material";

export default function UserForm({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    role: "user",
    password: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, password: "" });
      setPreview(initialData.profileImage || "");
    } else {
      setForm({ fullname: "", email: "", phone: "", role: "user", password: "" });
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
      <DialogTitle>{initialData ? "Edit User" : "Add User"}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar src={preview} sx={{ width: 80, height: 80, mb: 1 }} />
          <Button variant="outlined" component="label">
            Chọn ảnh
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>
        </Box>
        <TextField label="Full Name" name="fullname" value={form.fullname} onChange={handleChange} fullWidth margin="dense" />
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="dense" />
        <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth margin="dense" />
        <TextField select label="Role" name="role" value={form.role} onChange={handleChange} fullWidth margin="dense">
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        {!initialData && <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="dense" />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? "Update" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
} 