import React, { useEffect } from "react";

// Inline Icons
const Icons = {
  Check: () => <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Cross: () => <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Crown: () => <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
};

function UpgradePopup({ isOpen, onClose, currentLevel, onUpgrade }) {
  
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
      name: "Free Starter",
      price: "₹0",
      period: "Forever",
      features: [
        { name: "Up to 15 Menu Items", available: true },
        { name: "Basic QR Code", available: true },
        { name: "1 Year Validity", available: true },
        { name: "Unlimited Views", available: true },
        { name: "Image Uploads", available: false },
        { name: "WhatsApp Ordering", available: false },
        { name: "AI Menu Import", available: false },
      ],
      color: "gray",
      btnText: "Current Plan",
    },
    {
      level: 2,
      name: "Premium",
      price: "₹699",
      offerPrice: "₹549",
      period: "One-time",
      popular: true,
      features: [
        { name: "100 Menu Items", available: true },
        { name: "Image Uploads", available: true },
        { name: "Lifetime Validity", available: true },
        { name: "Premium QR Designs", available: true },
        { name: "AI Menu Import", available: true },
        { name: "WhatsApp Ordering", available: false },
        { name: "Social Links", available: false },
      ],
      color: "blue",
      btnText: "Upgrade to Premium",
    },
    {
      level: 3,
      name: "Business Pro",
      price: "₹999",
      offerPrice: "₹699",
      period: "One-time",
      features: [
        { name: "Unlimited Items", available: true },
        { name: "Everything in Premium", available: true },
        { name: "WhatsApp Ordering", available: true },
        { name: "Social Media Integration", available: true },
        { name: "Offer Banners", available: true },
        { name: "Priority Support", available: true },
        { name: "Custom Highlights", available: true },
      ],
      color: "purple",
      btnText: "Go Limitless",
    },
  ];

  const handlePayment = (plan) => {
    if (!window.Razorpay) {
      alert("Payment gateway loading...");
      return;
    }

    const amount = plan.offerPrice ? parseInt(plan.offerPrice.replace("₹", "")) : 0;
    
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_placeholder", // Fallback for preview
      amount: amount * 100,
      currency: "INR",
      name: "Petoba Premium",
      description: `Upgrade to ${plan.name}`,
      handler: function (response) {
        alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
        onUpgrade(plan.level);
        onClose();
      },
      theme: { color: "#4f46e5" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-gray-50 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden relative animate-scale-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors z-10"
        >
          <Icons.Close />
        </button>

        <div className="p-8 md:p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Unlock Your Restaurant's Potential</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">Choose a plan that fits your growth. One-time payment, lifetime benefits.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => {
              const isCurrent = currentLevel === plan.level;
              const isPopular = plan.popular;
              
              return (
                <div 
                  key={plan.level}
                  className={`relative bg-white rounded-2xl transition-all duration-300 flex flex-col h-full
                    ${isPopular ? 'border-2 border-indigo-500 shadow-xl scale-105 z-10' : 'border border-gray-200 shadow-sm hover:shadow-md'}
                    ${isCurrent ? 'opacity-80 grayscale-[0.5]' : ''}
                  `}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
                      <Icons.Crown /> Most Popular
                    </div>
                  )}

                  <div className="p-6 md:p-8 border-b border-gray-100 flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${isPopular ? 'text-indigo-600' : 'text-gray-800'}`}>{plan.name}</h3>
                    
                    <div className="my-4">
                      {plan.offerPrice ? (
                        <div className="flex flex-col items-center">
                           <span className="text-gray-400 line-through text-lg">{plan.price}</span>
                           <div className="flex items-baseline gap-1">
                             <span className="text-4xl font-extrabold text-gray-900">{plan.offerPrice}</span>
                             <span className="text-gray-500 text-sm">/{plan.period}</span>
                           </div>
                        </div>
                      ) : (
                        <div className="flex items-baseline justify-center gap-1">
                           <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                           <span className="text-gray-500 text-sm">/{plan.period}</span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 text-left mt-6 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className={`flex items-start gap-3 text-sm ${feature.available ? 'text-gray-700' : 'text-gray-400'}`}>
                          {feature.available ? <Icons.Check /> : <Icons.Cross />}
                          <span className={feature.available ? 'font-medium' : ''}>{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 mt-auto">
                    {isCurrent ? (
                      <button disabled className="w-full py-3 rounded-xl bg-gray-100 text-gray-500 font-bold cursor-not-allowed">
                        Current Plan
                      </button>
                    ) : (
                      <button 
                        onClick={() => handlePayment(plan)}
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-95
                          ${plan.level === 3 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 
                            plan.level === 2 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-800'}
                        `}
                      >
                        {plan.btnText}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <p className="mt-8 text-sm text-gray-400">Need a custom enterprise solution? <a href="#" className="text-indigo-500 hover:underline">Contact Sales</a></p>
        </div>
      </div>
    </div>
  );
}

export default UpgradePopup;