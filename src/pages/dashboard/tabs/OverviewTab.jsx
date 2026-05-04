import React from "react";
import OfferBannerManager from "../../../components/OfferBannerManager";

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

function OverviewTab({ existingItems, membershipLimits, restaurant, restaurantId, token, setActiveTab, setShowItemForm, setShowPopup, offers, setOffers, navigate, triggerAction, handleOptionClick }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total menu items stat */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="opacity-80 text-sm font-medium mb-1 tracking-wide">TOTAL MENU ITEMS</p>
            <h2 className="text-4xl font-extrabold tracking-tight">{existingItems.length}</h2>
            <p className="mt-4 text-xs bg-white/10 backdrop-blur-sm inline-block px-3 py-1 rounded-full border border-white/20">
              {membershipLimits[restaurant.membership_level] === Infinity
                ? "✨ Unlimited Plan Active"
                : `${membershipLimits[restaurant.membership_level]} Items Allowed on Plan`}
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
            <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-gray-800 text-lg font-bold">What would you like to do?</h3>
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => { setActiveTab("menu"); setShowItemForm(true); }}
                className="flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-3 rounded-lg text-sm font-medium transition group"
              >
                <span>Add a New Dish</span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button
                onClick={() => triggerAction(() => handleOptionClick("/bulk-upload", true))}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition group"
              >
                <span>Bulk Upload via AI</span>
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
          <button onClick={() => setShowPopup(true)} className="mt-4 text-xs text-center text-gray-400 hover:text-indigo-600 underline">
            Need help setting up your menu?
          </button>
        </div>

        {/* Live menu link */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-center text-center">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-bl-full opacity-50"></div>
          <h3 className="text-gray-800 font-bold text-lg mb-2">Your Live Menu</h3>
          <p className="text-gray-500 text-sm mb-5">This is what your customers see when they scan the QR code.</p>
          <button
            onClick={() => window.open(`https://app.avenirya.com/menuwp/${restaurantId}`, "_blank")}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition shadow-lg font-medium flex items-center justify-center gap-2"
          >
            <span>View Customer Menu</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Promotional Banners */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Promotional Banners</h3>
        <p className="text-gray-500 text-sm mb-6">
          These banners appear at the top of your digital menu to highlight offers. (Ideal banner size is 650x300 px)
        </p>
        <OfferBannerManager restaurantId={restaurantId} token={token} offers={offers} setOffers={setOffers} />
      </div>
    </div>
  );
}

export default OverviewTab;
