import { Box } from "@mui/material";
import HeaderSection from "../components/headerSection";
import ServicesSection from "../components/serviceSection";
import TopPlacesSection from "../components/topPlacesSection";
import AuthNavBar from "../components/authNavBar";
import FooterComponent from "../components/footer";


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
