import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Paper,
  alpha,
  Fade,
  Chip,
  Stack,
} from "@mui/material";
import {
  CheckCircle,
  AttachMoney,
  LocationOn,
  Event,
  Image as ImageIcon,
  CalendarMonth,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import experienceService from "../../../../../services/experince.service";
import { toast } from "react-hot-toast";

const StepReview = ({ experienceId }) => {
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!experienceId) return;

    const fetchExperience = async () => {
      setLoading(true);
      try {
        const data = await experienceService.getExperienceById(experienceId);
        setExperience(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load experience details");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [experienceId]);

  const handleFinish = () => {
    setPublishing(true);
    toast.success("Experience published successfully!");
    setTimeout(() => {
      navigate("/host/listings");
    }, 2000);
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: "#034959", mb: 2 }} size={50} />
        <Typography color="text.secondary">Loading experience details...</Typography>
      </Box>
    );
  }

  if (!experience) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" color="text.secondary">
          No experience data found
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box>
        {/* Header */}
        <Box mb={4} textAlign="center">
          <CheckCircle sx={{ fontSize: 60, color: "#4CAF50", mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" color="#034959" gutterBottom>
            Review Your Experience
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Make sure everything looks perfect before publishing
          </Typography>
        </Box>

        {/* Experience Overview Card */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha("#034959", 0.05)} 0%, ${alpha("#f27244", 0.05)} 100%)`,
            border: `2px solid ${alpha("#034959", 0.1)}`,
          }}
        >
          <Grid container spacing={3}>
            {/* Title & Description */}
            <Grid item xs={12}>
              <Typography variant="h5" fontWeight="bold" color="#034959" gutterBottom>
                {experience.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {experience.description || "No description provided."}
              </Typography>
            </Grid>

            {/* Key Details */}
            <Grid item xs={12}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
                <Chip
                  icon={<AttachMoney />}
                  label={`$${experience.price} per person`}
                  sx={{
                    bgcolor: alpha("#4CAF50", 0.1),
                    color: "#4CAF50",
                    fontWeight: "bold",
                    py: 2.5,
                    fontSize: "0.95rem",
                  }}
                />
                <Chip
                  icon={<LocationOn />}
                  label={`${experience.address?.city}, ${experience.address?.country}`}
                  sx={{
                    bgcolor: alpha("#034959", 0.1),
                    color: "#034959",
                    fontWeight: "bold",
                    py: 2.5,
                    fontSize: "0.95rem",
                  }}
                />
                <Chip
                  icon={<Event />}
                  label={`${experience.dates?.length || 0} available dates`}
                  sx={{
                    bgcolor: alpha("#f27244", 0.1),
                    color: "#f27244",
                    fontWeight: "bold",
                    py: 2.5,
                    fontSize: "0.95rem",
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Photos Section */}
        {experience.images?.length > 0 && (
          <Box mb={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <ImageIcon sx={{ color: "#034959", mr: 1 }} />
              <Typography variant="h6" fontWeight="bold" color="#034959">
                Photos ({experience.images.length})
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {experience.images.map((img, i) => (
                <Grid item xs={6} sm={4} md={3} key={i}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={img}
                      alt={`photo-${i}`}
                      sx={{ height: 180, objectFit: "cover" }}
                    />
                    {i === 0 && (
                      <Chip
                        label="Cover"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          bgcolor: "rgba(0,0,0,0.7)",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Activities Section */}
        {experience.activities?.length > 0 && (
          <Box mb={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <Event sx={{ color: "#034959", mr: 1 }} />
              <Typography variant="h6" fontWeight="bold" color="#034959">
                Activities ({experience.activities.length})
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {experience.activities.map((activity) => (
                <Grid item xs={12} sm={6} md={4} key={activity._id}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      height: "100%",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "translateY(-4px)" },
                    }}
                  >
                    {activity.image && (
                      <CardMedia
                        component="img"
                        image={activity.image}
                        alt={activity.title}
                        sx={{ height: 160, objectFit: "cover" }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" color="#034959" gutterBottom>
                        {activity.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Dates Section */}
        {experience.dates?.length > 0 && (
          <Box mb={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <CalendarMonth sx={{ color: "#034959", mr: 1 }} />
              <Typography variant="h6" fontWeight="bold" color="#034959">
                Available Dates ({experience.dates.length})
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {experience.dates.map((date, i) => (
                <Chip
                  key={i}
                  label={new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  sx={{
                    bgcolor: alpha("#034959", 0.1),
                    color: "#034959",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    py: 2.5,
                    px: 1,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Summary Box */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            bgcolor: alpha("#4CAF50", 0.05),
            border: `2px solid ${alpha("#4CAF50", 0.2)}`,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="#4CAF50" gutterBottom>
             Your Experience is Ready!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You've successfully completed all the steps. Once you publish, your experience will be visible to guests.
          </Typography>
        </Paper>

        {/* Publish Button */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={publishing ? <CircularProgress size={20} sx={{ color: "white" }} /> : <CheckCircle />}
            onClick={handleFinish}
            disabled={publishing}
            sx={{
              bgcolor: "#034959",
              "&:hover": { bgcolor: "#023342" },
              px: 6,
              py: 2,
              fontWeight: "bold",
              fontSize: "1.1rem",
              borderRadius: 3,
              boxShadow: 4,
              textTransform: "none",
            }}
          >
            {publishing ? "Publishing..." : "Publish Experience"}
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default StepReview;