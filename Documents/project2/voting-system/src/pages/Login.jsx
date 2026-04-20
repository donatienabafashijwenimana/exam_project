import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import { HowToVote, Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';

// ─── Constants ──────────────────────────────────────────────
const ADMIN = { id: '112005', password: 'Admin@123' };

// ─── Sub-components ─────────────────────────────────────────
function RoleSelector({ role, onChange }) {
  return (
    <FormControl component="fieldset" sx={{ mb: 2.5 }}>
      <FormLabel component="legend">Login as</FormLabel>
      <RadioGroup row value={role} onChange={(e) => onChange(e.target.value)}>
        <FormControlLabel value="voter" control={<Radio />} label="Voter" />
        <FormControlLabel value="admin" control={<Radio />} label="Admin" />
      </RadioGroup>
    </FormControl>
  );
}

// ─── Main Component ─────────────────────────────────────────
export default function LoginPage() {
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('voter');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const authenticateVoter = useDataStore((s) => s.authenticateVoter);

    const validate = () => {
    const newErrors = {};
    if (role === 'admin') {
      if (!voterId.trim()) {
        newErrors.voterId = 'Admin ID is required';
      }
    } else {
      if (!voterId.trim()) {
        newErrors.voterId = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(voterId)) {
        newErrors.voterId = 'Valid email is required';
      }
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    if (role === 'admin') {
      if (voterId !== ADMIN.id) {
        setError('Invalid Admin ID. Must be 112005.');
        return;
      }
      if (password !== ADMIN.password) {
        setError('Wrong Admin password.');
        return;
      }
      login({ name: 'Admin', voterId: 112005, role: 'admin', pollingDistrict: 'HQ' });
      navigate('/dashboard');
      return;
    }

    const authResult = authenticateVoter(voterId, password);
    if (authResult.success) {
      login({ ...authResult.voter, role: 'voter' });
      navigate('/voting');
    } else {
      switch (authResult.reason) {
        case 'invalidEmail':
          setError('Email not found or account inactive. Please check and try again.');
          break;
        case 'wrongPassword':
          setError('Incorrect password for this email.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    }
  };


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: '#ffffff',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 600,
          p: 5,
          borderRadius: '20px',
          background: '#ffffff',
          border: '1px solid',
          boxShadow: '0 20px 60px rgba(27, 94, 32, 0.25)',
          position: 'relative',
          zIndex: 1,
        }}
        elevation={0}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 24px rgba(46, 125, 50, 0.3)',
              }}
            >
              <HowToVote sx={{ fontSize: 40, color: '#fff' }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 0.5,
                background: 'linear-gradient(135deg, #2e7d32, #43a047)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Automated Voting System
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Secure Digital Election Platform
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '10px',
                border: '1px solid rgba(211, 47, 47, 0.2)',
              }}
            >
              {error}
            </Alert>
          )}

          <RoleSelector role={role} onChange={setRole} />

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                 fullWidth
                 label={role === 'admin' ? 'Admin ID' : 'Email'}
                 value={voterId}
                 onChange={(e) => setVoterId(e.target.value)}
                 error={!!errors.voterId}
                 helperText={errors.voterId || (role === 'admin' ? 'Enter 112005' : 'Enter your registered email')}
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     borderRadius: '10px',
                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                       borderColor: '#2e7d32',
                       borderWidth: '2px',
                     },
                   },
                   '& .MuiInputLabel-root.Mui-focused': {
                     color: '#2e7d32',
                   },
                 }}
                 placeholder={role === 'admin' ? '112005' : 'your.email@example.com'}
               />

<TextField
                 fullWidth
                 label="Password"
                 type={showPassword ? 'text' : 'password'}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 error={!!errors.password}
                 helperText={errors.password || 'Enter your account password'}
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     borderRadius: '10px',
                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                       borderColor: '#2e7d32',
                       borderWidth: '2px',
                     },
                   },
                   '& .MuiInputLabel-root.Mui-focused': {
                     color: '#2e7d32',
                   },
                 }}
                 InputProps={{
                   endAdornment: (
                     <InputAdornment position="end">
                       <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                         {showPassword ? <VisibilityOff /> : <Visibility />}
                       </IconButton>
                     </InputAdornment>
                   ),
                 }}
               />
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="medium"
              sx={{
                width: '50%',
                mx: 'auto',
                display: 'flex',
                py: 1,
                fontWeight: 600,
                fontSize: '0.875rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)',
                boxShadow: '0 4px 16px rgba(46, 125, 50, 0.3)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1b5e20 0%, #1b5e20 50%, #2e7d32 100%)',
                  boxShadow: '0 6px 24px rgba(46, 125, 50, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
              }}
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Select your role and enter your credentials to login
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
