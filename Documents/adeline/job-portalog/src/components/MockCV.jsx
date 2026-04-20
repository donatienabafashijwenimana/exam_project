import React from "react";
import {
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Person,
  Phone,
  Email,
  Work,
  School,
  Star,
  Code,
  Language,
} from "@mui/icons-material";

const MockCV = ({ applicant }) => {
  const mockExperience = [
    "Frontend Developer at TechCorp Rwanda (2022-Present)",
    "Junior React Developer at Startup Rwanda (2020-2022)",
    "Intern at Digital Solutions Ltd (2019)",
  ];

  const mockEducation = [
    "Bachelor of Science in Computer Science - University of Rwanda (2016-2020)",
    "High School Diploma - Excellence High School (2016)",
  ];

  const mockSkills = applicant.skills || ["React", "JavaScript", "CSS", "Git"];

  return (
    <Paper sx={{ p: 3, maxHeight: 600, overflow: "auto" }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {applicant.name}
        </Typography>
        <Chip icon={<Phone />} label={applicant.phone || "+250 788 XXX XXX"} size="small" />
        <Chip icon={<Email />} label={applicant.email} size="small" />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" fontWeight="bold" mb={2}>Professional Summary</Typography>
      <Typography mb={3}>
        Passionate {mockSkills[0]} developer with {mockExperience.length > 1 ? "3+" : "1+"} years of experience in modern web development.
        Proven track record in delivering high-quality React applications.
      </Typography>

      <Typography variant="h6" fontWeight="bold" mb={2}>Experience</Typography>
      <List dense>
        {mockExperience.slice(0, 3).map((exp, i) => (
          <ListItem key={i}>
            <ListItemIcon>
              <Work />
            </ListItemIcon>
            <ListItemText primary={exp} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>Education</Typography>
      <List dense>
        {mockEducation.slice(0, 2).map((edu, i) => (
          <ListItem key={i}>
            <ListItemIcon>
              <School />
            </ListItemIcon>
            <ListItemText primary={edu} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>Skills</Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {mockSkills.map((skill, i) => (
          <Chip key={i} label={skill} icon={<Code />} size="small" color="primary" variant="outlined" />
        ))}
      </Box>

      <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>Languages</Typography>
      <Box display="flex" gap={2}>
        <Chip label="English - Fluent" icon={<Language />} />
        <Chip label="Kinyarwanda - Native" />
      </Box>

      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary" align="center">
        Generated CV Preview for {applicant.name}
      </Typography>
    </Paper>
  );
};

export default MockCV;

