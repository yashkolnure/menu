import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantRegister from "./pages/RestaurantRegister";
import LandingPage from './pages/LandingPage';
import RestaurantDetails from "./pages/RestaurantDetails";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/restaurant/:id" element={<RestaurantMenuPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/register-restaurant" element={<RestaurantRegister />} />
        <Route path="/restaurant-details" element={<RestaurantDetails />} />
        <Route path="/" element={<LandingPage />} />
        {/* More routes coming later like admin login/dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
