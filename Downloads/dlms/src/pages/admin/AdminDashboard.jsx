import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, Chip, Button, Avatar } from '@mui/material';
import { People, Schedule, BarChart, TrendingUp } from '@mui/icons-material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { MONTHLY_LESSONS, INSTRUCTOR_WORKLOAD } from '../../data/mockData';

function StatCard({ icon, label, value, color, sub, onClick }) {
  return (
    <Card sx={{ cursor: onClick ? 'pointer' : 'default', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': onClick ? { transform: 'translateY(-3px)', boxShadow: '0 8px 32px rgba(13,43,94,0.18)' } : {} }} onClick={onClick}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" mb={0.5}>{label}</Typography>
            <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Syne", sans-serif' }}>{value}</Typography>
            {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
          </Box>
          <Avatar sx={{ bgcolor: `${color}18`, width: 48, height: 48 }}>
            <Box sx={{ color }}>{icon}</Box>
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { learners, instructors, lessons } = useApp();
  const navigate = useNavigate();

  const stats = {
    learners: learners.length,
    instructors: instructors.length,
    lessons: lessons.length,
    scheduled: lessons.filter(l => l.status === 'scheduled').length,
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Syne", sans-serif' }}>Admin Dashboard</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>Driving Lessons Management System Overview</Typography>
      </Box>

      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<People />} label="Total Learners" value={stats.learners} color="#0d2b5e" onClick={() => navigate('/admin/manage_learners')} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<People />} label="Instructors" value={stats.instructors} color="#0288d1" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<TrendingUp />} label="Lessons" value={stats.lessons} color="#1a6b3c" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<Schedule />} label="Scheduled" value={stats.scheduled} color="#c8a94a" />
        </Grid>
      </Grid>

      <Grid container spacing={2.5} mb={2.5}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>Monthly Lessons Trend</Typography>
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={MONTHLY_LESSONS}>
                  <defs>
                    <linearGradient id="gLessons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d2b5e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0d2b5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a6b3c" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1a6b3c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="lessons" stroke="#0d2b5e" fill="url(#gLessons)" name="Lessons" />
                  <Area type="monotone" dataKey="completed" stroke="#1a6b3c" fill="url(#gCompleted)" name="Completed" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>Instructor Workload</Typography>
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie data={INSTRUCTOR_WORKLOAD} cx="50%" cy="50%" outerRadius={80} dataKey="hours" nameKey="instructor">
                    {INSTRUCTOR_WORKLOAD.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#0d2b5e' : '#0288d1'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={700}>Recent Learners</Typography>
            <Button size="small" onClick={() => navigate('/admin/manage_learners')}>Manage All →</Button>
          </Box>
{learners.slice(0, 5).map(learner => (
            <Box key={learner.id} display="flex" alignItems="center" gap={2} py={1.5} borderBottom="1px solid" borderColor="divider">
              <Avatar sx={{ bgcolor: '#0d2b5e' }}>{learner.learnerName?.[0] || learner.name?.[0] || '?'}</Avatar>
              <Box flex={1}>
                <Typography variant="body2" fontWeight={600}>{learner.learnerName || learner.name || 'Unknown'}</Typography>
                <Typography variant="caption" color="text.secondary">{learner.category} • {learner.performance || 0}% perf.</Typography>
              </Box>
              <Chip label={learner.assignedInstructor ? 'Assigned' : 'Pending'} color={learner.assignedInstructor ? 'success' : 'warning'} size="small" />
            </Box>
          )) || <Typography variant="body2" color="text.secondary">No learners yet</Typography>}
        </CardContent>
      </Card>
    </Box>
  );
}
