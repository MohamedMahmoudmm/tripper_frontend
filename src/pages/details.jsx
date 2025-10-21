import {
    Box,
} from "@mui/material";
import GridImages from "../components/detailsComponents/gridImages";
import PlaceOffers from "../components/detailsComponents/placeOffers";
import PlaceReviews from "../components/detailsComponents/placeReviews";
import FooterComponent from "../components/onBoardingComponents/footer";
import DescriptonComponent from "../components/detailsComponents/descriptionComponents";


export default function PlaceDetails() {
    return (
        <Box sx={{ p: 4, backgroundColor: "#fafafa", minHeight: "100vh" }}>
            <GridImages />
            <DescriptonComponent></DescriptonComponent>
            <PlaceOffers></PlaceOffers>
            <PlaceReviews></PlaceReviews>
            <FooterComponent></FooterComponent>
        </Box>
    );
}
