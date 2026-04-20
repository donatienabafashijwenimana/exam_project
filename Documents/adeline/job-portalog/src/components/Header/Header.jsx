import React from "react";
import { IconButton, Tooltip, Avatar, Button } from "@mui/material";
import { DarkMode, LightMode, Logout, Menu as MenuIcon } from "@mui/icons-material";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import styles from "../../scss/Header.module.scss";

const Header = ({ onMenuToggle }) => {
  const { mode, toggleMode, currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={styles.header} style={{ backgroundColor: mode === "dark" ? "#1A1A2EDD" : "#FFFFFFDD" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <IconButton onClick={onMenuToggle} size="small" sx={{ display: { lg: "none" } }}>
          <MenuIcon />
        </IconButton>
        <div className={styles.header__brand}>
          Job<span>Portal</span>
          <span style={{ fontSize: "0.6rem", opacity: 0.5, marginLeft: 6, fontWeight: 400 }}>Rwanda</span>
        </div>
      </div>

      <div className={styles.header__actions}>
        {currentUser && (
          <div className={styles.header__role_badge}>
            {currentUser.role === "employer" ? "🏢 Employer" : "👤 Applicant"}
          </div>
        )}
        <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
          <IconButton onClick={toggleMode} size="small">
            {mode === "dark" ? <LightMode sx={{ color: "#FFC107" }} /> : <DarkMode />}
          </IconButton>
        </Tooltip>
        {currentUser && (
          <>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 14, fontWeight: 700 }}>
              {(currentUser.name || currentUser.username || currentUser.email)[0].toUpperCase()}
            </Avatar>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} size="small">
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
