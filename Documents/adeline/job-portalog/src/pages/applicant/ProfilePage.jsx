import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Alert, Avatar, Grid, Chip } from "@mui/material";
import { useApp } from "../../context/AppContext";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ProfilePage = () => {
  const { currentUser } = useApp();
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "+250 788 000 000",
    bio: "Passionate frontend developer with 3 years experience in React and modern web technologies.",
    skills: "React, JavaScript, CSS, HTML",
    location: "Kigali, Rwanda",
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!validateEmail(form.email)) errs.email = "Invalid email format";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <Box>
      <Typography variant="h5" mb={3}>My Profile</Typography>
      {saved && <Alert severity="success" sx={{ mb: 2 }}>Profile saved successfully!</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: "center" }}>
            <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 2, bgcolor: "primary.main", fontSize: "2rem", fontWeight: 700 }}>
              {form.name[0]}
            </Avatar>
            <Typography fontWeight={700} fontSize={18}>{form.name}</Typography>
            <Typography fontSize={13} color="text.secondary" mb={2}>{form.email}</Typography>
            <Chip label="Applicant" color="primary" size="small" />
            <Box mt={2}>
              <Typography fontSize={13} fontWeight={600} mb={1}>Skills</Typography>
              <Box display="flex" flexWrap="wrap" gap={0.5} justifyContent="center">
                {skills.map((s) => <Chip key={s} label={s} size="small" variant="outlined" />)}
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography fontWeight={700} mb={2}>Edit Profile</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  error={!!errors.name} helperText={errors.name} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={!!errors.email} helperText={errors.email} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  error={!!errors.phone} helperText={errors.phone} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} multiline rows={3} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Skills (comma separated)" value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  helperText="e.g. React, JavaScript, CSS" fullWidth />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="contained" onClick={handleSave}>Save Profile</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
