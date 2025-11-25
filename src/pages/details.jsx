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
  const [canReview, setCanReview] = useState(true);

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/${model}/${id}`).then((res) => {
       console.log('place'+res.data);
       
        model === "places" ? setPlace(res.data.data):setPlace(res.data);
        model!=='Places' && axiosInstance.get(`/api/reservations/${model==='hotel'?'hotel':'experience'}/${id}`).then((res) => {
          console.log('reserv');
          
          if (res.data.length > 0) {
            setCanReview(true);
          }
          else {
            setCanReview(false);
          }
        })
      }).catch((err) => {
        console.log(err);
      
      });
    }
  }, [id, model]);

  if (!place) return null;

  const formatModel = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  console.log('placeeee'+formatModel(model));
  
  return (
    <Box sx={{ p: 4, backgroundColor: "#fafafa", minHeight: "100vh" }}>
<GridImages 
  images={place.images} 
  title={place.name}
  itemId={place._id}
  itemType="Place"
/>
      <DescriptonComponent place={place} model={formatModel(model)} />
      {
        model === "hotel" ? <PlaceOffers amenities={place.amenities} />:model === "experiance" ? <WhatYoullDo activities={place.activities} />:null
      }

      {
        !canReview && <PlaceReviews model={model==='places'?'Place':formatModel(model)} itemId={id} />}

      <FooterComponent />
    </Box>
  );
}
