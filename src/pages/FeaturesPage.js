import React from "react";
import { Helmet } from "react-helmet";
import {
  QrCode,
  MessageCircle,
  Megaphone,
  LayoutDashboard,
  Bot,
  Image,
  Headphones,
} from "lucide-react";

const FeaturesPage = () => {
  const features = [
    {
      title: "Scannable QR Menus",
      description:
        "Generate modern QR codes that customers can scan from any device. Fast, simple, and user-friendly access to your digital menu.",
      icon: <QrCode size={58} className="text-blue-500" />,
      imageSide: "right",
      imageUrl: "https://petoba.avenirya.com/wp-content/uploads/2025/08/Adobe-Express-file-min-scaled.png",
    },
    {
      title: "WhatsApp Ordering",
      description:
        "Turn conversations into sales. Customers can scan, browse, and place orders directly through WhatsApp, and you receive them instantly.",
      icon: <MessageCircle size={58} className="text-green-500" />,
      imageSide: "left",
      imageUrl: "https://petoba.avenirya.com/wp-content/uploads/2025/08/Adobe-Express-file-5-min-scaled.png",
    },
    {
      title: "Promote Daily Offers",
      description:
        "Highlight your latest deals and discounts with attractive offer banners inside your menu. Keep customers engaged and coming back.",
      icon: <Megaphone size={58} className="text-orange-500" />,
      imageSide: "right",
      imageUrl: "https://petoba.avenirya.com/wp-content/uploads/2025/08/Adobe-Express-file-1-min-scaled.png",
    },
    {
      title: "Powerful Admin Dashboard",
      description:
        "Stay in control with an easy-to-use dashboard. Add or update items, adjust prices, and manage categories anytime, anywhere.",
      icon: <LayoutDashboard size={58} className="text-purple-500" />,
      imageSide: "left",
      imageUrl: "https://petoba.avenirya.com/wp-content/uploads/2025/08/people-analyzing-growth-charts-min.png",
    },
    {
      title: "AI Menu Upload",
      description:
        "No more manual entry. Upload photos or PDFs of your menu, and let our AI instantly digitize everything for you.",
      icon: <Bot size={58} className="text-pink-500" />,
      imageSide: "right",
      imageUrl: "https://petoba.avenirya.com/wp-content/uploads/2025/08/Adobe-Express-file-6-min-scaled.png",
    },
    {
      title: "Food Items with Images",
      description:
        "Enhance your menu effortlessly. Our AI automatically pairs food items with high-quality images to make dishes irresistible.",
      icon: <Image size={58} className="text-indigo-500" />,
      imageSide: "left",
      imageUrl: "https://petoba.avenirya.com/wp-content/uploads/2025/08/Adobe-Express-file-3-min-scaled.png",
    },
    {
      title: "Dedicated Support",
      description:
        "Get help when you need it. Our support team is always available via WhatsApp and email to keep your restaurant running smoothly.",
      icon: <Headphones size={58} className="text-red-500" />,
      imageSide: "right",
      imageUrl: "https://petoba.avenirya.com/wp-content/uploads/2025/08/Adobe-Express-file-4-min-scaled.png",
    },
  ];

  return (
    
    <section className="relative py-16 bg-white">
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
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <h2 className="text-4xl font-bold text-center mb-4">Key Features</h2>
        <p className="text-center text-gray-600 mb-16">
          Everything you need to modernize your restaurant and delight customers.
        </p>

        {/* Features List */}
        <div className="space-y-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-10 ${
                feature.imageSide === "left" ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Text + Icon */}
              <div className="flex-1">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Feature Image */}
              <div className="flex-1">
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  className="w-50   hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <a
            href="/membership"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
          >
            Explore Plans
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturesPage;
