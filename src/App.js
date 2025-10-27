import "./App.css";
import LoginPage from "./pages/auth";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import OnboardingPage from "./pages/onBoarding";
import HomePage from "./pages/home";
import PlaceDetails from "./pages/details";
import ChatPage from "./pages/ChatPage";
import FavouritePage from "./pages/favourite";
import ExperiencePage from "./pages/experience";
import PlanPage from "./pages/plan";
import HostRoutes from "./routes/HostRoutes";
import Places from "./pages/host/Places";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/:model/details/:id" element={<PlaceDetails />} />
          <Route path="/plan" element={<PlanPage />} />
        


             {/*  host */}
          <Route path="/host/*" element={<HostRoutes />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
