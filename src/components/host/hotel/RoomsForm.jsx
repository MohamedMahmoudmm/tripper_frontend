import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Box, Button, TextField, Typography, IconButton, Paper, Stack, Chip, InputAdornment, Divider } from "@mui/material";
import { Add, Delete, HotelRounded, AttachMoney, EventSeat, Group } from "@mui/icons-material";

export default function RoomsForm({ showRooms = false }) {
  const { control, register, formState: { errors } } = useFormContext();
  const type = useWatch({ control, name: "type" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const shouldShow = type === "hotel" || showRooms;
  if (!shouldShow) return null;

  const handleRemoveRoom = (index) => {
  
    if (showRooms && fields.length <= 1) {
      return; 
    }
    remove(index);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 4, height: 24, backgroundColor: "#667eea", borderRadius: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="#222">
              Room Types
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
            Add different room types available at your hotel
          </Typography>
        </Box>
        {fields.length > 0 && (
          <Chip
            icon={<HotelRounded />}
            label={`${fields.length} ${fields.length === 1 ? 'room type' : 'room types'}`}
            sx={{
              backgroundColor: "#667eea",
              color: "#fff",
              fontWeight: 600,
            }}
          />
        )}
      </Stack>

      <Stack spacing={3}>
        {fields.map((field, index) => (
          <Paper
            key={field.id}
            elevation={0}
            sx={{
              p: 3,
              border: "2px solid #E0E0E0",
              borderRadius: 3,
              position: "relative",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#667eea",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              },
            }}
          >
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    backgroundColor: "#F0F4FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#667eea",
                  }}
                >
                  <HotelRounded />
                </Box>
                <Typography variant="h6" fontWeight="bold" color="#222">
                  Room Type #{index + 1}
                </Typography>
              </Stack>
              
              
              <IconButton
                onClick={() => handleRemoveRoom(index)}
                disabled={showRooms && fields.length <= 1}
                sx={{
                  color: showRooms && fields.length <= 1 ? "#BDBDBD" : "#EF5350",
                  backgroundColor: showRooms && fields.length <= 1 ? "#F5F5F5" : "#FFEBEE",
                  cursor: showRooms && fields.length <= 1 ? "not-allowed" : "pointer",
                  "&:hover": {
                    backgroundColor: showRooms && fields.length <= 1 ? "#F5F5F5" : "#EF5350",
                    color: showRooms && fields.length <= 1 ? "#BDBDBD" : "#fff",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#F5F5F5",
                    color: "#BDBDBD",
                  },
                }}
              >
                <Delete />
              </IconButton>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* Form Fields */}
            <Stack spacing={2.5}>
              {/* Room Name */}
              <TextField
                label="Room Name"
                placeholder="e.g., Deluxe Ocean View Suite"
                fullWidth
                {...register(`rooms.${index}.name`)}
                error={!!errors.rooms?.[index]?.name}
                helperText={errors.rooms?.[index]?.name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HotelRounded sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#667eea",
                  },
                }}
              />

              {/* Room Price, Quantity, Max Guests */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Price per Night"
                  placeholder="100"
                  type="number"
                  fullWidth
                  {...register(`rooms.${index}.price`)}
                  error={!!errors.rooms?.[index]?.price}
                  helperText={errors.rooms?.[index]?.price?.message || "Minimum $10"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney sx={{ color: "#66BB6A" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#66BB6A",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#66BB6A",
                    },
                  }}
                />

                <TextField
                  label="Available Rooms"
                  placeholder="10"
                  type="number"
                  fullWidth
                  {...register(`rooms.${index}.quantity`)}
                  error={!!errors.rooms?.[index]?.quantity}
                  helperText={errors.rooms?.[index]?.quantity?.message || "Min: 1, Max: 100"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventSeat sx={{ color: "#667eea" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#667eea",
                    },
                  }}
                />

                <TextField
                  label="Max Guests"
                  placeholder="2"
                  type="number"
                  fullWidth
                  {...register(`rooms.${index}.maxGuests`)}
                  error={!!errors.rooms?.[index]?.maxGuests}
                  helperText={errors.rooms?.[index]?.maxGuests?.message || "Min: 1, Max: 20"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Group sx={{ color: "#FFA726" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#FFA726",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#FFA726",
                    },
                  }}
                />
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Add Room Button */}
      <Button
        startIcon={<Add />}
        variant="outlined"
        fullWidth
        onClick={() => append({ name: "", price: "", quantity: 1, maxGuests: 2 })}
        sx={{
          mt: 3,
          py: 1.5,
          borderRadius: 2,
          borderColor: "#667eea",
          color: "#667eea",
          borderWidth: 2,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          "&:hover": {
            borderColor: "#667eea",
            backgroundColor: "#F0F4FF",
            borderWidth: 2,
          },
        }}
      >
        Add Another Room Type
      </Button>

      {fields.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 3,
            textAlign: "center",
            backgroundColor: "#FFF3E0",
            border: "2px dashed #FFB74D",
            borderRadius: 2,
          }}
        >
          <HotelRounded sx={{ fontSize: 48, color: "#FFB74D", mb: 1 }} />
          <Typography variant="body1" fontWeight="600" color="#F57C00" mb={1}>
            No Room Types Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {showRooms 
              ? "This hotel must have at least one room type. Please add a room to continue."
              : "Click the button above to add your first room type."}
          </Typography>
        </Paper>
      )}
      
      {/* Edit mode */}
      {showRooms && fields.length === 1 && (
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: "#E3F2FD",
            border: "1px solid #90CAF9",
            borderRadius: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#2196F3",
              }}
            />
            <Typography variant="body2" color="#1976D2" fontWeight="500">
              This is the only room type. You cannot delete it, but you can edit its details or add more room types.
            </Typography>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}