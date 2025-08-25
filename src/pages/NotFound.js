// src/pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MessageCircle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => navigate("/");
  const handleContactWhatsApp = () => {
    window.open(
      "https://wa.me/917499835687?text=Hi, I landed on a missing page.",
      "_blank"
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Blobs (same as homepage style) */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="text-center px-6 max-w-3xl">
        {/* 404 Number */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-8xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 drop-shadow-xl"
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Oops! Page Not Found
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8"
        >
          The page you’re looking for doesn’t exist or may have been moved.  
          But don’t worry, let’s get you back on track 🚀
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
          <button
            onClick={handleContactWhatsApp}
            className="flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-5 h-5" />
            Contact on WhatsApp
          </button>
        </motion.div>

  
      </div>

    </div>
  );
};

export default NotFound;
