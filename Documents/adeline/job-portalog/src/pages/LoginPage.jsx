import React, { useState } from "react";
import { TextField, Button, Alert, Box, Typography, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import styles from "../scss/Pages.module.scss";

function LoginPage() {
  const { login, mode } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState("applicant");
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  const handleSubmit = () => {
    if (!form.email || !form.password) {
      setErrors({ email: !form.email ? "Email is required" : "", password: !form.password ? "Password is required" : "" });
      return;
    }

    const result = login(form.email, form.password);
    if (result.success) {
      navigate(result.role === "employer" ? "/employer/dashboard" : "/applicant/dashboard");
    } else {
      setAuthError("Invalid credentials. Try demo below.");
    }
  };

  const hints = {
    applicant: "applicant@demo.com / pass123",
    employer: "employer@demo.com / pass123",
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__card} style={{ background: mode === "dark" ? "#1A1A2E" : "#fff" }}>
        <div className={styles.login__logo}>
          Job<span>Portal</span>
        </div>
        <div className={styles.login__subtitle}>Rwanda's #1 Recruitment Platform</div>

        {/* Role Radio Buttons - like SignupPage */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Typography variant="body1" style={{ marginBottom: "1rem", fontWeight: 600 }}>
            Login as:
          </Typography>
          <RadioGroup
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setErrors({});
              setAuthError("");
            }}
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
                    Applicant
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

        {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            placeholder={hints[role]?.split(" / ")[0]}
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 1 }}
          >
            Login
          </Button>
        </Box>

        <div className={styles.login__hint}>
          New? <a href="/signup" style={{ color: "#0057FF", textDecoration: "none", fontWeight: 600 }}>Create account</a>
        </div>
        <div className={styles.login__hint}>
          Demo: {hints[role]}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

