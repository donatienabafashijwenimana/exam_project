import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { LayoutProvider } from './context/LayoutContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';


import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import AdminInstructors from './pages/admin/AdminInstructors';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminSchedule from './pages/admin/AdminSchedule';
import AdminAnalytics from './pages/admin/AdminAnalytics';


import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorAssigned from './pages/instructor/InstructorAssigned';
import InstructorResults from './pages/instructor/InstructorResults';


import LearnerDashboard from './pages/learner/LearnerDashboard';
import LearnerApply from './pages/learner/LearnerApply';
import LearnerStatus from './pages/learner/LearnerStatus';
import LearnerLicense from './pages/learner/LearnerLicense';
import LearnerSchedule from './pages/learner/LearnerSchedule';
import Register from './pages/auth/Register';

import './styles/global.scss';

export default function App() {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem('dlms_theme');
      return saved || 'dark';
    } catch {
      return 'dark';
    }
  });
  const theme = useMemo(() => getTheme(mode), [mode]);
  const toggleTheme = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    try {
      localStorage.setItem('dlms_theme', newMode);
    } catch { }
  };

  useEffect(() => {
    const saved = localStorage.getItem('dlms_theme');
    if (saved) {
      setMode(saved);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppProvider>
          <LayoutProvider>
            <BrowserRouter future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}>
              <Routes>
                <Route path="/login" element={<Login />} />


                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Layout darkMode={mode === 'dark'} onThemeToggle={toggleTheme} /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="manage_learners" element={<AdminApplications />} />
                  <Route path="manage_instructors" element={<AdminInstructors />} />
                  <Route path="manage_vehicles" element={<AdminVehicles />} />
                  <Route path="schedule_lessons" element={<AdminSchedule />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                </Route>


                <Route path="/instructor" element={<ProtectedRoute allowedRoles={['instructor']}><Layout darkMode={mode === 'dark'} onThemeToggle={toggleTheme} /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/instructor/dashboard" replace />} />
                  <Route path="dashboard" element={<InstructorDashboard />} />
                  <Route path="assigned" element={<InstructorAssigned />} />
                  <Route path="my_availability" element={<InstructorDashboard />} />
                  <Route path="update_progress" element={<InstructorResults />} />
                </Route>


                <Route path="/learner" element={<ProtectedRoute allowedRoles={['learner']}><Layout darkMode={mode === 'dark'} onThemeToggle={toggleTheme} /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/learner/dashboard" replace />} />
                  <Route path="dashboard" element={<LearnerDashboard />} />
                  <Route path="progress" element={<LearnerStatus />} />
                  <Route path="schedule" element={<LearnerSchedule />} />

                  <Route path="register" element={<LearnerApply />} />
                  <Route path="register" element={<LearnerApply />} />
                </Route>

                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/register" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </BrowserRouter>
          </LayoutProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
