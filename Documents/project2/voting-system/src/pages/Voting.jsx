import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import {
  HowToVote,
  CheckCircle,
  Close,
  Visibility,
  Campaign,
} from '@mui/icons-material';
import { useDataStore } from '../stores/dataStore';
import { useAuthStore } from '../stores/authStore';

export default function VotingPage() {
  const candidates = useDataStore((s) => s.candidates);
  const castVote = useDataStore((s) => s.castVote);
  const currentUser = useAuthStore((s) => s.currentUser);
  const markVoted = useAuthStore((s) => s.markVoted);
  const hasUserVotedForPosition = useAuthStore((s) => s.hasUserVotedForPosition);
  const votedPositions = useAuthStore((s) => s.votedPositions);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const userVotes = currentUser ? (votedPositions[currentUser.voterId] || {}) : {};

  const grouped = useMemo(() => {
    const map = {};
    candidates.forEach((c) => {
      if (!map[c.position]) map[c.position] = [];
      map[c.position].push(c);
    });
    return map;
  }, [candidates]);

  const positions = useMemo(() => Object.keys(grouped), [grouped]);

  const allVoted = positions.length > 0 && positions.every((pos) => hasUserVotedForPosition(currentUser?.voterId, pos));

  const handleView = (candidate) => {
    setSelected(candidate);
    setViewOpen(true);
  };

  const handleVoteClick = (candidate) => {
    setSelected(candidate);
    setConfirmOpen(true);
  };

  const handleConfirmVote = () => {
    if (!currentUser || hasUserVotedForPosition(currentUser.voterId, selected.position)) return;
    castVote(selected.id, currentUser.voterId, selected.position);
    markVoted(currentUser.voterId, selected.position, selected.id);
    setConfirmOpen(false);
    setSuccessMessage(`Your vote for ${selected.name} (${selected.position}) has been cast successfully!`);
  };

  return (
    <Box sx={{ bgcolor: '#f0f7f0', minHeight: '100vh', p: 3, borderRadius: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: '#1b5e20' }}>
          Cast Your Vote
        </Typography>
        <Typography variant="body2" sx={{ color: '#2e7d32' }}>
          {allVoted
            ? 'You have voted for all positions. Thank you for participating!'
            : 'Vote for one candidate at each position. Your vote per position is final.'}
        </Typography>
      </Box>

      {/* All Voted Banner */}
      {allVoted && (
        <Alert
          severity="success"
          icon={<CheckCircle />}
          sx={{ mb: 3, borderRadius: 3, fontSize: '1rem', bgcolor: '#c8e6c9', color: '#1b5e20', border: '1px solid #81c784' }}
        >
          You have voted for all positions. Thank you for participating in this election!
        </Alert>
      )}

      {successMessage && !allVoted && (
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: 3, bgcolor: '#c8e6c9', color: '#1b5e20', border: '1px solid #81c784' }}
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}

      {/* Positions grouped */}
      {positions.map((position) => {
        const votedForPosition = hasUserVotedForPosition(currentUser?.voterId, position);
        const positionCandidates = grouped[position];

        return (
          <Box key={position} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                {position}
              </Typography>
              {votedForPosition && (
                <Chip
                  icon={<CheckCircle />}
                  label="Voted"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
            <Divider sx={{ mb: 2, borderColor: '#a5d6a7' }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {positionCandidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    opacity: votedForPosition ? 0.7 : 1,
                    border: userVotes[position] === candidate.id ? '2px solid' : '1px solid',
                    borderColor: userVotes[position] === candidate.id ? '#2e7d32' : '#a5d6a7',
                    bgcolor: userVotes[position] === candidate.id ? '#e8f5e9' : '#ffffff',
                    '&:hover': votedForPosition
                      ? {}
                      : {
                          transform: 'translateY(-4px)',
                          boxShadow: 6,
                          borderColor: '#2e7d32',
                          bgcolor: '#f1f8e9',
                        },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={candidate.photo}
                    alt={candidate.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ pb: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {candidate.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Chip label={candidate.party} size="small" sx={{ bgcolor: '#c8e6c9', color: '#1b5e20', fontWeight: 600 }} />
                      <Chip label={candidate.category} size="small" sx={{ bgcolor: '#dcedc8', color: '#33691e', fontWeight: 600 }} />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      &ldquo;{candidate.campaignMessage}&rdquo;
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 1.5, gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => handleView(candidate)}
                      sx={{ borderRadius: 2, flex: 1, borderColor: '#66bb6a', color: '#2e7d32', '&:hover': { borderColor: '#2e7d32', bgcolor: '#e8f5e9' } }}
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={userVotes[position] === candidate.id ? <CheckCircle /> : <HowToVote />}
                      onClick={() => handleVoteClick(candidate)}
                      disabled={votedForPosition}
                      color={userVotes[position] === candidate.id ? 'success' : 'success'}
                      sx={{ borderRadius: 2, flex: 1, bgcolor: userVotes[position] === candidate.id ? '#1b5e20' : '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
                    >
                      {userVotes[position] === candidate.id ? 'Voted' : 'Vote'}
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
        );
      })}

      {/* View Candidate Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderTop: '4px solid #2e7d32' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#e8f5e9' }}>
          Candidate Profile
          <IconButton onClick={() => setViewOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                src={selected.photo}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {selected.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 1, mb: 2 }}>
                <Chip label={selected.party} sx={{ bgcolor: '#c8e6c9', color: '#1b5e20', fontWeight: 600 }} />
                <Chip label={selected.position} sx={{ bgcolor: '#a5d6a7', color: '#1b5e20', fontWeight: 600 }} />
                <Chip label={selected.category} sx={{ bgcolor: '#dcedc8', color: '#33691e', fontWeight: 600 }} />
              </Box>
              <Box
                sx={{
                  mt: 2,
                  p: 3,
                  borderRadius: 3,
                  bgcolor: '#e8f5e9',
                  border: '1px solid #a5d6a7',
                  textAlign: 'left',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Campaign fontSize="small" sx={{ color: '#2e7d32' }} />
                  <Typography sx={{ fontWeight: 600, color: '#1b5e20' }}>Campaign Message</Typography>
                </Box>
                <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.7 }}>
                  &ldquo;{selected.campaignMessage}&rdquo;
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setViewOpen(false)} variant="outlined" sx={{ borderRadius: 2, borderColor: '#66bb6a', color: '#2e7d32', '&:hover': { borderColor: '#2e7d32', bgcolor: '#e8f5e9' } }}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<HowToVote />}
            onClick={() => {
              setViewOpen(false);
              handleVoteClick(selected);
            }}
            disabled={selected && hasUserVotedForPosition(currentUser?.voterId, selected.position)}
            sx={{ borderRadius: 2, bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
          >
            Vote for this Candidate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vote Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderTop: '4px solid #2e7d32' } }}>
        <DialogTitle sx={{ bgcolor: '#e8f5e9', color: '#1b5e20' }}>Confirm Your Vote</DialogTitle>
        <DialogContent>
          {selected && (
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Avatar
                src={selected.photo}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {selected.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: '#2e7d32' }}>
                {selected.party} - {selected.position}
              </Typography>
              <Alert severity="warning" sx={{ borderRadius: 2, bgcolor: '#fff8e1', border: '1px solid #ffe082' }}>
                You can only vote <strong>once</strong> for the position of <strong>{selected.position}</strong>. This action cannot be undone.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" sx={{ borderRadius: 2, borderColor: '#66bb6a', color: '#2e7d32', '&:hover': { borderColor: '#2e7d32', bgcolor: '#e8f5e9' } }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmVote}
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            sx={{ borderRadius: 2, bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
          >
            Confirm Vote
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
