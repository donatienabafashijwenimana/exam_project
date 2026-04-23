import React, { useState } from 'react';
import { Box, Card, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, MenuItem, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DirectionsCar, Delete, Add, Build } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { LESSON_CATEGORIES } from '../../data/mockData';

export default function AdminVehicles() {
  const { vehicles, addVehicle, deleteVehicle, updateVehicle } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ plateNumber: '', model: '', category: 'B', status: 'Available' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.plateNumber || !form.plateNumber.trim()) e.plateNumber = 'Required';
    else if (!/^R[A-Z]{2} \d{3} [A-Z]$/.test(form.plateNumber.trim())) e.plateNumber = 'Format: RAA 123 A';
    if (!form.model || !form.model.trim()) e.model = 'Required';
    return e;
  }

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (editingId) {
      updateVehicle(editingId, form);
    } else {
      addVehicle(form);
    }
    setOpen(false);
    setErrors({});
    setForm({ plateNumber: '', model: '', category: 'B', status: 'Available' });
    setEditingId(null);
  };

  const handleEdit = (vehicle) => {
    setForm(vehicle);
    setEditingId(vehicle.id);
    setOpen(true);
  };

  const columns = [
    { field: 'plateNumber', headerName: 'Plate Number', width: 150 },
    { field: 'model', headerName: 'Model', flex: 1 },
    { 
      field: 'category', headerName: 'Category', width: 100,
      renderCell: ({ value }) => <Chip label={value} size="small" color="primary" variant="outlined" />
    },
    { 
      field: 'status', headerName: 'Status', width: 150,
      renderCell: ({ value }) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'Available' ? 'success' : value === 'Maintenance' ? 'error' : 'warning'} 
        />
      )
    },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <IconButton size="small" color="primary" onClick={() => handleEdit(row)}>
            <Build fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => deleteVehicle(row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Manage Vehicles</Typography>
          <Typography variant="body2" color="text.secondary">Fleet management for driving lessons</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => {
          setForm({ plateNumber: '', model: '', category: 'B', status: 'Available' });
          setEditingId(null);
          setOpen(true);
        }}>Add Vehicle</Button>
      </Box>

      <Card>
        <DataGrid
          rows={vehicles}
          columns={columns}
          autoHeight
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
        />
      </Card>

      <Dialog open={open} onClose={() => {
        setOpen(false);
        setErrors({});
        setForm({ plateNumber: '', model: '', category: 'B', status: 'Available' });
        setEditingId(null);
      }} maxWidth="sm" fullWidth>
        {editingId ? <DialogTitle>Edit Vehicle</DialogTitle> : <DialogTitle>Add Training Vehicle</DialogTitle>}
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Plate Number" 
                value={form.plateNumber} 
                onChange={e => { setForm({...form, plateNumber: e.target.value}); setErrors(p => ({ ...p, plateNumber: '' })); }}
                error={!!errors.plateNumber}
                helperText={errors.plateNumber}
                placeholder="RAA 001 A"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Model" 
                value={form.model} 
                onChange={e => { setForm({...form, model: e.target.value}); setErrors(p => ({ ...p, model: '' })); }}
                error={!!errors.model}
                helperText={errors.model}
                placeholder="Toyota Corolla"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {LESSON_CATEGORIES.map(c => <MenuItem key={c} value={c}>Category {c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Status" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="In Use">In Use</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            setErrors({});
            setForm({ plateNumber: '', model: '', category: 'B', status: 'Available' });
            setEditingId(null);
          }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingId ? 'Update Vehicle' : 'Save Vehicle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}