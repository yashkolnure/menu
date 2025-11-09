import React from "react";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeTemplates = ({ restaurantId, membership_level }) => {
  const wpLink = `https://app.avenirya.com/menuwp/${restaurantId}`;

  const demoLinks = {
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

            {isDisabled && (
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-gray-600 text-sm font-semibold rounded p-2">
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

          <p className="mt-2 text-sm text-gray-600">
            Pro: Scan to <span className="font-semibold">view & place orders</span>
          </p>

          <button
            onClick={() => handleDownload(templateId)}
            disabled={isDisabled}
            className={`mt-2 w-full px-4 py-2 rounded shadow text-white font-semibold transition-colors ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Download QR
          </button>
        </div>
      );
    });

  return (
    <div className="mt-10 border p-4 rounded bg-white text-center">
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        Restaurant Menu QR Codes
      </h3>

      <div className="overflow-x-auto py-4">
        <div className="flex gap-4">
          {renderTemplates(wpLink, "pro-", 3, demoLinks.premiumWP)}
        </div>
      </div>

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
