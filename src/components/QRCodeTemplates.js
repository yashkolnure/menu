// QRCodeTemplates.js
import React from "react";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeTemplates = ({ restaurantId }) => {
  const qrLink = `https://app.avenirya.com/menu/${restaurantId}`;

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

  return (
    <div className="mt-10 border p-4 rounded bg-gray-50 text-center">
      <h3 className="text-xl font-semibold mb-8 text-gray-700">Restaurant Menu QR Codes</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {templates.map((template, index) => (
          <div key={template.id} className="border p-3 rounded shadow bg-white">
            <div
              id={template.id}
              className="relative inline-block w-64 h-auto rounded overflow-hidden shadow"
            >
              <img
                src={template.img}
                alt={`QR Template ${index + 1}`}
                className="w-full h-auto object-cover"
                crossOrigin="anonymous"
              />
              <div
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: "translate(-50%, -50%)",
                  width: "50%",
                }}
              >
                <QRCodeCanvas
                  value={qrLink}
                  size={200}
                  bgColor="transparent"
                  fgColor="#000000"
                  level="H"
                  includeMargin={false}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>

            <button
              onClick={() => handleDownload(template.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow mt-4"
            >
              Download QR
            </button>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Link:{" "}
        <a
          href={qrLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {qrLink}
        </a>
      </p>
    </div>
  );
};

export default QRCodeTemplates;
