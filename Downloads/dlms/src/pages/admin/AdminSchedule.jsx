import React, { useState } from 'react';
import { Box, Card, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, Chip, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { CalendarMonth, AccessTime, LocationOn, Build, Delete } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { LESSON_CATEGORIES, LOCATIONS } from '../../data/mockData';

export default function AdminSchedule() {
  const { lessons, learners, instructors, addLesson, updateLesson, deleteLesson } = useApp();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ learnerId: '', instructorId: '', date: '', time: '', location: '', category: '' });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.learnerId) e.learnerId = 'Required';
    if (!form.instructorId) e.instructorId = 'Required';
    if (!form.date) e.date = 'Required';
    else {
      const selected = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) e.date = 'Cannot be in the past';
    }
    if (!form.time) e.time = 'Required';
    if (!form.location) e.location = 'Required';
    if (!form.category) e.category = 'Required';
    return e;
  }

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const conflict = lessons.find(l => 
      l.instructorId === form.instructorId && 
      l.date === form.date && 
      l.time === form.time && 
      (!editingId || l.id !== editingId)
    );
    if (conflict) {
      alert("Conflict detected: Instructor is busy at this time.");
      return;
    }
    
    if (editingId) {
      updateLesson(editingId, { ...form, status: 'scheduled', duration: 2 });
    } else {
      addLesson({ ...form, status: 'scheduled', duration: 2 });
    }
    setOpen(false);
    setErrors({});
    setForm({ learnerId: '', instructorId: '', date: '', time: '', location: '', category: '' });
    setEditingId(null);
  };

  const handleEdit = (lesson) => {
    setForm({ ...lesson });
    setEditingId(lesson.id);
    setOpen(true);
  };

  const columns = [
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'time', headerName: 'Time', width: 100 },
    { field: 'category', headerName: 'Cat.', width: 80 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { 
      field: 'status', headerName: 'Status', width: 120,
      renderCell: ({ value }) => <Chip label={value} size="small" color={value === 'scheduled' ? 'info' : 'success'} />
    }
    ,
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Edit Lesson">
            <IconButton size="small" color="primary" onClick={() => handleEdit(row)}>
              <Build fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Lesson">
            <IconButton size="small" color="error" onClick={() => deleteLesson(row.id)}>
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
        <Typography variant="h5" fontWeight={800}>Lesson Scheduling</Typography>
        <Button variant="contained" startIcon={<CalendarMonth />} onClick={() => {
          setForm({ learnerId: '', instructorId: '', date: '', time: '', location: '', category: '' });
          setEditingId(null);
          setOpen(true);
        }}>New Session</Button>
      </Box>

      <Card>
        <DataGrid
          rows={lessons}
          columns={columns}
          autoHeight
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
        />
      </Card>

      <Dialog open={open} onClose={() => {
        setOpen(false);
        setErrors({});
        setForm({ learnerId: '', instructorId: '', date: '', time: '', location: '', category: '' });
        setEditingId(null);
      }} maxWidth="sm" fullWidth>
        {editingId ? <DialogTitle>Edit Lesson</DialogTitle> : <DialogTitle>Schedule Driving Lesson</DialogTitle>}
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField select fullWidth label="Learner" value={form.learnerId} onChange={e => { setForm({...form, learnerId: e.target.value}); setErrors(p => ({ ...p, learnerId: '' })); }} error={!!errors.learnerId} helperText={errors.learnerId}>
                {learners.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth label="Instructor" value={form.instructorId} onChange={e => { setForm({...form, instructorId: e.target.value}); setErrors(p => ({ ...p, instructorId: '' })); }} error={!!errors.instructorId} helperText={errors.instructorId}>
                {instructors.map(i => <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} value={form.date} onChange={e => { setForm({...form, date: e.target.value}); setErrors(p => ({ ...p, date: '' })); }} error={!!errors.date} helperText={errors.date} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="time" label="Start Time" InputLabelProps={{ shrink: true }} value={form.time} onChange={e => { setForm({...form, time: e.target.value}); setErrors(p => ({ ...p, time: '' })); }} error={!!errors.time} helperText={errors.time} />
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth label="Category" value={form.category} onChange={e => { setForm({...form, category: e.target.value}); setErrors(p => ({ ...p, category: '' })); }} error={!!errors.category} helperText={errors.category}>
                {LESSON_CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth label="Location" value={form.location} onChange={e => { setForm({...form, location: e.target.value}); setErrors(p => ({ ...p, location: '' })); }} error={!!errors.location} helperText={errors.location}>
                {LOCATIONS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            setErrors({});
            setForm({ learnerId: '', instructorId: '', date: '', time: '', location: '', category: '' });
            setEditingId(null);
          }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingId ? 'Update Lesson' : 'Confirm Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}