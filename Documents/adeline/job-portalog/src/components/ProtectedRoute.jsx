import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, isLoading } = useApp();
  if (isLoading) {
    return (
      <Box display="flex" justifyContent= "center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  if (!currentUser) return <Navigate to="/" replace />;
  if (requiredRole && currentUser.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
