import React, { useState } from "react";
import {
  Box, Typography, TextField, MenuItem, Paper, Chip, Button,
  Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, IconButton
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility, CloudUpload, Close, PictureAsPdf } from "@mui/icons-material";
import { useApp } from "../../context/AppContext";
import { JobDetailDialog } from "../../components/Dialogs/Dialogs";
import styles from "../../scss/Pages.module.scss";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["application/pdf"];
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const BrowseJobsPage = () => {
  // Context with safe defaults
  const { jobs = [], addApplicant, currentUser = {}, applicants = [] } = useApp();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [viewJob, setViewJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [cvError, setCvError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    skills: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Check if user already applied
  const alreadyApplied = (jobId) => applicants.some((a) => a.email === currentUser?.email && a.jobId === jobId);

  // Filtered jobs with safe fallback
  const filtered = (jobs || []).filter((j) => {
    const matchSearch =
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || j.type === typeFilter;
    const matchIndustry = industryFilter === "All" || j.industry === industryFilter;
    return matchSearch && matchType && matchIndustry;
  });

  const industries = ["All", ...new Set((jobs || []).map((j) => j.industry))];

  // CV File validation
  const handleFileSelect = (file) => {
    setCvError("");
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setCvError("Only PDF files are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setCvError("File size must be less than 2MB.");
      return;
    }
    setCvFile(file);
  };

  // Form validation
  const validateApplyForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!validateEmail(form.email)) errs.email = "Invalid email format";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!cvFile) errs.cv = "CV/Resume is required";
    return errs;
  };

  const handleApplySubmit = () => {
    const errs = validateApplyForm();
    setFormErrors(errs);
    if (Object.keys(errs).length) return;

    addApplicant({
      name: form.name,
      email: form.email,
      phone: form.phone,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      jobId: applyJob.id,
      jobTitle: applyJob.title,
      cvName: cvFile.name,
    });

    setSubmitted(true);
    setTimeout(() => {
      setApplyJob(null);
      setSubmitted(false);
      setCvFile(null);
      setFormErrors({});
    }, 2000);
  };

  // DataGrid columns
  const columns = [
    { field: "title", headerName: "Job Title", flex: 1.2, minWidth: 160 },
    { field: "company", headerName: "Company", flex: 1, minWidth: 130 },
    {
      field: "salaryMin",
      headerName: "Salary (RWF)",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) =>
        `${(row.salaryMin / 1000).toFixed(0)}K – ${(row.salaryMax / 1000).toFixed(0)}K`,
    },
    {
      field: "type",
      headerName: "Type",
      width: 110,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          color={value === "Full-time" ? "primary" : "warning"}
          variant="outlined"
        />
      ),
    },
    { field: "deadline", headerName: "Deadline", width: 115 },
    {
      field: "actions",
      headerName: "Actions",
      width: 190,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => setViewJob(row)}
          >
            View
          </Button>
          <Button
            size="small"
            variant="contained"
            disabled={alreadyApplied(row.id) || new Date(row.deadline) < new Date()}
            onClick={() => {
              setApplyJob(row);
              setCvFile(null);
              setFormErrors({});
            }}
          >
            {alreadyApplied(row.id)
              ? "Applied"
              : new Date(row.deadline) < new Date()
              ? "Expired"
              : "Apply"}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Browse Jobs
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <TextField
          label="Search..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          select
          label="Type"
          size="small"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          sx={{ minWidth: 130 }}
        >
          {["All", "Full-time", "Part-time"].map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Industry"
          size="small"
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          {industries.map((i) => (
            <MenuItem key={i} value={i}>
              {i}
            </MenuItem>
          ))}
        </TextField>
        <Typography fontSize={13} color="text.secondary" alignSelf="center">
          {filtered.length} jobs
        </Typography>
      </Box>

      {/* Job DataGrid */}
      <Paper sx={{ height: 500, borderRadius: 2, overflow: "hidden" }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>

      {/* Job Detail Dialog */}
      <JobDetailDialog
        job={viewJob}
        open={!!viewJob}
        onClose={() => setViewJob(null)}
        isApplicant={true}
        onApply={(job) => {
          setApplyJob(job);
          setViewJob(null);
        }}
      />

      {/* Apply Dialog */}
      <Dialog
        open={!!applyJob}
        onClose={() => setApplyJob(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          Apply for: {applyJob?.title}
          <IconButton onClick={() => setApplyJob(null)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {submitted ? (
            <Alert severity="success">Application submitted successfully! 🎉</Alert>
          ) : (
            <Box display="flex" flexDirection="column" gap={2} pt={1}>
              <TextField
                label="Full Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name}
                fullWidth
              />
              <TextField
                label="Email Address *"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={!!formErrors.email}
                helperText={formErrors.email}
                fullWidth
              />
              <TextField
                label="Phone Number *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                fullWidth
              />
              <TextField
                label="Skills (comma separated)"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="React, JavaScript, CSS"
                fullWidth
              />

              {/* CV Upload */}
              <Box>
                <Typography fontSize={14} fontWeight={600} mb={1}>
                  Upload CV/Resume * (PDF only, max 2MB)
                </Typography>
                <Box
                  className={`${styles.form__upload_zone} ${
                    dragOver ? styles["form__upload_zone--active"] : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFileSelect(e.dataTransfer.files[0]);
                  }}
                  onClick={() => document.getElementById("cv-input").click()}
                >
                  <CloudUpload sx={{ fontSize: 36, color: "primary.main", mb: 1 }} />
                  <Typography fontSize={14} color="text.secondary">
                    Drag & drop or <strong>click to browse</strong>
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    PDF · Max 2MB
                  </Typography>
                  <input
                    id="cv-input"
                    type="file"
                    accept=".pdf"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                </Box>

                {cvError && <Typography className={styles.form__error}>{cvError}</Typography>}
                {formErrors.cv && !cvFile && (
                  <Typography className={styles.form__error}>{formErrors.cv}</Typography>
                )}

                {cvFile && (
                  <Box className={styles.form__preview}>
                    <PictureAsPdf sx={{ color: "error.main", fontSize: 32 }} />
                    <Typography fontSize={13} fontWeight={600}>
                      {cvFile.name}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {(cvFile.size / 1024).toFixed(1)} KB
                    </Typography>
                    <Button size="small" color="error" onClick={() => setCvFile(null)}>
                      Remove
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        {!submitted && (
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setApplyJob(null)} color="inherit">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleApplySubmit}>
              Submit Application
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default BrowseJobsPage;