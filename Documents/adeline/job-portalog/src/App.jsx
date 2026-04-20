import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import "./scss/global.scss";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Employer
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import ManageJobsPage from "./pages/employer/ManageJobsPage";
import AddJobPage from "./pages/employer/AddJobPage";
import ApplicantsPage from "./pages/employer/ApplicantsPage";
import AnalyticsPage from "./pages/employer/AnalyticsPage";

// Applicant
import ApplicantDashboard from "./pages/applicant/ApplicantDashboard";
import BrowseJobsPage from "./pages/applicant/BrowseJobsPage";
import MyApplicationsPage from "./pages/applicant/MyApplicationsPage";
import ProfilePage from "./pages/applicant/ProfilePage";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Employer Routes */}
          <Route path="/employer/*" element={
            <ProtectedRoute requiredRole="employer">
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<EmployerDashboard />} />
                  <Route path="jobs" element={<ManageJobsPage />} />
                  <Route path="add-job" element={<AddJobPage />} />
                  <Route path="applicants" element={<ApplicantsPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          {/* Applicant Routes */}
          <Route path="/applicant/*" element={
            <ProtectedRoute requiredRole="applicant">
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<ApplicantDashboard />} />
                  <Route path="jobs" element={<BrowseJobsPage />} />
                  <Route path="applications" element={<MyApplicationsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
