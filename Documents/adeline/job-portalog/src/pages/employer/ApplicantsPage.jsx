import React, { useState } from "react";
import CVPreview from "../../components/CVPreview";
import { Visibility } from "@mui/icons-material";
import {
  Box, Typography, TextField, MenuItem, Chip, IconButton, Tooltip, Paper
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CheckCircle, Cancel, HourglassEmpty, Star } from "@mui/icons-material";
import { useApp } from "../../context/AppContext";

const STATUS_OPTIONS = ["All", "Under Review", "Shortlisted", "Hired", "Rejected"];
const STATUS_COLORS = {
  "Under Review": "warning",
  "Shortlisted": "info",
  "Hired": "success",
  "Rejected": "error",
};

const ApplicantsPage = () => {
const { updateApplicantStatus } = useApp();
  const applicants = useApp().getMyApplicants() || [];

  const [search, setSearch] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("");

  const filtered = applicants.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    const matchSkill =
      !skillFilter ||
      (a.skills && a.skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase())));
    return matchSearch && matchStatus && matchSkill;
  });

  const columns = [
    { field: "name", headerName: "Applicant", flex: 1, minWidth: 140 },
    { field: "email", headerName: "Email", flex: 1.2, minWidth: 180 },
    { field: "jobTitle", headerName: "Applied For", flex: 1, minWidth: 160 },
    { field: "appliedDate", headerName: "Applied", width: 110 },
    {
      field: "skills", headerName: "Skills", flex: 1.2, minWidth: 180, sortable: false,
      renderCell: ({ value }) => (
        <Box display="flex" gap={0.5} flexWrap="wrap" py={0.5}>
          {(value || []).map((s) => <Chip key={s} label={s} size="small" variant="outlined" />)}
        </Box>
      ),
    },
    {
      field: "status", headerName: "Status", width: 140,
      renderCell: ({ value }) => (
        <Chip label={value} size="small" color={STATUS_COLORS[value] || "default"} />
      ),
    },
    {
      field: "cv", headerName: "CV", width: 80, sortable: false,
      renderCell: ({ row }) => (
        <Tooltip title="Preview CV">
          <IconButton 
            size="small" 
            onClick={() => {
              setSelectedApplicant(row);
              setPreviewOpen(true);
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "actions", headerName: "Update Status", width: 160, sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="Shortlist">
            <IconButton size="small" color="info" onClick={() => updateApplicantStatus(row.id, "Shortlisted")}>
              <Star fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hire">
            <IconButton size="small" color="success" onClick={() => updateApplicantStatus(row.id, "Hired")}>
              <CheckCircle fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton size="small" color="error" onClick={() => updateApplicantStatus(row.id, "Rejected")}>
              <Cancel fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Under Review">
            <IconButton size="small" color="warning" onClick={() => updateApplicantStatus(row.id, "Under Review")}>
              <HourglassEmpty fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" mb={2}>Applicants</Typography>
      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <TextField label="Search name / email" size="small" value={search}
          onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 200 }} />
        <TextField select label="Status" size="small" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 150 }}>
          {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField label="Filter by skill" size="small" value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)} sx={{ minWidth: 160 }} />
      </Box>
      <Typography fontSize={13} color="text.secondary" mb={1}>{filtered.length} applicant(s)</Typography>
      <Paper sx={{ height: 520, borderRadius: 2, overflow: "hidden" }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          getRowHeight={() => "auto"}
          sx={{ border: 0, "& .MuiDataGrid-cell": { py: 1 } }}
        />
      </Paper>
      <CVPreview 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        applicant={selectedApplicant}
      />
    </Box>
  );
};

export default ApplicantsPage;
