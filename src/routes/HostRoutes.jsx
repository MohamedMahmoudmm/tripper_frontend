import React from "react";
import { Routes, Route } from "react-router-dom";
import HostLayout from "../components/host/HostLayout";
import MyListings from "../pages/host/MyListings";
import AddListing from "../pages/host/AddListing";
import EditListing from "../pages/host/EditListing";
import HostProfile from "../pages/host/HostProfile";
import Reservations from "../pages/host/Reservations";
import Dashboard from "../pages/host/Dashboard";
import EditProfile from "../pages/host/EditProfile";
import TopAttractions from "../pages/host/Places";
import Places from "../pages/host/Places";

const HostRoutes = () => {
  return (
    <HostLayout>
      <Routes>
        {/* Dashboard host */}
        <Route path="/dashboard" element={<Dashboard />} />


        {/*  listings  */}
        <Route path="/listings" element={<MyListings />} />
        <Route path="/add" element={<AddListing />} />
        <Route path="/edit/:id" element={<EditListing />} />

        {/*  profile */}
        <Route path="/profile" element={<HostProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />


        {/* reservations */}
        <Route path="/reservations" element={<Reservations />} />
        <Route path = "/places" element={<Places />} />
      </Routes>
    </HostLayout>
  );
};

export default HostRoutes;
