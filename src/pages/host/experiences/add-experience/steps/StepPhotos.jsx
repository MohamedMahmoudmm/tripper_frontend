import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  alpha,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Close,
  CloudUpload,
  Delete,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { toast } from "react-hot-toast";

const StepPhotos = () => {
  const {
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  
  const [previewUrls, setPreviewUrls] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]); // Store actual files
  const [touched, setTouched] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setTouched(true);

    // Validation: max 10 photos
    if (photoFiles.length + files.length > 10) {
      setError("photos", {
        type: "manual",
        message: "Maximum 10 photos allowed",
      });
      toast.error("Maximum 10 photos allowed");
      return;
    }

    // Validation: file size (max 5MB per image)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError("photos", {
        type: "manual",
        message: "Some images are too large (max 5MB per image)",
      });
      toast.error("Some images are too large (max 5MB per image)");
      return;
    }

    // Create URLs for preview
    const newUrls = files.map((file) => URL.createObjectURL(file));
    const allUrls = [...previewUrls, ...newUrls];
    
    // Store actual files
    const allFiles = [...photoFiles, ...files];

    setValue("photos", allFiles, { shouldValidate: false }); // Store FILES not URLs
    setPreviewUrls(allUrls);
    setPhotoFiles(allFiles);
    clearErrors("photos");

    e.target.value = "";
  };

  const handleRemovePhoto = (index) => {
    const updatedUrls = previewUrls.filter((_, i) => i !== index);
    const updatedFiles = photoFiles.filter((_, i) => i !== index);
    
    setValue("photos", updatedFiles, { shouldValidate: false }); // Update with FILES
    setPreviewUrls(updatedUrls);
    setPhotoFiles(updatedFiles);
    
    // Only show error if user tried to remove and list became empty
    if (updatedFiles.length === 0 && touched) {
      setError("photos", {
        type: "manual",
        message: "Please upload at least one photo",
      });
    } else {
      clearErrors("photos");
    }
  };

  const handleClearAll = () => {
    setValue("photos", [], { shouldValidate: false });
    setPreviewUrls([]);
    setPhotoFiles([]);
    setTouched(true);
    setError("photos", {
      type: "manual",
      message: "Please upload at least one photo",
    });
  };

  const handleUploadClick = () => {
    setTouched(true);
    fileInputRef.current?.click();
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4} textAlign="center">
        <Typography variant="h4" fontWeight="bold" color="#034959" gutterBottom>
          Upload Photos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add high-quality images to showcase your experience
        </Typography>
      </Box>

      {/* Upload Area */}
      <Box
        sx={{
          border: `2px dashed ${
            touched && errors.photos ? "#d32f2f" : "#e0e0e0"
          }`,
          borderRadius: 3,
          p: 4,
          mb: 3,
          backgroundColor: alpha("#034959", 0.02),
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: touched && errors.photos ? "#d32f2f" : "#034959",
            backgroundColor: alpha("#034959", 0.05),
          },
        }}
        onClick={handleUploadClick}
      >
        <CloudUpload sx={{ fontSize: 60, color: "#034959", mb: 2 }} />
        <Typography variant="h6" fontWeight="bold" color="#034959" gutterBottom>
          Click to upload or drag and drop
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          PNG, JPG, JPEG (Max 5MB per image)
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
        >
          <Chip
            label={`${previewUrls.length}/5 photos`}
            color={previewUrls.length > 0 ? "primary" : "default"}
            size="small"
          />
        </Stack>

        <input
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </Box>

      {/* Validation Error - Only show if touched */}
      {touched && errors.photos && (
        <Typography
          variant="body2"
          color="error"
          sx={{
            mb: 3,
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {errors.photos.message}
        </Typography>
      )}

      {/* Action Buttons */}
      {previewUrls.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleUploadClick}
            sx={{
              bgcolor: "#034959",
              "&:hover": { bgcolor: "#023342" },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add More Photos
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            sx={{ textTransform: "none", fontWeight: 600 }}
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </Box>
      )}

      {/* Preview Grid */}
      {previewUrls.length > 0 ? (
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#034959"
            mb={2}
            textAlign="center"
          >
            Preview ({previewUrls.length})
          </Typography>

          <Grid container spacing={2}>
            {previewUrls.map((url, idx) => (
              <Grid item xs={6} sm={4} md={3} key={idx}>
                <Box
                  sx={{
                    position: "relative",
                    "&:hover .delete-btn": {
                      opacity: 1,
                    },
                  }}
                >
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={url}
                      alt={`preview-${idx}`}
                      sx={{
                        height: 180,
                        objectFit: "cover",
                      }}
                    />

                    {/* Image Number Badge */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        left: 8,
                        bgcolor: "rgba(0,0,0,0.7)",
                        color: "white",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      #{idx + 1}
                    </Box>

                    {/* Cover Badge */}
                    {idx === 0 && (
                      <Chip
                        label="Cover"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          bgcolor: "rgba(3, 73, 89, 0.9)",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    )}
                  </Card>

                  {/* Delete Button */}
                  <IconButton
                    className="delete-btn"
                    size="small"
                    onClick={() => handleRemovePhoto(idx)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(255,255,255,0.95)",
                      color: "#d32f2f",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      boxShadow: 2,
                      "&:hover": {
                        bgcolor: "#ffe5e5",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 3,
            backgroundColor: alpha("#e0e0e0", 0.2),
            borderRadius: 3,
          }}
        >
          <ImageIcon sx={{ fontSize: 80, color: "#bdbdbd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No photos yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click the upload area above to add your first photo
          </Typography>
        </Box>
      )}

      {/* Tips Section */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          backgroundColor: alpha("#034959", 0.05),
          borderRadius: 2,
          borderLeft: "4px solid #034959",
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          color="#034959"
          gutterBottom
        >
          📸 Photo Tips
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              ✓ Use high-resolution images
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              ✓ Show different angles & moments
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              ✓ First photo is your cover image
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default StepPhotos;