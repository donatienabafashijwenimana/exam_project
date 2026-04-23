import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { Schedule } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function LearnerSchedule() {
  const { lessons } = useApp();
  const { user } = useAuth();


  const myLessons = lessons.slice(0, 3);

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={800}>My Lesson Schedule</Typography>
        <Typography variant="body2" color="text.secondary">Upcoming training sessions</Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>Upcoming Lessons ({myLessons.length})</Typography>
          {myLessons.length === 0 ? (
            <Typography color="text.secondary">No lessons scheduled yet. Check back after registration.</Typography>
          ) : myLessons.map(lesson => (
            <Box key={lesson.id} p={2.5} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 1.5 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography fontWeight={600}>{lesson.category} Training</Typography>
                <Chip label={lesson.status} color={lesson.status === 'scheduled' ? 'warning' : 'success'} size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary">{lesson.location} • {lesson.time} ({lesson.duration}h)</Typography>
              <Typography variant="caption">{lesson.date} • {lesson.notes}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

    </Box>
  );
}

