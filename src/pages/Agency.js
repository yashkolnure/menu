import React from "react";
import { Helmet } from "react-helmet";

const AgencyPage = () => {
  const whatYouGet = [
    {
      icon: "🏢",
      title: "Agency Dashboard",
      description:
        "Manage menus for multiple restaurants from a single dashboard efficiently and keep everything up to date.",
    },
    {
      icon: "🖼️",
      title: "AI-Powered Menu Upload",
      description:
        "Upload menu card images and our AI automatically extracts all items, descriptions, and prices, saving hours of manual entry.",
    },
    {
      icon: "📸",
      title: "One-Click Image Fetch",
      description:
        "Automatically fetch or assign images for all menu items in just one click, making your menus visually appealing instantly.",
    },
    {
      icon: "📋",
      title: "Menu Preview",
      description:
        "Preview how your digital menu will appear to customers before publishing, ensuring everything looks perfect.",
    },
    {
      icon: "⚡",
      title: "Real-Time Updates",
      description:
        "Update items, prices, or categories instantly, and changes reflect immediately across all menus and branches.",
    },
    {
      icon: "📄",
      title: "Ready-to-Print QR Code",
      description:
        "After creating a restaurant, instantly get a printable QR Menu card with 3 different eye-catching layouts.",
    },
    {
      icon: "💬",
      title: "WhatsApp Order Integration",
      description:
        "Let restaurant owners receive and manage orders directly on WhatsApp through the generated QR menu.",
    },
    {
      icon: "🎨",
      title: "Premium Menu Layouts",
      description:
        "Access a variety of premium, professionally designed menu layouts to match each restaurant’s brand style.",
    },
    {
      icon: "🤝",
      title: "Guaranteed Support",
      description:
        "If you get stuck anywhere, connect with our expert team and get your issue resolved quickly and hassle-free.",
    },
  ];


  const aiMenuFeatures = [
    "Automatic extraction of menu items from images",
    "One-click image assignment for all items",
    "Supports multi-category menus with ease",
    "Real-time updates across all branches",
    "Reduce manual entry and save hours of work",
  ];

  return (
    <div className="relative ">
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

      {/* Full-page background blobs */}
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
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Start Your Online Business Now
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700">
              Join us as an agency and provide restaurants with AI-powered digital menus. Upload images, fetch item pictures, and manage menus effortlessly.
            </p>
            <a href="/agency-login">
            <button className="px-10 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold shadow-lg hover:scale-105 transition-transform">
              Login as Agency
            </button>
            </a>
          </div>
          {/* Right: Illustration Image */}
            <div className="md:w-1/2 flex justify-center">
            <img
                src="https://petoba.avenirya.com/wp-content/uploads/2025/08/wed-jan-11-2023-1-00-pm90646.png"
                alt="Dashboard Preview"
                className=""
            />
            </div>

        </div>
      </section>

      {/* What You Get Section */}
      <section className="relative py-12">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-5xl font-extrabold mb-4">What You Get</h2>
    <p className="text-lg text-gray-700 mb-16">
      Our software provides all the tools you need to deliver AI-powered digital menus to your clients.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {whatYouGet.map((feature, index) => (
        <div
          key={index}
          className="relative flex flex-col items-start gap-4 p-8 bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300"
        >
          <div className="flex items-start text-4xl mb-4">{feature.icon}</div>
          <h3 className="flex items-start text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="flex items-start text-left text-gray-800">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

    {/* How It Works Section */}
<section className="relative py-16 ">
 
  <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
    <h2 className="text-5xl font-extrabold mb-4 text-gray-900">How It Works</h2>
    <p className="text-lg text-gray-700 mb-16 max-w-2xl mx-auto">
      A simple step-by-step process to create stunning QR menus and get your clients up and running in minutes.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        {
          icon: "🏢",
          title: "Add Restaurant",
          desc: "Create a new restaurant profile in minutes with name, logo, and basic details.",
        },
        {
          icon: "📋",
          title: "Upload Menu",
          desc: "Upload images or type items manually — our AI extracts everything automatically.",
        },
        {
          icon: "📱",
          title: "Get QR Menu",
          desc: "Download ready-to-print QR menu cards in multiple layouts instantly.",
        },
      ].map((step, index) => (
        <div
          key={index}
          className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white rounded-full text-3xl mb-4">
            {step.icon}
          </div>
          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
          <p className="text-gray-600">{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
{`
  @keyframes blob {
    0%,
    100% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }
  .animate-blob {
    animation: blob 8s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
`}
</style>


   {/* AI-Powered Menu Features */}
<section className="relative py-16">

  <div className="relative max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-5xl font-extrabold mb-6">
      🚀 AI-Powered Menu Features
    </h2>
    <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-16">
      Let AI handle the heavy lifting — from instant menu generation to smart
      image assignment. Save hours of work and wow your restaurant clients.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {[
        {
          icon: "🖼️",
          title: "Instant Menu Extraction",
          desc: "Upload menu images and our AI instantly extracts items, descriptions, and prices.",
        },
        {
          icon: "📸",
          title: "One-Click Image Fetch",
          desc: "Automatically fetch matching food images for every menu item — no manual searching.",
        },
        {
          icon: "📝",
          title: "Auto Formatting",
          desc: "Get clean, well-structured menus ready to publish without extra editing.",
        },
        {
          icon: "🔄",
          title: "Bulk Updates",
          desc: "Update hundreds of items at once with AI-driven categorization and pricing.",
        },
        {
          icon: "🌐",
          title: "Multi-Language Support",
          desc: "Generate menus in different languages instantly to cater to diverse audiences.",
        },
        {
          icon: "⚡",
          title: "Speed + Accuracy",
          desc: "Deliver menus to clients within minutes with 99% accuracy and zero formatting hassle.",
        },
      ].map((feature, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-3xl p-8 text-left hover:shadow-2xl transition-all"
        >
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* CTA Section */}
<section className="relative py-16 ">
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-0 items-center">
    
    {/* Left Content */}
    <div className="text-center md:text-left">
      <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        Ready to Transform <span className="text-orange-500">Restaurant Menus?</span>
      </h2>
      <p className="text-lg text-gray-700 mb-8">
        Instantly create stunning <strong>AI-powered digital menus</strong>, generate 
        QR with <strong>WhatsApp Order</strong> functions, and offer your clients ready-to-print 
        QR menu cards in minutes.  
      </p>
      <a href="/membership#agency">
      <button className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold shadow-lg hover:scale-105 transition-transform">
        🚀 Join as Agency
      </button>
      </a>
      <p className="mt-4 text-sm text-gray-600">
        No credit card required. Get started in under 5 minutes.
      </p>
    </div>

   {/* Right Illustration (hidden on mobile) */}
<div className="hidden md:flex justify-center md:justify-end">
  <img
    src="https://petoba.avenirya.com/wp-content/uploads/2025/08/image-removebg-preview-11.png" // Placeholder - replace with custom illustration
    alt="Digital Menu Illustration"
    className="w-80 md:w-96 drop-shadow-lg animate-float"
  />
</div>
  </div>

  {/* Floating Animation Style */}
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

    </div>
  );
};


export default AgencyPage;
