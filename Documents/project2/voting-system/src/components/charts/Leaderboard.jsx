import { Card, CardContent, Box, Typography, Avatar, Chip } from '@mui/material';

const RANK_COLORS = ['#7c3aed', '#a855f7', '#c084fc', '#7b1fa2', '#00838f'];

export default function Leaderboard({ candidates, totalVotes, showLive = true }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Live Leaderboard
          </Typography>
          {showLive && (
            <Chip
              label="LIVE"
              size="small"
              color="success"
              sx={{ fontSize: '0.6rem', height: 18, fontWeight: 700 }}
            />
          )}
        </Box>

        {candidates.map((candidate, index) => (
          <Box
            key={candidate.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 1.5,
              borderBottom: index < candidates.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              transition: 'background 0.15s ease',
              borderRadius: 1,
              px: 1,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: RANK_COLORS[index] || '#999',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {index + 1}
            </Avatar>
            <Avatar
              src={candidate.photo}
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {candidate.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {candidate.party} - {candidate.position}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: RANK_COLORS[index] || 'text.primary' }}>
                {candidate.votes}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                votes
              </Typography>
            </Box>
            {totalVotes > 0 && (
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  minWidth: 40,
                  textAlign: 'right',
                  color: RANK_COLORS[index] || 'text.secondary',
                }}
              >
                {((candidate.votes / totalVotes) * 100).toFixed(1)}%
              </Typography>
            )}
          </Box>
        ))}

        {candidates.length === 0 && (
          <Typography sx={{ textAlign: 'center', py: 3, opacity: 0.5 }}>
            No candidates yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
