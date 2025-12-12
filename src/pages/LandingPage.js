import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet";
import HomePagePortfolioSection from "../components/HomePagePortfolioSection";
import {
  QrCode,
  MessageCircle,
  LayoutDashboard,
  Bot,
  Image,
  Star,
  ArrowRight,
  Check,
  PlayCircle,
  Gift,
  Printer,
  TrendingUp,
  Bike, 
  Wifi,    // <--- Add
  Settings, // <--- Add
  Users,    // <--- Add
  UtensilsCrossed, 
  CreditCard, 
  CheckCircle2,
  ChefHat,
  Receipt,
  UploadCloud,
  Wand2,
  Rocket,
  FileText,
  Sparkles, // <--- Add this
  Zap,
  Send
} from "lucide-react";
import { BsQrCodeScan, BsWhatsapp } from 'react-icons/bs';
import { IoDocumentTextOutline } from 'react-icons/io5';

// --- Custom Animations & CSS ---
const customStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
  
  .fade-in-section {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    will-change: opacity, visibility;
  }
  .fade-in-section.is-visible {
    opacity: 1;
    transform: none;
  }

  html { scroll-behavior: smooth; }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
  
  .gradient-text {
    background: linear-gradient(to right, #f97316, #db2777);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

// Helper for Scroll Animation
const FadeInSection = ({ children, delay = "0ms" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    });
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
        if(currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: delay }}
      ref={domRef}
    >
      {children}
    </div>
  );
};

// --- DATA ---

const stepsData = [
  { 
    icon: <Bot size={32} />, 
    title: '1. Upload Menu', 
    description: 'Take a photo of your physical menu card. Our AI scans it instantly.' 
  },
  { 
    icon: <Image size={32} />, 
    title: '2. AI Magic', 
    description: 'We extract items and auto-add high quality food images for you.' 
  },
  { 
    icon: <BsQrCodeScan size={32} />, 
    title: '3. Start Selling', 
    description: 'Get your QR code. Customers scan & order directly on WhatsApp.' 
  }
];

const faqData = [
  { q: "Do customers need to download an app?", a: "No! It works directly in their phone browser (Chrome/Safari) instantly." },
  { q: "How does the AI Menu builder work?", a: "Simply upload a PDF or photo of your menu. Our AI reads the text and builds your digital menu, even assigning food images automatically." },
  { q: "Can I use the Billing system offline?", a: "Yes! The Billing POS has offline support so your operations never stop even if the internet drops." },
  { q: "Does it support Thermal Printers?", a: "Yes, we support USB, Bluetooth, and WiFi thermal printers for receipts and KOTs." },
  { q: "Is there a free trial?", a: "Yes, you can create your menu and test the features completely free." },
];

const testimonials = [
    { name: "Rahul S.", role: "Cafe Owner", text: "Since using Petoba, our table turnover increased by 30%. Customers love the WhatsApp integration!" },
    { name: "Priya M.", role: "Restaurant Manager", text: "The KOT printing is instant. No more shouting orders to the kitchen. It's so peaceful now." },
    { name: "Amit K.", role: "Food Court Owner", text: "Best decision for my fast food joint. The Google Review prompt has doubled our ratings." }
];

// Split Features Data
const marketingFeatures = [
    "Scan & Order (No App Needed)",
    "Direct WhatsApp Ordering",
    "AI Menu Builder (Photo to Menu)",
    "Auto Food Images",
    "Google Review Booster",
    "Social Media Integration"
];

const billingFeatures = [
    "Fast Desktop/Tablet POS",
    "KOT Printing (Thermal Support)",
    "Table Management (Live Status)",
    "Inventory Management",
    "One-Click WhatsApp Billing",
    "Detailed Sales & Tax Reports"
];

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const sendMessage = () => {
    if (!message.trim()) return;
    const url = `https://wa.me/919270361329?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setMessage("");
    setOpen(false);
  };

  return (
    <div className="relative font-sans text-slate-800 selection:bg-orange-200 overflow-x-hidden">
      <Helmet>
        <title>Petoba | Smart QR Menu & Billing POS</title>
        <meta name="description" content="The all-in-one restaurant OS. Turn scans into sales with our AI QR Menu and manage operations with our Fast Billing POS." />
      </Helmet>
      
      <style>{customStyles}</style>

      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 to-orange-50/60">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute top-20 right-[-100px] w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-[-100px] w-80 h-80 bg-blue-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-8 pb-12 lg:pt-12">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/80 text-orange-700 font-semibold text-sm mb-6 border border-orange-200">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              Trusted by 1,000+ Restaurants
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Smart QR Menu & <br/>
              <span className="gradient-text">Fast Billing POS.</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Petoba is the <strong>all-in-one restaurant OS</strong>. Create an AI-powered digital menu in minutes, manage KOTs, and automate WhatsApp billing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/membership" className="group relative px-8 py-4 bg-slate-900 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                <span className="relative z-10">Create Free Menu</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-full shadow-md border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2" onClick={() => setOpen(true)}>
                <PlayCircle className="w-5 h-5 text-orange-500" />
                See Demo
              </button>
            </div>
          </div>

          
{/* Right Image & Floating Badges */}
<div className="relative flex justify-center z-10 mt-8 lg:mt-0">
  {/* 1. Container Width: Reduced to 'w-64' on mobile to create space on sides for badges. 
      2. 'md:w-[28rem]' keeps it large on desktop.
  */}
  <div className="relative w-64 md:w-[28rem] animate-float">
    
    {/* Background Glow */}
    <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-pink-100 rounded-[2rem] rotate-6 opacity-40 blur-xl transform scale-95"></div>
    
    {/* Main Phone Image */}
    <img 
      src="https://data.avenirya.com/wp-content/uploads/2025/10/Untitled-design-8.png" 
      alt="Petoba App Interface" 
      className="relative z-10 w-full drop-shadow-2xl"
    />
    
    {/* --- FLOATING BADGES START --- */}
    {/* Global Badge Style: Smaller on mobile (scale-75), Glassmorphism, specific positioning */}

    {/* 1. WhatsApp New Order (Top Left) */}
    <div className="absolute -left-6 top-4 md:-left-10 md:top-12 bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-lg shadow-orange-500/10 flex items-center gap-2 md:gap-3 z-20 animate-bounce border border-white/50 scale-75 md:scale-100 origin-right" style={{animationDuration: '3s'}}>
        <div className="bg-green-100 p-1.5 md:p-2 rounded-full"><BsWhatsapp className="text-green-600 text-lg md:text-xl"/></div>
        <div>
            <p className="text-[10px] md:text-xs text-slate-500 font-semibold leading-tight">New Order</p>
            <p className="text-xs md:text-sm font-bold text-slate-800">₹ 850.00</p>
        </div>
    </div>

    {/* 2. KOT Printed (Top Right - slightly lower than left to avoid symmetry) */}
    <div className="absolute -right-6 top-16 md:-right-12 md:top-20 bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-lg shadow-slate-400/10 flex items-center gap-2 md:gap-3 z-20 animate-bounce border border-white/50 scale-75 md:scale-100 origin-left" style={{animationDuration: '4.5s', animationDelay: '1s'}}>
        <div className="bg-slate-100 p-1.5 md:p-2 rounded-full"><Printer className="text-slate-600 text-lg md:text-xl"/></div>
        <div>
            <p className="text-[10px] md:text-xs text-slate-500 font-semibold leading-tight">Kitchen KOT</p>
            <p className="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-1">Printed <CheckCircle2 size={10} className="text-green-500"/></p>
        </div>
    </div>

    {/* 3. Table Order (Middle Left) */}
    <div className="absolute -left-8 top-[45%] md:-left-14 md:top-80 bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-lg shadow-orange-500/10 flex items-center gap-2 md:gap-3 z-20 animate-bounce border border-white/50 scale-75 md:scale-100 origin-right" style={{animationDuration: '5s', animationDelay: '0.5s'}}>
        <div className="bg-orange-100 p-1.5 md:p-2 rounded-full"><UtensilsCrossed className="text-orange-500 text-lg md:text-xl"/></div>
        <div>
            <p className="text-[10px] md:text-xs text-slate-500 font-semibold leading-tight">Table #4</p>
            <p className="text-xs md:text-sm font-bold text-slate-800">Ordering...</p>
        </div>
    </div>

    {/* 4. Delivery Order (Middle Right) */}
    <div className="absolute -right-8 top-[60%] md:-right-16 md:bottom-40 bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-lg shadow-blue-500/10 flex items-center gap-2 md:gap-3 z-20 animate-bounce border border-white/50 scale-75 md:scale-100 origin-left" style={{animationDuration: '3.5s', animationDelay: '1.5s'}}>
        <div className="bg-blue-100 p-1.5 md:p-2 rounded-full"><Bike className="text-blue-600 text-lg md:text-xl"/></div>
        <div>
            <p className="text-[10px] md:text-xs text-slate-500 font-semibold leading-tight">Delivery</p>
            <p className="text-xs md:text-sm font-bold text-slate-800">Received</p>
        </div>
    </div>

     {/* 5. 5-Star Review (Bottom Left) */}
     <div className="absolute -left-2 bottom-12 md:-left-4 md:bottom-20 bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-lg shadow-yellow-500/10 flex items-center gap-2 md:gap-3 z-20 animate-bounce border border-white/50 scale-75 md:scale-100 origin-right" style={{animationDuration: '4s', animationDelay: '2s'}}>
        <div className="bg-yellow-100 p-1.5 md:p-2 rounded-full"><Star className="text-yellow-500 text-lg md:text-xl fill-yellow-500"/></div>
        <div>
            <p className="text-[10px] md:text-xs text-slate-500 font-semibold leading-tight">Google Review</p>
            <p className="text-xs md:text-sm font-bold text-slate-800">5.0 Stars</p>
        </div>
    </div>

    {/* 6. Payment Received (Bottom Right) */}
    <div className="absolute -right-4 bottom-4 md:-right-6 md:bottom-10 bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-lg shadow-purple-500/10 flex items-center gap-2 md:gap-3 z-20 animate-bounce border border-white/50 scale-75 md:scale-100 origin-left" style={{animationDuration: '6s'}}>
        <div className="bg-purple-100 p-1.5 md:p-2 rounded-full"><CreditCard className="text-purple-500 text-lg md:text-xl"/></div>
        <div>
            <p className="text-[10px] md:text-xs text-slate-500 font-semibold leading-tight">Bill Paid</p>
            <p className="text-xs md:text-sm font-bold text-slate-800">₹ 1,200</p>
        </div>
    </div>

    {/* --- FLOATING BADGES END --- */}
  </div>
</div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <div className=" ">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-8 text-center z-20 rounded-3xl bg-white/80 glass-card shadow-md">
            {[
                { label: "Restaurants Trusted", val: "1,000+" },
                { label: "Orders Processed", val: "10k+" },
                { label: "Commission Fee", val: "0%" },
                { label: "Setup Time", val: "5 Mins" }
            ].map((stat, i) => (
                <div key={i}>
                    <p className="text-3xl font-extrabold text-slate-900">{stat.val}</p>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                </div>
            ))}
        </div>
      </div>
      {/* =========================================
          OPTION 1: DIGITAL MENU + WHATSAPP
          Layout: Left Text | Right Illustration (Improved)
         ========================================= */}
<section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center relative">
            
            {/* LEFT: Text Content */}
            {/* FIX: Wrapped in div with z-50 to force it ABOVE the image section */}
            <div className="relative z-50">
                <FadeInSection>
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-6">
                      <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                      Option 1
                    </div>
                    
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
                      Digital Menu with <br/>
                      <span className="text-green-600">WhatsApp Ordering</span>
                    </h2>
                    
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                      The perfect starter pack. Replace your physical menu with a stunning QR Catalog and let customers order directly via WhatsApp.
                    </p>

                    <div className="space-y-6">
                      <div className="flex gap-4 group">
                        <div className="mt-1 bg-green-50 p-3 rounded-xl h-fit text-green-600 shadow-sm group-hover:shadow-md transition-all">
                           <BsQrCodeScan size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Scan & View Menu</h4>
                          <p className="text-slate-500">Customers scan the QR code to see your full menu with photos on their phone.</p>
                        </div>
                      </div>

                      <div className="flex gap-4 group">
                        <div className="mt-1 bg-green-50 p-3 rounded-xl h-fit text-green-600 shadow-sm group-hover:shadow-md transition-all">
                           <BsWhatsapp size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Direct WhatsApp Orders</h4>
                          <p className="text-slate-500">Orders are sent to your WhatsApp number with Table # and Item details.</p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-5 bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl shadow-sm">
                        <div className="mt-1 bg-white p-2 rounded-full h-fit text-orange-500 shadow-sm">
                           <Gift size={20} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">Includes Bonus Gift</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Get <span className="font-bold text-orange-600 bg-orange-100 px-1 rounded">1 Month Free Trial</span> of our Billing Software.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10">
                       <a href="/membership" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all hover:gap-3 shadow-lg hover:shadow-xl cursor-pointer relative z-50">
                          Get WhatsApp Menu Plan <ArrowRight size={18}/>
                       </a>
                    </div>
                  </div>
                </FadeInSection>
            </div>

            {/* RIGHT: QR Standee + Phone Screen */}
            {/* FIX: Wrapped in div with z-0 to force it BELOW the text section */}
            <div className="relative z-0">
                <FadeInSection delay="200ms">
                   <div className="relative mx-auto w-full max-w-[450px] h-[550px] perspective-1000 flex justify-center items-center">
                      
                      {/* Ambient Background Glow - pointer-events-none added */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-green-100/40 to-orange-100/30 rounded-full blur-3xl -z-20 pointer-events-none"></div>

                      {/* STANDEE */}
                      <div className="absolute bottom-20 left-4 w-48 h-64 transform rotate-y-12 rotate-x-6 transition-transform hover:rotate-y-0 hover:rotate-x-0 z-10 group">
                          <div className="relative h-full w-full bg-gradient-to-b from-white/95 to-white/60 backdrop-blur-md rounded-2xl border-2 border-white/80 shadow-2xl overflow-hidden flex flex-col items-center p-4 text-center">
                              <div className="absolute -top-[100%] -left-[100%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/40 to-transparent transform rotate-45 pointer-events-none"></div>
                              
                              <div className="mb-2 text-orange-500"><UtensilsCrossed size={20}/></div>
                              <h3 className="font-bold text-slate-900 leading-tight">Scan for<br/>Digital Menu</h3>
                              
                              <div className="relative mt-3 mb-2 p-2 bg-white rounded-xl shadow-inner border border-slate-100 group-hover:scale-105 transition-transform">
                                 <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-xl animate-pulse z-0"></div>
                                 <BsQrCodeScan size={80} className="text-slate-900 relative z-10"/>
                              </div>

                              <div className="mt-auto bg-slate-900 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
                                 Table 05
                              </div>
                          </div>
                      </div>

                      {/* SCAN BEAM - pointer-events-none added */}
                      <div className="absolute top-24 left-28 w-40 h-40 bg-gradient-to-b from-green-400/50 via-green-200/10 to-transparent blur-md -rotate-45 transform-gpu pointer-events-none z-20 animate-pulse" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>

                      {/* SMARTPHONE - pointer-events-none added to container, but if you need scroll inside phone we need to handle that. Assuming phone is visual only: */}
                      <div className="absolute top-0 right-0 w-64 h-[480px] bg-slate-900 rounded-[2.5rem] border-[8px] border-slate-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden z-30 animate-float pointer-events-none" style={{animationDuration: '7s'}}>
                          {/* ... Phone Content ... */}
                          {/* To allow scrolling inside phone but pass clicks through outside, we'd need complex CSS. 
                              For now, I've set pointer-events-none on the whole phone to ensure the main CTA works. 
                              If you need the phone to be scrollable by user, remove 'pointer-events-none' 
                              and rely on the 'z-50' vs 'z-0' wrappers I added above. */}
                          
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-40"></div>
                      
                          <div className="absolute inset-0 bg-gray-100 flex flex-col font-sans overflow-hidden">
                            <div className="relative h-28 shrink-0">
                                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80" className="absolute inset-0 w-full h-full object-cover" alt="header"/>
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-3 gap-2">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <span className="font-bold text-orange-500 text-xs">PB</span>
                                    </div>
                                    <div className="w-full bg-white h-7 rounded-lg opacity-95 flex items-center px-3 gap-2">
                                        <div className="w-3 h-3 rounded-full border border-gray-300"></div>
                                        <div className="h-2 w-20 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
                                <div className="flex gap-2 px-3 p-2">
                                    <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm">All</span>
                                    <span className="bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-lg">Starters</span>
                                    <span className="bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-lg">Main</span>
                                </div>

                                <div className="px-3 space-y-3 pb-4">
                                    <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex gap-2">
                                        <div className="w-14 h-14 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
                                             <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover"/>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-1 mb-1">
                                                    <div className="w-3 h-3 border border-green-600 flex items-center justify-center p-[1px]"><div className="w-full h-full bg-green-600 rounded-full"></div></div>
                                                    <p className="text-[10px] font-bold text-gray-800 line-clamp-1">Veg Cheese Burger</p>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-900">₹ 149</p>
                                            </div>
                                            <div className="self-end">
                                                 <div className="bg-white border border-green-200 text-green-600 text-[10px] font-bold px-3 py-1 rounded shadow-sm uppercase">Add +</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex gap-2">
                                        <div className="w-14 h-14 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
                                             <img src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover"/>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-1 mb-1">
                                                    <div className="w-3 h-3 border border-red-600 flex items-center justify-center p-[1px]"><div className="w-full h-full bg-red-600 rounded-full"></div></div>
                                                    <p className="text-[10px] font-bold text-gray-800 line-clamp-1">Mexican Pizza</p>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-900">₹ 399</p>
                                            </div>
                                            <div className="self-end">
                                                 <div className="bg-white border border-green-200 text-green-600 text-[10px] font-bold px-1 py-0.5 rounded shadow-sm flex items-center gap-2">
                                                     <span className="px-1">-</span>
                                                     <span>1</span>
                                                     <span className="px-1">+</span>
                                                 </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-5 right-4 animate-bounce">
                               <div className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg shadow-orange-200 flex items-center gap-2">
                                   <span className="text-[10px] font-bold">View Cart (1)</span>
                               </div>
                            </div>
                         </div>
                      </div>

                   </div>
                </FadeInSection>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          OPTION 2: QR MENU + FULL BILLING
          Layout: Left Illustration (Improved) | Right Text
         ========================================= */}
     <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT: POS Illustration */}
            <div className="order-2 lg:order-1">
                <FadeInSection delay="200ms">
                   {/* Added pointer-events-none to container to prevent dead clicks on empty areas */}
                   <div className="relative perspective-1000">
                      
                      {/* Decorative Background - Added pointer-events-none */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-orange-200/30 to-pink-200/30 rounded-[100px] blur-3xl -z-10 pointer-events-none"></div>
                      
                      {/* Main Desktop Monitor POS - Needs pointer-events-auto to allow interaction if needed */}
                      <div className="relative bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] z-10">
                          {/* Header */}
                          <div className="bg-slate-800 p-3 flex justify-between items-center border-b border-slate-700">
                              <div className="flex gap-2">
                                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                                  <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                              </div>
                              <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                                  <span className="text-white">Dashboard</span>
                                  <span>Orders</span>
                                  <span>Reports</span>
                              </div>
                              <Wifi size={14} className="text-green-400" />
                          </div>
                          
                          {/* POS Layout */}
                          <div className="flex h-[380px] bg-slate-100">
                              <div className="w-16 bg-slate-900 flex flex-col items-center py-6 gap-8 text-slate-500">
                                  <div className="p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20"><LayoutDashboard size={22} /></div>
                                  <UtensilsCrossed size={22} className="hover:text-white transition-colors cursor-pointer"/>
                                  <Receipt size={22} className="hover:text-white transition-colors cursor-pointer"/>
                                  <div className="mt-auto"><Settings size={22} className="hover:text-white transition-colors cursor-pointer"/></div>
                              </div>
                              
                              <div className="flex-1 p-4 overflow-y-auto">
                                  <div className="flex justify-between items-center mb-6">
                                      <div>
                                        <h3 className="text-xl font-bold text-slate-800">Table Status</h3>
                                        <p className="text-xs text-slate-500">Live Updates</p>
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-1 gap-2">
                                      <div className="bg-white p-4 rounded-xl border-2 border-green-500 shadow-sm relative overflow-hidden">
                                          <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">Running</div>
                                          <div className="flex justify-between items-center mb-2">
                                              <span className="font-bold text-lg text-slate-800">T-01</span>
                                              <Users size={14} className="text-slate-400"/>
                                          </div>
                                          <div className="text-sm font-bold text-green-600">₹ 1,240</div>
                                          <p className="text-[10px] text-slate-500">Since 45 mins</p>
                                      </div>
                                      {[2, 3, 4, 5, 6].map(n => (
                                        <div key={n} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm opacity-70 hover:opacity-100 hover:border-orange-300 transition-all cursor-pointer">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-bold text-lg text-slate-400">T-0{n}</span>
                                                <Users size={14} className="text-slate-300"/>
                                            </div>
                                            <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md w-fit">Available</div>
                                        </div>
                                      ))}
                                  </div>
                              </div>

                              <div className="w-50 bg-white border-l border-slate-200 flex flex-col shadow-xl z-20">
                                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                      <div className="font-bold text-slate-800 flex items-center gap-2"><Receipt size={16} className="text-orange-500"/> Current Bill</div>
                                      <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded">Table #1</span>
                                  </div>
                                  
                                  <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-50/50">
                                      <div className="flex justify-between text-sm">
                                          <div>
                                            <p className="font-bold text-slate-700">Butter Chicken (Half)</p>
                                            <p className="text-[10px] text-slate-500">Qty: 1</p>
                                          </div>
                                          <p className="font-bold text-slate-800">₹ 320</p>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                          <div>
                                            <p className="font-bold text-slate-700">Butter Naan</p>
                                            <p className="text-[10px] text-slate-500">Qty: 4 x ₹40</p>
                                          </div>
                                          <p className="font-bold text-slate-800">₹ 160</p>
                                      </div>
                                      <div className="my-2 border-t border-dashed border-slate-200"></div>
                                      <div className="flex justify-between text-xs text-slate-500">
                                          <span>Subtotal</span> <span>₹ 480</span>
                                      </div>
                                      <div className="flex justify-between text-xs text-slate-500 mb-2">
                                          <span>Tax (5%)</span> <span>₹ 24</span>
                                      </div>
                                  </div>
                                  
                                  <div className="p-4 bg-white border-t border-slate-100">
                                      <div className="flex justify-between items-center mb-4">
                                          <span className="text-sm font-bold text-slate-600">Grand Total</span>
                                          <span className="text-2xl font-black text-slate-900">₹ 504</span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                          <button className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                            <Printer size={16}/> KOT
                                          </button>
                                          <button className="py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all">
                                            Settle Bill
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      {/* Floating Elements - Added pointer-events-none so they don't block text if they overlap */}
                      <div className="absolute -top-8 -right-8 bg-white p-3 rounded-lg shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] border border-slate-100 flex items-center gap-3 animate-float z-20 pointer-events-none" style={{animationDuration: '6s'}}>
                          <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Printer size={18}/></div>
                          <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Kitchen</p>
                              <p className="text-xs font-bold text-slate-800 leading-tight">New KOT Printed</p>
                          </div>
                      </div>
                      
                      <div className="absolute bottom-10 -left-10 bg-white p-3 rounded-lg shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] border border-slate-100 flex items-center gap-3 animate-float z-20 pointer-events-none" style={{animationDelay: '1.5s', animationDuration: '7s'}}>
                          <div className="bg-green-100 p-2 rounded-lg text-green-600"><TrendingUp size={18}/></div>
                          <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Today's Sales</p>
                              <p className="text-xs font-bold text-slate-800 leading-tight">₹ 12,450 so far</p>
                          </div>
                      </div>
                   </div>
                </FadeInSection>
            </div>

            {/* RIGHT: Text Content */}
            {/* FIX: Added 'relative z-30' to ensure this entire block sits ON TOP of the illustration elements */}
            <div className="order-1 lg:order-2 relative z-30">
                <FadeInSection>
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-6">
                      <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
                      Option 2 (Best Value)
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
                      QR Menu + <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">Full Billing Software</span>
                    </h2>
                    
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                      The all-in-one OS. You get everything in Option 1, plus a powerful Point of Sale (POS) system to manage your entire restaurant operations.
                    </p>

                    <div className="space-y-6">
                      <div className="flex gap-4 group">
                        <div className="mt-1 bg-white border border-slate-200 p-3 rounded-xl h-fit text-orange-500 shadow-sm group-hover:border-orange-300 transition-all">
                           <LayoutDashboard size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Desktop & Tablet POS</h4>
                          <p className="text-slate-500">Manage tables, inventory, and staff from a single dashboard. Works offline.</p>
                        </div>
                      </div>

                      <div className="flex gap-4 group">
                        <div className="mt-1 bg-white border border-slate-200 p-3 rounded-xl h-fit text-orange-500 shadow-sm group-hover:border-orange-300 transition-all">
                           <Printer size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Instant KOT & Bill Printing</h4>
                          <p className="text-slate-500">Supports all major Thermal Printers for fast kitchen communication.</p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-5 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl shadow-sm">
                        <div className="mt-1 bg-white p-2 rounded-full h-fit text-blue-600 shadow-sm">
                           <TrendingUp size={20} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">Long Term Savings</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Renew the billing software next year at a <span className="font-bold text-blue-600 bg-blue-100 px-1 rounded">heavily discounted rate</span>.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 relative z-40">
                       <a href="/membership" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all hover:gap-3 cursor-pointer">
                          Get Full Billing Software <ArrowRight size={18}/>
                       </a>
                    </div>
                  </div>
                </FadeInSection>
            </div>

          </div>
        </div>
      </section>

{/* =========================================
          NEW: AI CHATBOT HIGHLIGHT SECTION
          Layout: Left Text | Right Chat Simulation
          Theme: Transparent BG (Blends with Main Page)
         ========================================= */}
      <section className="py-16 relative ">
        
        {/* Background Decor (Subtle & Transparent) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT: Text Content */}
            <FadeInSection>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-bold text-xs uppercase tracking-widest mb-6 animate-pulse shadow-sm">
                  <Sparkles size={14} />
                  <span>New Feature</span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-slate-900">
                  Meet Your New <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">AI Waiter Bot</span>
                </h2>

                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Imagine a waiter who never sleeps, knows every ingredient, and upsells perfectly. Our AI lives inside the digital menu to chat with customers and take orders instantly.
                </p>

                <div className="space-y-5 mb-10">
                  {[
                    "Answers questions like 'Is this spicy?'",
                    "Takes orders via text (e.g. '2 Burgers')",
                    "Suggests pairings & upsells items",
                    "Works 24/7 without taking a break"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="font-medium text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>

              </div>
            </FadeInSection>

            {/* RIGHT: Chatbot Illustration */}
            <FadeInSection delay="200ms">
              <div className="relative mx-auto w-full max-w-[400px]">
                
                {/* Floating Status Badge */}
                <div className="absolute -right-4 top-10 animate-bounce z-20" style={{animationDuration: '3s'}}>
                   <div className="bg-white/90 backdrop-blur border border-slate-200 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 size={20}/></div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
                        <p className="text-sm font-bold text-slate-800">Order Accepted</p>
                      </div>
                   </div>
                </div>

                {/* Phone Frame (Kept Dark for Contrast/Premium Feel) */}
                <div className="relative bg-slate-900 border-[8px] border-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden h-[550px] transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  
                  {/* Fake Header */}
                  <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <Bot size={16} className="text-white"/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Petoba AI</p>
                        <p className="text-[10px] text-green-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                        </p>
                      </div>
                    </div>
                    <div className="text-slate-400"><Settings size={18}/></div>
                  </div>

                  {/* Chat Area */}
                  <div className="p-4 space-y-4 font-sans text-sm h-full bg-slate-800/50">
                    
                    {/* Bot Message */}
                    <div className="flex justify-start">
                      <div className="bg-slate-700 text-slate-100 p-3 rounded-2xl rounded-tl-none max-w-[85%] shadow-md border border-slate-600">
                        Hi! 👋 I'm your AI waiter. Ask me for recommendations or order directly here!
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-orange-500 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-lg">
                        I want something spicy. 🌶️
                      </div>
                    </div>

                    {/* Bot Typing Indicator */}
                    <div className="flex justify-start">
                      <div className="bg-slate-700 p-3 rounded-2xl rounded-tl-none border border-slate-600 w-16 flex items-center gap-1">
                         <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                         <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                         <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                      </div>
                    </div>

                    {/* Bot Result */}
                    <div className="flex justify-start animate-fade-in-up" style={{animationDelay: '1s', animationFillMode: 'both'}}>
                      <div className="bg-slate-700 text-slate-100 p-3 rounded-2xl rounded-tl-none max-w-[95%] shadow-md border border-slate-600">
                        <p className="mb-2">How about our <strong>Schezwan Noodles</strong>? 🔥 It's a customer favorite!</p>
                        <div className="bg-slate-800 p-2 rounded-xl flex gap-3 items-center border border-slate-600 mt-2">
                           <img src="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=100&q=80" className="w-10 h-10 rounded-lg object-cover" alt="food"/>
                           <div className="flex-1">
                             <p className="font-bold text-xs text-white">Schezwan Noodles</p>
                             <p className="text-xs text-orange-400">₹ 180</p>
                           </div>
                           <button className="bg-white text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded hover:bg-slate-200 transition">Add</button>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Fake Input */}
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-slate-800 border-t border-slate-700">
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-full border border-slate-700">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                        <Sparkles size={14}/>
                      </div>
                      <div className="flex-1 text-xs text-slate-500">Add 1 plate...</div>
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                        <Send size={14}/>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </FadeInSection>

          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Redesigned) --- */}
      <section className="py-12 ">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-200/20 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="text-orange-600 font-bold tracking-wider uppercase text-sm bg-orange-100 px-4 py-1 rounded-full">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-4">
              From PDF to QR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">in 5 Minutes</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              No technical skills needed. Our AI handles the boring data entry work for you.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Progress Line (Desktop Only) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-orange-200 to-slate-200 -translate-y-1/2 z-0 rounded-full"></div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              
              {/* --- STEP 1: UPLOAD --- */}
              <FadeInSection>
                <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group z-10">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-slate-50 shadow-lg">1</div>
                  
                  {/* Illustration: Uploading File */}
                  <div className="h-40 bg-blue-50/50 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden border border-blue-100 group-hover:bg-blue-50 transition-colors">
                      <div className="absolute inset-0 bg-blue-100/30 scale-0 group-hover:scale-100 transition-transform rounded-full blur-2xl"></div>
                      
                      {/* Document Icon */}
                      <div className="relative z-10 bg-white p-4 rounded-xl shadow-md border border-blue-100">
                          <FileText className="text-blue-500" size={32}/>
                          {/* Animated Arrow */}
                          <div className="absolute -right-2 -top-2 bg-blue-500 text-white p-1 rounded-full animate-bounce">
                              <UploadCloud size={14}/>
                          </div>
                      </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Upload Menu</h3>
                  <p className="text-slate-500 text-center text-sm leading-relaxed">
                    Simply take a photo of your physical menu or upload a PDF file. No typing required.
                  </p>
                </div>
              </FadeInSection>

              {/* --- STEP 2: AI PROCESSING --- */}
              <FadeInSection delay="150ms">
                <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group z-10">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-slate-50 shadow-lg">2</div>
                  
                  {/* Illustration: AI Magic */}
                  <div className="h-40 bg-orange-50/50 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden border border-orange-100 group-hover:bg-orange-50 transition-colors">
                      <div className="absolute inset-0 bg-orange-100/30 scale-0 group-hover:scale-100 transition-transform rounded-full blur-2xl"></div>
                      
                      {/* Magic Wand & Sparkles */}
                      <div className="relative z-10 flex flex-col items-center">
                          <div className="bg-white p-3 rounded-full shadow-lg border border-orange-100 animate-pulse">
                             <Wand2 className="text-orange-500" size={32}/>
                          </div>
                          <div className="mt-3 flex gap-2">
                             <div className="h-2 w-12 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-2/3 animate-[loading_1s_ease-in-out_infinite]"></div>
                             </div>
                             <span className="text-[10px] font-bold text-orange-500 uppercase">AI Working</span>
                          </div>
                      </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">AI Extraction</h3>
                  <p className="text-slate-500 text-center text-sm leading-relaxed">
                    Our AI scans the text, organizes categories, and even adds food photos automatically.
                  </p>
                </div>
              </FadeInSection>

              {/* --- STEP 3: GO LIVE --- */}
              <FadeInSection delay="300ms">
                <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group z-10">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-slate-50 shadow-lg">3</div>
                  
                  {/* Illustration: Rocket Launch */}
                  <div className="h-40 bg-green-50/50 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden border border-green-100 group-hover:bg-green-50 transition-colors">
                      <div className="absolute inset-0 bg-green-100/30 scale-0 group-hover:scale-100 transition-transform rounded-full blur-2xl"></div>
                      
                      {/* Rocket */}
                      <div className="relative z-10 group-hover:-translate-y-2 transition-transform duration-500">
                          <div className="bg-white p-3 rounded-2xl shadow-lg border border-green-100 flex items-center gap-2">
                             <QrCode className="text-slate-800" size={24}/>
                             <Rocket className="text-green-500" size={24}/>
                          </div>
                          {/* Clouds */}
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-2 bg-slate-200 rounded-full blur-sm group-hover:scale-x-50 transition-transform"></div>
                      </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Start Selling</h3>
                  <p className="text-slate-500 text-center text-sm leading-relaxed">
                    Get your unique QR code instantly. Print it, stick it, and start accepting WhatsApp orders.
                  </p>
                </div>
              </FadeInSection>

            </div>
          </div>

          
        </div>

        {/* Custom CSS for the loading bar animation */}
        <style>{`
           @keyframes loading {
             0% { transform: translateX(-100%); }
             100% { transform: translateX(100%); }
           }
        `}</style>
      </section>

      
      {/* --- THE "CHOOSE YOUR POWER" SECTION (Menu vs Billing) --- */}
      <section className="py-16 ">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Which Setup Do You Need?</h2>
                <p className="text-slate-600 mt-3 text-lg">Choose between a digital catalog or a full restaurant management system.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                
                {/* 1. Smart QR Menu */}
                <FadeInSection>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-lg hover:shadow-xl transition-all h-full flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                        <div className="mb-6">
                            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 text-green-600">
                                <BsQrCodeScan size={28}/>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Smart QR Menu</h3>
                            <p className="text-slate-500 mt-2 font-medium">Best for: Boosting orders & marketing</p>
                        </div>
                        <div className="flex-grow space-y-4">
                            {marketingFeatures.map((feat, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600"/></div>
                                    <span className="text-slate-700 font-medium">{feat}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100">
                             <a href="/membership" className="block w-full py-3 bg-green-50 text-green-700 font-bold text-center rounded-xl hover:bg-green-100 transition">Get QR Menu</a>
                        </div>
                    </div>
                </FadeInSection>

                {/* 2. QR Menu + Billing */}
                <FadeInSection delay="200ms">
                    <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-700 shadow-2xl h-full flex flex-col relative overflow-hidden text-white">
                         <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Most Popular</div>
                         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-pink-500"></div>
                        
                        <div className="mb-6">
                            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-orange-400">
                                <LayoutDashboard size={28}/>
                            </div>
                            <h3 className="text-2xl font-bold">QR Menu + Billing (POS)</h3>
                            <p className="text-slate-400 mt-2 font-medium">Best for: Smooth operations & control</p>
                        </div>
                        <div className="flex-grow space-y-4">
                            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 mb-4">
                                <p className="text-sm text-orange-300 font-semibold mb-1">Includes everything in QR Menu, PLUS:</p>
                            </div>
                            {billingFeatures.map((feat, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-1 bg-orange-500/20 p-1 rounded-full"><Check size={14} className="text-orange-400"/></div>
                                    <span className="text-slate-200 font-medium">{feat}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-800">
                             <a href="/membership" className="block w-full py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-center rounded-xl hover:shadow-lg hover:brightness-110 transition">Get Full System</a>
                        </div>
                    </div>
                </FadeInSection>

            </div>
        </div>
      </section>

      {/* --- FEATURE DEEP DIVE (Grid) --- */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900">More Than Just a Menu</h2>
                  <p className="text-slate-500 mt-2">Powerful tools to run your restaurant smoothly.</p>
             </div>
             
             <div className="grid md:grid-cols-4 lg:grid-cols-4 gap-4 grid-cols-2">
                 {[
                     { icon: <Printer size={32} className="text-blue-500"/>, title: "KOT Printing", desc: "Auto-print orders to the kitchen via thermal printers." },
                     { icon: <Receipt size={32} className="text-green-500"/>, title: "WhatsApp Billing", desc: "Send digital bills to customers in one click. Save paper." },
                     { icon: <ChefHat size={32} className="text-orange-500"/>, title: "Table Mgmt", desc: "Live dashboard showing occupied, free, and reserved tables." },
                     { icon: <TrendingUp size={32} className="text-purple-500"/>, title: "Sales Reports", desc: "Track daily revenue, expenses, and best-selling items." }
                 ].map((item, idx) => (
                    <FadeInSection key={idx} delay={`${idx * 100}ms`}>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all h-full">
                            <div className="mb-4">{item.icon}</div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                            <p className="text-sm text-slate-600">{item.desc}</p>
                        </div>
                    </FadeInSection>
                 ))}
             </div>
        </div>
      </section>

      {/* --- VIDEO SECTION --- */}
      {/* <FadeInSection>
        <section className="py-10 px-6">
          <div className="max-w-4xl mx-auto relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-2xl p-2 bg-black shadow-2xl aspect-video border-4 border-white">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/gjv5_9cXs9E?rel=0"
                title="Introductory Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      </FadeInSection> */}

      {/* --- TESTIMONIALS --- */}
      <section className="py-12">
          <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">What Restaurant Owners Say</h2>
              <div className="grid md:grid-cols-3 gap-8">
                  {testimonials.map((t, i) => (
                      <FadeInSection key={i} delay={`${i*100}ms`}>
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative h-full">
                             <div className="text-orange-400 mb-4 flex gap-1">
                                 {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor"/>)}
                             </div>
                             <p className="text-slate-700 italic mb-6">"{t.text}"</p>
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">{t.name[0]}</div>
                                 <div>
                                     <p className="font-bold text-sm text-slate-900">{t.name}</p>
                                     <p className="text-xs text-slate-500">{t.role}</p>
                                 </div>
                             </div>
                        </div>
                      </FadeInSection>
                  ))}
              </div>
          </div>
      </section>

      {/* --- PORTFOLIO --- */}
      <HomePagePortfolioSection />

      {/* --- FAQ SECTION --- */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-2xl bg-white shadow-sm">
                <button
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 transition-colors rounded-2xl"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-lg font-semibold text-slate-800">{faq.q}</span>
                  <span className={`transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                    <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" />
                  </span>
                </button>
                <div 
                  className={`bg-slate-50 px-6 transition-all duration-300 ease-in-out overflow-hidden ${openFaq === index ? 'max-h-48 py-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-slate-600">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-10 px-6 mb-20">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-orange-500 to-pink-600 rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <h2 className="relative z-10 text-4xl md:text-5xl font-bold mb-6">Ready to upgrade your restaurant?</h2>
          <p className="relative z-10 text-xl text-orange-100 mb-10 max-w-xl mx-auto">Join hundreds of restaurants saving time and getting more reviews today.</p>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
             <a href="/membership">
              <button className="px-10 py-4 bg-white text-orange-600 font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all w-full sm:w-auto">
                Get Started for Free
              </button>
             </a>
             <button 
                onClick={() => setOpen(true)}
                className="px-10 py-4 bg-orange-700/30 border border-white/30 backdrop-blur-sm text-white font-bold text-lg rounded-full hover:bg-orange-700/50 transition-all w-full sm:w-auto"
             >
                Chat with Us
             </button>
          </div>
        </div>
      </section>

      {/* --- FLOATING CHAT WIDGET --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <div className={`transition-all duration-300 ease-in-out origin-bottom-right transform ${open ? "scale-100 opacity-100 mb-4" : "scale-90 opacity-0 h-0 overflow-hidden"}`}>
          <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-0 overflow-hidden">
            <div className="bg-[#25D366] p-4 text-white">
              <h4 className="font-bold flex items-center gap-2"><MessageCircle size={18}/> Chat on WhatsApp</h4>
              <p className="text-xs text-green-100 mt-1">Typically replies in 5 minutes</p>
            </div>
            <div className="p-4 bg-slate-50">
              <textarea
                rows={3}
                placeholder="Hi, I want to know more about Petoba..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-700 text-sm bg-white resize-none"
              />
              <button
                onClick={sendMessage}
                className="mt-3 w-full bg-[#25D366] text-white font-bold py-3 rounded-xl hover:brightness-105 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2"
              >
                Start Chat <ArrowRight size={16}/>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="group flex items-center gap-3 px-3 py-3 md:px-5 md:py-3 rounded-full shadow-xl border border-white/20 bg-[#25D366] hover:bg-[#20bd5a] hover:-translate-y-1 transition-all text-white font-bold"
        >
          <BsWhatsapp size={24} />
          <span className="hidden md:block text-sm">Chat with us</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;