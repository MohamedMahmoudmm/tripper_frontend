import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  alpha,
  Stack,
  InputAdornment,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Add,
  CloudUpload,
  Delete,
  Image as ImageIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  Close,
} from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { toast } from "react-hot-toast";

const StepActivities = () => {
  const { setValue } = useFormContext();

  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // Error states
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    image: "",
  });

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      image: "",
    };

    if (!title.trim() || title.length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }
    if (!description.trim() || description.length < 5) {
      newErrors.description = "Description must be at least 5 characters";
    }
    if (!image) {
      newErrors.image = "Please upload an image";
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.description && !newErrors.image;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image must be less than 5MB" }));
        return;
      }
      
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };

  const handleAddActivity = () => {
    if (!validateForm()) return;

    const newActivity = { title, description, image };
    const updatedActivities = [...activities, newActivity];
    
    setActivities(updatedActivities);
    setValue("activities", updatedActivities);

    // Reset form
    setTitle("");
    setDescription("");
    setImage(null);
    setPreview(null);
    setErrors({ title: "", description: "", image: "" });
    
    toast.success("Activity added successfully!");
  };

  const handleDeleteActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
    setValue("activities", updatedActivities);
    toast.success("Activity removed");
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      backgroundColor: alpha("#034959", 0.02),
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: alpha("#034959", 0.04),
      },
      "&.Mui-focused": {
        backgroundColor: "#fff",
        "& fieldset": {
          borderColor: "#034959",
          borderWidth: 2,
        },
      },
    },
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4} textAlign="center">
        <Typography variant="h4" fontWeight="bold" color="#034959" gutterBottom>
          Activities
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add activities that are included in your experience
        </Typography>
      </Box>

      {/* Add Activity Form */}
      <Box
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: alpha("#034959", 0.02),
          borderRadius: 3,
          border: `2px solid ${alpha("#034959", 0.1)}`,
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="#034959" mb={3}>
          Add New Activity
        </Typography>

        <Stack spacing={3}>
          {/* Title */}
          <TextField
            label="Activity Title"
            fullWidth
            placeholder="e.g., Camel Riding"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors(prev => ({ ...prev, title: "" }));
            }}
            error={!!errors.title}
            helperText={errors.title}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon sx={{ color: "#034959" }} />
                </InputAdornment>
              ),
            }}
            sx={inputStyle}
          />

          {/* Description */}
          <TextField
            label="Activity Description"
            fullWidth
            multiline
            rows={4}
            placeholder="Describe what guests will do in this activity..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors(prev => ({ ...prev, description: "" }));
            }}
            error={!!errors.description}
            helperText={errors.description}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 2 }}>
                  <DescriptionIcon sx={{ color: "#034959" }} />
                </InputAdornment>
              ),
            }}
            sx={inputStyle}
          />

          {/* Image Upload */}
          <Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUpload />}
              sx={{
                py: 1.5,
                borderColor: errors.image ? "#d32f2f" : "#034959",
                color: errors.image ? "#d32f2f" : "#034959",
                borderWidth: 2,
                borderStyle: "dashed",
                borderRadius: 3,
                fontWeight: 600,
                "&:hover": {
                  borderColor: errors.image ? "#d32f2f" : "#023342",
                  backgroundColor: alpha("#034959", 0.05),
                },
              }}
            >
              {image ? "Change Image" : "Upload Activity Image"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            
            {errors.image && (
              <Typography variant="body2" color="error" sx={{ mt: 1, ml: 2 }}>
                {errors.image}
              </Typography>
            )}

            {preview && (
              <Box sx={{ mt: 2, position: "relative" }}>
                <Card elevation={2} sx={{ borderRadius: 3 }}>
                  <CardMedia
                    component="img"
                    image={preview}
                    alt="preview"
                    sx={{ height: 200, objectFit: "cover" }}
                  />
                </Card>
                <IconButton
                  size="small"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(255,255,255,0.95)",
                    color: "#d32f2f",
                    "&:hover": {
                      bgcolor: "#ffe5e5",
                    },
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Add Button */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddActivity}
            sx={{
              py: 1.5,
              bgcolor: "#034959",
              "&:hover": { bgcolor: "#023342" },
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: 3,
            }}
          >
            Add Activity
          </Button>
        </Stack>
      </Box>

      {/* Activities List */}
      <Box mb={3}>
        <Box display="flex" alignItems="center" mb={2}>
          <Box flex={1} height="2px" bgcolor="#e0e0e0" />
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="#034959"
            px={2}
          >
            ADDED ACTIVITIES ({activities.length})
          </Typography>
          <Box flex={1} height="2px" bgcolor="#e0e0e0" />
        </Box>

        {activities.length === 0 ? (
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
              No activities yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add your first activity using the form above
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {activities.map((activity, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    height: "100%",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  {activity.image && (
                    <CardMedia
                      component="img"
                      image={URL.createObjectURL(activity.image)}
                      alt={activity.title}
                      sx={{ height: 200, objectFit: "cover" }}
                    />
                  )}
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                      <Typography variant="h6" fontWeight="bold" color="#034959">
                        {activity.title}
                      </Typography>
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                          bgcolor: alpha("#034959", 0.1),
                          color: "#034959",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {activity.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteActivity(index)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Tips */}
      <Box
        sx={{
          p: 2.5,
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
          💡 Activity Tips
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              ✓ Be specific and descriptive
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              ✓ Use high-quality images
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              ✓ Highlight unique features
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default StepActivities;