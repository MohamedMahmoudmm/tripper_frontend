import { Box } from "@mui/material";
import GridImages from "../components/detailsComponents/gridImages";
import PlaceOffers from "../components/detailsComponents/placeOffers";
import PlaceReviews from "../components/detailsComponents/placeReviews";
import FooterComponent from "../components/onBoardingComponents/footer";
import DescriptonComponent from "../components/detailsComponents/descriptionComponents";
import { useEffect, useState } from "react";
import axiosInstance from "../axiousInstance/axoiusInstance";
import { useParams } from "react-router-dom";
import WhatYoullDo from "../components/detailsComponents/experienceActivity";

export default function PlaceDetails() {
  const [place, setPlace] = useState(null);
  const { model, id } = useParams();
const [canReview, setCanReview] = useState(false);

useEffect(() => {
  if (!id) return;

  axiosInstance.get(`/${model}/${id}`)
    .then(async (res) => {
      
      model === "places" ? setPlace(res.data.data) : setPlace(res.data);

      // ⭐ لو المكان من نوع "places" — خلي الريفيو دايمًا متاح
      if (model === "places") {
        setCanReview(true);
        return;
      }

      // ⭐ باقي الموديلات (hotel / experience)
      const type = model === "hotel" ? "hotel" : "experience";
      const reservationsRes = await axiosInstance.get(`/api/reservations/${type}/${id}`);

      setCanReview(reservationsRes.data.length > 0);

    })
    .catch((err) => {
      console.log(err);
    });

}, [id, model]);


  if (!place) return null;

  const formatModel = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  console.log('placeeee'+formatModel(model));
  
  return (
    <Box sx={{ p: 4, backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <GridImages
        images={place.images}
        title={place.name}
        location = {place.address}
        />
      <DescriptonComponent place={place} model={formatModel(model)} />
      {
        model === "hotel" ? <PlaceOffers amenities={place.amenities} />:model === "experiance" ? <WhatYoullDo activities={place.activities} />:null
      }

      {
        <PlaceReviews canReview={canReview} model={model==='places'?'Place':formatModel(model)} itemId={id} />}

      <FooterComponent />
    </Box>
  );
}
