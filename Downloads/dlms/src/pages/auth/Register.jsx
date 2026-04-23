import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, InputAdornment, IconButton, CircularProgress, Container,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Email, Lock, Person, Phone, Badge } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';


export default function Register() {
  const [form, setForm] = useState({
    learnerName: '',
    email: '',
    phone: '',
    nationalId: '',
    category: 'B'
  });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { addLearnerWithAccount } = useApp();

  function validate() {
    const e = {};
    if (!form.learnerName || !form.learnerName.trim()) e.learnerName = 'Required';
    else if (form.learnerName.trim().length < 2) e.learnerName = 'Min 2 characters';
    if (!form.email || !form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone || !form.phone.trim()) e.phone = 'Required';
    else if (!/^\d{10,13}$/.test(form.phone.replace(/\s/g, ''))) e.phone = '10-13 digits';
    if (!form.nationalId || !form.nationalId.trim()) e.nationalId = 'Required';
    else if (!/^\d{16}$/.test(form.nationalId.replace(/\s/g, ''))) e.nationalId = 'Must be 16 digits';
    if (!password || password.length < 6) e.password = 'Min 6 characters';
    return e;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setError('');

    try {
      await new Promise(r => setTimeout(r, 1000));
      const result = addLearnerWithAccount({ learnerName: form.learnerName, email: form.email, phone: form.phone, nationalId: form.nationalId, category: form.category }, password);
      const newUser = { email: form.email, password };
      localStorage.setItem('dlms_user', JSON.stringify(newUser));
      navigate('/learner/dashboard');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box textAlign="center" mt={8} p={4}>
          <CircularProgress />
          <Typography variant="h5" mt={3}>Registration Successful!</Typography>
          <Typography>Redirecting to login...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box p={4} boxShadow={3} borderRadius={2} bgcolor="background.paper">
        <Typography variant="h4" fontWeight={800} textAlign="center" mb={1}>Student Registration</Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>Create account for driving lessons</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth label="Full Name" required
            name="learnerName"
            value={form.learnerName}
            onChange={e => { setForm(p => ({ ...p, learnerName: e.target.value })); setErrors(p => ({ ...p, learnerName: '' })); }}
            error={!!errors.learnerName}
            helperText={errors.learnerName}
            InputProps={{ startAdornment: <Person /> }}
          />
          <TextField
            fullWidth label="Email" type="email" required
            value={form.email}
            onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{ startAdornment: <Email /> }}
          />
          <TextField
            fullWidth label="Phone" required
            value={form.phone}
            onChange={e => { setForm(p => ({ ...p, phone: e.target.value })); setErrors(p => ({ ...p, phone: '' })); }}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{ startAdornment: <Phone /> }}
          />
          <TextField
            fullWidth label="National ID" required
            value={form.nationalId}
            onChange={e => { setForm(p => ({ ...p, nationalId: e.target.value })); setErrors(p => ({ ...p, nationalId: '' })); }}
            error={!!errors.nationalId}
            helperText={errors.nationalId}
            inputProps={{ maxLength: 16 }}
            InputProps={{ startAdornment: <Badge /> }}
          />
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>License Category</InputLabel>
            <Select 
              value={form.category} 
              label="License Category" 
              onChange={e => { setForm(p => ({ ...p, category: e.target.value })); setErrors(p => ({ ...p, category: '' })); }}
            >
              <MenuItem value="A">Motorcycle (A)</MenuItem>
              <MenuItem value="B">Light Vehicle (B)</MenuItem>
              <MenuItem value="C">Heavy Vehicle (C)</MenuItem>
              <MenuItem value="D">Bus (D)</MenuItem>
              <MenuItem value="CE">Heavy Trailer (CE)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth label="Password" type="password" required
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
            error={!!errors.password}
            helperText={errors.password || 'Minimum 6 characters'}
          />
          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ py: 1.5 }}>
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Register Student'}
          </Button>
          <Button fullWidth variant="outlined" onClick={() => navigate('/login')} sx={{ mt: 1 }}>
            Have Account? Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
