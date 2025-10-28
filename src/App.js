import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import OnboardingPage from "./pages/onBoarding";
import LoginPage from "./pages/auth";
import HomePage from "./pages/home";
import PlaceDetails from "./pages/details";
import ChatPage from "./pages/ChatPage";
import FavouritePage from "./pages/favourite";
import ExperiencePage from "./pages/experience";
import PlanPage from "./pages/plan";
import HostRoutes from "./routes/HostRoutes";
import Places from "./pages/host/Places";
import Navbar from "./components/sharedComponents/navbar";

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/login"];
  const isHostRoute = location.pathname.startsWith("/host");

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && !isHostRoute && (
        <Navbar />
      )}

      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/experiences" element={<ExperiencePage />} />
        <Route path="/favourites" element={<FavouritePage />} />
        <Route path="/places" element={<Places />} />
        <Route path="/:model/details/:id" element={<PlaceDetails />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/plan" element={<PlanPage />} />

        <Route path="/host/*" element={<HostRoutes />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LocalizationProvider>
  );
}
