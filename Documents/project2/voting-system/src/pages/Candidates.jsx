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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  PhotoCamera,
  Warning,
  Close,
  Print as PrintIcon,
} from '@mui/icons-material';
import { useDataStore } from '../stores/dataStore';

const parties = ['RPF-Inkotanyi', 'PSD', 'PL', 'PPC', 'PS-Imberakuri', 'DGPR', 'UDPR'];
const positions = ['President', 'Senator', 'Deputy', 'Mayor', 'Councilor'];
const categories = ['National', 'Regional', 'District', 'Sector'];

const emptyForm = {
  name: '',
  party: '',
  position: '',
  category: '',
  photo: '',
  campaignMessage: '',
};

export default function CandidatesPage() {
  const candidates = useDataStore((s) => s.candidates);
  const addCandidate = useDataStore((s) => s.addCandidate);
  const updateCandidate = useDataStore((s) => s.updateCandidate);
  const deleteCandidate = useDataStore((s) => s.deleteCandidate);
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

  const handleOpenEdit = (candidate) => {
    setEditing(candidate);
    setForm({
      name: candidate.name,
      party: candidate.party,
      position: candidate.position,
      category: candidate.category,
      photo: candidate.photo,
      campaignMessage: candidate.campaignMessage,
    });
    setPhotoPreview(candidate.photo);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleOpenView = (candidate) => {
    setSelected(candidate);
    setViewOpen(true);
  };

  const handleOpenDelete = (candidate) => {
    setSelected(candidate);
    setDeleteOpen(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setFormErrors((prev) => ({ ...prev, photo: 'Only JPEG/PNG files allowed' }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFormErrors((prev) => ({ ...prev, photo: 'File must be under 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setForm((prev) => ({ ...prev, photo: reader.result }));
      setFormErrors((prev) => ({ ...prev, photo: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.party) errors.party = 'Party is required';
    if (!form.position) errors.position = 'Position is required';
    if (!form.category) errors.category = 'Category is required';
    if (!form.campaignMessage.trim()) errors.campaignMessage = 'Campaign message is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editing) {
      updateCandidate(editing.id, form);
    } else {
      addCandidate(form);
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    deleteCandidate(selected.id);
    setDeleteOpen(false);
  };

  const columns = [
    {
      field: 'photo',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Avatar src={params.row.photo} sx={{ width: 36, height: 36 }} />
      ),
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'party', headerName: 'Party', width: 140 },
    { field: 'position', headerName: 'Position', width: 120 },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'National' ? 'primary' : 'secondary'}
          variant="filled"
          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
        />
      ),
    },
    { field: 'votes', headerName: 'Votes', width: 80, type: 'number' },
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
            Candidate Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {candidates.length} registered candidates
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAdd}
            sx={{ borderRadius: 2 }}
          >
            Add Candidate
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
  rows={candidates}
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
        // bgcolor: '#fafff5',
      },
      '&:hover': {
        bgcolor: '#e8f5e9 !important',
        color: '#1b5e20',
      },
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: '2px solid #a5d6a7',
      // bgcolor: '#f1f8e9',
    },
  }}
/>
      </Card>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editing ? 'Edit Candidate' : 'Add New Candidate'}
          <IconButton onClick={() => setFormOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="candidates-page__photo-preview" />
          ) : (
            <Box className="candidates-page__photo-placeholder">
              <PhotoCamera />
            </Box>
          )}

          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
            fullWidth
            sx={{ mb: 3, borderRadius: 2 }}
          >
            Upload Photo
            <input type="file" hidden accept="image/jpeg,image/png" onChange={handlePhotoChange} />
          </Button>
          {formErrors.photo && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formErrors.photo}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={!!formErrors.name}
            helperText={formErrors.name}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField
              select
              label="Party"
              value={form.party}
              onChange={(e) => setForm({ ...form, party: e.target.value })}
              error={!!formErrors.party}
              helperText={formErrors.party}
            >
              {parties.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Position"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              error={!!formErrors.position}
              helperText={formErrors.position}
            >
              {positions.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            select
            fullWidth
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            error={!!formErrors.category}
            helperText={formErrors.category}
            sx={{ mb: 2 }}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Campaign Message"
            multiline
            rows={3}
            value={form.campaignMessage}
            onChange={(e) => setForm({ ...form, campaignMessage: e.target.value })}
            error={!!formErrors.campaignMessage}
            helperText={formErrors.campaignMessage}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2 }}>
            {editing ? 'Update' : 'Add Candidate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Candidate Details
          <IconButton onClick={() => setViewOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                src={selected.photo}
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {selected.name}
              </Typography>
              <Box sx={{ mt: 2, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Typography sx={{ fontWeight: 600, minWidth: 100 }}>Party:</Typography>
                  <Typography>{selected.party}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Typography sx={{ fontWeight: 600, minWidth: 100 }}>Position:</Typography>
                  <Typography>{selected.position}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Typography sx={{ fontWeight: 600, minWidth: 100 }}>Category:</Typography>
                  <Typography>{selected.category}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Typography sx={{ fontWeight: 600, minWidth: 100 }}>Votes:</Typography>
                  <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {selected.votes}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    fontStyle: 'italic',
                  }}
                >
                  <Typography variant="body2">"{selected.campaignMessage}"</Typography>
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
              Are you sure you want to delete <strong>{selected?.name}</strong>? This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ borderRadius: 2 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
