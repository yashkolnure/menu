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
  Printer,
  TrendingUp,
  Bike, 
  UtensilsCrossed, 
  CreditCard, 
  CheckCircle2,
  ChefHat,
  Receipt
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
          <div className="relative flex justify-center z-10">
             <div className="relative w-80 md:w-[28rem] animate-float">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-pink-100 rounded-[2rem] rotate-6 opacity-40 blur-xl transform scale-95"></div>
                
                {/* Main Phone Image */}
                <img 
                  src="https://data.avenirya.com/wp-content/uploads/2025/10/Untitled-design-8.png" 
                  alt="Petoba App Interface" 
                  className="relative z-10 "
                />
                
                {/* --- FLOATING BADGES START --- */}

                {/* 1. WhatsApp New Order (Top Left) */}
                <div className="absolute -left-10 top-12 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 z-20 animate-bounce border border-white/40 hidden md:flex" style={{animationDuration: '3s'}}>
                    <div className="bg-green-100 p-2 rounded-full"><BsWhatsapp className="text-green-600 text-xl"/></div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold">New Order</p>
                        <p className="text-sm font-bold text-slate-800">₹ 850.00</p>
                    </div>
                </div>

                {/* 2. KOT Printed (Top Right - High) */}
                <div className="absolute -right-12 top-20 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 z-20 animate-bounce border border-white/40 hidden md:flex" style={{animationDuration: '4.5s', animationDelay: '1s'}}>
                    <div className="bg-slate-100 p-2 rounded-full"><Printer className="text-slate-600 text-xl"/></div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold">Kitchen KOT</p>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-1">Printed <CheckCircle2 size={12} className="text-green-500"/></p>
                    </div>
                </div>

                {/* 3. Table Order (Mid Left) */}
                <div className="absolute -left-14 top-80 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 z-20 animate-bounce border border-white/40 hidden md:flex" style={{animationDuration: '5s', animationDelay: '0.5s'}}>
                    <div className="bg-orange-100 p-2 rounded-full"><UtensilsCrossed className="text-orange-500 text-xl"/></div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold">Table #4</p>
                        <p className="text-sm font-bold text-slate-800">Ordering... 🥘</p>
                    </div>
                </div>

                {/* 4. Delivery Order (Mid Right) */}
                <div className="absolute -right-16 bottom-40 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 z-20 animate-bounce border border-white/40 hidden md:flex" style={{animationDuration: '3.5s', animationDelay: '1.5s'}}>
                    <div className="bg-blue-100 p-2 rounded-full"><Bike className="text-blue-600 text-xl"/></div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold">Delivery</p>
                        <p className="text-sm font-bold text-slate-800">Order Received</p>
                    </div>
                </div>

                 {/* 5. 5-Star Review (Bottom Left) */}
                 <div className="absolute -left-4 bottom-20 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 z-20 animate-bounce border border-white/40 hidden md:flex" style={{animationDuration: '4s', animationDelay: '2s'}}>
                    <div className="bg-yellow-100 p-2 rounded-full"><Star className="text-yellow-500 text-xl fill-yellow-500"/></div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold">Google Review</p>
                        <p className="text-sm font-bold text-slate-800">5.0 Stars ⭐</p>
                    </div>
                </div>

                {/* 6. Payment Received (Bottom Right) */}
                <div className="absolute -right-6 bottom-10 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 z-20 animate-bounce border border-white/40 hidden md:flex" style={{animationDuration: '6s'}}>
                    <div className="bg-purple-100 p-2 rounded-full"><CreditCard className="text-purple-500 text-xl"/></div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold">Bill Paid</p>
                        <p className="text-sm font-bold text-slate-800">₹ 1,200 (UPI)</p>
                    </div>
                </div>

                {/* --- FLOATING BADGES END --- */}
             </div>
          </div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <div className="border-y border-slate-100 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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

      {/* --- HOW IT WORKS (AI Focus) --- */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Go Digital in 3 Simple Steps</h2>
            <p className="text-slate-500 text-lg">Stop typing manually. Let our AI build your menu.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 border-t-2 border-dashed border-slate-300 z-0"></div>

            {stepsData.map((step, idx) => (
              <FadeInSection key={idx} delay={`${idx * 150}ms`}>
                <div className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-orange-50 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-orange-200 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white shadow-inner">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed max-w-xs">{step.description}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
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
             
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <FadeInSection>
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
      </FadeInSection>

      {/* --- TESTIMONIALS --- */}
      <section className="py-16 bg-orange-50/30">
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