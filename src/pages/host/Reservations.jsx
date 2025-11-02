// import React from "react";
// import {
//   Container,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
// } from "@mui/material";

// const reservations = [
//   {
//     id: 1,
//     guest: "Alice Johnson",
//     listing: "Modern Apartment in Downtown",
//     date: "2025-11-01",
//     nights: 3,
//     status: "confirmed",
//   },
//   {
//     id: 2,
//     guest: "Mark Smith",
//     listing: "Luxury Villa with Pool",
//     date: "2025-11-05",
//     nights: 5,
//     status: "cancelled",
//   },
//   {
//     id: 3,
//     guest: "Sophia Lee",
//     listing: "Cozy Cabin in the Mountains",
//     date: "2025-11-10",
//     nights: 2,
//     status: "upcoming",
//   },
// ];

// const statusColors = {
//   confirmed: "success",
//   cancelled: "error",
//   upcoming: "warning",
// };

// const Reservations = () => {
//   return (
//     <Container maxWidth="lg" sx={{ py: 5 }}>
//       <Typography variant="h5" fontWeight="bold" mb={3}>
//         Reservations
//       </Typography>

//       <TableContainer
//         component={Paper}
//         sx={{
//           borderRadius: 3,
//           boxShadow: 3,
//           overflow: "hidden",
//         }}
//       >
//         <Table>
//           <TableHead>
//             <TableRow sx={{ bgcolor: "#f5f5f5" }}>
//               <TableCell>Guest</TableCell>
//               <TableCell>Listing</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Nights</TableCell>
//               <TableCell>Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {reservations.map((res) => (
//               <TableRow
//                 key={res.id}
//                 sx={{
//                   "&:hover": { backgroundColor: "#f9f9f9", cursor: "pointer" },
//                 }}
//               >
//                 <TableCell>{res.guest}</TableCell>
//                 <TableCell>{res.listing}</TableCell>
//                 <TableCell>{res.date}</TableCell>
//                 <TableCell>{res.nights}</TableCell>
//                 <TableCell>
//                   <Chip
//                     label={
//                       res.status.charAt(0).toUpperCase() + res.status.slice(1)
//                     }
//                     color={statusColors[res.status]}
//                     size="small"
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// };

// export default Reservations;

import React, { useEffect, useState } from "react";
import {
  Container,
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
} from "@mui/material";
import axiosInstance from "../../axiousInstance/axoiusInstance";

const statusColors = {
  pending: "warning",
  confirmed: "success",
  cancelled: "error",
  completed: "info",
};

const HostReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axiosInstance.get("/api/reservations"); 
             
        setReservations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading)
    return (
      <Container maxWidth="lg" sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        My Reservations
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell>Guest</TableCell>
              <TableCell>Listing</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No reservations found.
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((res) => (
                <TableRow
                  key={res._id}
                  sx={{
                    "&:hover": { backgroundColor: "#f9f9f9" },
                  }}
                >
                  <TableCell>{res.guestId?.name || "Unknown"}</TableCell>
                  <TableCell>{res.hotelId?.name || "N/A"}</TableCell>
                  <TableCell>
                    {res.checkIn ? new Date(res.checkIn).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    {res.checkOut ? new Date(res.checkOut).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>{res.guestsCount}</TableCell>
                  <TableCell>${res.totalPrice}</TableCell>
                  <TableCell>
                    <Chip
                      label={res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                      color={statusColors[res.status]}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default HostReservations;
