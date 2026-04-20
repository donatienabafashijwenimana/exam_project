import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import {
  Edit,
  Close,
  PhotoCamera,
  Badge,
  HowToVote,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
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
  name: '',
  email: '',
  password: '',
  pollingDistrict: '',
  status: 'Active',
};

export default function ProfilePage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const votedPositions = useAuthStore((s) => s.votedPositions);
  const login = useAuthStore((s) => s.login);
  const voters = useDataStore((s) => s.voters);
  const updateVoter = useDataStore((s) => s.updateVoter);
  const getVoterByVoterId = useDataStore((s) => s.getVoterByVoterId);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState('');
  const [currentVoter, setCurrentVoter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (currentUser?.voterId) {
      const voter = getVoterByVoterId(currentUser.voterId);
      setCurrentVoter(voter);
      setPhotoPreview(voter?.idPhoto || '');
      setForm({
        name: voter?.name || currentUser.name || '',
        email: voter?.email || '',
        password: '',
        pollingDistrict: voter?.pollingDistrict || '',
        status: voter?.status || 'Active',
      });
    }
    setLoading(false);
  }, [currentUser, getVoterByVoterId]);

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
      setFormErrors((prev) => ({ ...prev, idPhoto: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {};

    if (!form.name.trim()) errors.name = 'Name is required';

    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Invalid email format';
    }

    if (form.password) {
      const checks = [];
      if (!/[A-Z]/.test(form.password)) checks.push('uppercase letter');
      if (!/[0-9]/.test(form.password)) checks.push('number');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) checks.push('special character');
      if (form.password.length < 8) checks.push('minimum 8 characters');
      if (checks.length > 0) {
        errors.password = `Password needs: ${checks.join(', ')}`;
      }
    }

    if (!form.pollingDistrict) errors.pollingDistrict = 'District is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !currentVoter) return;

    const updateData = {
      name: form.name,
      email: form.email,
      pollingDistrict: form.pollingDistrict,
      status: form.status,
      idPhoto: photoPreview,
    };

    if (form.password) {
      updateData.password = form.password;
    }

    updateVoter(currentVoter.id, updateData);

    if (form.name !== currentUser.name) {
      login({ ...currentUser, name: form.name });
    }

    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setFormOpen(false);
    setFormErrors({});
  };

  const userVotedPositions = votedPositions[currentUser?.voterId] || {};
  const voteCount = Object.keys(userVotedPositions).length;

  if (loading || !currentUser) {
    return null;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {successMessage}
            </Alert>
          )}
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            My Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal information and voting status
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => setFormOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Edit Profile
        </Button>
      </Box>

      <Card elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4, border: '1px solid', borderColor: '#c8e6c9' }}>
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.50' }}>
          <Avatar
            src={photoPreview || currentVoter?.idPhoto}
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 2,
              fontSize: '2.5rem',
              fontWeight: 700,
              bgcolor: 'primary.main',
            }}
          >
            {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
            {currentUser.name}
          </Typography>
          <Chip
            label={currentUser.role === 'admin' ? 'Administrator' : 'Voter'}
            size="large"
            sx={{
              fontSize: '0.9rem',
              fontWeight: 700,
              height: 32,
              bgcolor: currentUser.role === 'admin' ? '#2e7d32' : '#43a047',
              color: 'white',
            }}
          />
        </Box>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ borderRadius: 3, height: '100%', border: '1px solid', borderColor: '#e8f5e9' }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Badge fontSize="small" color="primary" />
                Profile Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Voter ID</Typography>
                  <Typography variant="body1" fontFamily="monospace" fontWeight={600} sx={{ color: 'primary.main' }}>
                    {currentUser.voterId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Email</Typography>
                  <Typography>{currentVoter?.email || 'Not set'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Polling District</Typography>
                  <Typography>{currentVoter?.pollingDistrict || 'Not set'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Status</Typography>
                  <Chip
                    label={currentVoter?.status || 'Active'}
                    color={currentVoter?.status === 'Active' ? 'success' : 'default'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 3, height: '100%', border: '1px solid', borderColor: '#e8f5e9' }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <HowToVote fontSize="small" color="primary" />
                Voting Status
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ textAlign: 'center' }}>
                {voteCount > 0 ? (
                  <>
                    <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {voteCount}
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      Positions voted
                    </Typography>
                  </>
                ) : (
                  <>
                    <Schedule sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.disabled' }}>
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No votes cast yet
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Edit Profile
          <IconButton onClick={() => setFormOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {photoPreview ? (
            <Box
              component="img"
              src={photoPreview}
              alt="Profile Preview"
              sx={{
                width: '100%',
                maxWidth: 200,
                height: 150,
                objectFit: 'cover',
                borderRadius: 2,
                mx: 'auto',
                display: 'block',
                mb: 2,
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                fontSize: '2rem',
                bgcolor: 'primary.main',
              }}
            >
              {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
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
            Update Profile
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
