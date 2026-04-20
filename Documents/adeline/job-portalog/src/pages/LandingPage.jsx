import React from "react";
import { Button, Typography, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import styles from "../scss/Pages.module.scss";

const LandingPage = () => {
  const { mode } = useApp();

  return (
    <div className={styles.login} style={{ background: mode === "dark" ? "#121212" : "linear-gradient(135deg, #0057FF15 0%, #FF6B3510 100%)" }}>
      <Container maxWidth="sm">
        <div className={styles.login__card} style={{ background: mode === "dark" ? "#1A1A2E" : "#fff", maxWidth: "500px" }}>
          <div className={styles.login__logo} style={{ fontSize: "2.5rem" }}>Job<span>Portal</span></div>
          <Typography variant="h5" style={{ fontWeight: 700, marginBottom: "1rem", textAlign: "center" }}>
            Welcome to Rwanda's #1 Job Platform
          </Typography>
          <Typography style={{ textAlign: "center", opacity: 0.7, marginBottom: "2rem", fontSize: "1rem" }}>
            Find your dream job or hire top talent with ease.
          </Typography>
          
          <div style={{ display: "flex", gap: "1rem", flexDirection: "column", alignItems: "center" }}>
            <Button 
              component={Link} to="/login" 
              variant="contained" 
              size="large" 
              fullWidth
              sx={{ fontSize: "1.1rem", py: 1.5 }}
            >
              Sign In
            </Button>
            <Button 
              component={Link} to="/signup" 
              variant="outlined" 
              size="large" 
              fullWidth
              sx={{ fontSize: "1.1rem", py: 1.5 }}
            >
              Create Free Account
            </Button>
          </div>

          
        </div>
      </Container>
    </div>
  );
};

export default LandingPage;

