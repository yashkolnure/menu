import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

function Loginfree() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("restaurantId", data.restaurant._id);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again later.");
    }
  };

  
  return (
  <div className="relative bg-white  py-16">
            <Helmet>
        <title>Petoba | Digital QR Menu & Ordering</title>
        <meta
          name="description"
          content="Petoba lets restaurants create digital QR menus. Customers scan, order, and enjoy a contactless dining experience."
        />

        <link
          rel="icon"
          href="https://petoba.avenirya.com/wp-content/uploads/2025/09/download-1.png"
          type="image/png"
        />
        <meta
          property="og:image"
          content="https://petoba.avenirya.com/wp-content/uploads/2025/09/Untitled-design-6.png"
        />
        <meta property="og:title" content="Petoba - Digital QR Menu" />
        <meta property="og:description" content="Turn your restaurant’s menu into a digital QR code menu." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yash.avenirya.com" />
      </Helmet>
    {/* Blobs */}
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30"></div>
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>

   <h2 className="text-4xl font-bold text-center mb-4">
            Login Page
          </h2>
          <p className="text-center text-gray-600 mb-12">
             Manage your digital menu, update dishes, and keep customers happy — all in one place.
        
          </p>
    {/* Login card */}
    <div className="relative z-10 w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        
        <h2 className="text-3xl font-bold text-gray-800">
          Restaurant Admin Login
        </h2>
      
      </div>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 py-2 px-4 rounded-lg">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Enter your restaurant email"
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter your password"
        className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full py-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
        onClick={handleLogin}
      >
        Log In to Your Dashboard
      </button>

      <p className="text-gray-600 text-sm mt-4 text-center">
        Don’t have an account?{" "}
        <Link
          to="/membership"
          className="text-orange-600 font-semibold hover:underline"
        >
          Register now
        </Link>
      </p>
      <p className="text-gray-600 text-sm mt-4 text-center">
        Login As Agency{" "}
        <Link
          to="/agency-login"
          className="text-orange-600 font-semibold hover:underline"
        >
            Click Here
        </Link>
      </p>
    </div>

    {/* WhatsApp Help Floating Button */}
    <a
      href="https://wa.me/917499835687?text=Hello%2C%20I%20need%20help%20with%20Petoba%20menu%20login."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
    >
      <img
        src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
        alt="WhatsApp"
        className="w-5 h-5"
      />
      Help
    </a>
  </div>
);

}
export default Loginfree;
