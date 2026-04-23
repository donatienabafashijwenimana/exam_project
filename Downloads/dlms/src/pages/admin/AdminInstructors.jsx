import React, { useState } from 'react';
import { Box, Card, Typography, Button, Avatar, Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { PersonAdd, Delete, Visibility, Badge, Build } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

export default function AdminInstructors() {
  const { instructors, addInstructor, deleteInstructor, updateInstructor } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', badge: '', photo: '' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name || !form.name.trim()) e.name = 'Required';
    else if (form.name.trim().length < 2) e.name = 'Min 2 characters';
    if (!form.email || !form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.badge || !form.badge.trim()) e.badge = 'Required';
    return e;
  }

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const instructorData = { ...form, avatar: form.name ? form.name[0] : '?' };
    if (editingId) {
      updateInstructor(editingId, instructorData);
    } else {
      addInstructor(instructorData);
    }
    setOpen(false);
    setErrors({});
    setForm({ name: '', email: '', badge: '', photo: '' });
    setEditingId(null);
  };

  const handleEdit = (instructor) => {
    setForm({ name: instructor.name, email: instructor.email, badge: instructor.badge, photo: instructor.photo });
    setEditingId(instructor.id);
    setOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const columns = [
    {
      field: 'name', headerName: 'Instructor', flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: '#0288d1' }} src={row.photo}>{row.avatar || (row.name ? row.name[0] : '?')}</Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
            <Typography variant="caption" color="text.secondary">{row.email}</Typography>
          </Box>
        </Box>
      )
    },
    { field: 'badge', headerName: 'ID / Badge', width: 180 },
    {
      field: 'workload', headerName: 'Workload', width: 130,
      renderCell: () => <Chip label="Active" color="success" size="small" variant="outlined" />
    },
    {
      field: 'actions', headerName: 'Actions', width: 140,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Edit Instructor">
            <IconButton size="small" color="primary" onClick={() => handleEdit(row)}>
              <Build fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Instructor">
            <IconButton size="small" color="error" onClick={() => deleteInstructor(row.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={800}>Manage Instructors</Typography>
        <Button variant="contained" startIcon={<PersonAdd />} onClick={() => {
          setForm({ name: '', email: '', badge: '', photo: '' });
          setEditingId(null);
          setOpen(true);
        }}>Add Instructor</Button>
      </Box>

      <Card>
        <DataGrid
          rows={instructors}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
        />
      </Card>

      <Dialog open={open} onClose={() => {
        setOpen(false);
        setErrors({});
        setForm({ name: '', email: '', badge: '', photo: '' });
        setEditingId(null);
      }} maxWidth="sm" fullWidth>
        {editingId ? <DialogTitle>Edit Instructor</DialogTitle> : <DialogTitle>Add New Instructor</DialogTitle>}
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Full Name" value={form.name} onChange={e => { setForm({...form, name: e.target.value}); setErrors(p => ({ ...p, name: '' })); }} error={!!errors.name} helperText={errors.name} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" value={form.email} onChange={e => { setForm({...form, email: e.target.value}); setErrors(p => ({ ...p, email: '' })); }} error={!!errors.email} helperText={errors.email} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Badge Number (e.g. #E042)" value={form.badge} onChange={e => { setForm({...form, badge: e.target.value}); setErrors(p => ({ ...p, badge: '' })); }} error={!!errors.badge} helperText={errors.badge} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Profile Photo
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
              {form.photo && (
                <Box mt={1} display="flex" justifyContent="center">
                  <img src={form.photo} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%' }} />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            setErrors({});
            setForm({ name: '', email: '', badge: '', photo: '' });
            setEditingId(null);
          }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingId ? 'Update Instructor' : 'Save Instructor'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}