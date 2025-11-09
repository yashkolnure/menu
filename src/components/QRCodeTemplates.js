import React from "react";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeTemplates = ({ restaurantId, membership_level }) => {
  const wpLink = `https://app.avenirya.com/menuwp/${restaurantId}`;

  const template = {
    id: "template1",
    img: "https://website.avenirya.com/wp-content/uploads/2025/11/Orange-and-White-Retro-QR-Code-Placement-Flyer.jpg",
  };

  const handleDownload = (id) => {
    const qrElement = document.getElementById(id);
    html2canvas(qrElement, { useCORS: true, scale: 3 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `menu_qr_${restaurantId}_${id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const isDisabled = membership_level < 3;
  const templateId = `pro-${template.id}`;

  return (
    <div className="">
      <h3 className="text-xl font-semibold mb-4 mt-10 text-gray-700 text-center">
        Restaurant Menu QR Code
      </h3>

      <div className="flex justify-center">
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
              alt="QR Template"
              className="w-full h-auto object-cover"
              crossOrigin="anonymous"
            />

            <div
              className="absolute left-1/2"
              style={{
              top: "55%",      // adjust up/down
              left: "50%",     // keep centered horizontally
              transform: "translate(-50%, -50%)",
              width: "46%",    // adjust QR size to fit frame
            }}
            >
              <QRCodeCanvas
                value={wpLink}
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
      </div>


    </div>
  );
};

export default QRCodeTemplates;
