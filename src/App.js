import './App.css';
import LoginPage from './pages/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlaceDetails from './pages/details';
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<PlaceDetails />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
