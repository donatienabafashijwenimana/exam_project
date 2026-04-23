import React from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { INSTRUCTOR_WORKLOAD, MONTHLY_LESSONS } from '../../data/mockData';

export default function AdminAnalytics() {
  const { learners, instructors, lessons } = useApp();

  const statusDist = [
    { name: 'Pending Assignment', value: learners.filter(l => !l.assignedInstructor).length, fill: '#e65100' },
    { name: 'Assigned', value: learners.filter(l => l.assignedInstructor).length, fill: '#1a6b3c' },
  ];

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={800}>Analytics Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">Lesson system performance metrics</Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>Learner Assignment Status</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusDist} cx="50%" cy="50%" outerRadius={85} dataKey="value">
                    {statusDist.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>Instructor Hours Distribution</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={INSTRUCTOR_WORKLOAD}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="instructor" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#0d2b5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>Monthly Lesson Trends</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={MONTHLY_LESSONS}>
                  <defs>
                    <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0288d1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0288d1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="lessons" stroke="#0288d1" fill="url(#colorLessons)" />
                  <Area type="monotone" dataKey="completed" stroke="#1a6b3c" fillOpacity={0.3} fill="#1a6b3c" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
