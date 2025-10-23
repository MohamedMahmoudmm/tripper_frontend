import {
  Box,
} from "@mui/material";
import GridImages from "../components/detailsComponents/gridImages";
import PlaceOffers from "../components/detailsComponents/placeOffers";
import PlaceReviews from "../components/detailsComponents/placeReviews";
import FooterComponent from "../components/onBoardingComponents/footer";
import DescriptonComponent from "../components/detailsComponents/descriptionComponents";
import DefaultNavBar from "../components/defaultNavBar";
import { useEffect, useState } from "react";

export default function PlaceDetails() {
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("selectedPlace"));
    setPlace(stored);
  }, []);

  if (!place) return null;

  return (
    <Box sx={{ p: 4, backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <DefaultNavBar />
      <GridImages image={place.image} title={place.title} />
      <DescriptonComponent place={place} />
      <PlaceOffers />
      <PlaceReviews />
      <FooterComponent />
    </Box>
  );
}
