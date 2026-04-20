import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { CloudDownload } from "@mui/icons-material";

const CVPreview = ({ open, onClose, applicant }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  
  const cvUrl = applicant?.cvName ? `/cv/${applicant.cvName}` : null;

  useEffect(() => {
    setOpenDialog(open);
    setIsLoading(false);
    setPdfError(null);
  }, [open]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setPdfError('Invalid PDF file');
  };

  if (!applicant) {
    return null;
  }

  return (
    <Dialog open={openDialog} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            CV Preview - {applicant?.name || 'Unknown Applicant'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0, height: 600, display: "flex", flexDirection: "column" }}>
        {!cvUrl ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
            p={4}
            textAlign="center"
            color="text.secondary"
          >
            <Typography variant="h6" gutterBottom>
              CV Preview Not Available
            </Typography>
            <Typography variant="body2">
              Filename: {applicant?.cvName || "No CV"}
            </Typography>

            <Typography variant="body2" mt={1}>
              Upload CV for preview.
            </Typography>
          </Box>
        ) : isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography>Loading PDF...</Typography>
          </Box>
        ) : pdfError ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
            p={4}
            textAlign="center"
            color="error.main"
          >
            <Typography variant="h6" gutterBottom>
              Error Loading PDF
            </Typography>
            <Typography variant="body2">{pdfError}</Typography>
            <Typography variant="body2" mt={1}>
              Filename: {applicant?.cvName}
            </Typography>

            <Button 
              variant="outlined" 
              size="small" 
              mt={2} 
              onClick={() => window.open(cvUrl, '_blank')}
            >
              Open Directly
            </Button>
          </Box>
        ) : (
          <Box sx={{ height: "100%", width: "100%" }}>
            <iframe
              src={cvUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              title={`CV ${applicant?.name || 'Applicant'}`}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<CloudDownload />}
              onClick={() => window.open(cvUrl, '_blank')}
              sx={{ mt: 1 }}
            >
              Download CV
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CVPreview;

