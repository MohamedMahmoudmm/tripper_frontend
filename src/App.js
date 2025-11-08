import "./App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Toaster } from "react-hot-toast";
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
import CityHotelsPage from "./pages/cityhotelPage";
import CityExperiencePage from "./pages/cityExperincePage";
import GuestProfile from "./pages/guestProfile";
import PaymentPage from "./pages/paymentPage";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // or your specific token key
  return token ? children : <Navigate to="/login" replace />;
};
const ProtectedHostRoute = ({ children }) => {
  const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
  return user.activeRole === "host" ? children : <Navigate to="/home" replace />;
};
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
        <Route path="/profile" element={<ProtectedRoute><GuestProfile /></ProtectedRoute>} />
        <Route path="/experiences" element={<ExperiencePage /> } />
        <Route path="/favourites" element={<FavouritePage />} />
        <Route path="/places" element={<Places />} />
        <Route path="/:model/details/:id" element={<PlaceDetails />} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/plan" element={<PlanPage />} />

        <Route path="/host/*" element={<ProtectedHostRoute><HostRoutes /></ProtectedHostRoute>} />
        <Route path="/city/:city" element={<CityHotelsPage />} />
        <Route path="/experience-city/:city" element={<CityExperiencePage />} />
        <Route path="/payment" element={<PaymentPage />} />

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <AppContent />

        {/*  Toast  */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              fontWeight: 600,
              padding: "14px 18px",
              fontSize: "15px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            },
            success: {
              style: {
                background: "#FF385C",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#FF385C",
              },
            },
            error: {
              style: {
                background: "#222",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#222",
              },
            },
          }}
        />
      </BrowserRouter>
    </LocalizationProvider>
  );
}
