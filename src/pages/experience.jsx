import React, { useState, useEffect } from "react";
import PopularHomesCarousel from "../components/PopularHomesCarousel";
import experienceService from "../services/experince.service";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await experienceService.getAllExperiences();
        const formatted = data.map((exp) => ({
          image: exp.images?.[0] || "https://via.placeholder.com/400",
          title: exp.name,
          rating: exp.starRating || 4.8,
          price: exp.price ? `${exp.price} ج.م` : "Price not set",
          id: exp._id,
          model: "experiance",
        }));
        setExperiences(formatted);
      } catch (err) {
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading Experiences...
      </p>
    );
  }

  return (
    <PopularHomesCarousel
      homes={experiences}
      title="Top Experiences in Egypt"
    />
  );
}