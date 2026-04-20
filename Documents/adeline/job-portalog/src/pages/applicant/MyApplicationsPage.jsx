import React, { useState } from "react";
import { Box, Typography, Paper, Chip, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility } from "@mui/icons-material";
import { useApp } from "../../context/AppContext";
import CVPreview from "../../components/CVPreview";

const STATUS_COLORS = {
  "Under Review": "warning",
  "Shortlisted": "info",
  "Hired": "success",
  "Rejected": "error",
};

const MyApplicationsPage = () => {
  const { applicants = [], currentUser = {} } = useApp();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const mine = applicants.filter((a) => a.email === currentUser?.email);

  const columns = [
    { field: "jobTitle", headerName: "Job Applied", flex: 1.2, minWidth: 160 },
    { field: "appliedDate", headerName: "Date Applied", width: 130 },
    { field: "cvName", headerName: "CV Submitted", flex: 1, minWidth: 140 },
    {
      field: "preview", headerName: "Preview", width: 80, sortable: false,
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
      field: "status", headerName: "Status", width: 140,
      renderCell: ({ value }) => (
        <Chip label={value} size="small" color={STATUS_COLORS[value] || "default"} />
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" mb={2}>My Applications</Typography>

      {mine.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography color="text.secondary">You haven't applied to any jobs yet. Browse jobs to get started!</Typography>
        </Paper>
      ) : (
        <Paper sx={{ height: 460, borderRadius: 2, overflow: "hidden" }}>
          <DataGrid
            rows={mine}
            columns={columns}
            pageSizeOptions={[5, 10]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            sx={{ border: 0 }}
          />
        </Paper>
      )}
      <CVPreview 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        applicant={selectedApplicant}
      />
    </Box>
  );
};

export default MyApplicationsPage;
