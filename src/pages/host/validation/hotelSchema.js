import * as yup from "yup";
   
const roomSchema = yup.object().shape({
  name: yup
    .string()
    .required("Room name is required")
    .min(3, "Room name must be at least 3 characters")
    .max(100, "Room name is too long"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than 0")
    .min(10, "Price must be at least $10"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .required("Quantity is required")
    .positive("Quantity must be greater than 0")
    .integer("Quantity must be a whole number")
    .min(1, "At least 1 room is required")
    .max(100, "Cannot exceed 100 rooms"),
  maxGuests: yup
    .number()
    .typeError("Max guests must be a number")
    .required("Max guests is required")
    .positive("Max guests must be greater than 0")
    .integer("Max guests must be a whole number")
    .min(1, "At least 1 guest is required")
    .max(20, "Cannot exceed 20 guests"),
});

// Add Hotel Schema
export const addHotelSchema = yup.object().shape({
  title: yup
    .string()
    .min(2, "Title must be at least 2 characters")
    .required("Title is required"),
  
  description: yup
    .string()
    .min(20, "Description must be at least 20 characters")
    .required("Description is required"),
  
  price: yup
    .number()
    .when("type", {
      is: (val) => val !== "hotel",
      then: (schema) =>
        schema
          .typeError("Price must be a number")
          .positive("Price must be greater than 0")
          .required("Price is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  street: yup.string().required("Street is required"),
  
  amenities: yup
    .array()
    .min(1, "Please select at least one amenity")
    .required("Amenities are required"),
  
  photos: yup
    .array()
    .min(1, "Please upload at least one photo")
    .required("Please upload at least one photo"),
  
  rooms: yup
    .array()
    .of(roomSchema)
    .when("type", {
      is: "hotel",
      then: (schema) =>
        schema.min(1, "Hotels must have at least one room type"),
      otherwise: (schema) => schema.notRequired(),
    }),
});
            
export const editHotelSchema = yup.object().shape({
  title: yup.string().min(2).required("Title is required"),
  
  description: yup.string().min(20).required("Description is required"),
   
  price: yup
    .mixed()
    .nullable()
    .test(
      "price-required",
      "Price is required",
      function(value) {
        const rooms = this.parent.rooms;
                 
        if (rooms && Array.isArray(rooms) && rooms.length > 0) {
          return true;
        }
      
        if (value === null || value === undefined || value === "") {
          return this.createError({
            message: "Price is required for villas and apartments",
          });
        }
        
        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) {
          return this.createError({
            message: "Price must be a positive number",
          });
        }
        
        return true;
      }
    ),
    
  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  street: yup.string().required("Street is required"),
  
  amenities: yup
    .array()
    .min(1, "Please select at least one amenity")
    .required(),
  
  photos: yup.array().test(
    "photos",
    "Please upload at least one photo",
    (value, ctx) => {
      const oldPhotos = ctx.parent.oldPhotos || [];
      return (value && value.length > 0) || (oldPhotos && oldPhotos.length > 0);
    }
  ),
  
  rooms: yup
    .array()
    .of(roomSchema)
    .test(
      "rooms-required",
      "Hotels must have at least one room type",
      function(rooms) {
        if (!rooms || rooms === undefined) {
          return true;
        }
          
        if (Array.isArray(rooms) && rooms.length === 0) {
          return true;
        }
        
        return true;
      }
    ),
});
