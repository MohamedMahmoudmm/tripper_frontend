
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import authService from "../services/authservice";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // ✅ مسح الـ error الخاص بالـ field لما اليوزر يبدأ يكتب
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    
    // ✅ مسح الـ API error لما اليوزر يعدل في الفورم
    if (apiError) {
      setApiError("");
    }
  };

  const validate = () => {
    const newErrors = {};
    
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
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    setApiError("");
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const data = await authService.signin({
        email: formData.email,
        password: formData.password,
      });

      authService.saveAuthData(data.user, data.token);
      
      // Redirect based on role
      if (data.user.activeRole === "host") {
        navigate("/host/dashboard");
      } else if (data.user.activeRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
      
    } catch (err) {
      // ✅ Handle different error scenarios properly
      let errorMessage = "Something went wrong. Please try again.";
      
      if (err.response?.status === 401) {
        errorMessage = err.response.data.message || "Invalid email or password";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
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
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Login to continue your journey with Tripper
            </Typography>
          </Box>

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

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
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
              disabled={loading}
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
              sx={{ mb: 1 }}
              disabled={loading}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box textAlign="right" mb={3}>
              <Button
                variant="text"
                size="small"
                sx={{
                  textTransform: "none",
                  color: "#667eea",
                  fontWeight: 600,
                }}
                disabled={loading}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                bgcolor: "#f27244",
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 16,
                mb: 3,
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
              ) : (
                "Log In"
              )}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  style={{
                    textDecoration: "none",
                    fontWeight: 700,
                    color: "#667eea",
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}