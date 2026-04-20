import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './stores/themeStore';
import Layout from './components/layout/AppLayout';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import CandidatesPage from './pages/Candidates';
import VotersPage from './pages/Voters';
import VotingPage from './pages/Voting';
import ResultsPage from './pages/Results';
import ProfilePage from './pages/Profile';
import './styles/main.scss';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/voters" element={<VotersPage />} />
            <Route path="/voting" element={<VotingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
