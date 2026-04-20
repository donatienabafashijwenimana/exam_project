import React from "react";
import { NavLink } from "react-router-dom";
import {
  Dashboard, Work, People, BarChart, AddBox,
  Search, Assignment, AccountCircle, LightMode, DarkMode
} from "@mui/icons-material";
import { IconButton, Tooltip, Divider, Typography } from "@mui/material";
import { useApp } from "../../context/AppContext";
import styles from "../../scss/Sidebar.module.scss";

const EMPLOYER_LINKS = [
  { to: "/employer/dashboard", label: "Dashboard", icon: <Dashboard /> },
  { to: "/employer/jobs", label: "Manage Jobs", icon: <Work /> },
  { to: "/employer/add-job", label: "Post New Job", icon: <AddBox /> },
  { to: "/employer/applicants", label: "Applicants", icon: <People /> },
  { to: "/employer/analytics", label: "Analytics", icon: <BarChart /> },
];

const APPLICANT_LINKS = [
  { to: "/applicant/dashboard", label: "Dashboard", icon: <Dashboard /> },
  { to: "/applicant/jobs", label: "Browse Jobs", icon: <Search /> },
  { to: "/applicant/applications", label: "My Applications", icon: <Assignment /> },
  { to: "/applicant/profile", label: "My Profile", icon: <AccountCircle /> },
];

const Sidebar = ({ open, onClose }) => {
  const { currentUser, mode, toggleMode } = useApp();
  const links = currentUser?.role === "employer" ? EMPLOYER_LINKS : APPLICANT_LINKS;

  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <aside
        className={`${styles.sidebar} ${open ? styles["sidebar--open"] : ""}`}
        style={{ backgroundColor: mode === "dark" ? "#1A1A2E" : "#FFFFFF" }}
      >
        <nav className={styles.sidebar__nav}>
          <Typography variant="subtitle1" ml={1}>
            Menu Navigation  
          </Typography>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${styles.sidebar__item} ${isActive ? styles["sidebar__item--active"] : ""}`
              }
              onClick={onClose}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" ml={1}>
            Appearance
          </Typography>

          <div className={styles.sidebar__item} onClick={toggleMode} style={{ cursor: "pointer" }}>
            {mode === "dark" ? <LightMode /> : <DarkMode />}
            {mode === "dark" ? "Light Mode" : "Dark Mode"}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
