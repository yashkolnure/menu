import {React, useRef, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import {
  QrCode,
  MessageCircle,
  Megaphone,
  LayoutDashboard,
  Bot,
  Image,
  Headphones,
  Link,
  Star
} from "lucide-react";

import { BsQrCodeScan } from 'react-icons/bs';
import { IoDocumentTextOutline, IoRestaurantOutline } from 'react-icons/io5';

// --- All the CSS for the new creative design is here ---
const cssStyles = `
  .how-it-works-section-creative {
    padding: 4rem 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    position: relative;
    overflow: hidden;
    max-width: 1300px;
    place-self: center;
  }

  .how-it-works-section-creative .container {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
  }

  .how-it-works-section-creative .section-header {
    text-align: center;
    margin-bottom: 80px; /* More space for the layout to breathe */
  }

  .how-it-works-section-creative .section-header h2 {
    font-size: 2.8rem;
    color: #2c3e50; /* A darker, softer black */
    font-weight: 700;
    margin-bottom: 10px;
  }

  .how-it-works-section-creative .section-header p {
    font-size: 1.2rem;
    color: #7f8c8d;
  }

  .how-it-works-section-creative .steps-container-creative {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  /* The dashed connecting line */
  .how-it-works-section-creative .steps-container-creative::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    height: 2px;
    background-image: linear-gradient(to right, #bdc3c7 60%, transparent 40%);
    background-size: 15px 2px;
    background-repeat: repeat-x;
    transform: translateY(-50%);
    z-index: 0;
  }

  .how-it-works-section-creative .step-card-creative {
    background: linear-gradient(145deg, #ffffff, #e6eef5);
    border-radius: 15px;
    padding: 30px;
    text-align: center;
    width: 30%;
    box-shadow: 0 10px 30px rgba(44, 62, 80, 0.1);
    position: relative;
    z-index: 1;
    border: 1px solid #ffffff;
  }

  /* Creating the ZIG-ZAG effect */
  .how-it-works-section-creative .step-card-creative:nth-child(1) {
    transform: translateY(-40px);
  }
  .how-it-works-section-creative .step-card-creative:nth-child(2) {
    transform: translateY(40px);
  }
  .how-it-works-section-creative .step-card-creative:nth-child(3) {
    transform: translateY(-40px);
  }

  .how-it-works-section-creative .step-icon-creative {
    background: linear-gradient(45deg, #3498db, #2980b9);
    color: white;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -70px auto 20px auto; /* Pulls the icon up to sit on the card's edge */
    border: 5px solid #f8f9fa; /* Creates a border effect matching the background */
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
  }

  .how-it-works-section-creative .step-title-creative {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 15px;
    color: #2c3e50;
  }

  .how-it-works-section-creative .step-description-creative {
    font-size: 1rem;
    color: #7f8c8d;
    line-height: 1.6;
    font-weight: 500;
  }

  /* Responsive adjustments for mobile */
  @media (max-width: 900px) {
    .how-it-works-section-creative .steps-container-creative {
      flex-direction: column;
      gap: 60px; /* Increased gap for vertical rhythm */
    }
    
    .how-it-works-section-creative .step-card-creative {
      width: 80%;
      max-width: 320px;
    }
    
    /* Reset zig-zag transforms */
    .how-it-works-section-creative .step-card-creative:nth-child(1),
    .how-it-works-section-creative .step-card-creative:nth-child(2),
    .how-it-works-section-creative .step-card-creative:nth-child(3) {
      transform: translateY(0);
    }
    
    /* Hide the horizontal line on mobile */
    .how-it-works-section-creative .steps-container-creative::before {
      display: none;
    }
  }
`;
// Data for the steps
const stepsData = [
  { 
    icon: <BsQrCodeScan size={36} />, 
    title: '1. Scan QR', 
    description: 'Use your phone camera to scan the QR code on your table and instantly view the menu.' 
  },
  { 
    icon: <IoDocumentTextOutline size={36} />, 
    title: '2. Place Order', 
    description: 'Select your favorite items and place your order directly from WhatsApp.' 
  },
  { 
    icon: <IoRestaurantOutline size={36} />, 
    title: '3. Enjoy Your Meal', 
    description: 'Your order is sent to the kitchen. We’ll bring the food to your table as soon as it\'s ready.' 
  }];


const features = [
    {
      title: "Scannable QR Menus",
      description:
        "Generate modern QR codes that customers can scan from any device. Fast, simple, and user-friendly access to your digital menu.",
      icon: <QrCode size={48} className="text-blue-500" />,
    },
    {
      title: "WhatsApp Ordering",
      description:
        "Turn conversations into sales. Customers can scan, browse, and place orders directly through WhatsApp, and you receive them instantly.",
      icon: <MessageCircle size={48} className="text-green-500" />,
    },
    {
      title: "Social Media Integration",
      description:
        "Link your Instagram, Facebook, and other social profiles directly to your menu. Let customers explore your brand and boost engagement.",
      icon: <Link size={48} className="text-teal-500" />,
    },
    {
      title: "Boost Google Reviews",
      description:
        "Encourage happy customers to leave feedback with a direct link to your Google review page. Improve your online reputation and attract new business.",
      icon: <Star size={48} className="text-yellow-500" />,
    },
    {
      title: "Promote Daily Offers",
      description:
        "Highlight your latest deals and discounts with attractive offer banners inside your menu. Keep customers engaged and coming back.",
      icon: <Megaphone size={48} className="text-orange-500" />,
    },
    {
      title: "Powerful Admin Dashboard",
      description:
        "Stay in control with an easy-to-use dashboard. Add or update items, adjust prices, and manage categories anytime, anywhere.",
      icon: <LayoutDashboard size={48} className="text-purple-500" />,
    },
    {
      title: "AI Menu Upload",
      description:
        "No more manual entry. Upload photos or PDFs of your menu, and let our AI instantly digitize everything for you.",
      icon: <Bot size={48} className="text-pink-500" />,
    },
    {
      title: "Food Items with Images",
      description:
        "Enhance your menu effortlessly. Our AI automatically pairs food items with high-quality images to make dishes irresistible.",
      icon: <Image size={48} className="text-indigo-500" />,
    },
    {
      title: "Dedicated Support",
      description:
        "Get help when you need it. Our support team is always available via WhatsApp and email to keep your restaurant running smoothly.",
      icon: <Headphones size={48} className="text-red-500" />,
    },
  ];

const HomePage = () => {
  const screenshots = [
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/1.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/2.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/3.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/4.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/5.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/6.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/8.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/9.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/10.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/11.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/12.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/13.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/14.jpg",
        "https://petoba.avenirya.com/wp-content/uploads/2025/08/15.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/16.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/17.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/18.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/19.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/20.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/21.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/22.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/23.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/24.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/25.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/26.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/27.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/28.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/29.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/30.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/31.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/32.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/33.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/34.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/35.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/36.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/37.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/38.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/39.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/40.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/41.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/42.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/43.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/44.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/45.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/46.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/47.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/48.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/49.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/50.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/51.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/52.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/53.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/54.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/55.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/56.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/57.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/58.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/59.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/60.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/61.jpg",
    "https://petoba.avenirya.com/wp-content/uploads/2025/08/62.jpg",
    // Add all 60+ screenshot URLs here
  ];

     const [currentIndices, setCurrentIndices] = useState([0, 1, 2]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newIndices = [];
      const used = new Set();
      while (newIndices.length < 3) {
        const randomIndex = Math.floor(Math.random() * screenshots.length);
        if (!used.has(randomIndex)) {
          newIndices.push(randomIndex);
          used.add(randomIndex);
        }
      }
      setCurrentIndices(newIndices);
    }, 2000); // change images every 2 seconds

    return () => clearInterval(interval);


  }, [screenshots.length]);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
const [formData, setFormData] = useState({ phone: '' });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setStatus('');

  // Validate: not empty
  if (!formData.name) {
    setStatus("❌ Please enter your phone number.");
    setLoading(false);
    return;
  }

  // Validate: Indian mobile number (10 digits, starts with 6-9)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(formData.name)) {
    setStatus("❌ Please enter a valid 10-digit mobile number.");
    setLoading(false);
    return;
  }

  try {
    const res = await fetch("https://petoba.avenirya.com/wp-json/contact-form/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (data.success) {
      setStatus("✅ Thanks for your submission! We will call you shortly.");
      setFormData({ name: "" });
    } else {
      setStatus("❌ Something went wrong. Please try again.");
    }
  } catch (error) {
    setStatus("❌ Error connecting to the server.");
  }
  setLoading(false);
};
  
const QrCodeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <line x1="14" y1="14" x2="14.01" y2="14" />
    <line x1="17.5" y1="14" x2="17.51" y2="14" />
    <line x1="14" y1="17.5" x2="14.01" y2="17.5" />
  </svg>
);

const WhatsappIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const SocialIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
  </svg>
);

const GoogleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);


const faqData = [
  {
    q: "What is an All-in-One QR Code?",
    a: "It’s a single smart QR code that lets customers view your menu, order on WhatsApp, visit your social media, and leave Google reviews.",
  },
  {
    q: "Do my customers need an app?",
    a: "No. It opens instantly in any smartphone's web browser. No downloads are needed, making it fast and easy for everyone.",
  },
  {
    q: "How do I create my digital menu?",
    a: "Simply upload a photo of your current menu, and our AI will digitize it for you in minutes.",
  },
  {
    q: "How does a customer order on WhatsApp?",
    a: "Customers build their order from the menu, and it automatically creates a pre-filled WhatsApp message for them to send directly to you.",
  },
  {
    q: "How do I update my menu?",
    a: "Log in to your dashboard from any device to instantly change prices, add items, or mark something as 'sold out'.",
  },
  {
    q: "Can I add my restaurant's logo?",
    a: "Yes, you can fully customize your menu with your own logo, colors, and professional layouts to match your brand.",
  },
  {
    q: "Is this just for menus?",
    a: "No, it's a growth tool. It helps you get more orders, increase your Instagram followers, and easily collect 5-star Google reviews.",
  },
  {
    q: "Is it difficult to get started?",
    a: "Not at all. The setup is designed to be fast and easy, taking only a few minutes. No technical skills are required.",
  },
  {
    q: "How much does the service cost?",
    a: "We offer affordable monthly and yearly plans with no hidden fees. Check our 'Pricing' page for details.",
  },
  {
    q: "Do you take any commission on my sales?",
    a: "No, never. You keep 100% of your sales. We only charge a flat subscription fee.",
  },
];
const [openFaq, setOpenFaq] = useState(null);

const FaqItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-200 py-4">
    <button
      className="w-full flex justify-between items-center text-left focus:outline-none"
      onClick={onClick}
    >
      <span className="text-lg font-medium text-gray-800">{question}</span>
      <span className="transition-transform duration-300">
        <svg
          className={`w-5 h-5 text-gray-500 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
    <div
      className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
        isOpen ? 'max-h-96' : 'max-h-0'
      }`}
    >
      <p className="pt-4 text-gray-600">{answer}</p>
    </div>
  </div>
);

  const sendMessage = () => {
    if (!message.trim()) return;
    const url = `https://wa.me/917499835687?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setMessage("");
    setOpen(false);
  };
  return (
    <div className="relative">
            <Helmet>
        <title>Petoba | Digital QR Menu & Ordering</title>
        <meta
          name="description"
          content="Petoba lets restaurants create digital QR menus. Customers scan, order, and enjoy a contactless dining experience."
        />

        <link
          rel="icon"
          href="https://petoba.avenirya.com/wp-content/uploads/2025/09/download-1.png"
          type="image/png"
        />
        <meta
          property="og:image"
          content="https://petoba.avenirya.com/wp-content/uploads/2025/09/Untitled-design-6.png"
        />
        <meta property="og:title" content="Petoba - Digital QR Menu" />
        <meta property="og:description" content="Turn your restaurant’s menu into a digital QR code menu." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yash.avenirya.com" />
      </Helmet>

      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-[400px] left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Left: Text */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900">
             All-in-One QR Code for Your Restaurant.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700">
             Instantly create a digital menu, take orders via WhatsApp, grow your social media, and boost your Google ratings—all from a single scan.
            </p>
            <a href="/membership">
              <button className="px-10 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold shadow-lg hover:scale-105 transition-transform">
                Get Started
              </button>
            </a>
          </div>

          {/* Right: Illustration */}
          <div className="md:w-1/2 flex justify-center md:justify-end md:flex">
            <img
              src="https://data.avenirya.com/wp-content/uploads/2025/10/Untitled-design-8.png"
              alt="Digital Menu With QR Stand by Petoba QR"
              className="w-86 md:w-96 drop-shadow-lg animate-float"
            />
          </div>
        </div>

        {/* Floating Animation */}
        <style jsx>{`
          @keyframes float {
            0% { transform: translatey(0px); }
            50% { transform: translatey(-10px); }
            100% { transform: translatey(0px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </section>

{/* <section className="py-10 ">
 <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
    <div className="rounded-3xl shadow-2xl bg-white/90 backdrop-blur-xl p-10 md:p-16 flex flex-col items-center border border-orange-100 relative overflow-hidden">

      <div className="absolute -top-14 -right-14 w-48 h-48 bg-gradient-to-br from-orange-300 to-pink-400 opacity-30 rounded-full blur-3xl z-0"></div>
      <div className="absolute -bottom-14 -left-14 w-40 h-40 bg-gradient-to-br from-blue-300 to-green-300 opacity-30 rounded-full blur-3xl z-0"></div>


      <div className="relative z-10 mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 shadow-xl ring-4 ring-white/70">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
</svg>

      </div>

      <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4 text-center relative z-10">
        Start Now – Get a Free Call
      </h2>

      <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto text-center relative z-10 leading-relaxed">
        Share your number and our team will call you back to answer your
        questions and help you get started right away.
      </p>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="flex flex-col sm:flex-row justify-center items-center gap-5 w-full relative z-10"
      >
        <input
          type="tel"
          id="name"
          name="name"
          placeholder="Enter your phone number"
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full sm:w-80 px-6 py-3 border-2 border-orange-200 rounded-full shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 bg-white/95"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-10 py-3 border border-transparent text-lg font-semibold rounded-full shadow-md text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 transition-all duration-300"
        >
          {loading ? "Submitting..." : "Get a Call Now"}
        </button>
      </form>

      {status && (
        <div
          className={`mt-6 text-lg font-semibold ${
            status.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status === "success"
            ? "✅ Thanks! Our team will reach out to you soon."
            : status}
        </div>
      )}
    </div>
  </div>
</section> */}



<style>{cssStyles}</style>

        <section className="how-it-works-section-creative">
          
            <div className="text-4xl font-extrabold text-center  mb-10 text-gray-900 ">
              <h2 className="mb-20">How It Works</h2>
            
            <div className="steps-container-creative">
              {stepsData.map((step, index) => (
                <div key={index} className="step-card-creative">
                  <div className="step-icon-creative">{step.icon}</div>
                  <h3 className="step-title-creative">{step.title}</h3>
                  <p className="step-description-creative">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* HOW IT WORKS SECTION END */}



{/* Key Features - Multi-Info Professional Style */}
<section className="py-16 items-center">
  <div className="max-w-7xl mx-auto px-6 items-center ">
    <h2 className="text-4xl font-extrabold text-center  mb-10 text-gray-900">
      Key Features You’ll Get
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
    icon: QrCodeIcon,
    title: "QR Scan Menu Access",
    subtitle: "Menu from any device",
    points: [
      "Instant menu access via a single QR scan",
      "No app download required for customers",
      "Fully responsive and works on any smartphone",
    ],
  },
  {
    icon: WhatsappIcon,
    title: "Simple WhatsApp Ordering",
    subtitle: "Streamline your order process",
    points: [
      "Customers place orders directly on WhatsApp",
      "Receive instant order notifications",
      "Manage orders and customer communication easily",
    ],
  },
  {
    icon: SocialIcon,
    title: "Social Media Integration",
    subtitle: "Connect with your customers",
    points: [
      "Link your Instagram, Facebook, and more",
      "Let customers explore your social profiles",
      "Grow your online following effortlessly",
    ],
  },
  {
    icon: GoogleIcon,
    title: "Get Google Reviews",
    subtitle: "Boost your online reputation",
    points: [
      "Prompt happy customers to leave a review",
      "Use the same QR to increase Google ratings",
      "Improve visibility on Google and Google Maps",
    ],
  }
      ].map((feature, idx) => (
<div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-start hover:scale-105 transition-transform duration-300">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-500 text-white mb-4">
        <feature.icon Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold mb-1">{feature.title}</h3>
      <p className="text-orange-600 font-semibold mb-4">{feature.subtitle}</p>
      <ul className="list-disc pl-5 text-gray-700 space-y-2">
        {feature.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
        
      ))}
    </div>
  </div>
</section>
{/* How It Works Section */}
<section className="relative py-10 bg-transparent">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-extrabold mb-4 text-gray-900">
      How It Works: Your Menu, Online
    </h2>
    <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
     Easily convert your paper menu into a digital QR menu that customers can scan and order from instantly. </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
       {
          icon: "1",
          title: "Step 1: Choose Plan & Sign Up",
          desc: "Select the plan that suits your restaurant and quickly create your account to get started."
        },
        {
          icon: "2",
          title: "Step 2: Add Your Menu with AI",
          desc: "Upload your menu or images and let our AI automatically organize items, descriptions, and prices for you."
        },
        {
          icon: "3",
          title: "Step 3: Download & Use",
          desc: "Publish your digital menu and download the QR code. Customers can instantly scan and view your menu on any device."
        }

      ].map((step, index) => (
        <div
          key={index}
          className="bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl p-8 flex flex-col items-center text-center hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300"
        >
          <div className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white rounded-full text-3xl mb-4">
            {step.icon}
          </div>
          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
          <p className="text-gray-700">{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
<section className="py-10 bg-transparent">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-4xl md:text-4xl font-bold mb-8 text-gray-900">
      1,000+ Menus Delivered
    </h2>

    {/* 👇 Mobile: horizontal scroll */}
    <div className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
      {screenshots.map((src, idx) => (
        <div
          key={idx}
          className="flex-shrink-0 w-72 snap-center relative rounded-3xl shadow-lg overflow-hidden border-4 border-gray-200"
        >
          <img
            src={src}
            alt={`Menu Screenshot ${idx + 1}`}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      ))}
    </div>

    {/* 👇 Desktop: your existing animated 3-cards layout */}
    <div className="hidden md:flex gap-4 justify-center items-end">
      {currentIndices.map((idx, index) => {
        const isMiddle = index === 1; // middle slide
        return (
          <div
            key={idx}
            className={`relative rounded-3xl shadow-xl overflow-hidden border-8 border-gray-200 transition-transform duration-500 hover:scale-[1.02] ${
              isMiddle ? "w-80 md:w-94 md:h-[580px]" : "w-72 md:w-80 md:h-[550px]"
            }`}
          >
            <img
              src={screenshots[idx]}
              alt={`Menu Screenshot ${idx + 1}`}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        );
      })}
    </div>
  </div>

</section>



 <section className="relative py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Page Header */}
        <h2 className="text-4xl font-bold mb-4">All Features</h2>
        <p className="text-gray-600 mb-12">
          Everything you need to modernize your restaurant and delight customers.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
          {features.map((feature, index) => (
            <div
              key={index}
              className=""
            >
              <div className="mb-4 flex justify-left">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-left">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-base text-left">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
<section className=" py-16 sm:py-24">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center">
      <h2 className="text-4xl font-extrabold text-gray-900">
        Frequently Asked Questions
      </h2>
      <p className="mt-4 text-lg text-gray-600">
        Have questions? We have answers. If you need more help, feel free to contact us.
      </p>
    </div>
    <div className="mt-12 rounded-2xl shadow-lg bg-white/80 p-6">
      {faqData.map((faq, index) => (
        <FaqItem
          key={index}
          question={faq.q}
          answer={faq.a}
          isOpen={openFaq === index}
          onClick={() => setOpenFaq(openFaq === index ? null : index)}
        />
      ))}
    </div>
  </div>
</section>

 <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Box */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-96 opacity-100 mb-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="w-72 bg-white rounded-2xl shadow-xl border p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            💬 Chat with us
          </h4>
          <textarea
            rows={3}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-700"
          />
          <button
            onClick={sendMessage}
            className="mt-3 w-full bg-[#25D366] text-white font-medium py-2 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition"
          >
            Send via WhatsApp
          </button>
        </div>
      </div>

      {/* Floating Button with Icon + Text */}
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2 px-4 py-3 rounded-full shadow-lg border
                   bg-[#25D366] hover:scale-105 active:scale-95 transition text-white font-medium"
      >
        {/* Icon */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
         <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 256 256"
  className="h-6 w-6 fill-white"
>
  <path d="M128 20c-59.55 0-108 48.45-108 108 0 19.05 5.05 37.61 14.64 53.89L20 236l55.06-14.22C91.15 230.34 109.35 236 128 236c59.55 0 108-48.45 108-108S187.55 20 128 20zm0 192c-17.05 0-33.66-4.98-47.91-14.38l-3.41-2.29-32.71 8.44 8.75-31.94-2.21-3.47C43.11 156.91 38 142.84 38 128c0-49.61 40.39-90 90-90s90 40.39 90 90-40.39 90-90 90zm44.93-66.02c-2.46-1.23-14.54-7.17-16.8-7.99-2.26-.82-3.9-1.23-5.54 1.23-1.64 2.46-6.35 7.99-7.78 9.63-1.43 1.64-2.87 1.85-5.33.62-2.46-1.23-10.39-3.83-19.79-12.2-7.31-6.52-12.25-14.56-13.68-17.02-1.43-2.46-.15-3.79 1.08-5.02 1.11-1.1 2.46-2.87 3.69-4.3 1.23-1.43 1.64-2.46 2.46-4.1.82-1.64.41-3.08-.21-4.3-.62-1.23-5.54-13.32-7.61-18.23-2.07-4.97-4.16-4.28-5.54-4.34-1.43-.06-3.08-.07-4.72-.07-1.64 0-4.31.62-6.56 2.87-2.25 2.25-8.6 8.39-8.6 20.45s8.8 23.73 10.04 25.37c1.23 1.64 17.3 26.38 41.91 36.96 5.86 2.54 10.43 4.06 14 5.2 5.88 1.87 11.23 1.61 15.45.98 4.71-.7 14.54-5.95 16.59-11.7 2.05-5.75 2.05-10.67 1.43-11.7-.62-1.02-2.25-1.64-4.72-2.87z" />
</svg>

        </div>
        <span className="pr-1">Need Help?</span>
      </button>
    </div>
</div>
  );
};

export default HomePage;