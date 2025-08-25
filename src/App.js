import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
import RestaurantMenuPagewp from "./pages/Menuwporder";
import MenuPageWithoutCart from "./pages/MenuPageWithoutCart";
import MenuPageWithoutCartCloud from "./pages/MenuPageWithoutCartCloud";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantRegister from "./pages/RestaurantRegister";
import LandingPage from './pages/LandingPage';
import RestaurantDetails from "./pages/RestaurantDetails";
import BulkUploadmenu from "./pages/freefree";
import BulkUploadmenu1 from "./pages/freefree1";
import AdminLoginPage1 from "./pages/loginbulk";
import Loginpro from "./pages/loginpro";
import Proedit from "./pages/proedit";
import Loginfree from "./pages/loginfree";
import UserMenuCreator from "./pages/UserMenuCreator";
import MembershipPage from "./pages/MembershipPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import RegisterFreePage from "./pages/registerfree";
import NotFound from "./pages/NotFound";
import Dsbrdadmin1 from "./pages/dsbrdadmin1";
import Agentlogin from "./pages/agentlogin";
import Beautysalon from "./pages/beautysalon";
import ContactPage from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AgencyPage from "./pages/Agency";
import AgencyRegister from "./pages/AgencyRegister";
import AgencyLogin from "./pages/AgencyLogin";
import BulkUploadInfo from "./pages/bulkuploadinfo";
import AgencyDashboard from "./pages/AgencyDashboard";
import Dashboard from "./pages/Dashboard";
import FeaturesPage from "./pages/FeaturesPage";
import Kolnure from "./pages/Kolnure";
import Kolnuree from "./pages/kolnureyash";
import MembershipUpgrade from "./pages/MembershipUpgrade";

// Wrapper to handle conditional Header/Footer
function AppWrapper() {
  const location = useLocation();

  // Pages where we want to hide Header/Footer
  const noHeaderFooterRoutes = [
    "/menu/:id",
    "/cloudkitchen/:id",
    "/menuwp/:id",
    "/shop/:id",
    "/restaurant/:id",
  ];

  // Check current route
  const hideHeaderFooter = noHeaderFooterRoutes.some(path => {
    const regex = new RegExp("^" + path.replace(":id", "[^/]+") + "$");
    return regex.test(location.pathname);
  });

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/menu/:id" element={<MenuPageWithoutCart />} />
        <Route path="/cloudkitchen/:id" element={<MenuPageWithoutCartCloud />} />
        <Route path="/menuwp/:id" element={<RestaurantMenuPagewp />} />
        <Route path="/shop/:id" element={<Beautysalon />} />
        <Route path="/restaurant/:id" element={<RestaurantMenuPage />} />
        <Route path="/dsbrdadmin1" element={<Dsbrdadmin1 />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/agentlogin" element={<Agentlogin />} />
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
        <Route path="/mymenu" element={<Loginpro />} />
        <Route path="/proedit" element={<Proedit />} />
        <Route path="/register" element={<RegisterFreePage />} />
        <Route path="/yashkolnure" element={<SuperAdminDashboard />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/agency" element={<AgencyPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/agency-register" element={<AgencyRegister />} />
        <Route path="/agency-login" element={<AgencyLogin />} />
        <Route path="/agency-dashboard" element={<AgencyDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bulk-upload" element={<BulkUploadInfo />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/kolnure" element={<Kolnure />} />
        <Route path="/kolnure1" element={<Kolnuree />} />
        <Route path="/MembershipUpgrade" element={<MembershipUpgrade />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
