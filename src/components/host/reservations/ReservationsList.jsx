import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const statusColors = {
  pending: "warning",
  confirmed: "success",
  cancelled: "error",
  completed: "info",
};

const ReservationsList = ({
  title,
  reservations,
  loading,
  onAccept,
  detailsBasePath,
  fields, 
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedRes, setSelectedRes] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const handleConfirm = async () => {
    if (!selectedRes) return;
    await onAccept(selectedRes);
    setConfirmDialog(false);
    setSelectedRes(null);
  };

  return (
    <Fade in timeout={400}>
      <Box p={{ xs: 2, sm: 3, md: 4 }} maxWidth="1200px" mx="auto" width="100%">
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          fontWeight="bold"
          color="#034959"
          textAlign="center"
          mb={isSmallScreen ? 3 : 4}
        >
          {title}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
            <CircularProgress sx={{ color: "#FF385C" }} />
          </Box>
        ) : reservations.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" mt={4}>
            No reservations found.
          </Typography>
        ) : isSmallScreen ? (
          //  Mobile & Tablet View (Cards)
          <Stack spacing={2}>
            {reservations.map((res) => (
              <Card
                key={res._id}
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  p: 1,
                }}
              >
                <CardContent>
                  {fields.map((f) => (
                    <Typography
                      key={f.key}
                      variant="body2"
                      color={f.bold ? "text.primary" : "text.secondary"}
                      fontWeight={f.bold ? "bold" : "normal"}
                      mb={f.bold ? 1 : 0}
                    >
                      {f.label}: {f.render ? f.render(res) : res[f.key] || "-"}
                    </Typography>
                  ))}

                  <Box mt={1}>
                    <Chip
                      label={res.status}
                      color={statusColors[res.status]}
                      sx={{ textTransform: "capitalize", fontWeight: 600 }}
                    />
                  </Box>

                  <Stack direction="column" spacing={1.2} mt={2}>
                    {res.status === "pending" && (
                      <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        sx={{
                          backgroundColor: "#FF385C",
                          "&:hover": { backgroundColor: "#E31C5F" },
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: "bold",
                        }}
                        onClick={() => {
                          setSelectedRes(res);
                          setConfirmDialog(true);
                        }}
                      >
                        Accept
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{
                        borderColor: "#FF385C",
                        color: "#FF385C",
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: "bold",
                        "&:hover": { borderColor: "#E31C5F", color: "#E31C5F" },
                      }}
                      onClick={() => navigate(`${detailsBasePath}/${res._id}`)}
                    >
                      Details
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          //  Desktop View (Table)
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#FFF8F8" }}>
                  {fields.map((f) => (
                    <TableCell key={f.key} sx={{ fontWeight: "bold" }}>
                      {f.label}
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((res) => (
                  <TableRow
                    key={res._id}
                    hover
                    sx={{
                      transition: "0.2s",
                      "&:hover": { backgroundColor: "#FFF2F2" },
                    }}
                  >
                    {fields.map((f) => (
                      <TableCell key={f.key}>
                        {f.render ? f.render(res) : res[f.key] || "-"}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Chip
                        label={res.status}
                        color={statusColors[res.status]}
                        sx={{ textTransform: "capitalize", fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      {res.status === "pending" ? (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#FF385C",
                            "&:hover": { backgroundColor: "#E31C5F" },
                            textTransform: "none",
                            borderRadius: 2,
                            fontWeight: "bold",
                          }}
                          onClick={() => {
                            setSelectedRes(res);
                            setConfirmDialog(true);
                          }}
                        >
                          Accept
                        </Button>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: "#FF385C",
                          color: "#FF385C",
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: "bold",
                          "&:hover": { borderColor: "#E31C5F", color: "#E31C5F" },
                        }}
                        onClick={() => navigate(`${detailsBasePath}/${res._id}`)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold", color: "#FF385C" }}>
            Confirm Reservation
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to <b>accept</b> this reservation?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FF385C",
                "&:hover": { backgroundColor: "#E31C5F" },
              }}
              onClick={handleConfirm}
            >
              Yes, Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default ReservationsList;
