// src/pages/home.jsx
import React, { useState, useEffect } from "react";
import PopularHomesCarousel from "../components/sharedComponents/PopularHomesCarousel";
import hotelService from "../services/hotels.service";

const HomePage = () => {
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

  if (loading) return <p style={{ textAlign: "center" }}>Loading hotels...</p>;

  return <PopularHomesCarousel homes={homes} title="Popular Homes in Egypt" />;
};

export default HomePage;
