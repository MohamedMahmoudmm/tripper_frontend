import "./App.css";
import LoginPage from "./pages/auth";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import OnboardingPage from "./pages/onBoarding";
import HomePage from "./pages/home";
import PlaceDetails from "./pages/details";
import FavouritePage from "./pages/favourite";
import ExperiencePage from "./pages/experience";
import PlanPage from "./pages/plan";
function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/details" element={<PlaceDetails />} />
          <Route path="/details/:id" element={<PlaceDetails />} />
          <Route path="/favourites" element={<FavouritePage />} />
          <Route path="/experiences" element={<ExperiencePage />} />
          <Route path="/plan" element={<PlanPage />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
