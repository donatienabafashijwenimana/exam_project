import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  Paper,
} from "@mui/material";
import { useApp } from "../../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { INDUSTRIES } from "../../data/mockData";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const INITIAL_FORM = {
  title: "",
  company: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  type: "",
  industry: "",
  deadline: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  companyDetails: "",
  applicationProcess: "",
  formErrors: {},
};

const AddJobPage = () => {
const { addJob, updateJob, currentUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const editJob = location.state?.job || null;

  const [form, setForm] = useState(INITIAL_FORM);
  const [success, setSuccess] = useState(false);

  // ✅ Load edit data safely
  useEffect(() => {
    if (editJob) {
      setForm((prev) => ({
        ...prev,
        ...editJob,
        responsibilities: editJob.responsibilities?.join("\n") || "",
        requirements: editJob.requirements?.join("\n") || "",
        benefits: editJob.benefits?.join("\n") || "",
      }));
    }
  }, [editJob]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
      formErrors: {
        ...prev.formErrors,
        [field]: "",
      },
    }));
  };

  const validate = () => {
    const errs = {};

    if (!form.title.trim()) errs.title = "Required";
    if (!form.company.trim()) errs.company = "Required";
    if (!form.location.trim()) errs.location = "Required";

    if (!form.salaryMin || Number(form.salaryMin) <= 0)
      errs.salaryMin = "Invalid";

    if (!form.salaryMax || Number(form.salaryMax) <= 0)
      errs.salaryMax = "Invalid";

    if (Number(form.salaryMax) <= Number(form.salaryMin))
      errs.salaryMax = "Must be greater";

    if (!form.type) errs.type = "Required";
    if (!form.industry) errs.industry = "Required";

    if (!form.deadline || new Date(form.deadline) <= new Date())
      errs.deadline = "Invalid";

    if (!form.description.trim()) errs.description = "Required";

    if (!form.responsibilities.trim())
      errs.responsibilities = "Required";

    if (!form.requirements.trim())
      errs.requirements = "Required";

    setForm((prev) => ({
      ...prev,
      formErrors: errs,
    }));

    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) return;

    const jobData = {
      ...form,
      employerId: currentUser?.id,
      company: form.company || currentUser?.name || '',
      salaryMin: Number(form.salaryMin),
      salaryMax: Number(form.salaryMax),
      responsibilities: form.responsibilities.split("\n").filter(Boolean),
      requirements: form.requirements.split("\n").filter(Boolean),
      benefits: form.benefits.split("\n").filter(Boolean),
    };

    editJob ? updateJob(editJob.id, jobData) : addJob(jobData);

    setSuccess(true);
    setTimeout(() => navigate("/employer/jobs"), 1500);
  };

  return (
    <Box>
      <Typography variant="h5">
        {editJob ? "Edit Job" : "Post Job"}
      </Typography>

      {success && <Alert severity="success">Success!</Alert>}

      <Paper sx={{ p: 3, mt: 2 }}>
        <Box display="grid" gap={2} gridTemplateColumns={{ md: "1fr 1fr" }}>

          {/* TITLE */}
          <TextField
            label="Title"
            value={form.title}
            onChange={handleChange("title")}
            error={!!form.formErrors.title}
            helperText={form.formErrors.title}
            fullWidth
          />

          {/* COMPANY */}
          <TextField
            label="Company"
            value={form.company}
            onChange={handleChange("company")}
            error={!!form.formErrors.company}
            helperText={form.formErrors.company}
            fullWidth
          />

          {/* LOCATION */}
          <TextField
            label="Location"
            value={form.location}
            onChange={handleChange("location")}
            error={!!form.formErrors.location}
            helperText={form.formErrors.location}
            fullWidth
          />

          {/* TYPE */}
          <TextField
            label="Type"
            select
            value={form.type}
            onChange={handleChange("type")}
            error={!!form.formErrors.type}
            helperText={form.formErrors.type}
            fullWidth
          >
            {JOB_TYPES.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>

          {/* INDUSTRY */}
          <TextField
            label="Industry"
            select
            value={form.industry}
            onChange={handleChange("industry")}
            error={!!form.formErrors.industry}
            helperText={form.formErrors.industry}
            fullWidth
          >
            {INDUSTRIES.map((i) => (
              <MenuItem key={i} value={i}>{i}</MenuItem>
            ))}
          </TextField>

          {/* SALARY */}
          <TextField
            label="Min Salary"
            type="number"
            value={form.salaryMin}
            onChange={handleChange("salaryMin")}
            error={!!form.formErrors.salaryMin}
            helperText={form.formErrors.salaryMin}
            fullWidth
          />

          <TextField
            label="Max Salary"
            type="number"
            value={form.salaryMax}
            onChange={handleChange("salaryMax")}
            error={!!form.formErrors.salaryMax}
            helperText={form.formErrors.salaryMax}
            fullWidth
          />

          {/* DEADLINE */}
          <TextField
            label="Deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange("deadline")}
            error={!!form.formErrors.deadline}
            helperText={form.formErrors.deadline}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {/* DESCRIPTION */}
          <TextField
            label="Description"
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange("description")}
            error={!!form.formErrors.description}
            helperText={form.formErrors.description}
            fullWidth
          />

          {/* RESPONSIBILITIES */}
          <TextField
            label="Responsibilities"
            multiline
            rows={3}
            value={form.responsibilities}
            onChange={handleChange("responsibilities")}
            error={!!form.formErrors.responsibilities}
            helperText={form.formErrors.responsibilities}
            fullWidth
          />

          {/* REQUIREMENTS */}
          <TextField
            label="Requirements"
            multiline
            rows={3}
            value={form.requirements}
            onChange={handleChange("requirements")}
            error={!!form.formErrors.requirements}
            helperText={form.formErrors.requirements}
            fullWidth
          />

        </Box>

        <Box mt={2}>
          <Button onClick={handleSubmit} variant="contained">
            {editJob ? "Update" : "Submit"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddJobPage;