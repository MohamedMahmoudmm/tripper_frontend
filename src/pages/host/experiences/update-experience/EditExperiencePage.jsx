import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Divider,
  Paper,
  Container,
  Button,
  Stack,
  Fade,
} from "@mui/material";
import {
  ArrowBackIosNew,
  EditOutlined,
  HomeOutlined,
  NavigateNext,
} from "@mui/icons-material";
import experienceService from "../../../../services/experince.service";
import BasicInfoSection from "./EditSections/BasicInfoSection";
import ActivitiesSection from "./EditSections/ActivitiesSection";
import PhotosSection from "./EditSections/PhotosSection";
import DatesSection from "./EditSections/DatesSection";

const EditExperiencePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await experienceService.getExperienceById(id);
        setExperience(data);
      } catch (err) {
        console.error("Failed to fetch experience:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        gap={2}
      >
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ color: '#FF385C' }}
        />
        <Typography variant="body1" color="text.secondary" fontWeight="500">
          Loading experience details...
        </Typography>
      </Box>
    );
  }

  if (!experience) {
    return (
      <Container maxWidth="sm">
        <Box 
          textAlign="center" 
          mt={10}
          p={5}
          sx={{
            bgcolor: '#fff',
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          <Typography variant="h4" fontWeight="700" color="error" mb={2}>
             Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            The experience you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              bgcolor: '#FF385C',
              px: 4,
              py: 1.2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#E31C5F' }
            }}
          >
            Go to Homepage
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Fade in={!loading} timeout={600}>
          <Box mb={4}>
            {/* Back Button */}
            <Button
              startIcon={<ArrowBackIosNew sx={{ fontSize: '16px' }} />}
              onClick={() => navigate(-1)}
              sx={{
                mb: 2,
                color: '#FF385C',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '15px',
                px: 2,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255,56,92,0.08)',
                },
              }}
            >
              Back
            </Button>


            {/* Page Title */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #FF385C 0%, #E31C5F 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <EditOutlined sx={{ fontSize: 32 }} />
                  <Typography variant="h3" fontWeight="700">
                    Edit Experience
                  </Typography>
                </Stack>
                <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '16px' }}>
                  Manage and update your experience details, photos, activities, and availability
                </Typography>
              </Box>
              
              {/* Decorative circles */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.1)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  right: 100,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.08)',
                }}
              />
            </Paper>
          </Box>
        </Fade>

        {/* Content Sections */}
        <Fade in={!loading} timeout={800}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid #e0e0e0'
            }}
          >
            <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
              {/* BASIC INFO SECTION */}
              <BasicInfoSection experience={experience} onUpdate={setExperience} />

              <Divider sx={{ my: 4 }} />

              {/* PHOTOS SECTION */}
              <PhotosSection experience={experience} onUpdate={setExperience} />

              <Divider sx={{ my: 4 }} />

              {/* ACTIVITIES SECTION */}
              <ActivitiesSection experience={experience} onUpdate={setExperience} />

              <Divider sx={{ my: 4 }} />

              {/* DATES SECTION */}
              <DatesSection experience={experience} onUpdate={setExperience} />

              {/* Done Button */}
              <Box 
                sx={{ 
                  mt: 4, 
                  p: 3, 
                  bgcolor: '#f8f9fa', 
                  borderRadius: 3,
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2" color="text.secondary" mb={2}>
                  All changes are saved automatically
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{
                    px: 5,
                    py: 1.3,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                    borderColor: '#FF385C',
                    color: '#FF385C',
                    '&:hover': {
                      borderColor: '#E31C5F',
                      bgcolor: 'rgba(255,56,92,0.04)'
                    }
                  }}
                >
                  Done Editing
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Footer spacing */}
        <Box sx={{ height: 40 }} />
      </Container>
    </Box>
  );
};

export default EditExperiencePage;