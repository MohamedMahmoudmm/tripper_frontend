import React from "react";
import { Button, CircularProgress, Box } from "@mui/material";
import { Save, CheckCircle } from "@mui/icons-material";

const SubmitSection = ({ loading }) => {
  return (
    <Button
      variant="contained"
      type="submit"
      disabled={loading}
      startIcon={loading ? null : <Save />}
      sx={{
        background: loading
          ? "#BDBDBD"
          : "linear-gradient(135deg, #66BB6A 0%, #43A047 100%)",
        color: "#fff",
        borderRadius: 2,
        px: 5,
        py: 1.5,
        fontSize: "1rem",
        fontWeight: "bold",
        textTransform: "none",
        minWidth: 180,
        boxShadow: loading ? "none" : "0 4px 14px rgba(102, 187, 106, 0.4)",
        "&:hover": {
          background: loading
            ? "#BDBDBD"
            : "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
          boxShadow: loading ? "none" : "0 6px 20px rgba(102, 187, 106, 0.5)",
          transform: loading ? "none" : "translateY(-2px)",
        },
        transition: "all 0.3s ease",
        "&:disabled": {
          color: "#fff",
        },
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <CircularProgress
            size={20}
            sx={{
              color: "white",
            }}
          />
          Saving...
        </Box>
      ) : (
        "Save & Publish"
      )}
    </Button>
  );
};

export default SubmitSection;