import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
} from "@mui/material";
import {
  Search,
  Assignment,
  CheckCircle,
  HourglassEmpty,
} from "@mui/icons-material";
import { useApp } from "../../context/AppContext";
import {
  PostingTrendsChart,
  IndustryPieChart,
} from "../../components/Charts/Charts";

const StatCard = ({ icon, label, value, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: 3,
      border: `1px solid ${color}30`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      minHeight: 110,
    }}
  >
    <Box display="flex" justifyContent="space-between">
      <Box
        sx={{
          bgcolor: `${color}15`,
          color,
          p: 1,
          borderRadius: 2,
        }}
      >
        {icon}
      </Box>

      <Typography fontSize={12} color="text.secondary">
        {label}
      </Typography>
    </Box>

    <Typography
      fontSize="1.9rem"
      fontWeight={800}
      mt={1}
      color={color}
    >
      {value}
    </Typography>
  </Paper>
);

const ChartCard = ({ title, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: 4,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      border: "1px solid rgba(0,0,0,0.05)",
    }}
  >
    <Typography fontWeight={700} mb={1}>
      {title}
    </Typography>

    <Box sx={{ flex: 1, minHeight: 380 }}>
      {children}
    </Box>
  </Paper>
);

const ApplicantDashboard = () => {
  const { currentUser, applicants = [], jobs = [] } = useApp();

  const myApplications = useMemo(() => {
    if (!currentUser?.email) return [];
    return applicants.filter((a) => a.email === currentUser.email);
  }, [applicants, currentUser]);

  const statusCounts = useMemo(() => {
    return myApplications.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});
  }, [myApplications]);

  const stats = [
    {
      icon: <Search />,
      label: "Available Jobs",
      value: jobs.length,
      color: "#0057FF",
    },
    {
      icon: <Assignment />,
      label: "Applied",
      value: myApplications.length,
      color: "#FF6B35",
    },
    {
      icon: <CheckCircle />,
      label: "Shortlisted",
      value: statusCounts["Shortlisted"] || 0,
      color: "#00C896",
    },
    {
      icon: <HourglassEmpty />,
      label: "Under Review",
      value: statusCounts["Under Review"] || 0,
      color: "#FFA502",
    },
  ];

  const statusColorMap = {
    "Under Review": "warning",
    Shortlisted: "info",
    Hired: "success",
    Rejected: "error",
  };

  return (
    <Box>
      <Typography variant="h5" mb={0.5}>
        Hello, {currentUser?.name || "User"}
      </Typography>

      <Typography color="text.secondary" fontSize={14} mb={3}>
        Your job search overview
      </Typography>

      <Grid container spacing={3} mb={3}>
        {stats.map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {myApplications.length > 0 && (
        <Paper sx={{ p: 3, borderRadius: 4, mb: 4 }}>
          <Typography fontWeight={700} mb={2}>
            Recent Applications
          </Typography>

          {myApplications.slice(0, 3).map((a) => (
            <Box
              key={a.id}
              display="flex"
              justifyContent="space-between"
              py={1.5}
              borderBottom="1px solid"
              borderColor="divider"
            >
              <Box>
                <Typography fontWeight={600}>
                  {a.jobTitle}
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  {a.appliedDate}
                </Typography>
              </Box>

              <Chip
                label={a.status}
                size="small"
                color={statusColorMap[a.status] || "default"}
              />
            </Box>
          ))}
        </Paper>
      )}

      <Grid container spacing={3} justifyContent="flex-start">
        {/* Job Posting Trends Card */}
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg="auto"
          sx={{
            minWidth: "300px",
            flexGrow: 1,
          }}
        >
          <ChartCard title="Job Posting Trends">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",    // take full height of the card
                width: "100%",     // take full width
              }}
            >
              <PostingTrendsChart style={{ flex: 1, width: "100%" }} />
            </Box>
          </ChartCard>
        </Grid>

        {/* Industry Distribution Card */}
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg="auto"
          sx={{
            minWidth: "300px",
            flexGrow: 1,
          }}
        >
          <ChartCard title="Industry Distribution">
            <Box
              sx={{
                display: "flex",
                fontSize: 16,
                flexDirection: "column",
                height: "100%",
                width: "100%",
              }}
            >
              <IndustryPieChart style={{ flex: 1, width: "100%" }} />
            </Box>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApplicantDashboard;