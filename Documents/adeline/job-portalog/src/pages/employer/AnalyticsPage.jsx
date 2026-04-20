import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import {
  PostingTrendsChart,
  IndustryPieChart,
  ApplicantVolumeChart,
  SuccessRateChart,
} from "../../components/Charts/Charts";

const AnalyticsPage = () => (
  <Box>
    <Typography variant="h5" mb={0.5}>Analytics</Typography>
    <Typography color="text.secondary" fontSize={14} mb={3}>
      Recruitment insights and performance metrics
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}  md={6} lg={6}   xl={6} sx={{width:{md:'47%',xs:'100%',sm:'47%',lg:'47%',xl:'47%'}}}><PostingTrendsChart /></Grid>
      <Grid item xs={12} sm={6}  md={6} lg={6}   xl={6} sx={{width:{md:'47%',xs:'100%',sm:'47%',lg:'47%',xl:'47%'}}}><IndustryPieChart /></Grid>
      <Grid item xs={12} sm={12} md={12} lg={6} xl={6} sx={{width:{md:'47%',xs:'100%',sm:'47%',lg:'47%',xl:'47%'}}}><ApplicantVolumeChart /></Grid>
      <Grid item xs={12} sm={12} md={12} lg={6} xl={6} sx={{width:{md:'47%',xs:'100%',sm:'47%',lg:'47%',xl:'47%'}}}><SuccessRateChart /></Grid>
    </Grid>
  </Box>
);

export default AnalyticsPage;