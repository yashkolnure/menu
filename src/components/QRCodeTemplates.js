import React, { useState } from "react";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip"; 
import { saveAs } from "file-saver"; 

// Inline Icons
const Icons = {
  Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Copy: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Lock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Palette: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
  Layers: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  ToggleOn: () => <svg className="w-8 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm4 8a1 1 0 11-2 0 1 1 0 012 0zm-7 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /><path d="M4 10a6 6 0 1112 0 6 6 0 01-12 0z" /></svg> // Simplified
};

const QRCodeTemplates = ({ restaurantId, membership_level }) => {
  const [activeTab, setActiveTab] = useState(0); 
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Customization State
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  
  // 🆕 Table Management State
  const [enableTableSystem, setEnableTableSystem] = useState(false); // Default OFF
  const [tableCount, setTableCount] = useState(1);
  const [previewTable, setPreviewTable] = useState(1);

  // URLs
  const baseMenuURL = `https://petoba.in/menuwp/${restaurantId}`;
  const getTableURL = (tableNum) => `${baseMenuURL}?table=${tableNum}`;
  const deliveryQR = `https://petoba.in/cloudkitchen/${restaurantId}`;

  // Logic: If Table System is ON, use specific table URL. Otherwise, use base URL.
  const currentPreviewURL = activeTab === 0 
    ? (enableTableSystem ? getTableURL(previewTable) : baseMenuURL) 
    : deliveryQR;

  const templates = [
    {
      id: "template1",
      title: "Dine-In Menu QR",
      desc: "Standard QR for table ordering",
      img: "https://website.avenirya.com/wp-content/uploads/2025/11/Orange-and-White-Retro-QR-Code-Placement-Flyer.jpg",
      qrStyle: { top: "55%", left: "50%", width: "46%", transform: "translate(-50%, -50%)" },
    },
    {
      id: "template2",
      title: "Delivery & Pickup QR",
      desc: "Best for flyers and packaging",
      img: "https://website.avenirya.com/wp-content/uploads/2025/11/Delivery-Order-QR-Template.png",
      qrStyle: { top: "57.5%", left: "50%", width: "60%", transform: "translate(-50%, -50%)" },
    },
  ];

  const currentTemplate = templates[activeTab];
  const isLocked = membership_level < 3;

  // --- 💾 BULK DOWNLOAD LOGIC ---
  const handleBulkDownload = async () => {
    if (isLocked) { alert("Please upgrade."); return; }
    
    setDownloading(true);
    setProgress(0);
    const zip = new JSZip();
    const folder = zip.folder(`Petoba_QR_Codes_${restaurantId}`);

    try {
      for (let i = 1; i <= tableCount; i++) {
        const element = document.getElementById(`hidden-qr-gen-${i}`);
        if (element) {
          const canvas = await html2canvas(element, { useCORS: true, scale: 2 });
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          folder.file(`Table-${i}.png`, blob);
        }
        setProgress(Math.round((i / tableCount) * 100));
      }
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `Petoba_Tables_1-${tableCount}.zip`);
    } catch (error) {
      console.error(error);
      alert("Error generating zip.");
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  // --- SINGLE DOWNLOAD LOGIC ---
  const handleSingleDownload = () => {
    if (isLocked) { alert("Please upgrade."); return; }
    setDownloading(true);
    const element = document.getElementById("qr-preview-capture");
    
    html2canvas(element, { useCORS: true, scale: 3 }).then((canvas) => {
      const link = document.createElement("a");
      // Name depends on whether Table System is Active
      const fileName = activeTab === 0 
        ? (enableTableSystem ? `Table-${previewTable}_QR.png` : `General_Menu_QR.png`)
        : `Delivery_QR.png`;
        
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setDownloading(false);
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPreviewURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div className="flex flex-col lg:flex-row h-full">
        
        {/* --- LEFT PANEL: CONTROLS --- */}
        <div className="w-full lg:w-1/3 bg-gray-50 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col gap-6">
          
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Icons.Palette /></span>
              QR Studio
            </h3>
            <p className="text-gray-500 text-sm mt-2">Generate and download QR codes.</p>
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

          {/* 🆕 TABLE SETTINGS (Only for Dine-In) */}
          {activeTab === 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-200 animate-fade-in-up">
              
              <div className="flex justify-between items-center">
                 <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Icons.Layers /> 2. Table Management
                 </label>
                 
                 {/* TOGGLE SWITCH */}
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={enableTableSystem}
                      onChange={() => setEnableTableSystem(!enableTableSystem)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                 </label>
              </div>

              {!enableTableSystem ? (
                  <p className="text-xs text-gray-500 italic">Toggle "ON" to generate unique QR codes for specific tables (e.g., Table 1, Table 2).</p>
              ) : (
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-fade-in">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Total No. of Tables</label>
                        <input 
                            type="number" min="1" max="100"
                            value={tableCount} 
                            onChange={(e) => setTableCount(Number(e.target.value))}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-800"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Preview Table #</label>
                        <input 
                            type="range" min="1" max={tableCount} 
                            value={previewTable} 
                            onChange={(e) => setPreviewTable(Number(e.target.value))}
                            className="w-full mt-2 accent-indigo-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-xs font-bold text-indigo-600">
                            <span>1</span>
                            <span>Current: {previewTable}</span>
                            <span>{tableCount}</span>
                        </div>
                    </div>
                  </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto space-y-3 pt-6 border-t border-gray-200">
             
             {downloading && activeTab === 0 && enableTableSystem && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
             )}

             <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={handleSingleDownload}
                 disabled={downloading || isLocked}
                 className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
               >
                 <Icons.Download />
                 {activeTab === 0 && enableTableSystem ? `Save Table ${previewTable}` : "Download"}
               </button>

               {/* Bulk Download (Only visible if Table System is ON) */}
               {activeTab === 0 && enableTableSystem ? (
                   <button 
                    onClick={handleBulkDownload}
                    disabled={downloading || isLocked}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-lg font-medium transition-all shadow-md ${
                        isLocked ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                    }`}
                   >
                     {isLocked ? <Icons.Lock /> : <Icons.Layers />}
                     {isLocked ? "Locked" : downloading ? `${progress}%` : `Save All (${tableCount})`}
                   </button>
               ) : (
                   <button 
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium transition-all hover:bg-indigo-700"
                   >
                     {copied ? <Icons.Check /> : <Icons.Copy />}
                     {copied ? "Copied" : "Copy Link"}
                   </button>
               )}
             </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: LIVE PREVIEW --- */}
        <div className="w-full lg:w-2/3 bg-gray-100 flex items-center justify-center p-8 relative overflow-hidden">
           <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

           <div className="relative z-10 animate-fade-in-up">
              <div 
                id="qr-preview-capture" 
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
                style={{ width: '380px', maxWidth: '100%' }}
              >
                 <img 
                   src={currentTemplate.img} 
                   alt="Template Background" 
                   className="w-full h-auto object-cover block"
                   crossOrigin="anonymous"
                 />
                 <div className="absolute" style={currentTemplate.qrStyle}>
                    <QRCodeCanvas
                      value={currentPreviewURL}
                      size={512}
                      bgColor={bgColor}
                      fgColor={qrColor}
                      level="H"
                      includeMargin={false}
                      style={{ width: '100%', height: '100%', borderRadius: '4px' }}
                    />
                 </div>
                 {/* Only show Table Number overlay if enabled */}
                 {activeTab === 0 && enableTableSystem && (
                     <div className="absolute bottom-16 left-0 right-0 text-center">
                        <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-gray-800 shadow-sm">
                            Table {previewTable}
                        </span>
                     </div>
                 )}
              </div>

              <div className="mt-6 text-center">
                 <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full shadow text-xs font-bold text-gray-500 uppercase tracking-widest">
                   Live Preview: {activeTab === 0 ? (enableTableSystem ? `Table ${previewTable}` : "General Menu") : "Delivery"}
                 </span>
              </div>
           </div>
        </div>
      </div>

      {/* --- HIDDEN RENDERING FOR BULK --- */}
      {activeTab === 0 && enableTableSystem && (
          <div style={{ position: "fixed", left: "-9999px", top: "-9999px" }}>
            {Array.from({ length: tableCount }).map((_, i) => {
                const tableNum = i + 1;
                return (
                    <div 
                        key={tableNum} 
                        id={`hidden-qr-gen-${tableNum}`}
                        style={{ width: '500px', position: 'relative', overflow: 'hidden' }}
                    >
                         <img 
                            src={templates[0].img} 
                            style={{ width: '100%', display: 'block' }}
                            crossOrigin="anonymous"
                        />
                        <div style={{ position: 'absolute', ...templates[0].qrStyle }}>
                            <QRCodeCanvas
                                value={getTableURL(tableNum)}
                                size={512}
                                level="H"
                                includeMargin={false}
                                style={{ width: '100%', height: '100%', borderRadius: '4px' }}
                            />
                        </div>
                        <div style={{ position: 'absolute', bottom: '15%', width: '100%', textAlign: 'center' }}>
                            <span style={{ background: 'rgba(255,255,255,0.9)', padding: '5px 15px', borderRadius: '20px', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                                Table {tableNum}
                            </span>
                        </div>
                    </div>
                );
            })}
          </div>
      )}

    </div>
  );
};

export default QRCodeTemplates;