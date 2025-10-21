import { Box } from "@mui/material";
import AuthNavBar from "../components/onBoardingComponents/authNavBar";
import HeaderSection from "../components/onBoardingComponents/headerSection";
import ServicesSection from "../components/onBoardingComponents/serviceSection";
import TopPlacesSection from "../components/onBoardingComponents/topPlacesSection";
import FooterComponent from "../components/onBoardingComponents/footer";


export default function OnboardingPage() {
    return (
        <Box>
            <AuthNavBar></AuthNavBar>
            <HeaderSection></HeaderSection>
            <ServicesSection></ServicesSection>
            <TopPlacesSection></TopPlacesSection>
            <FooterComponent></FooterComponent>
        </Box>
    );
}
