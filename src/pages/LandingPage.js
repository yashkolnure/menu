import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet";
import HomePagePortfolioSection from "../components/HomePagePortfolioSection";
import {
  QrCode,
  MessageCircle,
  Megaphone,
  LayoutDashboard,
  Bot,
  Image,
  Headphones,
  Link,
  Star,
  ArrowRight,
  Check,
  X,
  PlayCircle,
  Smartphone,
  Zap,
  TrendingUp,
  ChefHat
} from "lucide-react";
import { BsQrCodeScan } from 'react-icons/bs';
import { IoDocumentTextOutline, IoRestaurantOutline } from 'react-icons/io5';

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

  /* Smooth scroll behavior */
  html {
    scroll-behavior: smooth;
  }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.5);
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
    icon: <BsQrCodeScan size={32} />, 
    title: '1. Scan QR', 
    description: 'Guests scan the table QR code with their phone camera. No app needed.' 
  },
  { 
    icon: <IoDocumentTextOutline size={32} />, 
    title: '2. Select & Order', 
    description: 'Guests browse the digital menu and select their items.' 
  },
  { 
    icon: <IoRestaurantOutline size={32} />, 
    title: '3. WhatsApp Send', 
    description: 'The order is sent directly to your WhatsApp as a formatted message.' 
  }
];

const features = [
  { title: "Scannable QR Menus", desc: "Modern QRs that work on any device.", icon: <QrCode size={32} className="text-blue-500" /> },
  { title: "WhatsApp Ordering", desc: "Receive orders directly on your phone.", icon: <MessageCircle size={32} className="text-green-500" /> },
  { title: "Social Growth", desc: "Link Instagram & Facebook to your menu.", icon: <Link size={32} className="text-teal-500" /> },
  { title: "Google Reviews", desc: "Auto-prompt happy customers to rate you.", icon: <Star size={32} className="text-yellow-500" /> },
  { title: "Daily Offers", desc: "Highlight deals with eye-catching banners.", icon: <Megaphone size={32} className="text-orange-500" /> },
  { title: "Admin Dashboard", desc: "Update prices and items in real-time.", icon: <LayoutDashboard size={32} className="text-purple-500" /> },
  { title: "AI Menu Upload", desc: "Upload a photo, let AI digitize it.", icon: <Bot size={32} className="text-pink-500" /> },
  { title: "Auto Food Images", desc: "AI pairs dishes with tasty photos.", icon: <Image size={32} className="text-indigo-500" /> },
  { title: "Premium Support", desc: "We help you set up and succeed.", icon: <Headphones size={32} className="text-red-500" /> },
];

const useCases = [
  {
    title: "Cafes & Coffee Shops",
    desc: "Speed up table turns and let customers order that second coffee without waiting for a waiter.",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Restaurants & Diners",
    desc: "Update your daily specials instantly and reduce printing costs for good.",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Hotels & Room Service",
    desc: "Place a QR code in every room. Guests order room service straight to WhatsApp.",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Food Trucks & QSR",
    desc: "Eliminate long queues. Customers scan, order, and pick up when ready.",
    img: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&q=80&w=600"
  }
];

const faqData = [
  { q: "Do customers need to download an app?", a: "No! It works directly in their phone browser (Chrome/Safari) instantly." },
  { q: "How do I receive orders?", a: "You receive a perfectly formatted WhatsApp message from the customer with their table number and items." },
  { q: "Can I update my menu later?", a: "Yes, you get a dashboard to change prices, add items, or hide out-of-stock dishes instantly." },
  { q: "Is there a free trial?", a: "Yes, you can create your menu and test the features before committing to a plan." },
  { q: "Does it work on Android and iPhone?", a: "Yes, it works on any smartphone with a camera and a web browser." },
];

const testimonials = [
    { name: "Rahul S.", role: "Cafe Owner", text: "Since using Petoba, our table turnover increased by 30%. Customers love the WhatsApp integration!" },
    { name: "Priya M.", role: "Restaurant Manager", text: "No more printing costs when we change prices. The AI upload feature saved me hours of work." },
    { name: "Amit K.", role: "Food Court Owner", text: "Best decision for my fast food joint. The Google Review prompt has doubled our ratings." }
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
    <div className="relative font-sans text-slate-800  selection:bg-orange-200">
      <Helmet>
        <title>Petoba | The Smart WhatsApp Menu</title>
        <meta name="description" content="Turn your paper menu into a digital sales machine. WhatsApp ordering, Google Reviews, and more." />
      </Helmet>
      
      <style>{customStyles}</style>

      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 to-orange-50/50">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute top-20 right-[-100px] w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-[-100px] w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-10 pb-10  ">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/80 text-orange-700 font-semibold text-sm mb-6 border border-orange-200">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              #1 Digital Menu Solution
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Turn Scans Into <br/>
              <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                Sales & Reviews.
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Petoba is the <strong>all-in-one digital menu</strong>. Customers scan QR to order on WhatsApp, leave 5-star reviews, and follow your Instagram.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/membership" className="group relative px-8 py-4 bg-slate-900 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 ">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Create Free Menu</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-full shadow-md border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5 text-orange-500" />
                See Demo
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center  z-10">
             <div className="relative w-80 md:w-96 animate-float">
                <div className="absolute inset-0  rounded-[2rem] rotate-6 opacity-30 blur-lg transform scale-95"></div>
                <img 
                  src="https://data.avenirya.com/wp-content/uploads/2025/10/Untitled-design-8.png" 
                  alt="Petoba App Interface" 
                  className="relative z-10 drop-shadow-2xl rounded-3xl"
                />
             </div>
          </div>
        </div>
      </section>

      {/* --- STATS BAR (Social Proof) --- */}
      <div className=" border-y border-slate-100 ">
        <div className="py-8 border-2 border-slate-100 shadow mt-12 bg-gradient-to-br from-pink-50 to-orange-50/50 max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center rounded-b-3xl shadow-lg">
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

      {/* --- VIDEO SECTION --- */}
      <FadeInSection>
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center mb-8">
             <h2 className="text-3xl font-bold">See Petoba in Action</h2>
          </div>
          <div className="max-w-4xl mx-auto relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-2xl p-2 bg-black  shadow-2xl aspect-video border-4 border-white">
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

      {/* --- PROBLEM VS SOLUTION (New Section) --- */}
      <section className="py-10 ">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Upgrade to Petoba?</h2>
                <p className="text-slate-600 mt-3">Stop losing customers to PDF menus and slow service.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
                {/* Old Way */}
                <FadeInSection>
                    <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-sm relative  h-full">
                        <div className="absolute top-0 right-0 bg-red-100 px-4 py-1 rounded-bl-xl text-red-600 font-bold text-sm">THE OLD WAY</div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><X className="text-red-500"/> PDF / Paper Menu</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-600">
                                <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5"/> <span><strong>Hard to Read:</strong> Customers have to pinch & zoom to read tiny text on PDFs.</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-600">
                                <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5"/> <span><strong>No Interaction:</strong> Can't order, can't search, can't filter veg/non-veg.</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-600">
                                <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5"/> <span><strong>Expensive to Update:</strong> Reprinting paper menus costs money every time prices change.</span>
                            </li>
                        </ul>
                    </div>
                </FadeInSection>

                {/* Petoba Way */}
                <FadeInSection delay="200ms">
                    <div className="bg-white p-8 rounded-3xl border-2 border-green-400 shadow-xl relative  h-full transform md:-translate-y-2">
                         <div className="absolute top-0 right-0 bg-green-500 px-4 py-1 rounded-bl-xl text-white font-bold text-sm">THE PETOBA WAY</div>
                         <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Check className="text-green-500"/> Smart QR Menu</h3>
                         <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-700">
                                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5"/> <span><strong>Mobile Optimized:</strong> Beautiful, easy-to-read list with food photos.</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5"/> <span><strong>Direct WhatsApp Ordering:</strong> Turn browsing into actual sales instantly.</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5"/> <span><strong>Edit Anytime:</strong> Change prices or hide items in 1 click from your phone.</span>
                            </li>
                        </ul>
                    </div>
                </FadeInSection>
            </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-10  relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How it Works</h2>
            <p className="text-slate-500 text-lg">Automation that feels like magic.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className=" md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 border-t-2 border-dashed border-slate-300 z-0"></div>

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

      {/* --- USE CASES (Who is this for?) --- */}
      <section className="py-12 text-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Built for every food business</h2>
                    <p className="text-slate-400 text-lg">Whether you run a small cafe or a large hotel, Petoba adapts to your needs.</p>
                  </div>
                  <a href="/membership" className=" md:flex text-orange-400 font-semibold items-center gap-2 hover:text-orange-300 transition">View all plans <ArrowRight size={18}/></a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {useCases.map((item, idx) => (
                      <FadeInSection key={idx} delay={`${idx * 100}ms`}>
                        <div className="group relative rounded-2xl  h-80 bg-slate-800">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-100 transition duration-700 rounded-2xl"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-300 leading-relaxed translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                      </FadeInSection>
                  ))}
              </div>
          </div>
      </section>

      {/* --- GRID FEATURES --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">More Than Just a Menu</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">Everything you need to modernize your restaurant operations.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <FadeInSection key={idx} delay={`${idx * 50}ms`}>
                  <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl border border-slate-100 hover:border-orange-100 transition-all duration-300 h-full hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 font-medium">{feature.desc}</p>
                  </div>
                </FadeInSection>
              ))}
           </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (Social Proof) --- */}
      <section className="py-10">
          <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">What Restaurant Owners Say</h2>
              <div className="grid md:grid-cols-3 gap-8">
                  {testimonials.map((t, i) => (
                      <FadeInSection key={i} delay={`${i*100}ms`}>
                        <div className="bg-orange-50/50 p-8 rounded-2xl border border-orange-300 relative">
                             <div className="text-orange-400 mb-4 flex gap-1">
                                 {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor"/>)}
                             </div>
                             <p className="text-slate-700 italic mb-6">"{t.text}"</p>
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">{t.name[0]}</div>
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
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-2xl  bg-white">
                <button
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-lg font-semibold text-slate-800">{faq.q}</span>
                  <span className={`transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div 
                  className={`bg-slate-50 px-6  transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 py-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-slate-600">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-orange-500 to-pink-600 rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl relative ">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <h2 className="relative z-10 text-4xl md:text-5xl font-bold mb-6">Ready to upgrade your restaurant?</h2>
          <p className="relative z-10 text-xl text-orange-100 mb-10 max-w-xl mx-auto">Join hundreds of restaurants saving time and getting more reviews today.</p>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
             <a href="/membership">
              <button className="px-10 py-4 bg-white text-orange-600 font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Get Started for Free
              </button>
             </a>
             <button 
                onClick={() => setOpen(true)}
                className="px-10 py-4 bg-orange-700/30 border border-white/30 backdrop-blur-sm text-white font-bold text-lg rounded-full hover:bg-orange-700/50 transition-all"
             >
                Chat with Us
             </button>
          </div>
        </div>
      </section>

      {/* --- FLOATING CHAT WIDGET --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <div className={`transition-all duration-300 ease-in-out origin-bottom-right transform ${open ? "scale-100 opacity-100 mb-4" : "scale-90 opacity-0 h-0 "}`}>
          <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-0 ">
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
                className="mt-3 w-full bg-[#25D366] text-white font-bold py-3 rounded-xl hover:brightness-105 transition shadow-lg shadow-green-200"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="group flex items-center gap-3 px-2 py-2 md:px-5 md:py-3 rounded-full shadow-xl border border-white/20 bg-[#25D366] hover:bg-[#20bd5a] hover:-translate-y-1 transition-all text-white font-bold"
        >
          <div className="flex items-center justify-center">
             <MessageCircle size={28} fill="white" className="text-transparent" />
          </div>
          <span className=" md:block text-sm">Chat with us</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;