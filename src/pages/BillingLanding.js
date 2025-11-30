import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { 
  Monitor, Keyboard, Cable, MousePointer2, 
  BarChart4, Share2, Printer, Zap, 
  CheckCircle2, MessageCircle, Copy, Eye, EyeOff, LayoutGrid
} from "lucide-react";

// --- CONSTANTS ---
const WEB_POS_LINK = "https://petoba.in/login"; // Example link for PC Login
const PHONE_NUMBER = "919270361329";

// Helper for WhatsApp
const getWhatsAppLink = () => {
  const message = `Hello Petoba Team, I am interested in the PC/Desktop Billing Software.`;
  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
};

export default function PetobaPCFeatures() {
  const [showDemo, setShowDemo] = useState(false);
  const demoEmail = "Demo@gmail.com";
  const demoPassword = "Demo@1234";

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch (err) {
      alert("Please copy manually.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Helmet>
        <title>Petoba Desktop POS | Restaurant Billing for PC</title>
        <meta name="description" content="Professional PC Billing Software for Restaurants. Keyboard shortcuts, USB Printer support, and large screen dashboard." />
      </Helmet>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-24 bg-white">
        {/* Abstract Background for PC Vibe */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm mb-8">
            <Monitor size={16} /> 
            Desktop Version Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
            Built for the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Cashier Counter</span>
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            The speed of keyboard shortcuts. The reliability of USB printing. The clarity of a big screen. 
            Experience the professional Point of Sale (POS) designed for Windows & Mac.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href={WEB_POS_LINK} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all">
              <Monitor size={20} />
              Launch Web POS
            </a>
            <button 
              onClick={() => document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              View Demo ID
            </button>
          </div>
          
          <p className="mt-6 text-sm text-slate-400 font-medium">Works on Chrome, Edge, Safari • Windows 10/11 & macOS</p>
        </div>
      </section>

      {/* --- DESKTOP FEATURES GRID --- */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Restaurants Upgrade to PC</h2>
            <p className="text-slate-500 mt-2">Mobile is great for waiters. Desktop is essential for cashiers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1: Speed */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                <Keyboard size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast Shortcuts</h3>
              <p className="text-slate-600 leading-relaxed">
                Ditch the mouse. Use <b>Enter</b> to print bills, <b>Space</b> to confirm orders, and <b>Esc</b> to go back. Clear lines 3x faster during rush hours.
              </p>
            </div>

            {/* Feature 2: Hardware */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6">
                <Cable size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">USB & LAN Printing</h3>
              <p className="text-slate-600 leading-relaxed">
                Bluetooth can be flaky. Connect heavy-duty Thermal Printers via USB or LAN cables for instant, reliable, non-stop KOT printing.
              </p>
            </div>

            {/* Feature 3: Big Screen */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 mb-6">
                <LayoutGrid size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Table Map View</h3>
              <p className="text-slate-600 leading-relaxed">
                See the status of 50+ tables at a glance. Visualize occupied, free, and reserved tables on a single wide screen without scrolling.
              </p>
            </div>

            {/* Feature 4: Multitasking */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-6">
                <MousePointer2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Tab Operations</h3>
              <p className="text-slate-600 leading-relaxed">
                Open "Live Orders" in one tab and "Reports" in another. Manage billing while checking yesterday's sales without losing context.
              </p>
            </div>

            {/* Feature 5: Integration */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                <Share2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">WhatsApp Web Sync</h3>
              <p className="text-slate-600 leading-relaxed">
                Since you use WhatsApp Web on PC, our billing software integrates seamlessly to send PDF invoices instantly to customers.
              </p>
            </div>

            {/* Feature 6: Analytics */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                <BarChart4 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Detailed Analytics</h3>
              <p className="text-slate-600 leading-relaxed">
                View large charts and data tables. Export sales data to Excel/CSV with one click for your accountant.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- SPECS SECTION (Table Style) --- */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-12 text-center">System Requirements</h2>
          
          <div className="border border-slate-200 rounded-2xl shadow-sm">
            {[
              { icon: <Monitor size={18}/>, label: "Operating System", val: "Windows 10/11, macOS, Linux" },
              { icon: <Zap size={18}/>, label: "Platform", val: "Web Browser (Chrome / Edge Recommended)" },
              { icon: <Printer size={18}/>, label: "Printer Support", val: "USB Thermal, LAN/Wifi, Standard Laser" },
              { icon: <Cable size={18}/>, label: "Hardware Support", val: "Barcode Scanners, Cash Drawers" },
              { icon: <Share2 size={18}/>, label: "Mobile Sync", val: "Syncs with Petoba Android App instantly" },
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between p-5 bg-slate-50 hover:bg-white transition-colors ${idx !== 4 ? 'border-b border-slate-200' : ''}`}>
                <div className="flex items-center gap-3 text-slate-600 font-medium">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className="font-bold text-slate-900">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DEMO SECTION (PC Style) --- */}
      <section id="demo-section" className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md mb-4 uppercase tracking-wide">Ready to Login</div>
            <h2 className="text-3xl font-bold mb-4">Try the PC Dashboard Now</h2>
            <p className="text-slate-400">
              Open the Web POS link on your laptop/desktop and use these admin credentials to experience the speed.
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 max-w-xl mx-auto shadow-2xl">
            <div className="space-y-6">
              
              {/* Email */}
              <div className="bg-slate-900 p-4 rounded-lg flex items-center justify-between border border-slate-600">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Login Email</p>
                  <p className="font-mono text-lg text-white tracking-wide">{demoEmail}</p>
                </div>
                <button onClick={() => copyToClipboard(demoEmail)} className="bg-slate-800 hover:bg-slate-700 text-blue-400 px-3 py-1.5 rounded text-sm font-semibold transition">Copy</button>
              </div>

              {/* Password */}
              <div className="bg-slate-900 p-4 rounded-lg flex items-center justify-between border border-slate-600">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Password</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-lg text-white tracking-wide">{showDemo ? demoPassword : "••••••••"}</p>
                    <button onClick={() => setShowDemo(!showDemo)} className="text-slate-500 hover:text-white ml-2">
                      {showDemo ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button onClick={() => copyToClipboard(demoPassword)} className="bg-slate-800 hover:bg-slate-700 text-blue-400 px-3 py-1.5 rounded text-sm font-semibold transition">Copy</button>
              </div>

              <div className="pt-2">
                <a href={WEB_POS_LINK} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-all hover:scale-[1.02]">
                  <Monitor size={20} /> Open Web POS
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <div className="bg-white border-t border-slate-200 py-12 text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Need a custom setup?</h3>
        <p className="text-slate-500 mb-6">We help with hardware selection (Printers/Scanners) and Menu setup.</p>
        <div className="flex justify-center gap-4">
          <a href={getWhatsAppLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition shadow-lg shadow-green-100">
            <MessageCircle size={20} /> Chat on WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
}