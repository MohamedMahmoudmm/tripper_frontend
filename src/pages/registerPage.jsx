
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Container,
  IconButton,
  InputAdornment,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material";
import authService from "../services/authservice";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const steps = ["Personal Info", "Account Details", "Verification"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // ✅ مسح الـ error الخاص بالـ field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    
    // ✅ مسح الـ API error
    if (apiError) {
      setApiError("");
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      // Personal Info
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (formData.name.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters";
      } else if (formData.name.trim().length > 20) {
        newErrors.name = "Name must be less than 20 characters";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[0-9]{10,15}$/.test(formData.phone.trim())) {
        newErrors.phone = "Please enter a valid phone number";
      }
    } else if (step === 1) {
      // Account Details
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  const handleNext = () => {
    setErrors({});
    setApiError("");

    const validationErrors = validateStep(activeStep);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (activeStep === 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setErrors({});
    setApiError("");
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      setSuccess(true);
      setActiveStep(2);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";
      
      if (err.response?.status === 409) {
        errorMessage = "This email is already registered";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setApiError(errorMessage);
      setActiveStep(1); // Go back to account details step
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              sx={{ mb: 2 }}
              autoFocus
            />

            <TextField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              fullWidth
              placeholder="01012345678"
            />
          </>
        );

      case 1:
        return (
          <>
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              sx={{ mb: 2 }}
              autoComplete="email"
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              sx={{ mb: 2 }}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        );

      case 2:
        return (
          <Box textAlign="center" py={4}>
            <CheckCircle sx={{ fontSize: 80, color: "#4caf50", mb: 2 }} />
            <Typography variant="h5" fontWeight={700} mb={2}>
              Account Created Successfully! 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              We've sent a verification email to <strong>{formData.email}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please verify your email before logging in.
            </Typography>
            <Typography variant="caption" color="text.secondary" mt={2} display="block">
              Redirecting to login in 3 seconds...
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            background: "#fff",
            borderRadius: 3,
            p: 4,
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          }}
        >
          {/* Logo & Header */}
          <Box textAlign="center" mb={4}>
            <Box
              component="img"
              src="/navImage.png"
              alt="Tripper logo"
              sx={{
                height: 40,
                width: 200,
                objectFit: "contain",
                mb: 2,
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <Typography variant="h4" fontWeight={700} color="#333" mb={1}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign up to start exploring amazing places
            </Typography>
          </Box>

          {/* Stepper */}
          {!success && (
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {/* API Error Message */}
          {apiError && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setApiError("")}
            >
              {apiError}
            </Alert>
          )}

          {/* Form Content */}
          <Box>
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          {!success && (
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                sx={{
                  flex: 1,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={loading}
                sx={{
                  flex: 2,
                  bgcolor: "#f27244",
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#d95a2e",
                  },
                  "&:disabled": {
                    bgcolor: "#ccc",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : activeStep === 1 ? (
                  "Create Account"
                ) : (
                  "Next"
                )}
              </Button>
            </Box>
          )}

          {/* Login Link */}
          {!success && (
            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    fontWeight: 700,
                    color: "#f27244",
                  }}
                >
                  Log In
                </Link>
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
