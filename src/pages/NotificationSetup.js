import React, { useState, useEffect } from "react";
import {
  Bell,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Send,
  Download,
  ArrowRight,
  Zap,
  Copy
} from "lucide-react";
import { Helmet } from "react-helmet";

const NotificationSetup = () => {
  const [restaurantId, setRestaurantId] = useState("");
  const [topic, setTopic] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [testStatus, setTestStatus] = useState("idle");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem("restaurantId");
    const activeId = storedId || "demo_123";
    setRestaurantId(activeId);
    setTopic(`petoba_${activeId}`);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(topic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendTestNotification = async () => {
    if (!topic) return;

    setIsSending(true);
    setTestStatus("idle");

    try {
      const res = await fetch(`https://ntfy.sh/${topic}`, {
        method: "POST",
        headers: {
          Title: "Connection Verified",
          Priority: "5",
          Tags: "tada,check_mark",
          Click: "https://petoba.in/admin/dashboard"
        },
        body: "🔔 Verification Successful!\nYour device is now linked to Petoba."
      });

      if (!res.ok) throw new Error("Failed");
      setTestStatus("success");
    } catch {
      setTestStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  if (!restaurantId) {
    return <div className="p-10 text-center text-gray-500">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 text-gray-800">
      <Helmet>
        <title>Alert Setup | Petoba</title>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-4">

        {/* HEADER */}
        <div className="flex items-start gap-4">
          <div className="bg-orange-50 text-orange-600 p-3 rounded-xl">
            <Bell size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Instant Order Alerts on Mobile
            </h1>
            <p className="text-gray-500 mt-1 max-w-xl">
              Get loud, instant notifications for new orders — even when this
              dashboard is closed.
            </p>
          </div>
        </div>

        {/* STEP 1 */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
              Step 1
            </span>
            <h2 className="text-lg font-semibold">Install the ntfy App</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-4">
                Install the <strong>ntfy</strong> app on your phone. It acts as a
                secure pager for new orders.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://play.google.com/store/apps/details?id=io.heckel.ntfy"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100 text-sm font-medium"
                >
                  <Download size={16} /> Android
                </a>
                <a
                  href="https://apps.apple.com/us/app/ntfy/id1625396347"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100 text-sm font-medium"
                >
                  <Download size={16} /> iOS
                </a>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center w-28 h-28 bg-gray-50 rounded-xl">
              <Smartphone size={42} className="text-gray-300" />
            </div>
          </div>

          
        </section>

        {/* STEP 2 */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-orange-100 text-xs font-semibold text-orange-700">
              Step 2
            </span>
            <h2 className="text-lg font-semibold">Connect Your Device</h2>
          </div>

          <div className="bg-gray-50 border rounded-xl p-4 flex flex-col md:flex-row gap-4 ">
            <div className="flex-1 text-sm text-gray-700 left-0">
              <p>1. Open ntfy and tap <strong>+</strong></p>
              <p>2. Enter this topic name</p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <code className="px-3 py-2 bg-white border rounded-lg font-mono text-sm flex-1">
                {topic}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg border bg-white hover:bg-gray-100"
                title="Copy topic"
              >
                {copied ? (
                  <CheckCircle size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
            
          </div>
          <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <Zap size={18} className="text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">
                Enable Instant Delivery
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Turn on <strong>Instant Delivery (⚡)</strong> inside the ntfy
                app to bypass battery optimizations.
              </p>
            </div>
          </div>

        </section>

        {/* STEP 3 */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
              Step 3
            </span>
            <h2 className="text-lg font-semibold">Verify Connection</h2>
          </div>

          <div className="flex flex-col md:flex-row  justify-between gap-6">
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <ArrowRight size={14} /> Ensure phone volume is on
              </p>
              <p className="flex items-center gap-2">
                <ArrowRight size={14} /> Send a test alert
              </p>

              {testStatus === "success" && (
                <div className="inline-flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-lg mt-2">
                  <CheckCircle size={16} /> Test alert delivered
                </div>
              )}

              {testStatus === "error" && (
                <div className="inline-flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1.5 rounded-lg mt-2">
                  <AlertTriangle size={16} /> Failed to send alert
                </div>
              )}
            </div>

            <button
              onClick={sendTestNotification}
              disabled={isSending}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition ${
                isSending
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
              }`}
            >
              <Send size={18} />
              {isSending ? "Sending…" : "Send Test Alert"}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default NotificationSetup;
