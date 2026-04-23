import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Button, Alert, InputAdornment, IconButton,
  CircularProgress, Box, Typography, useTheme,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, DirectionsCar } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.scss';

const ACCOUNTS = [
  { label: '👮 Admin Officer', email: 'admin@dlms.rw', password: 'admin123' },
  { label: '👨‍🏫 Instructor', email: 'instructor@dlms.rw', password: 'inst123' },
  { label: '👤 Learner', email: 'learner@dlms.rw', password: 'learn123' },
];

const ROLE_HOME = { admin: '/admin/dashboard', instructor: '/instructor/dashboard', learner: '/learner/dashboard' };

export default function Login() {
  const [form, setForm] = useState({ email: 'admin@dlms.rw', password: 'admin123' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.ok) navigate(ROLE_HOME[result.role]);
  };

  const textSx = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(13,43,94,0.2)' },
      '&:hover fieldset': { borderColor: '#0d2b5e' },
      '&.Mui-focused fieldset': { borderColor: '#0d2b5e' },
    },
  };

  return (
    <div className={styles.login}>

      <div className={styles['login__hero']}>
        <div className={styles['login__emblem']}>
          <div className={styles['login__emblem-icon']}>🚗</div>
          <div className={styles['login__emblem-text']}>Driving school Management system<br /></div>
        </div>
        <h1 className={styles['login__hero-title']}>Driving school Management System</h1>
        <p className={styles['login__hero-sub']}>A comprehensive digital platform 
          designed to manage the entire driving license process, including application 
          registration,test scheduling, document verification, and license issuance.</p>
        <div className={styles['login__features']}>
          {['Online driving license application submission', 
          'Secure document upload and verification', 
          'Theory and practical driving test scheduling and management', 
          'Automated digital driving license generation and issuance'].map(f => (
            <div key={f} className={styles['login__feature']}>
              <div className={styles['login__feature-dot']} />
              {f}
            </div>
          ))}
        </div>
      </div>


      <div className={styles['login__form-panel']}>
        <div className={styles['login__form-card']}>
          <Box display="flex" alignItems="center" gap={1.5} mb={1}>
            <DirectionsCar sx={{ color: '#0d2b5e', fontSize: 32 }} />
            <Typography variant="body2" fontWeight={700} color="primary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>DLMS Portal</Typography>
          </Box>
          <Typography variant="h4" fontWeight={800} className={styles['login__form-title']} sx={{ color: 'text.primary' }}>Sign In</Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.secondary">Quick Login:</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {ACCOUNTS.map((acc, i) => (
                <Button 
                  key={i} 
                  size="small" 
                  variant="outlined" 
                  onClick={() => setForm({ email: acc.email, password: acc.password })}
                  sx={{ minWidth: 120 }}
                >
                  {acc.label}
                </Button>
              ))}
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email Address" type="email" value={form.email} required
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              sx={{ mb: 2, ...textSx }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Password" type={showPass ? 'text' : 'password'} value={form.password} required
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              sx={{ mb: 3, ...textSx }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(s => !s)} size="small">{showPass ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
              }}
            />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
              sx={{ py: 1.5, bgcolor: '#0d2b5e', '&:hover': { bgcolor: '#071a3c' }, fontSize: '0.95rem' }}>
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In to Portal'}
            </Button>
          </form>

          <Button 
            fullWidth 
            variant="text" 
            onClick={() => navigate('/register')} 
            sx={{ mt: 2, color: 'primary.main', textTransform: 'none', fontSize: '1rem' }}
          >
            📝 New Student? Register for free
          </Button>
        </div>
      </div>
    </div>
  );
}

