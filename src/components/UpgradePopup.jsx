// components/UpgradePopup.jsx
import React, { useEffect } from "react";
import { X } from "lucide-react";

function UpgradePopup({ isOpen, onClose, currentLevel, onUpgrade }) {
  // ✅ Always call hooks at top level
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!isOpen) return null;

  const plans = [
    {
      level: 1,
      name: "FREE",
      price: "₹0",
      period: "/forever",
      amount: 0,
      features: [
         { name: "Upto 15 Menu Items", available: true },
        { name: "Free Dashboard - Manage Anytime", available: true },
        { name: "Basic QR Code Design", available: true },
        { name: "Premium Menu Design", available: true },
        { name: "1 Year Validity", available: true },
        { name: "AI Menu Upload", available: false },
        { name: "Upload Item Images", available: false },
        { name: "AI Image Upload", available: false },
        { name: "WhatsApp Ordering Feature", available: false },
        { name: "Connect Instagram / Social Media  ", available: false },
        { name: "Add Custom Line (We take Party Orders)", available: false },
    ],
      gradient: "from-gray-400 to-gray-600",
      buttonText: "Get Started Free",
    },
    {
      level: 2,
      name: "Premium",
      price: "₹699",
      discountedPrice: "₹549",
      period: "/forever",
      amount: 549,
      features: [
        { name: "100 Menu Items", available: true },
      { name: "Full Dashboard Access", available: true },
      { name: "Premium QR Code & Menu Designs", available: true },
      { name: "Upload Menu with Images", available: true },
      { name: "AI Menu Upload ", available: true },
      { name: "AI Image Upload", available: true },
      { name: "Lifetime Validity", available: true },
      { name: "Dedicated WhatsApp Support", available: true },
      { name: "WhatsApp Ordering Feature", available: false },
      { name: "Add Offer Banners", available: false },
      { name: "Connect Instagram / Social to Menu ", available: false },
      { name: "Add Custom Line (We take Party Orders)", available: false },
    ],
      gradient: "from-blue-500 to-indigo-600",
      buttonText: "Choose Premium",
      highlight: true,
    },
    {
      level: 3,
      name: "Pro",
      price: "₹999",
      discountedPrice: "₹699",
      period: "/forever",
      amount: 699,
      features: [
        { name: "All Features in Premium", available: true },
      { name: "Unlimited Menu Items", available: true },
      { name: "WhatsApp Ordering Feature", available: true },
      { name: "Add Offer Banners", available: true },
      { name: "Full Dashboard Access", available: true },
      { name: "All QR Code & Menu Designs", available: true },
      { name: "AI Menu Upload & Image Upload", available: true },
      { name: "Dedicated Support", available: true },
      { name: "Unlimited Menu Updates", available: true },
      { name: "Connect Instagram / Social to Menu ", available: true },
      { name: "Add Custom Line (We take Party Orders)", available: true },
    ],
      gradient: "from-purple-500 to-pink-600",
      buttonText: "Choose Pro",
    },
  ];

  const handlePayment = (plan) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded yet. Please refresh the page.");
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: plan.amount * 100,
      currency: "INR",
      name: "Avenirya",
      description: `Upgrade to ${plan.name} Plan`,
      handler: function (response) {
        alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
        onUpgrade(plan.level);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9876543210",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-6xl relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={28} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-3">Upgrade Your Plan</h2>
        <p className="text-center text-gray-600 mb-10">
          Current Plan:{" "}
          <span className="font-semibold text-blue-600">
            {plans.find((p) => p.level === currentLevel)?.name}
          </span>
        </p>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-3xl p-6 bg-white border shadow-md hover:shadow-2xl transition-all ${
                plan.highlight ? "scale-105 md:scale-110" : ""
              }`}
            >
              <h3 className="text-2xl font-semibold text-center mb-3">{plan.name}</h3>

              <div className="text-center mb-6">
                {plan.discountedPrice ? (
                  <>
                    <span className="text-xl text-gray-500 line-through mr-2">
                      {plan.price}
                    </span>
                    <span className="text-4xl font-bold text-black">
                      {plan.discountedPrice}
                    </span>
                    <span className="text-gray-500">{plan.period}</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-500">{plan.period}</span>
                  </>
                )}
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-gray-700 text-sm"
                  >
                    {feature.available ? (
                      <span className="text-green-500">✔</span>
                    ) : (
                      <span className="text-red-500">✖</span>
                    )}
                    {feature.name}
                  </li>
                ))}
              </ul>

              {plan.level > currentLevel ? (
                <button
                  className={`w-full py-3 rounded-full bg-gradient-to-r ${plan.gradient} text-white font-semibold shadow-md hover:scale-105 transition-transform`}
                  onClick={() => handlePayment(plan)}
                >
                  {plan.buttonText}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3 rounded-full bg-gray-300 text-gray-600 font-semibold cursor-not-allowed"
                >
                  Current Plan
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UpgradePopup;
