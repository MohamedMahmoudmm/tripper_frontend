import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Stack, IconButton, FormHelperText, Paper, Chip } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { Delete, CloudUpload, Image as ImageIcon } from "@mui/icons-material";

const PhotosUploader = () => {
  const {
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const photos = watch("photos") || [];
  const oldPhotos = watch("oldPhotos") || [];

  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (Array.isArray(oldPhotos) && oldPhotos.length !== existingPhotos.length) {
      setExistingPhotos(oldPhotos);
    }
  }, [oldPhotos]);

  const handleFileChange = (files) => {
    const validImages = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (validImages.length !== files.length) {
      setError("photos", { message: "Only image files are allowed" });
      return;
    }

    if (validImages.length === 0) {
      setError("photos", { message: "Please upload at least one image" });
      return;
    }

    clearErrors("photos");
    setValue("photos", validImages);

    const previews = validImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleRemoveOldPhoto = (index) => {
    const updated = existingPhotos.filter((_, i) => i !== index);
    setExistingPhotos(updated);
    setValue("oldPhotos", updated);
  };

  const handleRemoveNewPhoto = (index) => {
    const updatedFiles = photos.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setValue("photos", updatedFiles);
    setPreviewUrls(updatedPreviews);

    if (updatedFiles.length === 0 && existingPhotos.length === 0) {
      setError("photos", { message: "Please upload at least one image" });
    }
  };

  const totalPhotos = existingPhotos.length + previewUrls.length;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#222">
            Property Photos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Upload high-quality images to attract more guests
          </Typography>
        </Box>
        {totalPhotos > 0 && (
          <Chip
            icon={<ImageIcon />}
            label={`${totalPhotos} ${totalPhotos === 1 ? 'photo' : 'photos'}`}
            sx={{
              backgroundColor: "#667eea",
              color: "#fff",
              fontWeight: 600,
            }}
          />
        )}
      </Stack>

      {/* Drag & Drop Area */}
      <Paper
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          p: 4,
          mb: 3,
          border: dragActive
            ? "3px dashed #667eea"
            : errors.photos
            ? "2px dashed #FF385C"
            : "2px dashed #E0E0E0",
          borderRadius: 3,
          backgroundColor: dragActive ? "#F0F4FF" : "#FAFAFA",
          textAlign: "center",
          transition: "all 0.3s ease",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#F5F5F5",
            borderColor: "#667eea",
          },
        }}
      >
        <CloudUpload sx={{ fontSize: 48, color: "#667eea", mb: 2 }} />
        <Typography variant="h6" fontWeight="600" mb={1}>
          Drag and drop your images here
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          or
        </Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            borderRadius: 3,
            px: 4,
            py: 1.2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5)",
            },
          }}
        >
          Browse Files
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files)}
          />
        </Button>
        <Typography variant="caption" color="text.secondary" display="block" mt={2}>
          Supported formats: JPG, PNG, WEBP (Max 10MB per file)
        </Typography>
      </Paper>

      {errors.photos && (
        <FormHelperText error sx={{ mb: 2, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 1 }}>
          ⚠️ {errors.photos.message}
        </FormHelperText>
      )}

      {/* Existing Photos */}
      {existingPhotos.length > 0 && (
        <Box mb={3}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Box sx={{ width: 4, height: 20, backgroundColor: "#667eea", borderRadius: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Current Photos
            </Typography>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 2,
            }}
          >
            {existingPhotos.map((url, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  position: "relative",
                  paddingTop: "75%",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "2px solid #E0E0E0",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#667eea",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <img
                  src={url}
                  alt={`existing-${index}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveOldPhoto(index)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(255,255,255,0.95)",
                    color: "#EF5350",
                    "&:hover": {
                      backgroundColor: "#EF5350",
                      color: "#fff",
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
                {index === 0 && (
                  <Chip
                    label="Cover"
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      backgroundColor: "#667eea",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                    }}
                  />
                )}
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {/* New Photos */}
      {previewUrls.length > 0 && (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Box sx={{ width: 4, height: 20, backgroundColor: "#66BB6A", borderRadius: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              New Photos to Upload
            </Typography>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 2,
            }}
          >
            {previewUrls.map((url, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  position: "relative",
                  paddingTop: "75%",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "2px solid #66BB6A",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#4CAF50",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <img
                  src={url}
                  alt={`new-${index}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveNewPhoto(index)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(255,255,255,0.95)",
                    color: "#EF5350",
                    "&:hover": {
                      backgroundColor: "#EF5350",
                      color: "#fff",
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
                <Chip
                  label="New"
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    backgroundColor: "#66BB6A",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  }}
                />
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PhotosUploader;