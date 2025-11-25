import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

// Inline Icons
const Icons = {
  Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Copy: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Lock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Palette: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
};

const QRCodeTemplates = ({ restaurantId, membership_level }) => {
  const tableQR = `https://petoba.in/menuwp/${restaurantId}`;
  const deliveryQR = `https://petoba.in/cloudkitchen/${restaurantId}`;
  const [activeTab, setActiveTab] = useState(0); // 0 = Table, 1 = Delivery
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  // Customization State
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const templates = [
    {
      id: "template1",
      title: "Dine-In Menu QR",
      desc: "Best for table tents and stickers",
      url: tableQR,
      img: "https://website.avenirya.com/wp-content/uploads/2025/11/Orange-and-White-Retro-QR-Code-Placement-Flyer.jpg",
      qrStyle: { top: "55%", left: "50%", width: "46%", transform: "translate(-50%, -50%)" },
    },
    {
      id: "template2",
      title: "Delivery & Pickup QR",
      desc: "Best for flyers and packaging",
      url: deliveryQR,
      img: "https://website.avenirya.com/wp-content/uploads/2025/11/Delivery-Order-QR-Template.png",
      qrStyle: { top: "57.5%", left: "50%", width: "60%", transform: "translate(-50%, -50%)" },
    },
  ];

  const currentTemplate = templates[activeTab];
  const isLocked = membership_level < 3;

  const handleDownload = () => {
    if (isLocked) {
      alert("Please upgrade to the Business plan to download high-res QR codes.");
      return;
    }
    setDownloading(true);
    const element = document.getElementById("qr-preview-capture");
    
    html2canvas(element, { useCORS: true, scale: 3 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `Petoba_QR_${currentTemplate.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setDownloading(false);
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTemplate.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div className="flex flex-col lg:flex-row h-full">
        
        {/* --- LEFT PANEL: CONTROLS --- */}
        <div className="w-full lg:w-1/3 bg-gray-50 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col gap-8">
          
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Icons.Palette /></span>
              QR Design Studio
            </h3>
            <p className="text-gray-500 text-sm mt-2">Customize and download your QR codes.</p>
          </div>

          {/* Type Selector */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">1. Select QR Type</label>
            <div className="grid grid-cols-1 gap-3">
              {templates.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    activeTab === idx 
                      ? "border-indigo-500 bg-white shadow-md ring-2 ring-indigo-100" 
                      : "border-transparent bg-white shadow-sm hover:bg-gray-100"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${activeTab === idx ? "border-indigo-600" : "border-gray-300"}`}>
                    {activeTab === idx && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                  </div>
                  <div>
                    <h4 className={`font-bold ${activeTab === idx ? "text-indigo-900" : "text-gray-700"}`}>{t.title}</h4>
                    <p className="text-xs text-gray-500">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-3 pt-6 border-t border-gray-200">
             <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Scan Link:</span>
                <span className="font-mono text-indigo-600 truncate max-w-[150px]">{currentTemplate.url}</span>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={handleCopy}
                 className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
               >
                 {copied ? <Icons.Check /> : <Icons.Copy />}
                 {copied ? "Copied" : "Copy Link"}
               </button>

               <button 
                 onClick={handleDownload}
                 disabled={isLocked}
                 className={`flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-lg font-medium transition-all shadow-md ${
                   isLocked 
                     ? "bg-gray-400 cursor-not-allowed" 
                     : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                 }`}
               >
                 {isLocked ? <Icons.Lock /> : <Icons.Download />}
                 {isLocked ? "Locked" : downloading ? "Saving..." : "Download"}
               </button>
             </div>
             
             {isLocked && (
               <p className="text-xs text-center text-red-500 bg-red-50 p-2 rounded">
                 ⚠️ High-res downloads available on <b>Business Plan</b>
               </p>
             )}
          </div>

        </div>

        {/* --- RIGHT PANEL: LIVE PREVIEW --- */}
        <div className="w-full lg:w-2/3 bg-gray-100 flex items-center justify-center p-8 relative overflow-hidden">
           {/* Background Pattern */}
           <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

           {/* The Canvas Card */}
           <div className="relative z-10 animate-fade-in-up">
              <div 
                id="qr-preview-capture" 
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
                style={{ width: '380px', maxWidth: '100%' }}
              >
                 {/* Template Image */}
                 <img 
                    src={currentTemplate.img} 
                    alt="Template Background" 
                    className="w-full h-auto object-cover block"
                    crossOrigin="anonymous"
                 />

                 {/* QR Overlay */}
                 <div className="absolute" style={currentTemplate.qrStyle}>
                    <QRCodeCanvas
                      value={currentTemplate.url}
                      size={512} // Render high res, scale down via CSS
                      bgColor={bgColor}
                      fgColor={qrColor}
                      level="H"
                      includeMargin={false}
                      style={{ width: '100%', height: '100%', borderRadius: '4px' }}
                    />
                 </div>
              </div>

              {/* Preview Label */}
              <div className="mt-6 text-center">
                 <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full shadow text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Live Preview
                 </span>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default QRCodeTemplates;