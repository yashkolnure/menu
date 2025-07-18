import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
import MenuPageWithoutCart from "./pages/MenuPageWithoutCart";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantRegister from "./pages/RestaurantRegister";
import LandingPage from './pages/LandingPage';
import RestaurantDetails from "./pages/RestaurantDetails";
import BulkUploadmenu from "./pages/freefree";
import BulkUploadmenu1 from "./pages/freefree1";
import AdminLoginPage1 from "./pages/loginbulk";
import Loginfree from "./pages/loginfree";
import UserMenuCreator from "./pages/UserMenuCreator";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import RegisterFreePage from "./pages/registerfree";
import NotFound from "./pages/NotFound"; // ✅ Adjust path if needed
import Dsbrd from "./pages/dsbrd";
import Dsbrdadmin1 from "./pages/dsbrdadmin1";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/menu/:id" element={<MenuPageWithoutCart />} />
        <Route path="/restaurant/:id" element={<RestaurantMenuPage />} />
        <Route path="/dsbrd" element={<Dsbrd />} />
        <Route path="/dsbrdadmin1" element={<Dsbrdadmin1 />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/register-restaurant" element={<RestaurantRegister />} />
        <Route path="/restaurant-details" element={<RestaurantDetails />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/freefree" element={<BulkUploadmenu />} />
        <Route path="/freefree1" element={<BulkUploadmenu1 />} />
        <Route path="/login1" element={<AdminLoginPage1 />} />
        <Route path="/free" element={<UserMenuCreator />} />
        <Route path="/login" element={<Loginfree />} />
        <Route path="/register" element={<RegisterFreePage />} />
        <Route path="/yashkolnure" element={<SuperAdminDashboard />} />
        <Route path="*" element={<NotFound />} />
        {/* More routes coming later like admin login/dashboard */}
      </Routes>
    </Router>
  );
}


export default App;
