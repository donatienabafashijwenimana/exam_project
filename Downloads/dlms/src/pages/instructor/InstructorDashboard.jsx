import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Grid, Typography, Chip, Avatar, Button, Stack } from '@mui/material';
import { Assignment, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function InstructorDashboard() {
  const { learners, getInstructorLearners } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const myLearners = getInstructorLearners(user?.id) || [];
  const pending = myLearners.filter(l => l.hoursCompleted < l.totalHours);
  const completed = myLearners.filter(l => l.hoursCompleted >= l.totalHours);

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={800}>
          Welcome, {user?.name} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">{user?.badge}</Typography>
      </Box>

      <Grid container spacing={2.5} mb={3}>
        {[
          { label: 'My Learners', value: myLearners.length, icon: <Assignment />, color: '#0d2b5e', onClick: () => navigate('/instructor/assigned') },
          { label: 'Incomplete Training', value: pending.length, icon: <HourglassEmpty />, color: '#e65100' },
          { label: 'Training Completed', value: completed.length, icon: <CheckCircle />, color: '#1a6b3c' },
        ].map(item => (
          <Grid item xs={12} sm={4} key={item.label}>
            <Card sx={{ cursor: item.onClick ? 'pointer' : 'default' }} onClick={item.onClick}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                    <Typography variant="h4" fontWeight={800}>{item.value}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${item.color}18`, color: item.color, width: 44, height: 44 }}>{item.icon}</Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={700}>My Learners</Typography>
            <Button size="small" onClick={() => navigate('/instructor/update_progress')} sx={{ color: '#0d2b5e' }}>Update Progress →</Button>
          </Box>
          {myLearners.length === 0 ? (
            <Typography color="text.secondary">No learners assigned yet.</Typography>
          ) : (
            myLearners.map(learner => (
              <Box key={learner.id} display="flex" alignItems="center" gap={2} py={1.5} borderBottom="1px solid" borderColor="divider">
                <Avatar sx={{ bgcolor: '#0d2b5e' }}>{learner.name[0]}</Avatar>
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={600}>{learner.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Category {learner.category} • {learner.performance}% • {learner.hoursCompleted}/{learner.totalHours} hrs
                  </Typography>
                </Box>
                <Chip label={learner.hoursCompleted >= learner.totalHours ? 'Complete' : 'In Progress'} 
                  color={learner.hoursCompleted >= learner.totalHours ? 'success' : 'warning'} size="small" />
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

