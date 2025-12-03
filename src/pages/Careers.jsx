import { useState } from "react";
import {
  Container, Typography, Box, Grid, Button, Chip, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, IconButton
} from "@mui/material";
import { People, Rocket, Coffee, TravelExplore, Close } from "@mui/icons-material";

export default function Careers() {
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");

  const positions = [
    { title: "Senior React Developer", location: "Remote", type: "Full-time" },
    { title: "Content Creator (Arabic/English)", location: "Cairo", type: "Part-time" },
    { title: "Community Manager", location: "Dubai", type: "Full-time" },
    { title: "UX Designer", location: "Remote", type: "Full-time" },
  ];

  const handleApply = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: { xs: 12, md: 20 } }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={{ xs: 12, md: 16 }}>
          <Typography variant="h2" fontWeight="bold" sx={{ fontSize: { xs: "3rem", md: "5.5rem" } }}>
            Join Our Mission
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mt: 4, maxWidth: 900, mx: "auto" }}>
            We're not just building a platform. We're building the future of travel.
          </Typography>
        </Box>

        {/* Perks */}
        <Grid container spacing={{ xs: 6, md: 8 }} justifyContent="center" mb={16}>
          {[
            { icon: <Rocket sx={{ fontSize: 70 }} />, title: "Grow Fast", desc: "10x your skills in 12 months" },
            { icon: <People sx={{ fontSize: 70 }} />, title: "Global Team", desc: "12 nationalities, 1 mission" },
            { icon: <Coffee sx={{ fontSize: 70 }} />, title: "Best Perks", desc: "Free trips, health, unlimited leave" },
            { icon: <TravelExplore sx={{ fontSize: 70 }} />, title: "Travel Free", desc: "5 experiences/year on us" },
          ].map((item, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Box textAlign="center" sx={{ p: 6, bgcolor: "white", borderRadius: 6, boxShadow: "0 20px 50px rgba(0,0,0,0.08)", transition: "0.4s", "&:hover": { transform: "translateY(-15px)" } }}>
                <Box sx={{ color: "#4a6cf7", mb: 3 }}>{item.icon}</Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>{item.title}</Typography>
                <Typography color="text.secondary">{item.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Jobs */}
        <Box textAlign="center">
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 10 }}>Open Roles</Typography>
          <Grid container spacing={6} justifyContent="center">
            {positions.map((job, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Box sx={{ p: 6, bgcolor: "white", borderRadius: 6, boxShadow: "0 15px 40px rgba(0,0,0,0.1)", textAlign: "left", transition: "0.3s", "&:hover": { transform: "translateY(-8px)", boxShadow: "0 25px 60px rgba(74,108,247,0.15)" } }}>
                  <Typography variant="h5" fontWeight="bold">{job.title}</Typography>
                  <Box sx={{ mt: 2, mb: 4 }}>
                    <Chip label={job.location} size="small" sx={{ mr: 1 }} />
                    <Chip label={job.type} color="primary" size="small" />
                  </Box>
                  <Button variant="contained" size="large" onClick={() => handleApply(job.title)}>
                    Apply Now
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Button variant="contained" size="large" sx={{ mt: 10, px: 8, py: 3, borderRadius: 4, fontSize: "1.2rem" }} href="mailto:careers@tripper.com">
            Don't see your role? Email us anyway!
          </Button>
        </Box>
      </Container>

      {/* Apply Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Apply for {selectedJob}
          <IconButton onClick={() => setOpen(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField fullWidth label="Full Name" margin="normal" required />
            <TextField fullWidth label="Email" type="email" margin="normal" required />
            <TextField fullWidth label="LinkedIn / Portfolio" margin="normal" />
            <TextField fullWidth label="Cover Letter" multiline rows={4} margin="normal" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { alert("Application sent! We'll contact you soon!"); setOpen(false); }}>
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}