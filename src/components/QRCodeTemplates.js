import React, { useState } from "react";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeTemplates = ({ restaurantId, membership_level }) => {
  const tableQR = `https://app.avenirya.com/menuwp/${restaurantId}`;
  const deliveryQR = `https://app.avenirya.com/cloudkitchen/${restaurantId}`;

  const [copiedId, setCopiedId] = useState(null);

  const templates = [
    {
      id: "template1",
      title: "For Table (Menu Scan QR)",
      img: "https://website.avenirya.com/wp-content/uploads/2025/11/Orange-and-White-Retro-QR-Code-Placement-Flyer.jpg",
      qrValue: tableQR,
      qrStyle: {
        top: "55%",
        left: "50%",
        width: "46%",
        transform: "translate(-50%, -50%)",
      },
    },
    {
      id: "template2",
      title: "For Delivery Orders",
      img: "https://website.avenirya.com/wp-content/uploads/2025/11/Delivery-Order-QR-Template.png",
      qrValue: deliveryQR,
      qrStyle: {
        top: "57.5%",
        left: "50%",
        width: "60%",
        transform: "translate(-50%, -50%)",
      },
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

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);

    setTimeout(() => setCopiedId(null), 1500);
  };

  const isDisabled = membership_level < 3;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 mt-10 text-gray-700 text-center">
        Restaurant QR Templates
      </h3>

      <div className="flex justify-center gap-5 flex-wrap rounded-lg py-5 overflow-hidden">
        {templates.map((template) => {
          const templateId = `pro-${template.id}`;

          return (
            <div
              key={templateId}
              className="bg-white/60 backdrop-blur-lg rounded-3xl border border-gray-200 md:w-[40%] p-5 shadow-lg"
            >
              <h4 className="text-center font-semibold mb-2 text-gray-800 text-m">
                {template.title}
              </h4>
              <div
                id={templateId}
                className="relative inline-block w-full h-auto rounded overflow-hidden shadow"
              >
                <img
                  src={template.img}
                  alt="QR Template"
                  className="w-full h-auto object-cover"
                  crossOrigin="anonymous"
                />

                <div className="absolute" style={template.qrStyle}>
                  <QRCodeCanvas
                    value={template.qrValue}
                    size={200}
                    bgColor="transparent"
                    fgColor="#000000"
                    level="H"
                    includeMargin={false}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>

                {isDisabled && (
                  <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center text-gray-600 text-sm font-semibold rounded p-2">
                    <div>Upgrade to unlock</div>
                    <a
                      href="https://petoba.short.gy/PremiumWP"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                      View Demo
                    </a>
                  </div>
                )}
              </div>

              {/* Download Button */}
             <div className="mt-3 flex items-center gap-3">
  {/* Download Button */}
  <button
    onClick={() => handleDownload(templateId)}
    disabled={isDisabled}
    className={`flex-1 px-4 py-2 rounded-lg shadow text-white font-semibold transition-colors
      ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
  >
    Download QR
  </button>

  {/* Copy URL Button */}
  <button
    onClick={() => handleCopy(template.qrValue, templateId)}
    className="flex-1 px-4 py-2 rounded-lg shadow bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
  >
    {copiedId === templateId ? "Copied!" : "Copy URL"}
  </button>
</div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QRCodeTemplates;
