import React, { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

function MenuCard({ item, addToCart }) {
  const [expanded, setExpanded] = useState(false);
  const descRef = useRef(null);
  const [descHeight, setDescHeight] = useState("3rem"); // default height for 2 lines

  useEffect(() => {
    if (descRef.current) {
      const fullHeight = descRef.current.scrollHeight + "px";
      setDescHeight(expanded ? fullHeight : "3rem");
    }
  }, [expanded]);

  return (
    <div className="relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-md p-3 m-2 w-full max-w-md flex items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
      {/* Image */}
      {Boolean(item.image?.trim()) && !imageError && (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImageError(true)}
            className="w-20 h-20 rounded-xl object-cover shadow-sm border"
          />
        )}


      {/* Info */}
      <div className="ml-4 flex flex-col justify-between flex-grow h-full">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>

        {/* Expandable Description */}
        <div
          className="overflow-hidden transition-all duration-300 cursor-pointer"
          style={{ maxHeight: descHeight }}
          onClick={() => setExpanded(!expanded)}
          title="Click to expand"
        >
          <p
            ref={descRef}
            className="text-xs text-gray-600 mt-1 leading-snug"
          >
            {item.description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-orange-500 font-semibold text-base">₹ {item.price}</span>
          {addToCart && (
            <button
              onClick={() => addToCart(item)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1.5 rounded-xl transition"
            >
              <FaPlus className="text-xs" /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
