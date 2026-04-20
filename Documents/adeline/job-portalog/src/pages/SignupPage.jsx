import React, { useState } from "react";
import { TextField, Button, Alert, Box, Typography, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import styles from "../scss/Pages.module.scss";

const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const SignupPage = () => {
  const { mode, login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState("applicant");
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!validateEmail(form.email)) errs.email = "Invalid email format";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === form.email)) {
      setErrors({ email: "Account with this email already exists" });
      return;
    }

    const newUser = {
      email: form.email,
      password: form.password,
      role,
      username: form.email.split('@')[0],
      joined: new Date().toISOString()
    };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setSuccess("Account created! Logging you in...");

    setTimeout(() => {
      const result = login(form.email, form.password);
      if (result.success) {
        navigate(result.role === "employer" ? "/employer/dashboard" : "/applicant/dashboard");
      } else {
        navigate("/login");
      }
    }, 1500);
  };

  return (
    <div className={`${styles.login} ${styles.signup}`} style={{ background: mode === "dark" ? "#121212" : "linear-gradient(135deg, #0057FF15 0%, #FF6B3510 100%)" }}>
      <div className={styles.login__card} style={{ background: mode === "dark" ? "#1A1A2E" : "#fff" }}>
        <div className={styles.login__logo}>
          Job<span>Portal</span>
        </div>
        <div className={styles.login__subtitle}>Create your account</div>

        {/* Two Role Options */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Typography variant="body1" style={{ marginBottom: "1rem", fontWeight: 600 }}>
            Sign up as:
          </Typography>
          <RadioGroup
            value={role}
            onChange={(e) => setRole(e.target.value)}
            row
            style={{ justifyContent: "space-around" }}
          >
            <FormControlLabel
              value="applicant"
              control={<Radio />}
              label={
                <Box textAlign="center">
                  <div style={{ fontSize: "1.8rem" }}>👤</div>
                  <Typography variant="body2" style={{ fontWeight: 600 }}>
                    Job Seeker
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="employer"
              control={<Radio />}
              label={
                <Box textAlign="center">
                  <div style={{ fontSize: "1.8rem" }}>🏢</div>
                  <Typography variant="body2" style={{ fontWeight: 600 }}>
                    Employer
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </div>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }}
            error={!!errors.password}
            helperText={errors.password || "At least 6 characters"}
            fullWidth
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: "" }); }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            fullWidth
          />
          <Button variant="contained" size="large" onClick={handleSubmit} fullWidth sx={{ mt: 1 }}>
            Create Account & Login
          </Button>
        </Box>

        <div className={styles.login__hint}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#0057FF", textDecoration: "none", fontWeight: 600 }}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
