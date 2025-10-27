import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import PopularHomesCarousel from "../components/PopularHomesCarousel";
import ExperiencePage from "./experience";
import FavouritePage from "./favourite";
import hotelService from "../services/hotels.service";
import Places from "./host/Places";

const HomePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await hotelService.getAllHotels();
        const formatted = data.map((h) => ({
          image: h.images?.[0] || "https://via.placeholder.com/150",
          title: h.name,
          rating: h.starRating || 4.5,
          price: `${h.price} ج.م / night`,
          id: h._id,
          model: "hotel",
        }));
        setHomes(formatted);
      } catch (err) {
        console.error("Error loading hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const renderBody = () => {
    if (loading) return <p style={{ textAlign: "center" }}>Loading hotels...</p>;

    switch (tabValue) {
      case 0:
        return <PopularHomesCarousel homes={homes} title="Popular Homes in Egypt" />;
      case 1:
        return <ExperiencePage />;
      case 2:
        return <FavouritePage />;
      case 3:
        return <Places />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar tabValue={tabValue} setTabValue={setTabValue} />
      {renderBody()}
    </>
  );
};

export default HomePage;