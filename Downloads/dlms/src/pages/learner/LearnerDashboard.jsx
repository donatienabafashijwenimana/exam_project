import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Avatar, Chip, Button, LinearProgress, CircularProgress, Alert } from '@mui/material';
import { Schedule, Person, Speed, AccessTime } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function LearnerDashboard() {
  const { learners: allLearners, getLearnerLessons } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();


  const learner = allLearners.find(l => l.nationalId === user?.nationalId);

  if (!learner) {
    return (
      <Box>
        <Card sx={{ background: 'linear-gradient(135deg, #0d2b5e, #1a4a9e)', color: '#fff' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Person sx={{ fontSize: 56, color: '#c8a94a' }} />
            <Typography variant="h5" fontWeight={800} mt={2}>Welcome to DLMS</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.8)' }} mb={3}>Register to start your driving lessons journey</Typography>
            <Button variant="contained" onClick={() => navigate('/learner/register')} sx={{ bgcolor: '#c8a94a' }}>
              Get Started
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const lessons = getLearnerLessons(learner.id);
  const progress = Math.min(Number.isFinite(learner.hoursCompleted / learner.totalHours) ? ((learner.hoursCompleted / learner.totalHours) * 100) : 0, 100).toFixed(0);

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={800}>My Learning Portal</Typography>
        <Typography variant="body2" color="text.secondary">{learner.name} — Category {learner.category}</Typography>
      </Box>


      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>Training Progress</Typography>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
          <CircularProgress variant="determinate" value={Number(progress)} size={80} sx={{ color: '#0d2b5e' }} />
            <Box>
              <Typography variant="h4" fontWeight={800}>{progress}%</Typography>
              <Typography color="text.secondary">{learner.hoursCompleted}/{learner.totalHours} hours</Typography>
            </Box>
          </Box>
          <Chip label={`Performance: ${learner.performance}%`} color="success" size="medium" />
          <Typography mt={1} color="text.secondary">Excellent progress! Keep it up 🚀</Typography>
        </CardContent>
      </Card>


      <Grid container spacing={2} mb={3}>
        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Speed sx={{ fontSize: 36, color: '#1a6b3c', mb: 1 }} />
              <Typography variant="h6" fontWeight={700}>{learner.performance}%</Typography>
              <Typography variant="caption" color="text.secondary">Performance Score</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <AccessTime sx={{ fontSize: 36, color: '#0d2b5e', mb: 1 }} />
              <Typography variant="h6">{learner.totalHours - learner.hoursCompleted}</Typography>
              <Typography variant="caption" color="text.secondary">Hours Remaining</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>Upcoming Lessons ({lessons.filter(l => l.status === 'scheduled').length})</Typography>
          {lessons.filter(l => l.status === 'scheduled').length > 0 ? (
            lessons.filter(l => l.status === 'scheduled').slice(0, 3).map(lesson => (
              <Box key={lesson.id} p={2} border="1px solid" borderColor="divider" borderRadius={2} mb={1.5}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography fontWeight={600}>{lesson.category} - {lesson.time}</Typography>
                  <Chip label={lesson.status} color="info" size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">{lesson.location} • {lesson.date}</Typography>
                <Typography variant="caption">{lesson.notes}</Typography>
              </Box>
            ))
          ) : (
            <Alert severity="info">
              No scheduled lessons. Complete registration to get assigned.
            </Alert>
          )}
        </CardContent>
      </Card>

      <Button variant="contained" fullWidth onClick={() => navigate('/learner/schedule')} sx={{ bgcolor: '#0d2b5e' }}>
        View Full Schedule
      </Button>
    </Box>
  );
}
