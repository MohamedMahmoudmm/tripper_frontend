import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Alert,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-hot-toast";
import experienceService from "../../../../../services/experince.service";

const PhotosSection = ({ experience, onUpdate }) => {
  const [images, setImages] = useState(experience.images || []);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    imageUrl: null,
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        toast.error(`${file.name} is not a valid image file`);
      }
      return isImage;
    });

    // Validate file sizes (max 5MB per image)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validSizedFiles = validFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      return true;
    });

    setNewImages(validSizedFiles);
  };

  const handleUpload = async () => {
    if (newImages.length === 0) {
      return toast.error("Please select images to upload");
    }

    const formData = new FormData();
    newImages.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);

      const res = await experienceService.addExperienceImages(
        experience._id,
        formData
      );

      const updatedImages = res.images;
      setImages(updatedImages);
      onUpdate({ ...experience, images: updatedImages });
      setNewImages([]);

      toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} uploaded successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteImage = (imageUrl) => {
    // Prevent deleting the last image
    if (images.length === 1) {
      toast.error("Cannot delete the last image. Experience must have at least one image");
      return;
    }
    setDeleteDialog({ open: true, imageUrl });
  };

  const handleDeleteImage = async () => {
    const imageUrl = deleteDialog.imageUrl;
    try {
      setLoading(true);

      const updatedImages = images.filter((img) => img !== imageUrl);

      const res = await experienceService.updateExperience(experience._id, {
        images: updatedImages,
      });

      setImages(res.images);
      onUpdate(res);
      setDeleteDialog({ open: false, imageUrl: null });

      toast.success("Image removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image");
      setDeleteDialog({ open: false, imageUrl: null });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                bgcolor: "#FF385C",
                p: 1,
                borderRadius: 2,
                mr: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <AddPhotoAlternateIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Typography variant="h5" fontWeight="700" color="#222">
              Experience Photos
            </Typography>
          </Box>
          <Chip
            label={`${images.length} image${images.length !== 1 ? "s" : ""}`}
            size="small"
            sx={{ bgcolor: "#f7f7f7", fontWeight: 600 }}
          />
        </Box>

        {/* Warning for last image */}
        {images.length === 1 && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            This is your last image. You must have at least one image for your experience.
          </Alert>
        )}

        {/* Existing Images */}
        <Grid container spacing={2} mb={4}>
          {images.length > 0 ? (
            images.map((img, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box
                  position="relative"
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      "& .delete-btn": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <img
                    src={img}
                    alt={`experience-${index}`}
                    width="100%"
                    height={160}
                    style={{ objectFit: "cover", display: "block" }}
                  />
                  <IconButton
                    className="delete-btn"
                    color="error"
                    onClick={() => confirmDeleteImage(img)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(255,255,255,0.95)",
                      opacity: 0,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,1)",
                        transform: "scale(1.1)",
                      },
                    }}
                    size="small"
                    disabled={loading}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  border: "2px dashed #e0e0e0",
                  borderRadius: 3,
                  bgcolor: "#fafafa",
                }}
              >
                <AddPhotoAlternateIcon
                  sx={{ fontSize: 64, color: "#ccc", mb: 2 }}
                />
                <Typography color="text.secondary" variant="body1">
                  No images uploaded yet
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Upload New Images */}
        <Box>
          <Typography variant="h6" gutterBottom fontWeight="600" color="#222" mb={2}>
            Add New Photos
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: "#FF385C",
                  color: "#FF385C",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#E31C5F",
                    bgcolor: "rgba(255,56,92,0.04)",
                  },
                }}
              >
                Choose Images
                <input
                  type="file"
                  multiple
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading || newImages.length === 0}
                fullWidth
                sx={{
                  py: 1.5,
                  bgcolor: "#FF385C",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#E31C5F" },
                  "&:disabled": {
                    bgcolor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                    Uploading...
                  </>
                ) : (
                  `Upload ${newImages.length > 0 ? `(${newImages.length})` : ""}`
                )}
              </Button>
            </Grid>
          </Grid>

          {/* Preview New Images */}
          {newImages.length > 0 && (
            <Grid container spacing={2} mt={2}>
              {newImages.map((file, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box
                    sx={{
                      border: "2px dashed #FF385C",
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      width="100%"
                      height={150}
                      style={{ objectFit: "cover", display: "block" }}
                    />
                    <Chip
                      label="New"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: "#FF385C",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveNewImage(index)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(255,255,255,0.95)",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,1)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, imageUrl: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Confirm Image Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this image? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, imageUrl: null })}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#666",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteImage}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PhotosSection;