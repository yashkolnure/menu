import React from "react";
import { MessageCircle } from "lucide-react"; // nice chat icon

const MembershipPage = () => {
  const plans = [
  {
    name: "FREE",
    price: "₹0",
    period: "/forever",
    features: [
      { name: "Upto 30 Menu Items", available: true },
      { name: "Free Dashboard - Manage Anytime", available: true },
      { name: "Basic QR Code Design", available: true },
      { name: "Premium Menu Design", available: true },
      { name: "1 Year Validity", available: true },
      { name: "AI Menu Upload", available: false },
      { name: "Upload Item Images", available: false },
      { name: "AI Image Upload", available: false },
      { name: "WhatsApp Ordering Feature", available: false },
    ],
    buttonText: "Get Started Free",
    gradient: "from-gray-400 to-gray-600",
  },
  {
    name: "Premium",
    price: "₹599",
    discountedPrice: "₹399",   // 🔹 Added discounted price
    period: "/forever",
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
    ],
    buttonText: "Choose Premium",
    gradient: "from-blue-500 to-indigo-600",
    highlight: true,
  },
  {
    name: "Pro",
    price: "₹799",
    discountedPrice: "₹599",   // 🔹 Added discounted price
    period: "/forever",
    features: [
      { name: "All Features in Premium", available: true },
      { name: "Unlimited Menu Items", available: true },
      { name: "WhatsApp Ordering Feature", available: true },
      { name: "Full Dashboard Access", available: true },
      { name: "All QR Code & Menu Designs", available: true },
      { name: "AI Menu Upload & Image Upload", available: true },
      { name: "Dedicated Support", available: true },
      { name: "Unlimited Menu Updates", available: true },
    ],
    buttonText: "Choose Pro",
    gradient: "from-purple-500 to-pink-600",
  },
];


  const businessPlans = [
    {
      name: "Start-Up",
      price: "₹2,999",
      period: "/forever",
      features: [
        { name: "All Pro Features Included", available: true },
        { name: "Create up to 10 Menus", available: true },
        { name: "Unlimited Items per Menu", available: true },
        { name: "Full Dashboard Access", available: true },
        { name: "Premium QR Code & Menu Designs", available: true },
        { name: "AI Menu Upload & Image Upload", available: true },
        { name: "WhatsApp Ordering Feature", available: true },
        { name: "Dedicated Support", available: true },
      ],
      buttonText: "Choose Start-Up",
      gradient: "from-green-400 to-green-600",
    },
    {
      name: "Business",
      price: "₹4,999",
      period: "/forever",
      features: [
        { name: "All Pro Features Included", available: true },
        { name: "Create up to 25 Menus", available: true },
        { name: "Unlimited Items per Menu", available: true },
        { name: "Full Dashboard Access", available: true },
        { name: "Premium QR Code & Menu Designs", available: true },
        { name: "AI Menu Upload & Image Upload", available: true },
        { name: "WhatsApp Ordering Feature", available: true },
        { name: "Dedicated Support", available: true },
      ],
      buttonText: "Choose Business",
      gradient: "from-blue-500 to-indigo-600",
      highlight: true,
    },
    {
      name: "Agency",
      price: "₹9,999",
      period: "/forever",
      features: [
        { name: "All Pro Features Included", available: true },
        { name: "Create up to 50 Menus", available: true },
        { name: "Unlimited Items per Menu", available: true },
        { name: "Full Dashboard Access", available: true },
        { name: "Premium QR Code & Menu Designs", available: true },
        { name: "AI Menu Upload & Image Upload", available: true },
        { name: "WhatsApp Ordering Feature", available: true },
        { name: "Unlimited Menu Updates", available: true },
        { name: "Priority Support", available: true },
      ],
      buttonText: "Choose Agency",
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  // 🔹 Reusable plan renderer
  const renderPlans = (plansArray, type) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
      {plansArray.map((plan, index) => (
        <div
          key={index}
          className={`relative flex flex-col rounded-3xl p-8 bg-white/60 backdrop-blur-lg border border-gray-200 shadow-lg hover:shadow-2xl transition-all ${
            plan.highlight ? "scale-105 md:scale-110" : ""
          }`}
        >
          {plan.highlight && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
              Most Popular
            </span>
          )}
          <h3 className="text-2xl font-semibold text-center mb-4">{plan.name}</h3>
          <div className="text-center mb-6">
            {plan.discountedPrice ? (
              <>
                <span className="text-2xl text-gray-500 line-through mr-2">
                  {plan.price}
                </span>
                <span className="text-4xl font-bold text-black-600">
                  {plan.discountedPrice}
                </span>
                <span className="text-gray-500">{plan.period}</span>
              </>
            ) : (
              <>
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </>
            )}
          </div>

          <ul className="flex-1 space-y-3 mb-6">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700">
                {feature.available ? (
                  <span className="text-green-500">✔</span>
                ) : (
                  <span className="text-red-500">✖</span>
                )}
                {feature.name}
              </li>
            ))}
          </ul>

          {/* ✅ Correct redirect based on plan type */}
          <a
            href={
              type === "personal"
                ? `/register?plan=${plan.name}`
                : `/agency-register?plan=${plan.name}`
            }
          >
            <button
              className={`w-full py-3 rounded-full bg-gradient-to-r ${plan.gradient} text-white font-semibold shadow-md hover:scale-105 transition-transform`}
            >
              {plan.buttonText}
            </button>
          </a>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Personal Plans */}
      <section className="relative py-16 bg-white">
        {/* Background blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-40 -right-20  h-80 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h2>
          <p className="text-center text-gray-600 mb-12">
            Flexible plans designed for every stage of your restaurant business.
          </p>
          {renderPlans(plans, "personal")}
        </div>
      </section>

      {/* Business & Agency Plans */}
      <section id="agency" className="relative py-16 ">
        {/* Background blobs for second section */}
        <div className="absolute -top-20 right-0 w-72 h-72 bg-gradient-to-r from-teal-400 to-blue-600 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-4">
            Business & Agency Plans
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Scalable solutions for enterprises and marketing partners.
          </p>
          {renderPlans(businessPlans, "business")}
        </div>
      </section>
      {/* 🔹 WhatsApp Help Floating Button */}
      <a
        href="https://wa.me/917499835687?text=Hi! is there anyone to chat?"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        <MessageCircle size={22} />
        <span>Need Help?</span>
      </a>
    </>
  );
};

export default MembershipPage;
