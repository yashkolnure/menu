import React, { useState, useEffect } from "react";
import { 
  Bell, Smartphone, CheckCircle, AlertTriangle, Send, 
  Download, ArrowRight, ShieldCheck, HelpCircle, Zap, Copy 
} from "lucide-react";
import { Helmet } from "react-helmet";

const NotificationSetup = () => {
  // --- STATE ---
  const [restaurantId, setRestaurantId] = useState("");
  const [topic, setTopic] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [testStatus, setTestStatus] = useState("idle"); 
  const [copied, setCopied] = useState(false); // For manual copy feedback

  // --- INIT ---
  useEffect(() => {
    const storedId = localStorage.getItem("restaurantId");
    // Fallback for demo
    const activeId = storedId || "demo_123"; 
    setRestaurantId(activeId);
    setTopic(`petoba_${activeId}`);
  }, []);

  // --- MANUAL COPY FUNCTION ---
  const handleCopy = () => {
    navigator.clipboard.writeText(topic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- SEND TEST ALERT ---
  const sendTestNotification = async () => {
    if (!topic) return;
    setIsSending(true);
    setTestStatus("idle");

    try {
      const res = await fetch("https://ntfy.sh", {
        method: "POST",
        body: JSON.stringify({
          topic: topic,
          message: "🔔 Verification Successful! \nYour device is now linked to Petoba.",
          title: "Connection Verified ✅",
          priority: 5, // 5 = Max Priority (triggers sound/vibrate even in Doze mode)
          tags: ["tada", "check_mark"],
          click: "https://app.petoba.in/admin/dashboard"
        })
      });

      if (res.ok) {
        setTestStatus("success");
        const audio = new Audio("https://actions.google.com/sounds/v1/science_fiction/scifi_input.ogg");
        audio.play().catch(e => console.log("Audio error", e));
      } else {
        throw new Error("Error sending");
      }
    } catch (error) {
      console.error("Notification Error:", error);
      setTestStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  if (!restaurantId) return <div className="p-10 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-4 md:p-8">
      <Helmet><title>Alert Setup | Petoba</title></Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-orange-600">
            <Bell size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instant Order Alerts</h1>
            <p className="text-gray-500">Receive loud notifications on your phone even when this dashboard is closed.</p>
          </div>
        </div>

        {/* STEP 1: INSTALL */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Step 1</span>
                <h3 className="font-bold text-lg text-gray-800">Install Pager App</h3>
              </div>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Download the <strong>Ntfy</strong> app. It's a lightweight tool that turns your phone into a secure pager for restaurant orders.
              </p>
              <div className="flex gap-3">
                <a href="https://play.google.com/store/apps/details?id=io.heckel.ntfy" target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-semibold flex items-center gap-2 transition text-gray-700">
                  <Download size={16} /> Android App
                </a>
                <a href="https://apps.apple.com/us/app/ntfy/id1625396347" target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-semibold flex items-center gap-2 transition text-gray-700">
                  <Download size={16} /> iOS App
                </a>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center bg-gray-50 rounded-lg w-32">
               <Smartphone className="text-gray-300" size={48} />
            </div>
          </div>
          
          {/* ⚡ NEW: INSTANT DELIVERY INSTRUCTION */}
          
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
             <div className="bg-yellow-100 p-2 rounded-full h-fit text-yellow-600">
                <Zap size={20} fill="currentColor" />
             </div>
             <div>
                <h4 className="font-bold text-yellow-800 text-sm">Critical Setting: Enable Instant Delivery</h4>
                <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                   To ensure alerts wake up your phone instantly:
                   <br/>1. Open the App Settings.
                   <br/>2. Look for <strong>Instant Delivery</strong> or the <strong>Flash Icon (⚡)</strong>.
                   <br/>3. Enable it to bypass battery optimization.
                </p>
             </div>
          </div>
        </div>

        {/* STEP 2: CONNECT */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
          <div className="pl-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">Step 2</span>
              <h3 className="font-bold text-lg text-gray-800">Connect Device</h3>
            </div>
            
            <p className="text-gray-500 text-sm mb-6">
              Use the button below to auto-connect, or enter the Topic ID manually in the app.
            </p>
            
            {/* Auto Connect Button */}
            <a 
              href={`ntfy://subscribe/${topic}`} 
              className="w-full md:w-auto px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 mb-6"
            >
              <Smartphone size={20} /> One-Tap Connect
            </a>

            {/* 🆕 MANUAL SETUP OPTION */}
            <div className="border-t border-gray-100 pt-5">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Or Connect Manually</p>
               <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex-1">
                     <p className="text-sm text-gray-700 font-medium mb-1">
                        1. Open App & Click <span className="font-bold text-xl leading-none inline-block align-middle">+</span> (Subscribe)
                     </p>
                     <p className="text-sm text-gray-700 font-medium">
                        2. Type this Topic Name:
                     </p>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                     <code className="bg-white px-3 py-2 border border-gray-300 rounded text-sm font-mono text-gray-800 flex-1 md:flex-initial">
                        {topic}
                     </code>
                     <button 
                        onClick={handleCopy} 
                        className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 p-2 rounded transition"
                        title="Copy Topic"
                     >
                        {copied ? <CheckCircle size={18} className="text-green-600"/> : <Copy size={18} />}
                     </button>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* STEP 3: TEST */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Step 3</span>
            <h3 className="font-bold text-lg text-gray-800">Verify Connection</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-6">
            <div className="flex-1 space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <ArrowRight size={14} className="text-gray-400" /> Ensure phone volume is ON.
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <ArrowRight size={14} className="text-gray-400" /> Press button to send a test ping.
              </p>

              {/* FEEDBACK MESSAGES */}
              {testStatus === "success" && (
                <div className="inline-flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-lg text-sm font-medium mt-2">
                  <CheckCircle size={16} /> Test Sent! Check your phone.
                </div>
              )}
              {testStatus === "error" && (
                <div className="inline-flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium mt-2">
                  <AlertTriangle size={16} /> Connection Failed. Check internet.
                </div>
              )}
            </div>

            <button 
              onClick={sendTestNotification}
              disabled={isSending}
              className={`w-full md:w-auto px-6 py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${
                isSending ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-900 hover:bg-black"
              }`}
            >
              {isSending ? "Sending..." : <><Send size={18} /> Send Test Alert</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotificationSetup;