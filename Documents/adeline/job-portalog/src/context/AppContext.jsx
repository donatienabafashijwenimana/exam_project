import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { MOCK_USERS, INITIAL_JOBS, INITIAL_APPLICANTS } from "../data/mockData";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const DATA_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
  const [mode, setMode] = useState("light");

  // Save mode on change (load consolidated below)
  useEffect(() => {
    try {
      localStorage.setItem('appMode', mode);
    } catch (e) {
      console.error('Failed to save mode to localStorage:', e);
    }
  }, [mode]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Consolidated load all from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }

        // Load mode
        const savedMode = localStorage.getItem('appMode');
        if (savedMode) {
          setMode(savedMode);
        }

        // Load jobs with expiration check
        const savedJobsData = localStorage.getItem('jobs');
        if (savedJobsData) {
          try {
            const parsed = JSON.parse(savedJobsData);
            if (Date.now() > parsed.expires) {
              console.log('Jobs data expired, resetting to initial');
            } else {
              setJobs(parsed.data);
            }
          } catch (e) {
            console.error('Failed to parse jobs:', e);
          }
        }

        // Load applicants with expiration check
        const savedApplicantsData = localStorage.getItem('applicants');
        if (savedApplicantsData) {
          try {
            const parsed = JSON.parse(savedApplicantsData);
            if (Date.now() > parsed.expires) {
              console.log('Applicants data expired, resetting to initial');
            } else {
              setApplicants(parsed.data);
            }
          } catch (e) {
            console.error('Failed to parse applicants:', e);
          }
        }
      } catch (e) {
        console.error('Failed to load data from localStorage:', e);
        // Reset corrupted data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('jobs');
        localStorage.removeItem('applicants');
        setJobs(INITIAL_JOBS);
        setApplicants(INITIAL_APPLICANTS);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  const [jobs, setJobs] = useState(INITIAL_JOBS);

  // Save jobs on change with expiration
  useEffect(() => {
    try {
      const jobData = { data: jobs, expires: Date.now() + DATA_TTL };
      localStorage.setItem('jobs', JSON.stringify(jobData));
    } catch (e) {
      console.error('Failed to save jobs to localStorage:', e);
    }
  }, [jobs, DATA_TTL]);


  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);

  // Save applicants on change with TTL (symmetric to jobs)
  useEffect(() => {
    try {
      const applicantData = { data: applicants, expires: Date.now() + DATA_TTL };
      localStorage.setItem('applicants', JSON.stringify(applicantData));
    } catch (e) {
      console.error('Failed to save applicants to localStorage:', e);
    }
  }, [applicants, DATA_TTL]);



  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  const login = useCallback((email, password) => {
    // Check localStorage users first (real signups)
    let user = null;
    try {
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      user = localUsers.find((u) => u.email === email && u.password === password);
    } catch (e) {
      console.error('Failed to check local users:', e);
    }

    // Fallback to MOCK_USERS
    if (!user) {
      user = MOCK_USERS.find((u) => u.email === email && u.password === password);
    }

    if (user) {
      setCurrentUser(user);
      try {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } catch (e) {
        console.error('Failed to save user to localStorage:', e);
      }
      return { success: true, role: user.role };
    }
    return { success: false };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }, []);

  const addJob = (job) => {
    const newJob = { ...job, id: Date.now(), posted: new Date().toISOString().split("T")[0] };
    setJobs((prev) => [...prev, newJob]);
  };

  const updateJob = (id, updates) => setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates } : j)));
  const deleteJob = (id) => setJobs((prev) => prev.filter((j) => j.id !== id));

  const addApplicant = (applicant) => {
    const newApp = { ...applicant, id: Date.now(), appliedDate: new Date().toISOString().split("T")[0], status: "Under Review" };
    setApplicants((prev) => [...prev, newApp]);
  };

  const updateApplicantStatus = (id, status) =>
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const updateApplicant = (id, updates) =>
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));

  const getMyJobs = () => jobs.filter((j) => j.employerId === currentUser?.id);
  const getMyApplicants = () => applicants.filter((a) => {
    const job = jobs.find(j => j.id === a.jobId);
    return job && job.employerId === currentUser?.id;
  });

  const theme = useMemo(

    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#0057FF" },
          secondary: { main: "#FF6B35" },
          background: {
            default: mode === "dark" ? "#0D0D0D" : "#F4F6FB",
            paper: mode === "dark" ? "#1A1A2E" : "#FFFFFF",
          },
        },
        typography: {
          fontFamily: '"Syne", "Inter", sans-serif',
          h4: { fontWeight: 800 },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 700 },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: { textTransform: "none", fontWeight: 700, borderRadius: 8 },
            },
          },
          MuiDataGrid: {
            styleOverrides: {
              root: { border: "none" },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <AppContext.Provider value={{ mode, toggleMode, currentUser, isLoading, login, logout, jobs, addJob, updateJob, deleteJob, applicants, addApplicant, updateApplicantStatus, getMyJobs, getMyApplicants }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
};

