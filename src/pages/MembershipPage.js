import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { MessageCircle, Check, X, Zap, Printer, Smartphone, LayoutDashboard, BadgeCheck } from "lucide-react";

const MembershipPage = () => {
  const [billingCycle, setBillingCycle] = useState("yearly"); // 'monthly' or 'yearly'
  const [showWizard, setShowWizard] = useState(false);

  // ✅ HELPER: Generate WhatsApp Link dynamically
  const getWhatsAppLink = (planType) => {
    const phoneNumber = "919270361329";
    let message = "";

    if (planType === "qr") {
      message = billingCycle === "monthly" 
        ? "Hi Petoba, I want to subscribe to the *QR Menu Plan* - Monthly (₹199/mo)."
        : "Hi Petoba, I want to subscribe to the *QR Menu Plan* - Yearly (₹899/yr).";
    } 
    else if (planType === "billing") {
      message = billingCycle === "monthly" 
        ? "Hi Petoba, I want to subscribe to the *Billing App Plan* - Monthly (₹199/mo)."
        : "Hi Petoba, I want to subscribe to the *Billing App Plan* - Yearly (₹899/yr).";
    } 
    else if (planType === "combo") {
      message = billingCycle === "monthly" 
        ? "Hi Petoba, I want to subscribe to the *Power Combo Plan* - Monthly."
        : "Hi Petoba, I want to subscribe to the *Power Combo Plan* - Yearly (₹1499/yr).";
    }

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  // --- FEATURES ---
  const qrFeatures = [
    { name: "Unlimited Menu Items & Categories", available: true },
    { name: "AI Menu Import (Upload PDF/Image)", available: true },
    { name: "WhatsApp Ordering System", available: true },
    // ✅ NEW: Added Specific QR types
    { name: "Separate QRs: Dine-in & Bill Payment", available: true },
    // ✅ NEW: Cloud Kitchen Highlight
    { name: "Takeaway QR (Ideal for Cloud Kitchens)", available: true },
    { name: "Google Map Reviews Booster", available: true },
    { name: "Offer Banners Manager", available: true },
    { name: "Fast Billing / KOT Management", available: false },
  ];

  const billingFeatures = [
    { name: "Unlimited Menu Items", available: true },
    { name: "Fast Billing POS (Desktop/Tab)", available: true },
    { name: "Bluetooth Thermal Printing", available: true },
    { name: "KOT (Kitchen Order Tickets)", available: true },
    { name: "Table Management & Live Status", available: true },
    { name: "Sales Reports & Analytics", available: true },
    { name: "WhatsApp Customer Ordering", available: false },
    { name: "Google Review Tools", available: false },
  ];

  const comboFeatures = [
    { name: "INCLUDES ALL QR Menu Features", available: true, bold: true },
    { name: "INCLUDES ALL Billing App Features", available: true, bold: true },
    { name: "Unified Dashboard (Single Login)", available: true },
    { name: "Sync Menu (Update Price Everywhere)", available: true },
    { name: "Inventory Management", available: true },
    { name: "Staff/Waiter Login Access", available: true },
    { name: "Priority Support", available: true },
  ];

  // --- AI RECOMMENDATION WIZARD COMPONENT ---
const PlanRecommendationWizard = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState(null); // 'cloud' or 'dinein'
  
  if (!isOpen) return null;

  // --- LOGIC ENGINE ---
  const getRecommendation = () => {
    if (businessType === 'cloud') {
      return {
        plan: "QR Menu Plan",
        icon: <Smartphone className="w-12 h-12 text-blue-500" />,
        reason: "For Cloud Kitchens, you need a way to receive direct orders from customers via WhatsApp without commissions. The QR feature is perfect for you. Get Customer details address and order info sent directly to your WhatsApp.",
        link: "/register?plan=qr",
        color: "bg-blue-600"
      };
    }
    if (businessType === 'dinein-billing') {
      return {
        plan: "Power Combo",
        icon: <Zap className="w-12 h-12 text-orange-500" />,
        reason: "Since you have a Dine-in space and want Billing, the Combo is best. It connects your Digital Menu directly to your Billing POS for a seamless operation.",
        link: "/register?plan=combo",
        color: "bg-gradient-to-r from-orange-500 to-red-600"
      };
    }
    return {
      plan: "QR Menu Plan",
      icon: <Smartphone className="w-12 h-12 text-blue-500" />,
      reason: "To start with digital visibility for your restaurant without changing your current billing software, the QR Menu plan is the ideal starting point.",
      link: "/register?plan=qr",
      color: "bg-blue-600"
    };
  };

  const result = getRecommendation();

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg  relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl">AI Plan Finder</h3>
              <p className="text-indigo-100 text-xs">Answer 2 questions to get the perfect match</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X size={24}/></button>
        </div>

        {/* Content Body */}
        <div className="p-8">
          
          {/* STEP 1: Business Type */}
          {step === 1 && (
            <div className="animate-slideIn">
              <h4 className="text-lg font-bold text-gray-800 mb-6">What type of food business do you run?</h4>
              <div className="space-y-4">
                <button 
                  onClick={() => { setBusinessType('cloud'); setStep(3); }} // Jump to result for Cloud Kitchen
                  className="w-full p-4 border-2 border-gray-100 rounded-xl flex items-center gap-4 hover:border-orange-500 hover:bg-orange-50 transition-all group text-left"
                >
                  <span className="text-2xl">☁️</span>
                  <div>
                    <span className="block font-bold text-gray-700 group-hover:text-orange-700">Cloud Kitchen / Home Baker</span>
                    <span className="text-xs text-gray-500">Delivery & Takeaway only</span>
                  </div>
                </button>

                <button 
                  onClick={() => { setBusinessType('dinein'); setStep(2); }} 
                  className="w-full p-4 border-2 border-gray-100 rounded-xl flex items-center gap-4 hover:border-orange-500 hover:bg-orange-50 transition-all group text-left"
                >
                  <span className="text-2xl">🍽️</span>
                  <div>
                    <span className="block font-bold text-gray-700 group-hover:text-orange-700">Restaurant / Cafe / Hotel</span>
                    <span className="text-xs text-gray-500">Has seating area for Dine-in</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Billing Need (Only for Dine-in) */}
          {step === 2 && (
            <div className="animate-slideIn">
              <h4 className="text-lg font-bold text-gray-800 mb-6">Do you want a Billing System linked to your Menu?</h4>
              <div className="space-y-4">
                <button 
                  onClick={() => { setBusinessType('dinein-billing'); setStep(3); }} 
                  className="w-full p-4 border-2 border-gray-100 rounded-xl flex items-center gap-4 hover:border-purple-500 hover:bg-purple-50 transition-all group text-left"
                >
                  <span className="text-2xl">⚡</span>
                  <div>
                    <span className="block font-bold text-gray-700 group-hover:text-purple-700">Yes, Integrated System</span>
                    <span className="text-xs text-gray-500">Orders from QR go directly to Billing (KOT)</span>
                  </div>
                </button>

                <button 
                  onClick={() => { setBusinessType('dinein-simple'); setStep(3); }} 
                  className="w-full p-4 border-2 border-gray-100 rounded-xl flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                >
                  <span className="text-2xl">📱</span>
                  <div>
                    <span className="block font-bold text-gray-700 group-hover:text-blue-700">No, Just Digital Menu</span>
                    <span className="text-xs text-gray-500">I already have billing or don't need it</span>
                  </div>
                </button>
              </div>
              <button onClick={() => setStep(1)} className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline">Back</button>
            </div>
          )}

          {/* STEP 3: Result */}
          {step === 3 && (
            <div className="text-center animate-zoomIn">
              <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                {result.icon}
              </div>
              <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-2">We Recommend</h4>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{result.plan}</h2>
              <p className="text-gray-600 mb-8 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed border border-gray-100">
                {result.reason}
              </p>
              
              <a href={result.link}>
                <button className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-transform hover:scale-105 ${result.color}`}>
                  Choose {result.plan} →
                </button>
              </a>
              <button onClick={() => { setStep(1); setBusinessType(null); }} className="mt-4 text-sm text-gray-400 hover:text-gray-600">Start Over</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

  return (
    <>
      <Helmet>
        <title>Plans & Pricing - Petoba</title>
        <meta name="description" content="Affordable QR Menu and Billing Software plans. Perfect for Restaurants and Cloud Kitchens." />
      </Helmet>

      <section className="relative py-16 bg-white font-sans">
        
        {/* Soft Background Blobs (Theme Matching) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Flexible Plans for Your Restaurant
            </h2>
            <p className="text-lg text-gray-500 mb-6">
              Start small with one tool, or go big with the Combo.
            </p>
{/* Inside the Header Section, below the <p>Start small...</p> */}

<div className="mb-8">
  <button 
    onClick={() => setShowWizard(true)}
    className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-200 transition-colors cursor-pointer"
  >
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
    </span>
    Confused? Let AI help you choose
  </button>
</div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-orange-500 transition-colors focus:outline-none shadow-inner"
              >
                <span
                  className={`${
                    billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                  } inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform`}
                />
              </button>
              <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>
                Yearly <span className="text-green-600 text-xs ml-1 bg-green-100 px-2 py-0.5 rounded-full">HUGE DISCOUNT</span>
              </span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 mt-8 lg:grid-cols-3 gap-8 items-stretch mb-16">

            {/* 1. QR MENU */}
            <PricingCard
              icon={<Smartphone className="w-6 h-6 text-blue-500" />}
              title="QR Menu"
              subtitle="Digital Presence"
              originalPrice={billingCycle === "monthly" ? "₹499" : "₹1999"}
              price={billingCycle === "monthly" ? "₹199" : "₹899"}
              period={billingCycle === "monthly" ? "/mo" : "/yr"}
              features={qrFeatures}
              buttonText="Select QR Plan"
              buttonColor="bg-blue-600 hover:bg-blue-700"
              offerText={billingCycle === "yearly" ? "🎁 Yearly Deal: Get 1 Month Billing App FREE" : ""}
              redirect={getWhatsAppLink("qr")}
            />

            {/* 2. COMBO (Hero) */}
            <div className="relative transform lg:-translate-y-6 z-20">
              {/* Most Popular Badge */}
              <div className="z-10 absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 whitespace-nowrap">
                <Zap size={14} fill="currentColor" /> BEST VALUE COMBO
              </div>
              
              <PricingCard
                icon={<LayoutDashboard className="w-6 h-6 text-orange-600" />}
                title="Power Combo"
                subtitle="Complete Restaurant OS"
                originalPrice={billingCycle === "monthly" ? "₹999" : "₹4999"}
                price={billingCycle === "monthly" ? "₹299" : "₹1499"}
                period="/year"
                description="Digital Menu + Billing POS. Perfect for Cloud Kitchens and Dine-in Restaurants."
                features={comboFeatures}
                buttonText="Get The Combo Deal"
                buttonColor="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-orange-200"
                highlight={true}
                redirect={getWhatsAppLink("combo")}
              />
            </div>

            {/* 3. BILLING APP */}
            <PricingCard
              icon={<Printer className="w-6 h-6 text-purple-500" />}
              title="Billing App"
              subtitle="POS Operations"
              originalPrice={billingCycle === "monthly" ? "₹499" : "₹1999"}
              price={billingCycle === "monthly" ? "₹199" : "₹899"}
              period={billingCycle === "monthly" ? "/mo" : "/yr"}
              features={billingFeatures}
              buttonText="Select Billing Plan"
              buttonColor="bg-purple-600 hover:bg-purple-700"
              redirect={getWhatsAppLink("billing")}
            />
          </div>
{/* --- OPTION 2: Sleek Dark Mode --- */}
<div className=" max-w-5xl mx-auto mt-20">
  <div className=" bg-slate-900 rounded-3xl p-8 md:p-14 text-center shadow-2xl shadow-slate-200 relative  border border-slate-800">
    
    {/* Decorative Grid */}
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    
    {/* Glowing orb */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>

    <div className="relative z-10">
      <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 text-sm text-indigo-300 font-semibold mb-6">
        <Zap size={14} className="fill-indigo-300" /> Free 7-Day Access Pass
      </div>

      <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Unlock the <span className="text-orange-400">FREE Combo Plan</span> Today
      </h3>
      
      <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
        Experience seamless ordering and fast billing without spending a rupee. Set up your restaurant in minutes.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a href="/register?plan=Free" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-white border border-orange-800 text-slate-900 hover:bg-indigo-50 font-bold py-4 px-8 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Start Free Trial
          </button>
        </a>
        <a href="https://wa.me/919270361329?text=Hi, I want to know more about the Plans." target="_blank" className="text-slate-400 hover:text-white font-medium text-sm sm:text-base transition-colors">
          Talk to sales first
        </a>
      </div>
    </div>
  </div>
</div>
        </div>
      </section>
      <PlanRecommendationWizard 
   isOpen={showWizard} 
   onClose={() => setShowWizard(false)} 
/>

      {/* Floating Chat */}
      <a
        href="https://wa.me/919270361329?text=Hi, I am interested in the 1499 Combo Plan."
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

// --- REUSABLE COMPONENT ---
const PricingCard = ({ icon, title, subtitle, originalPrice, price, period, features, buttonText, buttonColor, highlight, offerText, redirect, description }) => {
  return (
    <div className={`flex flex-col bg-white rounded-2xl transition-all duration-300 h-full ${highlight ? 'shadow-2xl border-2 border-orange-100 scale-100 lg:scale-105' : 'shadow-lg border border-gray-100 hover:shadow-xl'}`}>
      
      <div className="p-8 flex-1 flex flex-col">
        {/* Title Section */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2.5 rounded-lg bg-gray-50 border border-gray-100`}>{icon}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">{title}</h3>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{subtitle}</p>
          </div>
        </div>

        {/* Price Section */}
        <div className="my-6 border-b border-gray-50 pb-6">
          <div className="flex items-center">
            {/* Faded Strikethrough Price */}
            <span className="text-gray-400 line-through text-lg mr-2 font-medium">{originalPrice}</span>
            <span className="text-4xl font-extrabold text-gray-900">{price}</span>
            <span className="text-gray-500 font-medium ml-1 text-sm self-end mb-1">{period}</span>
          </div>
          {offerText && <p className="text-xs text-orange-600 font-bold mt-2 bg-orange-50 inline-block px-2 py-1 rounded">{offerText}</p>}
          {description && <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>}
        </div>

        {/* Feature List */}
        <div className="space-y-4 flex-1">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {feature.available ? (
                  <Check size={16} className={`text-green-600 ${feature.bold ? 'stroke-[3px]' : ''}`} />
                ) : (
                  <X size={16} className="text-gray-300" />
                )}
              </div>
              <span className={`text-sm leading-tight ${feature.available ? 'text-gray-700' : 'text-gray-400 line-through'} ${feature.bold ? 'font-bold text-gray-900' : ''}`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-8 pt-0 mt-auto">
        <a href={redirect}>
          <button className={`w-full py-3.5 rounded-xl text-white font-bold shadow-md transition-transform active:scale-95 ${buttonColor}`}>
            {buttonText}
          </button>
        </a>
      </div>
    </div>
  );
};

export default MembershipPage;