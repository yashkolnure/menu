import { useRef, useState, useEffect } from 'react';
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


  return (
    <div className="relative">

      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-[400px] left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Left: Text */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900">
             From Paper Menus to Digital QR in Minutes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700">
             Give your customers a modern, easy-to-use digital menu. Scan the QR code to view instantly, with fast setup and professional design.
            </p>
            <a href="/membership">
              <button className="px-10 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold shadow-lg hover:scale-105 transition-transform">
                Get Started
              </button>
            </a>
          </div>

          {/* Right: Illustration */}
          <div className="md:w-1/2 flex justify-center md:justify-end hidden md:flex">
            <img
              src="https://petoba.avenirya.com/wp-content/uploads/2025/08/image-removebg-preview-11.png"
              alt="Digital Menu Illustration"
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

{/* Key Features - Multi-Info Professional Style */}
<section className="py-24 ">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900">
      Key Features You’ll Get
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          icon: "🤖",
          title: "AI-Powered Menu Upload",
          subtitle: "Save hours of manual work",
          points: [
            "Extract items, prices, and descriptions automatically",
            "Organizes menu images intelligently",
            "Works for multiple menus at once"
          ]
        },
        {
          icon: "💬",
          title: "WhatsApp Order Integration",
          subtitle: "Direct orders to your WhatsApp",
          points: [
            "Receive orders instantly",
            "Track customer requests",
            "Manage multiple branches easily"
          ]
        },
        {
          icon: "🎨",
          title: "Premium UI & Menu Layouts",
          subtitle: "Beautiful and intuitive",
          points: [
            "Professionally designed layouts",
            "Customizable colors and fonts",
            "Mobile-friendly and responsive"
          ]
        },
        {
          icon: "📋",
          title: "Real-Time Menu Management",
          subtitle: "Instant updates everywhere",
          points: [
            "Change items, prices, categories instantly",
            "Sync across all devices",
            "Easy to manage even large menus"
          ]
        }
      ].map((feature, idx) => (
        <div key={idx} className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-start hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-500 text-white text-4xl mb-4">
            {feature.icon}
          </div>
          <h3 className="text-2xl font-bold mb-1">{feature.title}</h3>
          <p className="text-orange-600 font-semibold mb-4">{feature.subtitle}</p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            {feature.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</section>

{/* How It Works Section */}
<section className="relative py-16 bg-transparent">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-5xl font-extrabold mb-4 text-gray-900">
      How It Works: Your Menu, Online
    </h2>
    <p className="text-lg text-gray-700 mb-16 max-w-2xl mx-auto">
     Easily convert your paper menu into a digital QR menu that customers can scan and order from instantly. </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
       {
  icon: "🏢",
  title: "Step 1: Choose Plan & Sign Up",
  desc: "Select the plan that suits your restaurant and quickly create your account to get started."
},
{
  icon: "🖼️",
  title: "Step 2: Add Your Menu with AI",
  desc: "Upload your menu or images and let our AI automatically organize items, descriptions, and prices for you."
},
{
  icon: "⚡",
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
<section className="py-16 bg-transparent">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold mb-8 text-gray-900">
     600+ Digital Menus already live
    </h2>

    <div className="flex gap-4 justify-center items-end">
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
        </div>
  );
};

export default HomePage;