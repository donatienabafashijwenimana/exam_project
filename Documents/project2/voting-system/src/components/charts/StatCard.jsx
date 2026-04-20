import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';

export default function StatCard({ label, value, icon, gradient, color }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            background: gradient || `linear-gradient(135deg, ${color}, ${color}88)`,
            borderRadius: 2.5,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
