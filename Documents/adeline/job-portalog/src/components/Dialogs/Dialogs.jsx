import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip, Divider, Grid, IconButton
} from "@mui/material";
import {
  Close, LocationOn, AttachMoney, Schedule,
  Business, CheckCircle, ArrowForward
} from "@mui/icons-material";
import { useApp } from "../../context/AppContext";

export const JobDetailDialog = ({ job, open, onClose, onApply, isApplicant }) => {
  const { applicants, currentUser } = useApp();
  if (!job) return null;
  const alreadyApplied = (jobId) => applicants.some((a) => a.email === currentUser?.email && a.jobId === jobId);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", pb: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>{job.title}</Typography>
          <Typography color="text.secondary" fontSize={14}>{job.company} · {job.location}</Typography>
        </Box>
        <IconButton onClick={onClose}><Close /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Meta chips */}
        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          <Chip icon={<AttachMoney />} label={`${(job.salaryMin / 1000).toFixed(0)}K – ${(job.salaryMax / 1000).toFixed(0)}K RWF`} color="primary" variant="outlined" />
          <Chip label={job.type} color={job.type === "Full-time" ? "success" : "warning"} variant="outlined" />
          <Chip icon={<Schedule />} label={`Deadline: ${job.deadline}`} variant="outlined" />
          <Chip label={job.industry} variant="outlined" />
        </Box>

        <Typography variant="body1" mb={2}>{job.description}</Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Responsibilities</Typography>
            {job.responsibilities?.map((r, i) => (
              <Box key={i} display="flex" gap={1} alignItems="flex-start" mb={0.5}>
                <CheckCircle sx={{ fontSize: 16, color: "success.main", mt: 0.3 }} />
                <Typography fontSize={14}>{r}</Typography>
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Requirements</Typography>
            {job.requirements?.map((r, i) => (
              <Box key={i} display="flex" gap={1} alignItems="flex-start" mb={0.5}>
                <ArrowForward sx={{ fontSize: 14, color: "primary.main", mt: 0.4 }} />
                <Typography fontSize={14}>{r}</Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Benefits</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {job.benefits?.map((b, i) => <Chip key={i} label={b} size="small" color="secondary" variant="outlined" />)}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Company</Typography>
            <Typography fontSize={14}>{job.companyDetails}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Application Process</Typography>
        <Typography fontSize={14} color="text.secondary">{job.applicationProcess}</Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Close</Button>
        {isApplicant && (
          <Button disabled={new Date(job.deadline) < new Date() || alreadyApplied(job.id)} variant="contained" onClick={() => { onApply(job); onClose(); }}>
            {alreadyApplied(job.id) ? "Already Applied" : new Date(job.deadline) < new Date() ? "Expired" : "Apply Now"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export const DeleteDialog = ({ open, onClose, onConfirm, itemName }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
    PaperProps={{ sx: { borderRadius: 3 } }}>
    <DialogTitle fontWeight={700}>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete <strong>"{itemName}"</strong>? This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2 }}>
      <Button onClick={onClose} color="inherit">Cancel</Button>
      <Button onClick={onConfirm} variant="contained" color="error">Delete</Button>
    </DialogActions>
  </Dialog>
);
