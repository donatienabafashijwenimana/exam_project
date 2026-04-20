import { useMemo } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import {
  Print as PrintIcon,
  People,
  HowToVote,
  EmojiEvents,
  TrendingUp,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useDataStore } from '../stores/dataStore';
import StatCard from '../components/charts/StatCard';
import PieChartCard from '../components/charts/PieChartCard';
import Leaderboard from '../components/charts/Leaderboard';

const PIE_COLORS = ['#7c3aed', '#a855f7', '#c084fc', '#7b1fa2', '#00838f', '#558b2f'];

export default function DashboardPage() {
  const candidates = useDataStore((s) => s.candidates);
  const rawVoters = useDataStore((s) => s.voters);

  const voters = useMemo(() => {
    const allPositionNames = [...new Set(candidates.map((c) => c.position))];
    return rawVoters.map((v) => {
      if (!v.votedPositions) return v;
      const isComplete = allPositionNames.every((p) => v.votedPositions[p]);
      return { ...v, hasVoted: isComplete };
    });
  }, [rawVoters, candidates]);

  const totalVotes = useMemo(
    () => candidates.reduce((sum, c) => sum + c.votes, 0),
    [candidates]
  );
  const totalVoters = voters.length;
  const votedCount = voters.filter((v) => v.hasVoted).length;
  const turnout = totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(1) : 0;

  const sortedCandidates = useMemo(
    () => [...candidates].sort((a, b) => b.votes - a.votes),
    [candidates]
  );

  const barData = candidates.map((c) => ({
    name: c.name.split(' ')[0],
    votes: c.votes,
  }));

  const pieData = candidates
    .map((c) => ({ name: c.name, value: c.votes }))
    .filter((d) => d.value > 0);

  const turnoutData = [
    { name: 'Voted', value: votedCount },
    { name: 'Not Voted', value: totalVoters - votedCount },
  ];

  const districtData = useMemo(() => {
    const districts = {};
    voters.forEach((v) => {
      const district = v.pollingDistrict?.split(' - ')[1] || 'Unknown';
      if (!districts[district]) {
        districts[district] = { name: district, total: 0, voted: 0 };
      }
      districts[district].total++;
      if (v.hasVoted) districts[district].voted++;
    });
    return Object.values(districts);
  }, [voters]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Election Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time election results and analytics
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr 1fr',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          label="Total Candidates"
          value={candidates.length}
          icon={<EmojiEvents />}
          gradient="linear-gradient(135deg, #7c3aed, #c084fc)"
        />
        <StatCard
          label="Registered Voters"
          value={totalVoters}
          icon={<People />}
          gradient="linear-gradient(135deg, #4c1d95, #7c3aed)"
        />
        <StatCard
          label="Votes Cast"
          value={totalVotes}
          icon={<HowToVote />}
          gradient="linear-gradient(135deg, #a855f7, #ddd6fe)"
        />
        <StatCard
          label="Voter Turnout"
          value={`${turnout}%`}
          icon={<TrendingUp />}
          gradient="linear-gradient(135deg, #558b2f, #9ccc65)"
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 2.5,
          mb: 3,
        }}
      >

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          <PieChartCard
            title="Vote Distribution"
            data={pieData}
            colors={PIE_COLORS}
            height={320}
            outerRadius={110}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2.5,
            }}
          >

            <Card
              elevation={0}
              sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Votes by Candidate
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <PieChartCard
              title="Voter Turnout"
              data={turnoutData}
              colors={['#2e7d32', '#e0e0e0']}
              height={250}
              outerRadius={85}
              showLegend
              labelFormatter={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            />
          </Box>
        </Box>

        <Leaderboard candidates={sortedCandidates} totalVotes={totalVotes} />
      </Box>

      <Card
        elevation={0}
        sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            District Turnout
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={districtData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#7c3aed"
                strokeWidth={2}
                name="Total"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="voted"
                stroke="#2e7d32"
                strokeWidth={2}
                name="Voted"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

