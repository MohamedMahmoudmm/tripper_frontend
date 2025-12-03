import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Error, Email } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  // ✅ الـ status جاي من الـ backend redirect
  const status = searchParams.get("status");
  const errorMessage = searchParams.get("message");

  const isSuccess = status === "success";
  const isError = status === "error";

  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSuccess, navigate]);

  // ✅ Loading state (لو الصفحة اتفتحت بدون status)
  if (!status) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              background: "#fff",
              borderRadius: 3,
              p: 5,
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" color="text.secondary">
              Processing verification...
            </Typography>
          </Box>
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
        background: isSuccess
          ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
          : "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            background: "#fff",
            borderRadius: 3,
            p: 5,
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src="/navImage.png"
            alt="Tripper logo"
            sx={{
              height: 40,
              width: 200,
              objectFit: "contain",
              mb: 3,
              mx: "auto",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />

          {/* ✅ Success State */}
          {isSuccess && (
            <>
              <CheckCircle
                sx={{
                  fontSize: 100,
                  color: "#4caf50",
                  mb: 2,
                  animation: "scaleIn 0.5s ease-in-out",
                  "@keyframes scaleIn": {
                    "0%": { transform: "scale(0)" },
                    "50%": { transform: "scale(1.1)" },
                    "100%": { transform: "scale(1)" },
                  },
                }}
              />
              <Typography variant="h4" fontWeight={700} mb={2} color="#333">
                Email Verified Successfully! 🎉
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                Your account has been verified. You can now log in and start
                exploring amazing places with Tripper.
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Redirecting to login in <strong>{countdown}</strong> seconds...
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{
                  bgcolor: "#4caf50",
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 16,
                  "&:hover": {
                    bgcolor: "#388e3c",
                  },
                }}
              >
                Go to Login Now
              </Button>
            </>
          )}

          {/* ✅ Error State */}
          {isError && (
            <>
              <Error
                sx={{
                  fontSize: 100,
                  color: "#f44336",
                  mb: 2,
                  animation: "shake 0.5s ease-in-out",
                  "@keyframes shake": {
                    "0%, 100%": { transform: "translateX(0)" },
                    "25%": { transform: "translateX(-10px)" },
                    "75%": { transform: "translateX(10px)" },
                  },
                }}
              />
              <Typography variant="h4" fontWeight={700} mb={2} color="#333">
                Verification Failed
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                {errorMessage || "Something went wrong while verifying your email."}
              </Typography>

              {errorMessage?.includes("expired") && (
                <Box
                  sx={{
                    bgcolor: "#fff3e0",
                    p: 2,
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Email sx={{ color: "#f57c00", mb: 1 }} />
                  <Typography variant="body2" color="#f57c00">
                    Your verification link has expired. Please request a new one.
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/signup")}
                  sx={{
                    px: 3,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: "#f44336",
                    color: "#f44336",
                    "&:hover": {
                      borderColor: "#d32f2f",
                      bgcolor: "#ffebee",
                    },
                  }}
                >
                  Sign Up Again
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{
                    bgcolor: "#f44336",
                    px: 3,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#d32f2f",
                    },
                  }}
                >
                  Go to Login
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}