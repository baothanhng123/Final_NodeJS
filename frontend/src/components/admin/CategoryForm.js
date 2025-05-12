import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";

export default function CategoryForm({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    description: "",
    state: "ACTIVE"
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ description: "", state: "ACTIVE" });
  }, [initialData]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? "Edit Category" : "Add Category"}</DialogTitle>
      <DialogContent>
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="dense" />
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