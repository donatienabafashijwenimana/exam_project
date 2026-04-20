import { useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  Print as PrintIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { useDataStore } from '../stores/dataStore';
import PieChartCard from '../components/charts/PieChartCard';
import Leaderboard from '../components/charts/Leaderboard';

const PIE_COLORS = ['#7c3aed', '#a855f7', '#c084fc', '#7b1fa2', '#00838f', '#558b2f'];

export default function ResultsPage() {
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
  const votedCount = voters.filter((v) => v.hasVoted).length;
  const turnout = voters.length > 0 ? ((votedCount / voters.length) * 100).toFixed(1) : 0;

  const sortedCandidates = useMemo(
    () => [...candidates].sort((a, b) => b.votes - a.votes),
    [candidates]
  );

  const barData = candidates.map((c) => ({
    name: c.name.split(' ')[0],
    fullName: c.name,
    votes: c.votes,
  }));

  const pieData = candidates
    .map((c) => ({ name: c.name, value: c.votes || 0 }))
    .filter((d) => d.value > 0);

  const turnoutPie = [
    { name: 'Voted', value: votedCount },
    { name: 'Not Voted', value: voters.length - votedCount },
  ];

  const partyData = useMemo(() => {
    const parties = {};
    candidates.forEach((c) => {
      if (!parties[c.party]) parties[c.party] = { name: c.party, votes: 0, candidates: 0 };
      parties[c.party].votes += c.votes;
      parties[c.party].candidates++;
    });
    return Object.values(parties);
  }, [candidates]);

  const positionData = useMemo(() => {
    const positions = {};
    candidates.forEach((c) => {
      if (!positions[c.position]) positions[c.position] = { name: c.position, votes: 0 };
      positions[c.position].votes += c.votes;
    });
    return Object.values(positions);
  }, [candidates]);

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, flex: 1 }}>
            Election Results
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            sx={{ borderRadius: 2 }}
          >
            Print Results
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Real-time results and analytics dashboard
        </Typography>
      </Box>

      {/* Summary Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          { label: 'Total Votes', value: totalVotes, color: '#7c3aed' },
          { label: 'Voters', value: voters.length, color: '#4c1d95' },
          { label: 'Turnout', value: `${turnout}%`, color: '#a855f7' },
          { label: 'Candidates', value: candidates.length, color: '#c084fc' },
        ].map((stat) => (
          <Card key={stat.label} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ textAlign: 'center', py: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts: 2-column with leader */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 2.5,
          mb: 3,
        }}
      >
        {/* Left: Charts */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Top row: Pie + Turnout */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2.5,
            }}
          >
            <PieChartCard
              title="Vote Distribution"
              data={pieData}
              colors={PIE_COLORS}
              height={300}
              outerRadius={100}
            />
            <PieChartCard
              title="Voter Turnout"
              data={turnoutPie}
              colors={['#2e7d32', '#e0e0e0']}
              height={300}
              outerRadius={100}
              showLegend
              labelFormatter={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            />
          </Box>

          {/* Bottom row: Bar + Area */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2.5,
            }}
          >
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Vote Count by Candidate
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip
                      formatter={(value, name, props) => [value, props.payload.fullName]}
                    />
                    <Bar dataKey="votes" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Votes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Votes by Party
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={partyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="votes"
                      stroke="#7c3aed"
                      fill="rgba(124,58,237,0.15)"
                      strokeWidth={2}
                      name="Total Votes"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Right: Leaderboard */}
        <Leaderboard candidates={sortedCandidates} totalVotes={totalVotes} />
      </Box>

      {/* Full-width Line Chart */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Votes by Position
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={positionData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="votes"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={{ r: 5, fill: '#7c3aed' }}
                name="Total Votes"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
