import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Alert, Chip } from '@mui/material';
import { Add, CalendarToday } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { LOCATIONS, LESSON_CATEGORIES } from '../../data/mockData';

export default function LearnerSchedule() {
  const { lessons, getLearnerLessons, instructors, addLesson } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ date: '', time: '10:00', duration: 2, category: 'B', location: 'Kigali Central', instructorId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const learnerLessons = getLearnerLessons(user.id);
  const availableInstructors = instructors.filter(i => !learnerLessons.some(l => l.instructorId === i.id));

  function validate() {
    const e = {};
    if (!form.date) e.date = 'Required';
    else {
      const selected = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) e.date = 'Cannot be in the past';
    }
    if (!form.time) e.time = 'Required';
    if (!form.instructorId) e.instructorId = 'Required';
    return e;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setError('');

    try {
      await new Promise(r => setTimeout(r, 800));
      const result = addLesson({
        learnerId: user.id,
        instructorId: form.instructorId,
        ...form,
        status: 'pending'
      });
      setSuccess('Schedule request submitted! Awaiting instructor approval.');
      setErrors({});
      setForm({ date: '', time: '10:00', duration: 2, category: 'B', location: 'Kigali Central', instructorId: '' });
    } catch (err) {
      setError('Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Syne", sans-serif' }} mb={1}>Request Lesson Schedule</Typography>
        <Typography color="text.secondary">Submit a lesson request. Available instructors will be notified.</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth label="Preferred Date" type="date"
                      value={form.date}
                      onChange={e => { setForm(p => ({ ...p, date: e.target.value })); setErrors(p => ({ ...p, date: '' })); }}
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.date}
                      helperText={errors.date}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth label="Time" type="time"
                      value={form.time}
                      onChange={e => { setForm(p => ({ ...p, time: e.target.value })); setErrors(p => ({ ...p, time: '' })); }}
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.time}
                      helperText={errors.time}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required error={!!errors.instructorId}>
                      <InputLabel>Instructor</InputLabel>
                      <Select 
                        value={form.instructorId} 
                        label="Instructor"
                        onChange={e => { setForm(p => ({ ...p, instructorId: e.target.value })); setErrors(p => ({ ...p, instructorId: '' })); }}
                      >
                        {availableInstructors.map(i => (
                          <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select value={form.category} label="Category" onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                        {LESSON_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Location</InputLabel>
                      <Select value={form.location} label="Location" onChange={e => setForm(p => ({ ...p, location: e.target.value }))}>
                        {LOCATIONS.map(loc => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      fullWidth variant="contained" 
                      size="large" 
                      startIcon={<Add />}
                      disabled={loading || !form.instructorId || !form.date}
                      sx={{ py: 1.5 }}
                    >
                      {loading ? 'Submitting...' : 'Request Lesson Schedule'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>My Lesson Requests</Typography>
              {learnerLessons.length === 0 ? (
                <Typography color="text.secondary">No requests yet. Submit one above.</Typography>
              ) : (
                learnerLessons.slice(0, 3).map(lesson => (
                  <Box key={lesson.id} py={1.5} borderBottom="1px solid" borderColor="divider">
                    <Typography variant="body2" fontWeight={600}>{lesson.date} {lesson.time}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {lesson.location} • {lesson.status === 'pending' ? 'Pending Approval' : lesson.status}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

