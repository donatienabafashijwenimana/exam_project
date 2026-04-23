import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Box, Card, CardContent, Typography, Chip, Grid, LinearProgress } from '@mui/material';

export default function LearnerStatus() {
  const { learners } = useApp();
  const { user } = useAuth();

  const learner = learners.find(l => l.nationalId === user?.nationalId);

  if (!learner) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography color="text.secondary" mb={2}>No training record found</Typography>
          <Typography variant="body2" color="text.secondary">Complete registration first.</Typography>
        </CardContent>
      </Card>
    );
  }

  const progress = Math.min((learner.hoursCompleted / learner.totalHours) * 100, 100);

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={800}>Training Progress</Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>Overall Progress</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <LinearProgress variant="determinate" value={progress} sx={{ width: 120, height: 10, borderRadius: 10 }} />
              <Typography sx={{ position: 'absolute', right: 8, fontWeight: 700, fontSize: '0.75rem' }}>
                {progress.toFixed(0)}%
              </Typography>
            </Box>
            <Typography>{learner.hoursCompleted}/{learner.totalHours} hours</Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>Details</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Category</Typography><Typography>{learner.category}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Performance</Typography><Typography>{learner.performance}%</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Instructor</Typography><Typography>{learner.instructorName || 'Pending'}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Status</Typography><Typography>Active</Typography></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Next Steps</Typography>
              <Chip label="Training in Progress" color="info" />
              <Typography variant="body2" color="text.secondary" mt={1}>Continue scheduled lessons to complete training.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
