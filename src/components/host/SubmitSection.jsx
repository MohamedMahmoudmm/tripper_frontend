import React from "react";
import { Button, Box } from "@mui/material";

const SubmitSection = () => (
  <Box sx={{ mt: 3 }}>
    <Button type="submit" variant="contained" sx={{ bgcolor: "#FF385C", "&:hover": { bgcolor: "#e22d50" }, fontWeight: "bold", py: 1.5, width: "100%" }}>
      Add Listing
    </Button>
  </Box>
);

export default SubmitSection;
