import React from "react";

const ExpertHelpPopup = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center 
                    bg-black/40 backdrop-blur-sm animate-fadeIn">

      <div className="bg-white w-11/12 max-w-md p-7 rounded-2xl shadow-2xl relative 
                      border border-gray-200 animate-slideUp">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition text-2xl"
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Need Help Uploading Your Menu?
        </h2>

        {/* Subtext */}
        <p className="text-gray-600 text-sm text-center leading-relaxed">
          Let our experts upload your entire restaurant menu, including  
          <span className="font-semibold text-gray-800"> name, description, price, category, and images.</span>
        </p>

        {/* Price Box */}
        <div className="bg-orange-100 text-orange-700 border border-orange-300 
                        rounded-lg py-3 px-4 mt-5 text-center font-semibold">
          Full Menu Upload Service –  
          <span className="text-orange-800 font-bold"> Only ₹149</span>
        </div>

        {/* Feature List */}
        <ul className="mt-5 text-gray-700 text-sm space-y-2">
          <li className="flex items-center gap-2">
            ✔ We upload everything for you
          </li>
          <li className="flex items-center gap-2">
            ✔ Perfect for large menus
          </li>
          <li className="flex items-center gap-2">
            ✔ Fast delivery within 1–2 hours
          </li>
          <li className="flex items-center gap-2">
            ✔ Hassle-free & professional
          </li>
        </ul>

        {/* Action Button */}
        <div className="text-center mt-6">
          <a
            href="https://wa.me/919270361329?text=Hi%2C%20I%20need%20expert%20help%20to%20upload%20my%20menu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 
                       text-white px-6 py-3 rounded-full shadow-md 
                       font-semibold text-sm transition transform hover:scale-105"
          >
            Hire Professional – ₹149
          </a>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; } 
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ExpertHelpPopup;
