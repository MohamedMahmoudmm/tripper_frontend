import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CakeIcon from "@mui/icons-material/Cake";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useState, useEffect } from "react";
import authService from "../services/authservice";

const GuestProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { token } = authService.getAuthData();

        if (!token) {
          setError("No token found. Please login first.");
          setLoading(false);
          return;
        }

        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
          authService.logout();
        } else {
          setError("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" sx={{ py: 4 }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => (window.location.href = "/login")}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box textAlign="center" sx={{ py: 4 }}>
        <Typography color="error">User not found.</Typography>
      </Box>
    );
  }

 return (
  <Box sx={{ backgroundColor: "#f2f4f7", minHeight: "100vh", py: 6 }}>
    <Container maxWidth="md">
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: "20px",
          backgroundColor: "#fff",
          textAlign: "center",
          boxShadow: "0 6px 25px rgba(0,0,0,0.1)"
        }}
      >
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mx: "auto",
            mb: 2,
            bgcolor: "red",
            fontSize: 55,
          }}
        >
          <PersonIcon sx={{ fontSize: 70 }} />
        </Avatar>

        <Typography variant="h5" fontWeight="bold" mb={2}>
          {user.name}
        </Typography>

        {/* <Divider sx={{ my: 3 }} /> */}

      <List sx={{ width: "100%" }}>

  {/* Email */}
  <ListItem>
    <ListItemIcon>
      <Box sx={{ bgcolor: "#e8eef9", p: 1, borderRadius: "50%" }}>
        <EmailIcon color="primary" />
      </Box>
    </ListItemIcon>
    <ListItemText primary="Email" secondary={user.email} />
  </ListItem>
  <Divider />

  {/* Phone */}
  <ListItem>
    <ListItemIcon>
      <Box sx={{ bgcolor: "#e8eef9", p: 1, borderRadius: "50%" }}>
        <CakeIcon color="primary" />
      </Box>
    </ListItemIcon>
    <ListItemText primary="Phone" secondary={user.phone || "-"} />
  </ListItem>
  <Divider />

  {/* Role */}
  <ListItem>
    <ListItemIcon>
      <Box sx={{ bgcolor: "#e8eef9", p: 1, borderRadius: "50%" }}>
        <VerifiedIcon color="primary" />
      </Box>
    </ListItemIcon>
    <ListItemText
      primary="Roles"
      secondary={user.role?.join(", ") || "-"}
    />
  </ListItem>
  <Divider />

  {/* Active Role */}
  {/* <ListItem>
    <ListItemIcon>
      <Box sx={{ bgcolor: "#e8eef9", p: 1, borderRadius: "50%" }}>
        <VerifiedIcon color="primary" />
      </Box>
    </ListItemIcon>
    <ListItemText primary="Active Role" secondary={user.activeRole} />
  </ListItem>
  <Divider /> */}

  {/* Email Confirmed */}
  <ListItem>
    <ListItemIcon>
      <Box sx={{ bgcolor: "#e8eef9", p: 1, borderRadius: "50%" }}>
        <VerifiedIcon color={user.isConfirmed ? "success" : "disabled"} />
      </Box>
    </ListItemIcon>
    <ListItemText
      primary="Email Confirmed"
      secondary={user.isConfirmed ? "Yes" : "No"}
    />
  </ListItem>
  <Divider />

  {/* Account Verification Status */}
  <ListItem>
    <ListItemIcon>
      <Box sx={{ bgcolor: "#e8eef9", p: 1, borderRadius: "50%" }}>
        <VerifiedIcon
          color={
            user.isVerified === "verified"
              ? "success"
              : user.isVerified === "pending"
              ? "warning"
              : user.isVerified === "rejected"
              ? "error"
              : "disabled"
          }
        />
      </Box>
    </ListItemIcon>

    <ListItemText
      primary="Account Verification Status"
      secondary={user.isVerified}
    />
  </ListItem>
</List>

      </Paper>
    </Container>
  </Box>
);

};

export default GuestProfile;
