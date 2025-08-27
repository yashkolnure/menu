import React, { useState } from "react";
import confetti from "canvas-confetti";

const CouponBox = ({ onApply }) => {
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Hardcoded coupons
  const coupons = {
    // SAVE100: { type: "flat", value: 100 },   // ₹100 off
    // WELCOME50: { type: "flat", value: 50 },  // ₹50 off
    // PREMIUM200: { type: "flat", value: 200 },// ₹200 off
    FLAT15: { type: "percent", value: 15 },  // 15% off
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (coupons[code]) {
      const { type, value } = coupons[code];

      let discountText =
        type === "flat"
          ? `₹${value} off`
          : `${value}% off`;

      setMessage(`🎉 Coupon applied! You got ${discountText}.`);

      // 🔥 Confetti burst
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Send details back to parent
      onApply({ type, value, code });
    } else {
      setMessage("❌ Invalid or expired coupon.");
      onApply(null);
    }
  };

  return (
    <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 shadow-inner">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">💸 Have a Coupon?</h3>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Coupon Code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-400 transition"
        />
        <button
          type="button"
          onClick={applyCoupon}
          className="px-5 py-2 bg-gradient-to-r from-green-400 to-green-600 hover:scale-105 transition-transform text-white rounded-xl font-semibold shadow-lg"
        >
          Apply
        </button>
      </div>
      {message && (
        <p
          className={`mt-3 text-sm font-medium ${
            message.includes("❌") ? "text-red-500" : "text-green-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default CouponBox;
