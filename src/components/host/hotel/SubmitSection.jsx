import React from "react";
import { Button, CircularProgress } from "@mui/material";

const SubmitSection = ({ onSubmit, loading }) => {
  return (
    <Button
      variant="contained"
      sx={{
        bgcolor: "#FF385C",
        borderRadius: 3,
        px: 4,
        py: 1.2,
        fontWeight: "bold",
        textTransform: "none",
        "&:hover": { bgcolor: "#e22d50" },
      }}
      type="submit"
      onClick={onSubmit}
      disabled={loading}
    >
      {loading ? (
        <CircularProgress
          size={24}
          sx={{
            color: "white",
          }}
        />
      ) : (
        "Save Hotel"
      )}
    </Button>
  );
};

export default SubmitSection;
