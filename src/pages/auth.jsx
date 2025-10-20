import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Tab,
  Tabs,
  TextField,
  Typography,
  Divider,
  Alert,
  Container,
  MenuItem,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (tab === 1 && !formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password.trim())
      newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (tab === 1 && !formData.phone.trim())
      newErrors.phone = "Phone number is required";
    if (tab === 1 && !formData.role)
      newErrors.role = "Please select a role";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
      return;
    }
    setSuccess(tab === 0 ? "Logged in successfully!" : "Account created!");
    setFormData({ name: "", email: "", password: "", phone: "", role: "" });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          background: "#fff",
          borderRadius: 4,
          p: 5,
          boxShadow: "0 0 15px rgba(0,0,0,0.05)",
        }}
      >
        <Box textAlign="center" mb={3}>
          <LockIcon sx={{ color: "#1976d2", fontSize: 40 }} />
          <Typography variant="h4" fontWeight={700} mb={1}>
            {tab === 0 ? "Welcome Back" : "Create Account"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tab === 0
              ? "Login to continue your journey"
              : "Sign up to start exploring amazing places"}
          </Typography>
        </Box>

        <Tabs
          value={tab}
          onChange={(e, val) => {
            setTab(val);
            setErrors({});
            setSuccess("");
          }}
          centered
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
            mb: 3,
          }}
        >
          <Tab label="Log In" />
          <Tab label="Sign Up" />
        </Tabs>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
          {tab === 1 && (
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />
          )}

          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
          />

          {tab === 1 && (
            <>
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
              />

              <TextField
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={!!errors.role}
                helperText={errors.role}
                fullWidth
              >
                <MenuItem value="guest">Guest</MenuItem>
                <MenuItem value="host">Host</MenuItem>
              </TextField>
            </>
          )}
        </Box>

        {tab === 0 && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Remember me"
            />
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
            >
              Forgot Password?
            </Typography>
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#1976d2",
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            mb: 2,
          }}
          onClick={handleSubmit}
        >
          {tab === 0 ? "Log In" : "Sign Up"}
        </Button>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Divider sx={{ my: 2 }}>Or</Divider>

          <Typography variant="body2" textAlign="center">
          {tab === 0 ? (
            <>
              Don't have an account?{" "}
              <Button
                variant="text"
                color="primary"
                size="small"
                sx={{ textTransform: "none", fontWeight: 600 }}
                onClick={() => setTab(1)}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button
                variant="text"
                color="primary"
                size="small"
                sx={{ textTransform: "none", fontWeight: 600 }}
                onClick={() => setTab(0)}
              >
                Sign In
              </Button>
            </>
          )}
        </Typography>
      </Container>
    </Box>
  );
}
