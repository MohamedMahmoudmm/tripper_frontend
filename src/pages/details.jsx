import {
  Box,
} from "@mui/material";
import GridImages from "../components/detailsComponents/gridImages";
import PlaceOffers from "../components/detailsComponents/placeOffers";
import PlaceReviews from "../components/detailsComponents/placeReviews";
import FooterComponent from "../components/onBoardingComponents/footer";
import DescriptonComponent from "../components/detailsComponents/descriptionComponents";
import { useEffect, useState } from "react";
import axiosInstance from "../axiousInstance/axoiusInstance";
import { useParams } from "react-router-dom";

export default function PlaceDetails() {
  const [place, setPlace] = useState(null);
  const { model, id } = useParams(); 

 useEffect(() => {
  if (id) {
    axiosInstance.get(`/${model}/${id}`).then((res) => {
      console.log(res.data);
      setPlace(res.data);
    });
  }
}, [id, model]);


  if (!place) return null;

  return (
    <Box sx={{ p: 4, backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <GridImages images={place.images} title={place.name+", "+place.address.city} />
      <DescriptonComponent place={place} />
      <PlaceOffers />
      <PlaceReviews />
      <FooterComponent />
    </Box>
  );
}
