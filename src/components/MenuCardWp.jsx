import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaTimes, FaMinus } from "react-icons/fa";

// Currency symbol helper
const getCurrencySymbol = (code) => {
  switch (code) {
    case "INR":
      return "₹";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "AUD":
      return "A$";
    case "CAD":
      return "C$";
    default:
      return "₹";
  }
};

function MenuCard({
  item,
  cartItem,
  addToCart,
  increaseQty,
  decreaseQty,
  currency , // default to INR
  conversionRate = 1, // conversion rate to multiply price (e.g. 0.012 for USD)
}) {
  const [expanded, setExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const descRef = useRef(null);
  const [descHeight, setDescHeight] = useState("3rem");

  const quantity = cartItem ? cartItem.quantity : 0;

  const currencySymbol = getCurrencySymbol(currency);

  // Convert price dynamically
  const convertedPrice = (item.price * conversionRate).toFixed(2);

  useEffect(() => {
    if (descRef.current) {
      const fullHeight = descRef.current.scrollHeight + "px";
      setDescHeight(expanded ? fullHeight : "3rem");
    }
  }, [expanded]);

  const handleStopProp = (e, func) => {
    e.stopPropagation();
    if (func) func(item);
  };

  const renderCartControls = (isPopup = false) => {
    if (quantity === 0) {
      return (
        <button
          onClick={(e) => handleStopProp(e, addToCart)}
          className={
            isPopup
              ? "flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-full transition w-full"
              : "flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1.5 rounded-xl transition"
          }
        >
          <FaPlus className={isPopup ? "text-sm" : "text-xs"} />
          {isPopup ? "Add to Cart" : "Add"}
        </button>
      );
    }

    return (
      <div
        className={
          isPopup
            ? "flex items-center justify-center gap-3 bg-orange-500 text-white font-semibold px-5 py-2 rounded-full transition w-full"
            : "flex items-center gap-2 bg-orange-500 text-white rounded-xl px-2 py-1.5"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => handleStopProp(e, decreaseQty)}
          className="p-1 rounded-full hover:bg-orange-600 transition"
        >
          <FaMinus className={isPopup ? "text-sm" : "text-xs"} />
        </button>
        <span
          className={
            isPopup
              ? "text-lg font-bold w-6 text-center"
              : "text-sm font-semibold w-5 text-center"
          }
        >
          {quantity}
        </span>
        <button
          onClick={(e) => handleStopProp(e, increaseQty)}
          className="p-1 rounded-full hover:bg-orange-600 transition"
        >
          <FaPlus className={isPopup ? "text-sm" : "text-xs"} />
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Card */}
      <div
        className="relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-md p-3 m-2 w-full max-w-md flex items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        onClick={() => setShowPopup(true)}
      >
        <img
          src={item.image || "https://via.placeholder.com/100"}
          alt={item.name}
          className="w-20 h-20 rounded-xl object-cover shadow-sm border"
        />

        <div className="ml-4 flex flex-col justify-between flex-grow h-full">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>

          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: descHeight }}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            <p
              ref={descRef}
              className="text-xs text-gray-600 mt-1 leading-snug"
            >
              {item.description}
            </p>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-orange-500 font-semibold text-base">
              {currencySymbol} {convertedPrice}
            </span>
            {renderCartControls(false)}
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full relative animate-fadeIn">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={18} />
            </button>

            <img
              src={item.image || "https://via.placeholder.com/300"}
              alt={item.name}
              className="w-full h-56 object-cover rounded-t-2xl"
            />

            <div className="p-5 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <p className="text-orange-500 font-semibold text-lg mb-4">
                {currencySymbol} {convertedPrice}
              </p>

              {renderCartControls(true)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MenuCard;
