
import React, { useState } from "react";
import {
  Box, Button, Chip, TextField, MenuItem, Typography, IconButton, Tooltip
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility, Delete, Edit } from "@mui/icons-material";
import { useApp } from "../../context/AppContext";
import { JobDetailDialog, DeleteDialog } from "../../components/Dialogs/Dialogs";
import { useNavigate } from "react-router-dom";
import styles from "../../scss/Pages.module.scss";
const ManageJobsPage = () => {
const { deleteJob } = useApp();
  const jobs = useApp().getMyJobs() || [];
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [viewJob, setViewJob] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = jobs.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || j.type === typeFilter;
    return matchSearch && matchType;
  });

  const columns = [
    { field: "title", headerName: "Job Title", flex: 1.5, minWidth: 160 },
    { field: "company", headerName: "Company", flex: 1, minWidth: 130 },
    {
      field: "salaryMin", headerName: "Salary Range", flex: 1, minWidth: 160,
      renderCell: ({ row }) => `${(row.salaryMin / 1000).toFixed(0)}K – ${(row.salaryMax / 1000).toFixed(0)}K RWF`,
    },
    {
      field: "type", headerName: "Type", width: 110,
      renderCell: ({ value }) => (
        <Chip label={value} size="small"
          color={value === "Full-time" ? "primary" : "warning"} variant="outlined" />
      ),
    },
    { field: "deadline", headerName: "Deadline", width: 120 },
    { field: "industry", headerName: "Industry", width: 130 },
    {
      field: "actions", headerName: "Actions", width: 130, sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="View Details">
            <IconButton size="small" color="primary" onClick={() => setViewJob(row)}><Visibility fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" color="warning" onClick={() => navigate("/employer/add-job", { state: { job: row } })}><Edit fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}><Delete fontSize="small" /></IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
        <Typography variant="h5">Manage Jobs</Typography>
        <Button variant="contained" sx={{ background: 'green' }} onClick={() => navigate("/employer/add-job")}>+ Post New Job</Button>
      </Box>

      <div className={styles.jobs__toolbar}>
        <div className={styles.jobs__filters}>
          <TextField label="Search jobs..." size="small" value={search}
            onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 220 }} />
          <TextField select label="Job Type" size="small" value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)} sx={{ minWidth: 140 }}>
            {["All", "Full-time", "Part-time"].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
        </div>
        <Typography fontSize={13} color="text.secondary">{filtered.length} jobs found</Typography>
      </div>

      <Box sx={{ height: 480, bgcolor: "background.paper", borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,87,255,0.06)" }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Box>

      <JobDetailDialog job={viewJob} open={!!viewJob} onClose={() => setViewJob(null)} isApplicant={false} />
      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteJob(deleteTarget.id); setDeleteTarget(null); }}
        itemName={deleteTarget?.title}
      />
    </Box>
  );
};

export default ManageJobsPage;
