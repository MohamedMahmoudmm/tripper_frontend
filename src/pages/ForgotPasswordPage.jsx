import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Container,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Email, CheckCircle } from "@mui/icons-material";
import authService from "../services/authservice";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              p: 5,
              textAlign: "center",
            }}
          >
            <CheckCircle sx={{ fontSize: 100, color: "#4caf50", mb: 2 }} />
            <Typography variant="h4" fontWeight={700} mb={2}>
              Check Your Email! 📧
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              We've sent a password reset link to <strong>{email}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
              Please check your inbox and click the link to reset your password.
              The link will expire in 1 hour.
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                bgcolor: "#4caf50",
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "#388e3c" },
              }}
            >
              Back to Login
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={24}
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            p: 4,
          }}
        >
          <Box textAlign="center" mb={4}>
            <Email sx={{ fontSize: 60, color: "#f27244", mb: 2 }} />
            <Typography variant="h4" fontWeight={700} color="#333" mb={1}>
              Forgot Password?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email and we'll send you a reset link
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              fullWidth
              sx={{ mb: 3 }}
              disabled={loading}
              autoFocus
            />

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
                mb: 2,
                "&:hover": { bgcolor: "#f27244" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <Box textAlign="center">
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#667eea",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Back to Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}