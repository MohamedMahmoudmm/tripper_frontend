import "./App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Toaster } from "react-hot-toast";
import OnboardingPage from "./pages/onBoarding";
import LoginPage from "./pages/auth";
import HomePage from "./pages/home";
import DetailsPage from "./pages/details"; // ✅ Hotel/Experience details
import PlaceDetailsPage from "./pages/host/PlaceDetails"; // ✅ Place details with plans
import ChatPage from "./pages/ChatPage";
import FavouritePage from "./pages/favourite";
import ExperiencePage from "./pages/experience";
import PlanPage from "./pages/plan";
import HostRoutes from "./routes/HostRoutes";
import Places from "./pages/host/Places";
import MyTrips from "./pages/MyTrips";
import Navbar from "./components/sharedComponents/navbar";
import CityHotelsPage from "./pages/cityhotelPage";
import CityExperiencePage from "./pages/cityExperincePage";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/paymentPage";
import RegisterPage from "./pages/registerPage";
import HostProfile from "./pages/hostProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import FAQ from "./pages/FAQ";
import Help from "./pages/Help";
import PlanCreate from "./pages/host/PlanCreate";
import Plans from "./pages/plan";
import PlanDetails from "./pages/host/planDetails";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const ProtectedHostRoute = ({ children }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  return user?.activeRole === "host" ? children : <Navigate to="/home" replace />;
};

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/login", "/signup", "/verify-email", "/forgot-password", "/reset-password"];
  const isHostRoute = location.pathname.startsWith("/host");

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && !isHostRoute && (
        <Navbar />
      )}

      <Routes>
        {/* ============= Auth Routes ============= */}
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* ============= Main Pages ============= */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/experiences" element={<ExperiencePage />} />
        <Route path="/favourites" element={<FavouritePage />} />
        <Route path="/my-trips" element={<MyTrips />} />

<Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
<Route path="/plans/:id" element={<ProtectedRoute><PlanDetails /></ProtectedRoute>} />

        {/* ============= Places Routes ============= */}
        <Route path="/places" element={<Places />} />
        <Route path="/places/details/:id" element={<PlaceDetailsPage />} /> {/* ✅ Place with Plans */}

        {/* ============= Plans Routes ============= */}
        <Route path="/plans/create" element={<ProtectedRoute><PlanCreate /></ProtectedRoute>} />

        {/* ============= Hotel & Experience Details ============= */}
        <Route path="/:model/details/:id" element={<DetailsPage />} /> {/* ✅ Hotel/Experience */}

        {/* ============= Profile Routes ============= */}
        <Route path="/guest/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/host/profile/:hostId" element={<HostProfile />} />

        {/* ============= City Pages ============= */}
        <Route path="/city/:city" element={<CityHotelsPage />} />
        <Route path="/experience-city/:city" element={<CityExperiencePage />} />

        {/* ============= Payment ============= */}
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/:reservationId" element={<PaymentPage />} />

        {/* ============= Chat ============= */}
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        {/* ============= Host Routes ============= */}
        <Route path="/host/*" element={<ProtectedHostRoute><HostRoutes /></ProtectedHostRoute>} />

        {/* ============= Footer Pages ============= */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 1500,
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
