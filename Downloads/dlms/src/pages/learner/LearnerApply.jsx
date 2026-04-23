import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, MenuItem, Button,
  Grid, Alert, Chip, Stepper, Step, StepLabel,
} from '@mui/material';
import { CloudUpload as UploadIcon, CheckCircle, PersonAdd } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { LESSON_CATEGORIES, LOCATIONS } from '../../data/mockData';
import { useLayout } from '../../context/LayoutContext';

function validateStep1(form) {
  const e = {};
  if (!form.firstName.trim()) e.firstName = 'Required';
  else if (form.firstName.trim().length < 2) e.firstName = 'Min 2 characters';
  if (!form.lastName.trim()) e.lastName = 'Required';
  else if (form.lastName.trim().length < 2) e.lastName = 'Min 2 characters';
  if (!form.nationalId.trim()) e.nationalId = 'Required';
  else if (!/^\d{16}$/.test(form.nationalId.replace(/\s/g, ''))) e.nationalId = 'Must be 16 digits';
  if (!form.email.trim()) e.email = 'Required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
  if (!form.phone.trim()) e.phone = 'Required';
  else if (!/^\d{10,13}$/.test(form.phone.replace(/\s/g, ''))) e.phone = '10-13 digits';
  return e;
}

function validateStep2(form) {
  const e = {};
  if (!form.category) e.category = 'Required';
  if (!form.preferredLocation) e.preferredLocation = 'Required';
  if (!form.preferredSchedule) e.preferredSchedule = 'Required';
  return e;
}

export default function LearnerApply() {
  const { addLearner } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggleCollapse } = useLayout();

   const [step, setStep] = useState(0);
   const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      nationalId: '',
      email: '',
      phone: '',
      category: '',
      preferredLocation: '',
      preferredSchedule: '',
   });
   const [errors, setErrors] = useState({});
   const [submitted, setSubmitted] = useState(false);
   const f = k => e => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: '' })); };

  const next = () => {
    const errs = step === 0 ? validateStep1(form) : validateStep2(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(s => s + 1);
  };

  const handleSubmit = () => {
    const newLearner = addLearner({
      learnerName: `${form.firstName} ${form.lastName}`,
      nationalId: form.nationalId,
      email: form.email,
      phone: form.phone,
      category: form.category,
      preferredLocation: form.preferredLocation,
      preferredSchedule: form.preferredSchedule,
      hoursCompleted: 0,
      totalHours: 30,
      performance: 0,
      assignedInstructor: null,
      instructorName: null,
    });
    setSubmitted(true);
    console.log('New learner added:', newLearner);
  };

  if (submitted) {
    return (
      <Card sx={{ textAlign: 'center', p: 4 }}>
        <CheckCircle sx={{ fontSize: 64, color: '#1a6b3c', mb: 2 }} />
        <Typography variant="h5" fontWeight={800} mb={1}>Registration Complete!</Typography>
        <Typography color="text.secondary" mb={3}>Your profile has been created. View your progress.</Typography>
        <Button variant="contained" onClick={() => navigate('/learner/progress')}>View Progress</Button>
      </Card>
    );
  }

  const STEPS = ['Personal Details', 'Lesson Preferences'];

  return (
    <Box>
      <Box mb={3}>
<Typography variant="h5" fontWeight={800}>Register for Driving Lessons</Typography>
        <Typography variant="body2" color="text.secondary">Create your profile to start driving lessons</Typography>
      </Box>

      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {STEPS.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {step === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><TextField fullWidth label="First Name *" value={form.firstName} onChange={f('firstName')} error={!!errors.firstName} helperText={errors.firstName} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name *" value={form.lastName} onChange={f('lastName')} error={!!errors.lastName} helperText={errors.lastName} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="National ID *" value={form.nationalId} onChange={f('nationalId')} error={!!errors.nationalId} helperText={errors.nationalId} inputProps={{ maxLength: 16 }} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Email *" type="email" value={form.email} onChange={f('email')} error={!!errors.email} helperText={errors.email} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Phone *" value={form.phone} onChange={f('phone')} error={!!errors.phone} helperText={errors.phone} /></Grid>
            </Grid>
          )}

          {step === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="License Category *" value={form.category} onChange={f('category')} error={!!errors.category}>
                  {LESSON_CATEGORIES.map(c => <MenuItem key={c} value={c}>Category {c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Preferred Location *" value={form.preferredLocation} onChange={f('preferredLocation')} error={!!errors.preferredLocation}>
                  {LOCATIONS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Preferred Schedule (e.g., 'Weekends 10am-12pm')" value={form.preferredSchedule} onChange={f('preferredSchedule')} error={!!errors.preferredSchedule} helperText={errors.preferredSchedule} />
              </Grid>
            </Grid>
          )}

          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button disabled={step === 0} onClick={() => setStep(s => s - 1)}>Back</Button>
            {step < 1 ? (
              <Button variant="contained" onClick={next}>Continue</Button>
            ) : (
              <Button variant="contained" onClick={handleSubmit} startIcon={<PersonAdd />}>Register Now</Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

