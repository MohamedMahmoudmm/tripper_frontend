import "./App.css";
import LoginPage from "./pages/auth";
// import OnboardingPage from './pages/onBoarding';

import { BrowserRouter, Routes, Route } from "react-router-dom";

// LocalizationProvider و AdapterDayjs
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import HomePage from "./pages/home";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<OnboardingPage />} /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
