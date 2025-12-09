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
import Dashboard1 from "./pages/Dashboard1";
import FeaturesPage from "./pages/FeaturesPage";
import Kolnure from "./pages/Kolnure";
import Kolnuree from "./pages/kolnureyash";
import MembershipUpgrade from "./pages/MembershipUpgrade";
import UploadMenuPage from "./pages/uploadmenu";
import RedirectManagerPage from "./pages/redirectpage";
import BillingApp from "./pages/billingpage";
import PetobaBillingLanding from "./pages/BillingLanding";
import RestaurantMenuPageDemo from "./pages/Menudemo";
import SplashScreen from "./pages/SplashScreen";
import SplashScreendemo from "./pages/SplashScreendemo";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import SplashScreenCloud from "./pages/SplashScreencloud";
import { Cloud } from "lucide-react";

// Wrapper to handle conditional Header/Footer
function AppWrapper() {
  const location = useLocation();

  // Pages where we want to hide Header/Footer
  const noHeaderFooterRoutes = [
    "/menu/:id",
    "/cloudkitchen/:id",
    "/menuwp/:id",
    "/demo/:id",
    "/shop/:id",
    "/dashboard",
    "/admin/dashboard",
    "/restaurant/:id",
    "/mymenu/:id",
    "/mykitchen/:id",
    "/d/:id",
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
        <Route path="/cloudkitchen/:id" element={<SplashScreenCloud />} />
        <Route path="/mykitchen/:id" element={<MenuPageWithoutCartCloud />} />
        <Route path="/menuwp/:id" element={<SplashScreen />} />
        <Route path="/mymenu/:id" element={<RestaurantMenuPagewp />} />
        <Route path="/demo/:id" element={<RestaurantMenuPageDemo />} />
        <Route path="/d/:id" element={<SplashScreendemo />} />
        <Route path="/shop/:id" element={<Beautysalon />} />
        <Route path="/doredirect" element={<RedirectManagerPage />} />
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
        <Route path="/dashboard1" element={<Dashboard1 />} />
        <Route path="/bulk-upload" element={<BulkUploadInfo />} />
        <Route path="/portfolio" element={<FeaturesPage />} />
        <Route path="/kolnure" element={<Kolnure />} />
        <Route path="/kolnure1" element={<Kolnuree />} />
        <Route path="/deliverydashboard" element={<DeliveryDashboard />} />
        <Route path="/MembershipUpgrade" element={<MembershipUpgrade />} />
        <Route path="/upload-menu" element={<UploadMenuPage />} />
        <Route path="/petoba-billing" element={<BillingApp />} />
        <Route path="/petoba-billing-landing" element={<PetobaBillingLanding />} />
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
