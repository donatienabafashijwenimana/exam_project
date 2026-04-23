import React, { useState } from 'react';
import {
  Box, Button, Card, Typography, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Grid, Stack, Avatar,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Visibility, Delete, CheckCircle, Cancel, PersonAdd, Build,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { USERS, LESSON_CATEGORIES, LOCATIONS } from '../../data/mockData';

const STATUS_COLOR = { pending: 'warning', assigned: 'success', completed: 'info', cancelled: 'error' };
const STATUS_LABEL = { pending: 'Pending', assigned: 'Assigned', completed: 'Completed', cancelled: 'Cancelled' };

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '?';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
};

function validateEditForm(form) {
  const e = {};
  if (!form.name || !form.name.trim()) e.name = 'Required';
  else if (form.name.trim().length < 2) e.name = 'Min 2 characters';
  if (!form.nationalId || !form.nationalId.trim()) e.nationalId = 'Required';
  else if (!/^\d{16}$/.test(form.nationalId.replace(/\s/g, ''))) e.nationalId = 'Must be 16 digits';
  if (!form.email || !form.email.trim()) e.email = 'Required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
  if (!form.phone || !form.phone.trim()) e.phone = 'Required';
  else if (!/^\d{10,13}$/.test(form.phone.replace(/\s/g, ''))) e.phone = '10-13 digits';
  if (form.performance === '' || form.performance === undefined || isNaN(form.performance)) e.performance = 'Required';
  else if (form.performance < 0 || form.performance > 100) e.performance = '0-100 only';
  if (form.hoursCompleted === '' || form.hoursCompleted === undefined || isNaN(form.hoursCompleted)) e.hoursCompleted = 'Required';
  else if (form.hoursCompleted < 0) e.hoursCompleted = 'Min 0';
  if (form.totalHours === '' || form.totalHours === undefined || isNaN(form.totalHours)) e.totalHours = 'Required';
  else if (form.totalHours < 1) e.totalHours = 'Min 1';
  return e;
}

function validateAddForm(form) {
  const e = {};
  if (!form.learnerName || !form.learnerName.trim()) e.learnerName = 'Required';
  else if (form.learnerName.trim().length < 2) e.learnerName = 'Min 2 characters';
  if (!form.nationalId || !form.nationalId.trim()) e.nationalId = 'Required';
  else if (!/^\d{16}$/.test(form.nationalId.replace(/\s/g, ''))) e.nationalId = 'Must be 16 digits';
  if (!form.email || !form.email.trim()) e.email = 'Required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
  if (!form.phone || !form.phone.trim()) e.phone = 'Required';
  else if (!/^\d{10,13}$/.test(form.phone.replace(/\s/g, ''))) e.phone = '10-13 digits';
  if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
  return e;
}

export default function AdminApplications() {
  const { learners, assignInstructor, updateLearner, deleteLearner, addLearnerWithAccount } = useApp();

  const [viewLearner, setViewLearner] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '', nationalId: '', email: '', phone: '', category: 'B',
    performance: 0, hoursCompleted: 0, totalHours: 20, status: 'pending'
  });
  const [editErrors, setEditErrors] = useState({});

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    learnerName: '', email: '', password: 'learner123', phone: '', category: 'B', nationalId: '',
  });
  const [addErrors, setAddErrors] = useState({});

  const instructors = USERS.filter(u => u.role === 'instructor');

  const handleSaveEdit = () => {
    const errs = validateEditForm(editForm);
    if (Object.keys(errs).length) { setEditErrors(errs); return; }
    updateLearner(editTarget.id, editForm);
    setEditTarget(null);
    setEditErrors({});
    setEditForm({
      name: '', nationalId: '', email: '', phone: '', category: 'B',
      performance: 0, hoursCompleted: 0, totalHours: 20, status: 'pending'
    });
  };

  const handleEdit = (learner) => {
    setEditTarget(learner);
    setEditForm({ ...learner });
    setEditErrors({});
  };

  const columns = [
    {
      field: 'name', headerName: 'Learner', flex: 1.4, minWidth: 160,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: '#0d2b5e', width: 30, height: 30, fontSize: '0.68rem', fontWeight: 700 }}>
            {getInitials(row.name)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>{row.name || '—'}</Typography>
            <Typography variant="caption" color="text.secondary">{row.category}</Typography>
          </Box>
        </Box>
      ),
    },
    { field: 'nationalId', headerName: 'National ID', width: 150 },
    { field: 'email', headerName: 'Email', width: 160 },
    { field: 'phone', headerName: 'Phone', width: 120 },
    {
      field: 'performance', headerName: 'Performance %', width: 120,
      valueFormatter: ({ value }) => `${value}%`,
    },
    {
      field: 'hoursCompleted', headerName: 'Hours', width: 100,
      renderCell: ({ row }) => `${row.hoursCompleted}/${row.totalHours}`,
    },
    {
      field: 'status', headerName: 'Status', width: 130,
      renderCell: ({ value }) => <Chip label={STATUS_LABEL[value] || value} size="small" color={STATUS_COLOR[value] || 'default'} />,
    },
    {
      field: 'actions', headerName: 'Actions', width: 160, sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" gap={0.4}>
          <Tooltip title="View Details"><IconButton size="small" color="primary" onClick={() => setViewLearner(row)}><Visibility fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Edit Learner"><IconButton size="small" color="info" onClick={() => handleEdit(row)}><Build fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Assign Instructor"><IconButton size="small" color="info" onClick={() => assignInstructor(row.id, 2)}><PersonAdd fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}><Delete fontSize="small" /></IconButton></Tooltip>
        </Box>
      )
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Manage Learners ({learners.length})</Typography>
          <Stack direction="row" gap={1} mt={0.5} flexWrap="wrap">
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <Chip key={k} label={`${v}: ${learners.filter(l => l.status === k || (k === 'pending' && !l.assignedInstructor)).length}`}
                size="small" color={STATUS_COLOR[k]} variant="outlined" />
            ))}
          </Stack>
        </Box>
        <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setAddModalOpen(true)}>Add Learner</Button>
      </Box>

      <Card>
        <DataGrid
          rows={learners}
          columns={columns}
          autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          disableRowSelectionOnClick
          sx={{ border: 'none' }}
        />
      </Card>


      <Dialog open={!!viewLearner} onClose={() => setViewLearner(null)} maxWidth="md" fullWidth>
        {viewLearner && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#0d2b5e', width: 44, height: 44 }}>{getInitials(viewLearner.name)}</Avatar>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight={700}>{viewLearner.name}</Typography>
                  <Chip label={`Category ${viewLearner.category}`} size="small" color="primary" />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>Personal Information</Typography>
                  <Typography variant="body2"><strong>National ID:</strong> {viewLearner.nationalId}</Typography>
                  <Typography variant="body2"><strong>Email:</strong> {viewLearner.email}</Typography>
                  <Typography variant="body2"><strong>Phone:</strong> {viewLearner.phone}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>Training Progress</Typography>
                  <Typography variant="body2"><strong>Performance:</strong> {viewLearner.performance}%</Typography>
                  <Typography variant="body2"><strong>Hours:</strong> {viewLearner.hoursCompleted}/{viewLearner.totalHours}</Typography>
                  <Typography variant="body2"><strong>Instructor:</strong> {viewLearner.instructorName || 'Not assigned'}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewLearner(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>


      <Dialog open={!!editTarget} onClose={() => {
        setEditTarget(null);
        setEditErrors({});
        setEditForm({
          name: '', nationalId: '', email: '', phone: '', category: 'B',
          performance: 0, hoursCompleted: 0, totalHours: 20, status: 'pending'
        });
      }} maxWidth="md" fullWidth>
        <DialogTitle>Edit Learner</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={editForm.name}
                onChange={(e) => { setEditForm({ ...editForm, name: e.target.value }); setEditErrors(p => ({ ...p, name: '' })); }}
                error={!!editErrors.name}
                helperText={editErrors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="National ID"
                value={editForm.nationalId}
                onChange={(e) => { setEditForm({ ...editForm, nationalId: e.target.value }); setEditErrors(p => ({ ...p, nationalId: '' })); }}
                error={!!editErrors.nationalId}
                helperText={editErrors.nationalId}
                inputProps={{ maxLength: 16 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={editForm.email}
                onChange={(e) => { setEditForm({ ...editForm, email: e.target.value }); setEditErrors(p => ({ ...p, email: '' })); }}
                error={!!editErrors.email}
                helperText={editErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={editForm.phone}
                onChange={(e) => { setEditForm({ ...editForm, phone: e.target.value }); setEditErrors(p => ({ ...p, phone: '' })); }}
                error={!!editErrors.phone}
                helperText={editErrors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth label="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                {LESSON_CATEGORIES.map(c => (
                  <MenuItem key={c} value={c}>Category {c}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="number"
                fullWidth
                label="Performance (%)"
                value={editForm.performance}
                onChange={(e) => { setEditForm({ ...editForm, performance: parseInt(e.target.value) }); setEditErrors(p => ({ ...p, performance: '' })); }}
                error={!!editErrors.performance}
                helperText={editErrors.performance}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="number"
                fullWidth
                label="Hours Completed"
                value={editForm.hoursCompleted}
                onChange={(e) => { setEditForm({ ...editForm, hoursCompleted: parseInt(e.target.value) }); setEditErrors(p => ({ ...p, hoursCompleted: '' })); }}
                error={!!editErrors.hoursCompleted}
                helperText={editErrors.hoursCompleted}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="number"
                fullWidth
                label="Total Hours"
                value={editForm.totalHours}
                onChange={(e) => { setEditForm({ ...editForm, totalHours: parseInt(e.target.value) }); setEditErrors(p => ({ ...p, totalHours: '' })); }}
                error={!!editErrors.totalHours}
                helperText={editErrors.totalHours}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth label="Status" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditTarget(null);
            setEditErrors({});
            setEditForm({
              name: '', nationalId: '', email: '', phone: '', category: 'B',
              performance: 0, hoursCompleted: 0, totalHours: 20, status: 'pending'
            });
          }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Save Changes</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete Learner</DialogTitle>
        <DialogContent>
          <Typography>Delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => { deleteLearner(deleteTarget?.id); setDeleteTarget(null); }}>Delete</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={addModalOpen} onClose={() => { setAddModalOpen(false); setAddErrors({}); }} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Learner Account</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Create learner account with login credentials. Password will be shown after creation.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Full Name" value={addForm.learnerName} onChange={(e) => { setAddForm({...addForm, learnerName: e.target.value}); setAddErrors(p => ({ ...p, learnerName: '' })); }} error={!!addErrors.learnerName} helperText={addErrors.learnerName} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" value={addForm.email} onChange={(e) => { setAddForm({...addForm, email: e.target.value}); setAddErrors(p => ({ ...p, email: '' })); }} error={!!addErrors.email} helperText={addErrors.email} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Phone" value={addForm.phone} onChange={(e) => { setAddForm({...addForm, phone: e.target.value}); setAddErrors(p => ({ ...p, phone: '' })); }} error={!!addErrors.phone} helperText={addErrors.phone} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="National ID" value={addForm.nationalId} onChange={(e) => { setAddForm({...addForm, nationalId: e.target.value}); setAddErrors(p => ({ ...p, nationalId: '' })); }} error={!!addErrors.nationalId} helperText={addErrors.nationalId} inputProps={{ maxLength: 16 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth label="License Category" value={addForm.category} onChange={(e) => setAddForm({...addForm, category: e.target.value})}>
                {['A', 'B', 'C', 'D', 'CE'].map(c => <MenuItem key={c} value={c}>Category {c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Temporary Password" value={addForm.password} onChange={(e) => { setAddForm({...addForm, password: e.target.value}); setAddErrors(p => ({ ...p, password: '' })); }} error={!!addErrors.password} helperText={addErrors.password || 'Learner will use this to login'} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAddModalOpen(false); setAddErrors({}); }}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            const errs = validateAddForm(addForm);
            if (Object.keys(errs).length) { setAddErrors(errs); return; }
            addLearnerWithAccount({
              learnerName: addForm.learnerName,
              email: addForm.email,
              phone: addForm.phone,
              category: addForm.category,
              nationalId: addForm.nationalId,
              hoursCompleted: 0,
              totalHours: 30,
              performance: 0,
            }, addForm.password);
            alert(`Learner "${addForm.learnerName}" created!\nEmail: ${addForm.email}\nPassword: ${addForm.password}`);
            setAddModalOpen(false);
            setAddErrors({});
            setAddForm({ learnerName: '', email: '', password: 'learner123', phone: '', category: 'B', nationalId: '' });
          }}>
            Create Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

