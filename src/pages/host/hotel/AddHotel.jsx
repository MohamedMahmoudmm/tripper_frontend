// import React, { useState } from "react";
// import {
//   Container,
//   Paper,
//   Typography,
//   Divider,
//   Box,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { useForm, FormProvider } from "react-hook-form";
// import { useNavigate } from "react-router-dom";

// import ListingDetailsForm from "../../../components/host/hotel/ListingDetailsForm";
// import AmenitiesForm from "../../../components/host/hotel/AmenitiesForm";
// import PhotosUploader from "../../../components/host/hotel/PhotosUploader";
// import SubmitSection from "../../../components/host/hotel/SubmitSection";
// import axiosInstance from "../../../axiousInstance/axoiusInstance";
// import HostLayout from "../../../components/host/HostLayout";

// const AddHotel = () => {
//   const methods = useForm({
//     defaultValues: {
//       title: "",
//       description: "",
//       price: "",
//       country: "",
//       city: "",
//       street: "",
//       amenities: [],
//       starRating: 0,
//       photos: [],
//     },
//   });

//   const navigate = useNavigate();
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const onSubmit = async (data) => {
//     try {
//       const formData = new FormData();

//       formData.append("name", data.title);
//       formData.append("description", data.description);
//       formData.append("price", Number(data.price));
      
//       formData.append("address[country]", data.country || "Egypt");
//       formData.append("address[city]", data.city || "Cairo");
//       formData.append("address[street]", data.street || "Any Street");

//       formData.append("amenities", JSON.stringify(data.amenities || []));

//       data.photos.forEach((file) => formData.append("images", file));

//       await axiosInstance.post("/hotel", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setSnackbar({
//         open: true,
//         message: "Hotel added successfully!",
//         severity: "success",
//       });

//       methods.reset();

//       setTimeout(() => navigate("/host/listings"), 1000);
//     } catch (err) {
//       console.error("Add hotel error:", err.response?.data || err);
//       setSnackbar({
//         open: true,
//         message: err.response?.data?.message || "Failed to add hotel",
//         severity: "error",
//       });
//     }
//   };

//   return (
//     <HostLayout>
//       <Container maxWidth="md" >
//         <Paper
//           elevation={3}
//           sx={{
//             p: { xs: 2, sm: 4 },
//             borderRadius: 4,
//           }}
//         >
//           <Typography
//             variant="h4"
//             fontWeight="bold"
//             gutterBottom
//             textAlign="center"
//             color="primary"
//           >
//             🏨 Add Hotel
//           </Typography>

//           <Divider sx={{ mb: 4 }} />

//           <FormProvider {...methods}>
//             <Box
//               component="form"
//               onSubmit={methods.handleSubmit(onSubmit)}
//               noValidate
//             >
//               {/* Details */}
//               <Paper sx={{ p: 3, mb: 3 }}>
//                 <ListingDetailsForm type="hotel" />
//               </Paper>

//               {/* Amenities */}
//               <Paper sx={{ p: 3, mb: 3 }}>
//                 <AmenitiesForm />
//               </Paper>

//               {/* Photos */}
//               <Paper sx={{ p: 3, mb: 3 }}>
//                 <PhotosUploader />
//               </Paper>

//               <Box textAlign="center">
//                 <SubmitSection onSubmit={methods.handleSubmit(onSubmit)} />
//               </Box>
//             </Box>
//           </FormProvider>
//         </Paper>

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={3000}
//           onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Container>
//     </HostLayout>
//   );
// };

// export default AddHotel;


import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ListingDetailsForm from "../../../components/host/hotel/ListingDetailsForm";
import AmenitiesForm from "../../../components/host/hotel/AmenitiesForm";
import PhotosUploader from "../../../components/host/hotel/PhotosUploader";
import SubmitSection from "../../../components/host/hotel/SubmitSection";
import HostLayout from "../../../components/host/HostLayout";
import hotelService from "../../../services/hotels.service"; 

const AddHotel = () => {
  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      country: "",
      city: "",
      street: "",
      amenities: [],
      starRating: 0,
      photos: [],
    },
  });

  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.title);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));

      formData.append("address[country]", data.country || "Egypt");
      formData.append("address[city]", data.city || "Cairo");
      formData.append("address[street]", data.street || "Any Street");

      formData.append("amenities", JSON.stringify(data.amenities || []));

      data.photos.forEach((file) => formData.append("images", file));
      
      await hotelService.addHotel(formData);

      setSnackbar({
        open: true,
        message: "Hotel added successfully!",
        severity: "success",
      });

      methods.reset();
      setTimeout(() => navigate("/host/listings"), 1000);
    } catch (err) {
      console.error("Add hotel error:", err.response?.data || err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to add hotel",
        severity: "error",
      });
    }
  };

  return (
    <HostLayout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            color="primary"
          >
            🏨 Add Hotel
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <FormProvider {...methods}>
            <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
              <Paper sx={{ p: 3, mb: 3 }}>
                <ListingDetailsForm type="hotel" />
              </Paper>

              <Paper sx={{ p: 3, mb: 3 }}>
                <AmenitiesForm />
              </Paper>

              <Paper sx={{ p: 3, mb: 3 }}>
                <PhotosUploader />
              </Paper>

              <Box textAlign="center">
                <SubmitSection onSubmit={methods.handleSubmit(onSubmit)} />
              </Box>
            </Box>
          </FormProvider>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </HostLayout>
  );
};

export default AddHotel;
