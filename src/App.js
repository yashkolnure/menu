import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
import MenuPageWithoutCart from "./pages/MenuPageWithoutCart";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantRegister from "./pages/RestaurantRegister";
import LandingPage from './pages/LandingPage';
import RestaurantDetails from "./pages/RestaurantDetails";
import BulkMenuUploader from "./pages/bulkupload";
import BulkUploadmenu from "./pages/freefree";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/menu/:id" element={<MenuPageWithoutCart />} />
        <Route path="/restaurant/:id" element={<RestaurantMenuPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/register-restaurant" element={<RestaurantRegister />} />
        <Route path="/restaurant-details" element={<RestaurantDetails />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/freefree" element={<BulkUploadmenu />} />
        <Route path="/upload-menu" element={<BulkMenuUploader />} />
        {/* More routes coming later like admin login/dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
