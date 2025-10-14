import React, { useState } from "react";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeTemplates = ({ restaurantId, membership_level }) => {
  // Dynamic links
  const basicLink = `https://app.avenirya.com/menu/${restaurantId}`;
  const wpLink = `https://app.avenirya.com/menuwp/${restaurantId}`;

  const [openFree, setOpenFree] = useState(true);
  const [openPremium, setOpenPremium] = useState(false);
  const [openPro, setOpenPro] = useState(false);

  // Example demo links
  const demoLinks = {
    free: "https://petoba.short.gy/Free",
    premium: "https://petoba.short.gy/premium",
    premiumWP: "https://petoba.short.gy/PremiumWP",
  };

  const templates = [
    {
      id: "template1",
      img: "https://website.avenirya.com/wp-content/uploads/2025/07/to-See-the-Full-Menu-2.png",
    },
    {
      id: "template2",
      img: "https://website.avenirya.com/wp-content/uploads/2025/07/Beige-Minimalist-Discount-QR-Code-Business-Square-Sticker-600-x-900-px.png",
    },
    {
      id: "template3",
      img: "https://website.avenirya.com/wp-content/uploads/2025/07/Orange-and-Yellow-Modern-Simple-Scan-for-Menu-Rectangle-Sticker.png",
    },
  ];

  const handleDownload = (id) => {
    const qrElement = document.getElementById(id);
    html2canvas(qrElement, { useCORS: true, scale: 3 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `menu_qr_${restaurantId}_${id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  // Render QR templates by level
  const renderTemplates = (link, prefix = "", level, demoLink) =>
    templates.map((template, index) => {
      const templateId = `${prefix}${template.id}`;
      const isDisabled = membership_level < level;

      return (
        <div
          key={templateId}
          className="relative flex-shrink-0 border p-3 rounded shadow bg-white w-full md:w-[32%]"
        >

          <div
            id={templateId}
            className="relative inline-block w-full h-auto rounded overflow-hidden shadow"
          >
            <img
              src={template.img}
              alt={`QR Template ${index + 1}`}
              className="w-full h-auto object-cover"
              crossOrigin="anonymous"
            />
            <div
              className="absolute top-1/2 left-1/2"
              style={{ transform: "translate(-50%, -50%)", width: "50%" }}
            >
              <QRCodeCanvas
                value={link}
                size={200}
                bgColor="transparent"
                fgColor="#000000"
                level="H"
                includeMargin={false}
                style={{ width: "100%", height: "auto" }}
              />
            </div>

            {/* Overlay for locked levels */}
            {isDisabled && (
              <div className="absolute inset-0 bg-white  flex flex-col items-center justify-center text-gray-600 text-sm font-semibold rounded p-2">
                <div>Upgrade to unlock</div>
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 px-3 py-1 text-white rounded text-xs hover:bg-blue-600"
                >
                  View Demo
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          {level === 1 && (
            <p className="mt-2 text-sm text-gray-600">
              Free: Scan to <span className="font-semibold">view menu</span>
            </p>
          )}
          {level === 2 && (
            <p className="mt-2 text-sm text-gray-600">
              Premium: Scan to <span className="font-semibold">view menu</span>
            </p>
          )}
          {level === 3 && (
            <p className="mt-2 text-sm text-gray-600">
              Pro: Scan to{" "}
              <span className="font-semibold">view & place orders</span>
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => handleDownload(templateId)}
              disabled={isDisabled}
              className={`flex-1 px-4 py-2 rounded shadow text-white font-semibold transition-colors ${
                isDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Download QR
            </button>
          </div>
        </div>
      );
    });

  return (
  <div className="mt-10 border p-4 rounded bg-white text-center">
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        Restaurant Menu QR Codes
      </h3>

      {/* Free level dropdown */}
      <div className="mb-4 text-left">
        <button
          className="w-full flex justify-between items-center px-4 py-3 text-lg font-semibold focus:outline-none border-b"
          onClick={() => setOpenFree((v) => !v)}
        >
          <span>Free QR</span>
          <span>{openFree ? "▲" : "▼"}</span>
        </button>
        {openFree && membership_level === 1 && (
          <div className="flex flex-col items-center py-4">
            <div id="free-qr" className="relative">
              <QRCodeCanvas
                value={basicLink}
                size={180}
                bgColor="transparent"
                fgColor="#000000"
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Free: Scan to <span className="font-semibold">view menu</span>
            </p>
            <button
              onClick={() => handleDownload("free-qr")}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
            >
              Download Menu
            </button>
          </div>
        )}
      </div>

      {/* Premium dropdown */}
      <div className="mb-4 text-left">
        <button
          className="w-full flex justify-between items-center px-4 py-3 text-lg font-semibold focus:outline-none border-b"
          onClick={() => setOpenPremium((v) => !v)}
        >
          <span>Premium QR</span>
          <span>{openPremium ? "▲" : "▼"}</span>
        </button>
        {openPremium && (
          <>
            <h4 className="text-lg font-medium mb-2 text-gray-600 mt-4"></h4>
            <div className="overflow-x-auto py-4">
              <div className="flex gap-4">
                {renderTemplates(basicLink, "premium-", 2, demoLinks.premium)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pro dropdown */}
      <div className="mb-4 text-left">
        <button
          className="w-full flex justify-between items-center px-4 py-3 text-lg font-semibold focus:outline-none border-b"
          onClick={() => setOpenPro((v) => !v)}
        >
          <span>Pro QR (Take Orders on WhatsApp)</span>
          <span>{openPro ? "▲" : "▼"}</span>
        </button>
        {openPro && (
          <>
            <h4 className="text-lg font-medium mb-2 text-gray-600 mt-4"></h4>
            <div className="overflow-x-auto py-4">
              <div className="flex gap-4">
                {renderTemplates(wpLink, "pro-", 3, demoLinks.premiumWP)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Membership Info */}
      <p className="mt-6 text-sm text-gray-600">
        Your Membership Level:{" "}
        <span className="font-semibold">
          {{
            1: "Free",
            2: "Premium",
            3: "Pro Level",
          }[membership_level] || "Unknown"}
        </span>
      </p>
    </div>
  );
};
export default QRCodeTemplates;
