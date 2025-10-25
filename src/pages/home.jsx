import React, { useState } from "react";
import Navbar from "../components/navbar";
import PopularHomesCarousel from "../components/PopularHomesCarousel";
import ExperiencePage from "./experience";
import FavouritePage from "./favourite";

const HomePage = () => {
  const [tabValue, setTabValue] = useState(0);
const home = [
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
    title: "Sea View Room in Hurghada",
    price: "2,800 ج.م / night",
    rating: 4.9,
  },
  {
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60",
    title: "Modern Studio in El Gouna",
    price: "1,500 ج.م / night",
    rating: 4.8,
  },
  {
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=60",
    title: "Luxury Apartment in Sharm El Sheikh",
    price: "3,600 ج.م / night",
    rating: 5.0,
  },
  {
    image:
      "https://images.unsplash.com/photo-1600585154780-0c77d90d1b1c?auto=format&fit=crop&w=800&q=60",
    title: "Cozy Room in Dahab",
    price: "1,200 ج.م / night",
    rating: 4.7,
  },
  {
    image:
      "https://images.unsplash.com/photo-1586105251261-72a756497a12?auto=format&fit=crop&w=800&q=60",
    title: "Beachfront Chalet in Marsa Alam",
    price: "2,400 ج.م / night",
    rating: 4.95,
  },
];

  const renderBody = () => {
    switch (tabValue) {
      case 0:
        return  <PopularHomesCarousel
      homes={home}
      title="Popular Homes in Egypt"
    />;
      case 1:
        return <ExperiencePage />;
      case 2:
              return <FavouritePage />;
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
