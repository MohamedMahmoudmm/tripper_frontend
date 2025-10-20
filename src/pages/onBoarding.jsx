import { Box } from "@mui/material";
import Footer from "../components/footer";
import HeaderSection from "../components/headerSection";
import ServicesSection from "../components/serviceSection";
import TopPlacesSection from "../components/topPlacesSection";
import AuthNavBar from "../components/authNavBar";


export default function OnboardingPage() {
    return (
        <Box>
            <AuthNavBar></AuthNavBar>
            <HeaderSection></HeaderSection>
            <ServicesSection></ServicesSection>
            <TopPlacesSection></TopPlacesSection>
            <Footer></Footer>
        </Box>
    );
}
