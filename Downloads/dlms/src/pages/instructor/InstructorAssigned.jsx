import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Chip, Stack, Grid } from '@mui/material';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function InstructorAssigned() {
  const { learners, getInstructorLearners } = useApp();
  const { user } = useAuth();
  const myLearners = getInstructorLearners(user?.id) || [];

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={800}>Assigned Learners</Typography>
        <Typography variant="body2" color="text.secondary">{myLearners.length} learner(s) assigned to you</Typography>
      </Box>
      {myLearners.length === 0 ? (
        <Card><CardContent><Typography color="text.secondary">No learners assigned yet. Wait for admin to assign.</Typography></CardContent></Card>
      ) : (
        <Grid container spacing={2}>
          {myLearners.map(learner => (
            <Grid item xs={12} md={6} key={learner.id}>
              <Card>
                <CardContent>
                  <Box display="flex" gap={2} alignItems="flex-start" mb={2}>
                    <Avatar sx={{ bgcolor: '#0d2b5e', width: 44, height: 44 }}>{learner.name[0]}</Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle1" fontWeight={700}>{learner.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{learner.nationalId}</Typography>
                    </Box>
                    <Chip label={`Cat. ${learner.category}`} color="primary" size="small" />
                  </Box>
                  <Grid container spacing={1}>
                    {[
                      ['Email', learner.email],
                      ['Phone', learner.phone],
                      ['Performance', `${learner.performance}%`],
                      ['Hours', `${learner.hoursCompleted}/${learner.totalHours}`],
                    ].map(([l, v]) => (
                      <Grid item xs={6} key={l}>
                        <Typography variant="caption" color="text.secondary">{l}</Typography>
                        <Typography variant="body2" fontWeight={500}>{v}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                  <Stack direction="row" gap={1} mt={2}>
                    <Chip label={learner.assignedInstructor ? 'Active' : 'Pending'} color="success" size="small" />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

