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
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  PaginationItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Cancel, Visibility } from "@mui/icons-material";

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
  onReject,
  detailsBasePath,
  fields,
  pagination,
  onPageChange,
  onStatusFilterChange,
  statusFilter,
  onItemsPerPageChange,
  error
}) => {
  const navigate = useNavigate();
  const [selectedRes, setSelectedRes] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedRes) return;
    try {
      setActionLoading(true);
      if (dialogType === "accept") {
        await onAccept(selectedRes);
      } else if (dialogType === "reject") {
        await onReject(selectedRes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setDialogType(null);
      setSelectedRes(null);
    }
  };

  return (
    <Fade in timeout={400}>
      <Box p={{ xs: 2, md: 3 }} maxWidth="1400px" mx="auto" width="100%">
        {/* Header */}
        <Box mb={4}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#034959"
            textAlign="center"
            mb={1}
          >
            {title}
          </Typography>
          {pagination && (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} reservations
            </Typography>
          )}
        </Box>

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter || "all"}
                onChange={(e) => onStatusFilterChange && onStatusFilterChange(e.target.value)}
                label="Status Filter"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            {onItemsPerPageChange && (
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Items per page</InputLabel>
                <Select
                  value={pagination?.itemsPerPage || 10}
                  onChange={(e) => onItemsPerPageChange(e.target.value)}
                  label="Items per page"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress sx={{ color: "#FF385C" }} size={60} />
          </Box>
        ) : reservations.length === 0 ? (
          <Paper elevation={1} sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              No reservations found
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Try adjusting your filters
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Desktop Table */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      {fields.map((f) => (
                        <TableCell key={f.key} sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                          {f.label}
                        </TableCell>
                      ))}
                      <TableCell sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "0.95rem", textAlign: "center" }}>Actions</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "0.95rem", textAlign: "center" }}>Details</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {reservations.map((res) => (
                      <TableRow key={res._id} hover sx={{ "&:hover": { backgroundColor: "#fafafa" } }}>
                        {fields.map((f) => (
                          <TableCell key={f.key}>
                            {f.render ? f.render(res) : res[f.key]}
                          </TableCell>
                        ))}

                        <TableCell>
                          <Chip
                            label={res.status}
                            color={statusColors[res.status]}
                            size="small"
                            sx={{ textTransform: "capitalize", fontWeight: 600 }}
                          />
                        </TableCell>

                        {/* Actions column with icons */}
                        <TableCell sx={{ textAlign: "center" }}>
                          <Stack direction="row" spacing={1} justifyContent="center">
                            {res.status === "pending" && (
                              <>
                                <CheckCircle
                                  color="success"
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setSelectedRes(res);
                                    setDialogType("accept");
                                  }}
                                />
                                <Cancel
                                  color="error"
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setSelectedRes(res);
                                    setDialogType("reject");
                                  }}
                                />
                              </>
                            )}
                          </Stack>
                        </TableCell>

                        {/* Details column */}
                        <TableCell sx={{ textAlign: "center" }}>
                          <Visibility
                            color="primary"
                            sx={{ cursor: "pointer" }}
                            onClick={() => navigate(`${detailsBasePath}/${res._id}`)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Mobile Cards */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <Stack spacing={2}>
                {reservations.map((res) => (
                  <Card key={res._id} elevation={2} sx={{ borderRadius: 3 }}>
                    <CardContent>
                      {fields.map((f) => (
                        <Typography key={f.key} variant="body2" mb={0.5}>
                          <strong>{f.label}:</strong> {f.render ? f.render(res) : res[f.key]}
                        </Typography>
                      ))}

                      <Box mt={1} mb={2}>
                        <Chip
                          label={res.status}
                          color={statusColors[res.status]}
                          size="small"
                          sx={{ textTransform: "capitalize", fontWeight: 600 }}
                        />
                      </Box>

                      <Stack direction="row" spacing={1}>
                        {res.status === "pending" && (
                          <>
                            <CheckCircle
                              color="success"
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelectedRes(res);
                                setDialogType("accept");
                              }}
                            />
                            <Cancel
                              color="error"
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelectedRes(res);
                                setDialogType("reject");
                              }}
                            />
                          </>
                        )}

                        <Visibility
                          color="primary"
                          sx={{ cursor: "pointer" }}
                          onClick={() => navigate(`${detailsBasePath}/${res._id}`)}
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 3,
                }}
              >
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={(e, page) => onPageChange && onPageChange(page)}
                  size="large"
                  siblingCount={2}
                  renderItem={(item) => (
                    <PaginationItem
                      {...item}
                      sx={{
                        borderRadius: "10px",
                        mx: 0.7,
                        px: 2,
                        fontWeight: 600,
                        border: "1px solid #d1d1d1",
                        transition: "0.25s ease",
                        "&:hover": {
                          backgroundColor: "#e8f4f6",
                          borderColor: "#034959",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#034959 !important",
                          borderColor: "#034959 !important",
                          color: "#fff !important",
                          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                        },
                      }}
                    />
                  )}
                />
              </Box>
            )}
          </>
        )}

        {/* Confirmation Dialog */}
        <Dialog 
          open={dialogType !== null} 
          onClose={() => !actionLoading && setDialogType(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
            {dialogType === "accept" ? "Confirm Reservation" : "Reject Reservation"}
          </DialogTitle>

          <DialogContent>
            <Typography>
              Are you sure you want to{" "}
              <strong style={{ color: dialogType === "accept" ? "#4CAF50" : "#D32F2F" }}>
                {dialogType === "accept" ? "accept" : "reject"}
              </strong>{" "}
              this reservation?
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setDialogType(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: dialogType === "accept" ? "#4CAF50" : "#D32F2F",
                "&:hover": {
                  backgroundColor: dialogType === "accept" ? "#45a049" : "#c62828"
                }
              }}
              onClick={handleConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? <CircularProgress size={24} /> : "Confirm"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default ReservationsList;
