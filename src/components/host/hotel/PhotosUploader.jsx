// import React from "react";
// import { Box, Typography, Button, Stack } from "@mui/material";
// import { useFormContext } from "react-hook-form";

// const PhotosUploader = () => {
//   const { watch, setValue } = useFormContext();
//   const photos = watch("photos") || [];

//   const handleAddPhoto = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imgURL = URL.createObjectURL(file);
//       setValue("photos", [...photos, imgURL]);
//     }
//   };

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6" fontWeight="bold" gutterBottom>Photos</Typography>
//       <Stack direction="row" spacing={2} flexWrap="wrap" mb={1}>
//         {photos.map((photo, i) => (
//           <img key={i} src={photo} alt="listing" style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 6 }} />
//         ))}
//       </Stack>
//       <Button variant="outlined" component="label">Upload Photo
//         <input type="file" hidden accept="image/*" onChange={handleAddPhoto} />
//       </Button>
//     </Box>
//   );
// };

// export default PhotosUploader;



// import React, { useState } from "react";
// import { Box, Button, Typography, Stack } from "@mui/material";
// import { useFormContext } from "react-hook-form";

// const PhotosUploader = () => {
//   const { setValue, watch } = useFormContext();
//   const photos = watch("photos") || [];
//   const [previewUrls, setPreviewUrls] = useState([]);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);

//     // خزن الملفات في الفورم
//     setValue("photos", files);

//     // عرض صور مبدئية (preview)
//     const previews = files.map((file) => URL.createObjectURL(file));
//     setPreviewUrls(previews);
//   };

//   return (
//     <Box>
//       <Typography variant="h6" fontWeight="bold" mb={2}>
//         Upload Photos
//       </Typography>

//       <Button
//         variant="contained"
//         component="label"
//         sx={{
//           bgcolor: "#FF385C",
//           "&:hover": { bgcolor: "#e22d50" },
//           borderRadius: 3,
//           textTransform: "none",
//           fontWeight: 600,
//         }}
//       >
//         Select Images
//         <input type="file" hidden multiple onChange={handleFileChange} />
//       </Button>

//       {previewUrls.length > 0 && (
//         <Stack spacing={1} mt={2}>
//           {previewUrls.map((url, index) => (
//             <Box
//               key={index}
//               component="img"
//               src={url}
//               alt="preview"
//               sx={{
//                 width: "100%",
//                 height: 160,
//                 objectFit: "cover",
//                 borderRadius: 2,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               }}
//             />
//           ))}
//         </Stack>
//       )}
//     </Box>
//   );
// };

// export default PhotosUploader;



// import React, { useState, useEffect } from "react";
// import { Box, Button, Typography, Stack, IconButton } from "@mui/material";
// import { useFormContext } from "react-hook-form";
// import { Delete } from "@mui/icons-material";

// const PhotosUploader = () => {
//   const { setValue, watch } = useFormContext();
//   const photos = watch("photos") || []; // الصور الجديدة اللي المستخدم بيختارها
//   const oldPhotos = watch("oldPhotos") || []; // الصور القديمة من السيرفر

//   const [previewUrls, setPreviewUrls] = useState([]);
//   const [existingPhotos, setExistingPhotos] = useState([]);

//   // 📦 تحميل الصور القديمة في الحالة
// useEffect(() => {
//   if (Array.isArray(oldPhotos) && oldPhotos.length !== existingPhotos.length) {
//     setExistingPhotos(oldPhotos);
//   }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [oldPhotos]);


//   // 📤 لما المستخدم يختار صور جديدة
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setValue("photos", files);

//     // توليد الـ preview
//     const previews = files.map((file) => URL.createObjectURL(file));
//     setPreviewUrls(previews);
//   };

//   // 🗑️ حذف صورة قديمة (قبل الحفظ)
//   const handleRemoveOldPhoto = (index) => {
//     const updated = existingPhotos.filter((_, i) => i !== index);
//     setExistingPhotos(updated);
//     setValue("oldPhotos", updated); // حدث القيمة داخل الفورم
//   };

//   // 🗑️ حذف صورة جديدة قبل رفعها
//   const handleRemoveNewPhoto = (index) => {
//     const updatedFiles = photos.filter((_, i) => i !== index);
//     const updatedPreviews = previewUrls.filter((_, i) => i !== index);
//     setValue("photos", updatedFiles);
//     setPreviewUrls(updatedPreviews);
//   };

//   return (
//     <Box>
//       <Typography variant="h6" fontWeight="bold" mb={2}>
//         Upload Photos
//       </Typography>

//       {/* زر رفع الصور */}
//       <Button
//         variant="contained"
//         component="label"
//         sx={{
//           bgcolor: "#FF385C",
//           "&:hover": { bgcolor: "#e22d50" },
//           borderRadius: 3,
//           textTransform: "none",
//           fontWeight: 600,
//         }}
//       >
//         Select Images
//         <input type="file" hidden multiple onChange={handleFileChange} />
//       </Button>

//       {/* الصور القديمة */}
//       {existingPhotos.length > 0 && (
//         <>
//           <Typography variant="subtitle1" mt={3} mb={1}>
//             Existing Photos:
//           </Typography>
//           <Stack direction="row" flexWrap="wrap" gap={1}>
//             {existingPhotos.map((url, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   position: "relative",
//                   width: 120,
//                   height: 120,
//                   borderRadius: 2,
//                   overflow: "hidden",
//                   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 <img
//                   src={url}
//                   alt={`old-${index}`}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />
//                 <IconButton
//                   size="small"
//                   color="error"
//                   onClick={() => handleRemoveOldPhoto(index)}
//                   sx={{
//                     position: "absolute",
//                     top: 4,
//                     right: 4,
//                     bgcolor: "rgba(255,255,255,0.7)",
//                     "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
//                   }}
//                 >
//                   <Delete fontSize="small" />
//                 </IconButton>
//               </Box>
//             ))}
//           </Stack>
//         </>
//       )}

//       {/* الصور الجديدة */}
//       {previewUrls.length > 0 && (
//         <>
//           <Typography variant="subtitle1" mt={3} mb={1}>
//             New Photos:
//           </Typography>
//           <Stack direction="row" flexWrap="wrap" gap={1}>
//             {previewUrls.map((url, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   position: "relative",
//                   width: 120,
//                   height: 120,
//                   borderRadius: 2,
//                   overflow: "hidden",
//                   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 <img
//                   src={url}
//                   alt={`new-${index}`}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />
//                 <IconButton
//                   size="small"
//                   color="error"
//                   onClick={() => handleRemoveNewPhoto(index)}
//                   sx={{
//                     position: "absolute",
//                     top: 4,
//                     right: 4,
//                     bgcolor: "rgba(255,255,255,0.7)",
//                     "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
//                   }}
//                 >
//                   <Delete fontSize="small" />
//                 </IconButton>
//               </Box>
//             ))}
//           </Stack>
//         </>
//       )}
//     </Box>
//   );
// };

// export default PhotosUploader;



import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Stack, IconButton } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { Delete } from "@mui/icons-material";

const PhotosUploader = () => {
  const { setValue, watch } = useFormContext();
  const photos = watch("photos") || [];
  const oldPhotos = watch("oldPhotos") || [];

  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  // رفع الصور القديمة مرة واحدة فقط
  useEffect(() => {
    if (Array.isArray(oldPhotos) && oldPhotos.length !== existingPhotos.length) {
      setExistingPhotos(oldPhotos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldPhotos]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setValue("photos", files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleRemoveOldPhoto = (index) => {
    const updated = existingPhotos.filter((_, i) => i !== index);
    setExistingPhotos(updated);
    setValue("oldPhotos", updated);
  };

  const handleRemoveNewPhoto = (index) => {
    const updatedFiles = photos.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setValue("photos", updatedFiles);
    setPreviewUrls(updatedPreviews);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Upload Photos
      </Typography>

      <Button
        variant="contained"
        component="label"
        sx={{ bgcolor: "#FF385C", "&:hover": { bgcolor: "#e22d50" }, borderRadius: 3, textTransform: "none", fontWeight: 600 }}
      >
        Select Images
        <input type="file" hidden multiple onChange={handleFileChange} />
      </Button>

      {/* الصور القديمة */}
      {existingPhotos.length > 0 && (
        <>
          <Typography variant="subtitle1" mt={3} mb={1}>
            Existing Photos:
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {existingPhotos.map((url, index) => (
              <Box key={index} sx={{ position: "relative", width: 120, height: 120, borderRadius: 2, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <img src={url} alt={`old-${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <IconButton size="small" color="error" onClick={() => handleRemoveOldPhoto(index)} sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(255,255,255,0.7)", "&:hover": { bgcolor: "rgba(255,255,255,0.9)" } }}>
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </>
      )}

      {/* الصور الجديدة */}
      {previewUrls.length > 0 && (
        <>
          <Typography variant="subtitle1" mt={3} mb={1}>
            New Photos:
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {previewUrls.map((url, index) => (
              <Box key={index} sx={{ position: "relative", width: 120, height: 120, borderRadius: 2, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <img src={url} alt={`new-${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <IconButton size="small" color="error" onClick={() => handleRemoveNewPhoto(index)} sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(255,255,255,0.7)", "&:hover": { bgcolor: "rgba(255,255,255,0.9)" } }}>
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default PhotosUploader;
