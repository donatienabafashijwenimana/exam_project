import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
  Tooltip,
  Alert,
  InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Badge,
  Warning,
  Close,
  PhotoCamera,
  CheckCircle,
  Cancel,
  Print as PrintIcon,
} from '@mui/icons-material';
import { useDataStore } from '../stores/dataStore';

const districts = [
  'District A - Kigali',
  'District B - Huye',
  'District C - Musanze',
  'District D - Rubavu',
  'District E - Muhanga',
  'District F - Nyagatare',
  'District G - Rusizi',
];

const emptyForm = {
  voterId: '',
  name: '',
  email: '',
  password: '',
  pollingDistrict: '',
  status: 'Active',
  idPhoto: '',
};

export default function VotersPage() {
  const candidates = useDataStore((s) => s.candidates);
  const rawVoters = useDataStore((s) => s.voters);
  const addVoter = useDataStore((s) => s.addVoter);
  const updateVoter = useDataStore((s) => s.updateVoter);
  const deleteVoter = useDataStore((s) => s.deleteVoter);

  const voters = useMemo(() => {
    const allPositionNames = [...new Set(candidates.map((c) => c.position))];
    return rawVoters.map((v) => {
      if (!v.votedPositions) return v;
      const isComplete = allPositionNames.every((p) => v.votedPositions[p]);
      return { ...v, hasVoted: isComplete };
    });
  }, [rawVoters, candidates]);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState('');

  const handleOpenAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setPhotoPreview('');
    setFormErrors({});
    setFormOpen(true);
  };

  const handleOpenEdit = (voter) => {
    setEditing(voter);
    setForm({
      voterId: voter.voterId,
      name: voter.name,
      email: voter.email,
      password: voter.password,
      pollingDistrict: voter.pollingDistrict,
      status: voter.status,
      idPhoto: voter.idPhoto,
    });
    setPhotoPreview(voter.idPhoto);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleOpenView = (voter) => {
    setSelected(voter);
    setViewOpen(true);
  };

  const handleOpenDelete = (voter) => {
    setSelected(voter);
    setDeleteOpen(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setFormErrors((prev) => ({ ...prev, idPhoto: 'Only JPEG/PNG files allowed' }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFormErrors((prev) => ({ ...prev, idPhoto: 'File must be under 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setForm((prev) => ({ ...prev, idPhoto: reader.result }));
      setFormErrors((prev) => ({ ...prev, idPhoto: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {};

    // Voter ID - numeric only
    if (!form.voterId.trim()) {
      errors.voterId = 'Voter ID is required';
    } else if (!/^\d+$/.test(form.voterId)) {
      errors.voterId = 'Voter ID must contain numbers only';
    } else if (form.voterId.length < 10) {
      errors.voterId = 'Voter ID must be at least 10 digits';
    }

    // Name
    if (!form.name.trim()) errors.name = 'Name is required';

    // Email validation
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Invalid email format';
    }

    // Password strength
    if (!form.password) {
      errors.password = 'Password is required';
    } else {
      const checks = [];
      if (!/[A-Z]/.test(form.password)) checks.push('uppercase letter');
      if (!/[0-9]/.test(form.password)) checks.push('number');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) checks.push('special character');
      if (form.password.length < 8) checks.push('minimum 8 characters');
      if (checks.length > 0) {
        errors.password = `Password needs: ${checks.join(', ')}`;
      }
    }

    // District
    if (!form.pollingDistrict) errors.pollingDistrict = 'District is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editing) {
      updateVoter(editing.id, form);
    } else {
      addVoter(form);
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    deleteVoter(selected.id);
    setDeleteOpen(false);
  };

  const columns = [
    {
      field: 'idPhoto',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Avatar src={params.row.idPhoto} sx={{ width: 32, height: 32 }} />
      ),
    },
    { field: 'voterId', headerName: 'Voter ID', width: 160 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 140 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
    { field: 'pollingDistrict', headerName: 'District', width: 160 },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'Active' ? 'success' : 'error'}
          variant="filled"
          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
        />
      ),
    },
    {
      field: 'hasVoted',
      headerName: 'Voted',
      width: 80,
      renderCell: (params) =>
        params.value ? (
          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
        ) : (
          <Cancel sx={{ color: 'text.disabled', fontSize: 20 }} />
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleOpenView(params.row)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenEdit(params.row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleOpenDelete(params.row)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Voter Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {voters.length} registered voters
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAdd}
            sx={{ borderRadius: 2 }}
          >
            Register Voter
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            sx={{ borderRadius: 2 }}
          >
            Print List
          </Button>
        </Box>
      </Box>

      <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: '#c8e6c9' }}>
<DataGrid
  rows={voters}
  columns={columns}
  pageSize={5}
  rowsPerPageOptions={[5, 10, 25]}
  disableRowSelectionOnClick
  autoHeight
  filterMode="client"
  sx={{
    border: 'none',
    '& .MuiDataGrid-columnHeaders': {
      bgcolor: '#e8f5e9',
      borderBottom: '2px solid #a5d6a7',
      '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: 700,
        color: '#1b5e20',
        fontSize: '0.85rem',
      },
    },
    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid #f1f8e9',
      fontSize: '0.875rem',
    },
    '& .MuiDataGrid-row': {
      '&:nth-of-type(even)': {
      },
      '&:hover': {
        bgcolor: '#e8f5e9 !important',
        color: '#1b5e20',
      },
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: '2px solid #a5d6a7',
    },
  }}
/>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editing ? 'Update Voter' : 'Register New Voter'}
          <IconButton onClick={() => setFormOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {photoPreview ? (
            <img src={photoPreview} alt="ID Preview" className="voters-page__photo-preview" />
          ) : (
            <Box className="voters-page__photo-placeholder">
              <Badge />
            </Box>
          )}

          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
            fullWidth
            sx={{ mb: 3, borderRadius: 2 }}
          >
            Upload ID Photo
            <input type="file" hidden accept="image/jpeg,image/png" onChange={handlePhotoChange} />
          </Button>
          {formErrors.idPhoto && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formErrors.idPhoto}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Voter ID (National ID Number)"
            value={form.voterId}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setForm({ ...form, voterId: val });
            }}
            error={!!formErrors.voterId}
            helperText={formErrors.voterId || 'Numeric national ID only'}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Badge fontSize="small" /></InputAdornment>,
            }}
          />

          <TextField
            fullWidth
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={!!formErrors.name}
            helperText={formErrors.name}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={!!formErrors.email}
            helperText={formErrors.email || 'Valid email format required'}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={!!formErrors.password}
            helperText={formErrors.password || 'Must contain: uppercase, number, special char, 8+ chars'}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              select
              label="Polling District"
              value={form.pollingDistrict}
              onChange={(e) => setForm({ ...form, pollingDistrict: e.target.value })}
              error={!!formErrors.pollingDistrict}
              helperText={formErrors.pollingDistrict}
            >
              {districts.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2 }}>
            {editing ? 'Update Voter' : 'Register Voter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Voter Details
          <IconButton onClick={() => setViewOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                src={selected.idPhoto}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {selected.name}
              </Typography>
              <Chip
                label={selected.status}
                size="small"
                color={selected.status === 'Active' ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
              <Box sx={{ mt: 2, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Typography sx={{ fontWeight: 600, minWidth: 120 }}>Voter ID:</Typography>
                  <Typography sx={{ fontFamily: 'monospace' }}>{selected.voterId}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Typography sx={{ fontWeight: 600, minWidth: 120 }}>Email:</Typography>
                  <Typography>{selected.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Typography sx={{ fontWeight: 600, minWidth: 120 }}>District:</Typography>
                  <Typography>{selected.pollingDistrict}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Typography sx={{ fontWeight: 600, minWidth: 120 }}>Has Voted:</Typography>
                  <Typography>{selected.hasVoted ? 'Yes' : 'No'}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setViewOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: 'error.main', color: '#fff', mb: 2, opacity: 0.9 }}>
            <Warning />
            <Typography variant="body2">
              Are you sure you want to remove voter <strong>{selected?.name}</strong>? This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ borderRadius: 2 }}>
            Remove Voter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
