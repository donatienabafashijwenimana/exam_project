import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, Chip, Button, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

function validate(form) {
  const e = {};
  if (!form.score || isNaN(form.score) || +form.score < 0 || +form.score > 100) e.score = 'Score must be 0–100';
  if (!form.comments.trim()) e.comments = 'Required';
  return e;
}

export default function InstructorResults() {
  const { learners, updateLearner, getInstructorLearners } = useApp();
  const { user } = useAuth();
  const myLearners = getInstructorLearners(user?.id) || learners.filter(l => l.assignedInstructor === user?.id);

  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState({ score: '', comments: '' });
  const [errors, setErrors] = useState({});

  const f = k => e => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: '' })); };

  const handleSubmit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    updateLearner(dialog.learner.id, { 
      performance: +form.score, 
      hoursCompleted: Math.min(dialog.learner.hoursCompleted + 1, dialog.learner.totalHours),
      instructorComments: form.comments 
    });
    setDialog(null);
    setForm({ score: '', comments: '' });
  };

  const openDialog = (learner) => {
    setDialog({ learner });
    setForm({ score: '', comments: '' });
    setErrors({});
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={800}>Update Learner Progress</Typography>
        <Typography variant="body2" color="text.secondary">Record session scores and comments</Typography>
      </Box>

      {myLearners.length === 0 ? (
        <Card><CardContent><Typography color="text.secondary">No assigned learners.</Typography></CardContent></Card>
      ) : myLearners.map(learner => (
        <Card key={learner.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ bgcolor: '#0d2b5e' }}>{learner.name[0]}</Avatar>
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight={700}>{learner.name}</Typography>
                <Typography variant="caption" color="text.secondary">{learner.category} · {learner.performance}%</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Current: {learner.performance}% ({learner.hoursCompleted}/{learner.totalHours} hours)
            </Typography>
            <Button variant="contained" onClick={() => openDialog(learner)} startIcon={<Assignment />}>
              Update Session Progress
            </Button>
          </CardContent>
        </Card>
      ))}


      <Dialog open={!!dialog} onClose={() => setDialog(null)} maxWidth="xs">
        <DialogTitle>Update {dialog?.learner?.name} Progress</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField fullWidth label="Session Score (0-100) *" type="number" value={form.score} onChange={f('score')} 
              error={!!errors.score} helperText={errors.score} inputProps={{ min: 0, max: 100 }} />
            <TextField fullWidth multiline rows={3} label="Session Comments *" value={form.comments} onChange={f('comments')} 
              error={!!errors.comments} helperText={errors.comments} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Update Progress</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
