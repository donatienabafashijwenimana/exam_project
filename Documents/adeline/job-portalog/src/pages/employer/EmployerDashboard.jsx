import React from "react";
import { Grid, Box, Typography, Paper, useTheme } from "@mui/material";
import { Work, People, TrendingUp, CheckCircle } from "@mui/icons-material";
import { useApp } from "../../context/AppContext";
import { PostingTrendsChart, IndustryPieChart, ApplicantVolumeChart, SuccessRateChart } from "../../components/Charts/Charts";
import styles from "../../scss/Pages.module.scss";

const StatCard = ({ icon, label, value, color }) => {
  const theme = useTheme();
  return (
    <Paper className={styles.dashboard__stat_card} sx={{ bgcolor: `${color}15`, color ,padding:5}}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        {icon}
        <Typography fontSize={13} fontWeight={600} sx={{ opacity: 0.75 }}>{label}</Typography>
      </Box>
      <div className={styles.dashboard__stat_num}>{value}</div>
    </Paper>
  );
};

const EmployerDashboard = () => {
const { currentUser } = useApp();
  const myJobs = useApp().getMyJobs() || [];
  const myApplicants = useApp().getMyApplicants() || [];

  const stats = [
    { icon: <Work />, label: "Active Jobs", value: myJobs.length, color: "#0057FF" },
    { icon: <People />, label: "Total Applicants", value: myApplicants.length, color: "#ffa135" },
    { icon: <CheckCircle />, label: "Shortlisted", value: myApplicants.filter((a) => a.status === "Shortlisted").length, color: "#00C896" },
    { icon: <TrendingUp />, label: "Hired", value: myApplicants.filter((a) => a.status === "Hired").length, color: "#9C27B0" },
  ];

  return (
    <Box>
      <Typography variant="h5" mb={0.5}>Welcome back, {currentUser?.name}</Typography>
      <Typography color="text.secondary" fontSize={14} mb={3}>Here's your recruitment overview</Typography>

      <div  className={styles.dashboard__stats}>
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className={styles.dashboard__charts}>
        <PostingTrendsChart />
        <IndustryPieChart />
        <ApplicantVolumeChart />
        <SuccessRateChart />
      </div>
    </Box>
  );
};

export default EmployerDashboard;
