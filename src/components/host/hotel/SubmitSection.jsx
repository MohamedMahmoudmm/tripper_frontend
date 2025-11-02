import React from "react";
import { Button } from "@mui/material";

const SubmitSection = ({ onSubmit }) => {
  return (
    <Button
      variant="contained"
      sx={{
        bgcolor: "#FF385C",
        borderRadius: 3,
        px: 4,
        py: 1.2,
        fontWeight: "bold",
        "&:hover": { bgcolor: "#e22d50" },
      }}
      type="submit"
      onClick={onSubmit}
    >
      Save Listing
    </Button>
  );
};

export default SubmitSection;
