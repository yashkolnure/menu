import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const SplashScreendemo = () => {
  const params = useParams();
  const rawParam = params.slug || params.id || params.param || null;
  const [id, setId] = useState(null);

  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  if (rawParam) {
    setId(rawParam);
  }
}, [rawParam]);
  useEffect(() => {
    console.log("Restaurant ID from URL:", id);

    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`/api/admin/${rawParam}/details`);
        console.log("API response:", res.status);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        console.log("Restaurant data:", data);

        setRestaurant(data);
        setLoading(false);

        // Redirect to menu page after 2.5s
        setTimeout(() => {
          navigate(`/demo/${id}`);
        }, 3500);
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) fetchRestaurant();
  }, [id, navigate]);

  // 🔍 Debug States
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <p>Loading...</p>
        
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-900 text-white">
        <h2>Error loading restaurant details 😞</h2>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );

  if (!restaurant)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        No restaurant data found.
      </div>
    );

  // ✅ Display Splash
  return (
    <div
        className="relative flex flex-col items-center justify-center h-screen w-screen overflow-hidden text-white"
        style={{
            backgroundImage: `url(${
            restaurant?.homeImage ||
            "https://petoba.avenirya.com/wp-content/uploads/2025/11/Green-Festive-Photocentric-Inspirational-Phone-Wallpaper-1.jpg"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {restaurant.logo && (
          <img
            src={restaurant.logo}
            alt="Restaurant Logo"
            className="w-auto max-h-24 h-auto mb-4 mx-auto object-contain"
          />
        )}

        <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>

        {restaurant.address && (
          <p className="text-orange-400 text-lg mb-3">{restaurant.address}</p>
        )}

        {restaurant.contact && (
          <p className="text-gray-300 text-sm">📞 +{restaurant.contact}</p>
        )}

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="w-10 h-10 border-4 border-t-transparent border-orange-400 rounded-full animate-spin"></div>
        </motion.div>

        <p className="mt-4 text-gray-300 text-sm">Redirecting to menu...</p>
      </motion.div>
    </div>
  );
};

export default SplashScreendemo;
