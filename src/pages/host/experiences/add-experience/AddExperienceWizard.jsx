import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Fade,
  alpha,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { experienceSchema } from "../../validation/experienceSchema";
import experienceService from "../../../../services/experince.service";
import { ArrowBackIosNew, ArrowForward, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Steps
import StepBasicInfo from "./steps/StepBasicInfo";
import StepPhotos from "./steps/StepPhotos";
import StepActivities from "./steps/StepActivities";
import StepDates from "./steps/StepDates";
import StepReview from "./steps/StepReview";

const steps = ["Basic Info", "Photos", "Activities", "Dates", "Review"];

const AddExperienceWizard = () => {
  const methods = useForm({
    resolver: yupResolver(experienceSchema),
    defaultValues: {
      name: "",
      description: "",
      notes: "",
      price: "",
      country: "",
      city: "",
      photos: [],
      activities: [],
      dates: [],
    },
  });

  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [experienceId, setExperienceId] = useState(null);

  const { trigger, getValues, setError } = methods;

  const saveActivities = async (activities) => {
    try {
      const uploadPromises = activities.map((act) => {
        const formData = new FormData();
        formData.append("title", act.title);
        formData.append("description", act.description);
        formData.append("image", act.image);

        return experienceService.addActivity(experienceId, formData);
      });

      await Promise.all(uploadPromises);
    } catch (err) {
      console.error(err);
      toast.error("Error saving activities");
      throw err;
    }
  };

  const handleCreateExperience = async () => {
    const data = getValues();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("notes", data.notes);
      formData.append("price", data.price);
      formData.append("address[country]", data.country);
      formData.append("address[city]", data.city);

      data.photos.forEach((file) => {
        formData.append("images", file);
      });

      const newExperience = await experienceService.addExperience(formData);
      setExperienceId(newExperience._id);
      setActiveStep((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error("Error creating experience. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    const data = getValues();
    let valid = true;

    try {
      switch (activeStep) {
        case 0: // Basic Info
          valid = await trigger(["name", "description", "price", "country", "city"]);
          if (!valid) {
            
            return;
          }
          break;

        case 1: // Photos
          if (!data.photos || data.photos.length === 0) {
            setError("photos", { type: "manual", message: "Please upload at least one photo" });
            toast.error("Please upload at least one photo");
            return;
          }
          valid = await trigger("photos");
          if (!valid) return;

          await handleCreateExperience();
          return;

        case 2: // Activities
          if (!data.activities || data.activities.length === 0) {
            toast.error("Please add at least one activity");
            return;
          }
          setLoading(true);
          await saveActivities(data.activities);
          setActiveStep((prev) => prev + 1);
          setLoading(false);
          return;

        case 3: // Dates
          if (!experienceId) {
            toast.error("Experience ID not found");
            return;
          }

          setLoading(true);
          try {
            const experience = await experienceService.getExperienceById(experienceId);
            if (!experience.dates || experience.dates.length === 0) {
              toast.error("Please add at least one available date to continue");
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error(err);
            toast.error("Error checking dates. Please try again.");
            setLoading(false);
            return;
          }
          setLoading(false);
          break;

        default:
          break;
      }

      if (activeStep !== 1 && activeStep !== 2) {
        setActiveStep((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getStepIcon = (step) => {
    const icons = {
      0: "📝",
      1: "📸",
      2: "🎯",
      3: "📅",
      4: "✅",
    };
    return icons[step] || "";
  };

  return (
    <FormProvider {...methods}>
      <Fade in timeout={500}>
        <Paper
          elevation={4}
          sx={{
            position: "relative",
            width: "100%",
            p: { xs: 2, md: 4 },
            borderRadius: 4,
            backgroundColor: "#fff",
            maxWidth: "1000px",
            margin: "40px auto",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Button
            startIcon={<ArrowBackIosNew />}
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              color: "#034959",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                color: "#f27244",
                bgcolor: alpha("#f27244", 0.1),
              },
            }}
          >
            Back
          </Button>

          <Box textAlign="center" mb={4} mt={{ xs: 4, md: 0 }}>
            <Typography variant="h4" fontWeight="bold" color="#034959" gutterBottom>
              Add New Experience
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Step {activeStep + 1} of {steps.length}
            </Typography>
          </Box>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 5,
              "& .MuiStepLabel-label": {
                fontWeight: "bold",
                fontSize: { xs: "0.75rem", md: "0.875rem" },
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor:
                          index === activeStep
                            ? "#034959"
                            : index < activeStep
                            ? "#4CAF50"
                            : alpha("#034959", 0.1),
                        color: index <= activeStep ? "#fff" : "#757575",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {index < activeStep ? "✓" : getStepIcon(index)}
                    </Box>
                  )}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 400, px: { xs: 1, md: 3 }, py: 3, transition: "all 0.3s ease" }}>
            <Fade in key={activeStep} timeout={300}>
              <Box>
                {activeStep === 0 && <StepBasicInfo />}
                {activeStep === 1 && <StepPhotos />}
                {activeStep === 2 && <StepActivities experienceId={experienceId} />}
                {activeStep === 3 && <StepDates experienceId={experienceId} />}
                {activeStep === 4 && <StepReview experienceId={experienceId} />}
              </Box>
            </Fade>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent:
                activeStep === 0
                  ? "flex-end"
                  : activeStep === steps.length - 1
                  ? "center"
                  : "space-between",
              mt: 5,
              pt: 3,
              borderTop: `2px solid ${alpha("#034959", 0.1)}`,
              gap: 2,
            }}
          >
            {activeStep > 0 && activeStep < steps.length - 1 && (
              <Button
                onClick={handleBack}
                variant="outlined"
                startIcon={<ArrowBack />}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  borderColor: "#034959",
                  color: "#034959",
                  borderWidth: 2,
                  borderRadius: 3,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#023342",
                    bgcolor: alpha("#034959", 0.05),
                    borderWidth: 2,
                  },
                }}
              >
                Back
              </Button>
            )}

            {activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                endIcon={
                  loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <ArrowForward />
                }
                onClick={handleNext}
                disabled={loading}
                sx={{
                  backgroundColor: "#034959",
                  "&:hover": { backgroundColor: "#023342" },
                  px: 5,
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderRadius: 3,
                  boxShadow: 3,
                  textTransform: "none",
                  minWidth: 140,
                }}
              >
                {loading ? "Saving..." : "Next"}
              </Button>
            )}
          </Box>
        </Paper>
      </Fade>
    </FormProvider>
  );
};

export default AddExperienceWizard;
