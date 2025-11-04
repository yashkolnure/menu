// PetobaBillingLanding.jsx
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const APK_LINK = "https://avenirya.com/wp-content/uploads/2025/10/Petoba-Billing.apk";
const WHATSAPP_LINK =
  "https://wa.me/919270361329?text=Hello%20Petoba%20Team%2C%20I%20want%20to%20subscribe%20to%20Petoba%20Billing%20App.";

const screenshots = [
  "https://avenirya.com/wp-content/uploads/2025/10/1.png",
  "https://avenirya.com/wp-content/uploads/2025/10/2.png",
  "https://avenirya.com/wp-content/uploads/2025/10/3.png",
  "https://avenirya.com/wp-content/uploads/2025/10/4.png",
  "https://avenirya.com/wp-content/uploads/2025/10/2-1.png",
  "https://avenirya.com/wp-content/uploads/2025/10/1-1.png",
  "https://avenirya.com/wp-content/uploads/2025/10/4-1.png",
  "https://avenirya.com/wp-content/uploads/2025/10/3-1.png",
];

const FEATURES = [
  {
    key: "orders",
    title: "Digital Order Management",
    desc:
      "Receive and manage table orders instantly from your Petoba Digital Menu — realtime updates and clear kitchen flow.",
    img: screenshots[0],
  },
  {
    key: "kot",
    title: "KOT & Bill Printing",
    desc:
      "Print kitchen order tickets (KOTs) and customer bills instantly via Bluetooth printers — fast service, fewer errors.",
    img: screenshots[1],
  },
  {
    key: "dashboard",
    title: "Smart Dashboard & Reports",
    desc:
      "Daily, weekly, monthly summaries with top-selling items and simple charts to help you make quick decisions.",
    img: screenshots[2],
  },
  {
    key: "whatsapp",
    title: "WhatsApp Bill Sharing",
    desc:
      "Send bills directly to customers via WhatsApp from the Billing screen — saves paper and speeds checkout.",
    img: screenshots[3],
  },
];

export default function PetobaBillingLanding() {
  const [showDemo, setShowDemo] = useState(false);
  const demoEmail = "Demo@gmail.com";
  const demoPassword = "Demo@1234";

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // a simple feedback; you can expand to toast notifications
      alert("Copied to clipboard!");
    } catch (err) {
      alert("Unable to copy. Please copy manually.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased relative isolate">
      <Helmet>
        <title>Petoba Billing — Smart Restaurant Billing App</title>
        <meta
          name="description"
          content="Petoba Billing App — manage orders, print KOTs, share bills on WhatsApp, view analytics. Download the APK and try demo credentials."
        />
        <meta property="og:title" content="Petoba Billing — Smart Restaurant Billing App" />
        <meta
          property="og:description"
          content="An all-in-one mobile billing solution for restaurants with KOT printing, live orders, and WhatsApp bill sharing."
        />
        <meta property="og:image" content="https://petoba.avenirya.com/wp-content/uploads/2025/09/Untitled-design-6.png" />
        <link rel="icon" href="https://petoba.avenirya.com/wp-content/uploads/2025/09/download-1.png" />
      </Helmet>

      {/* Globe/Illustration Effect */}
      <div
        className="absolute inset-x-0 top-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-[50%] top-0 h-[800px] w-[1200px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-yellow-200/50 to-orange-300/50 opacity-40 filter blur-3xl"></div>
      </div>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-10 py-6 pt-24">
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900"
          >
            Smart Billing App for Restaurants & Cafes
            <span className="block text-orange-500 mt-2 text-2xl font-semibold">Fast KOTs/Bills • OR Orders • WhatsApp Bills</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-gray-600 max-w-xl"
          >
            Accept table orders via QR, print KOTs and bills over Bluetooth, share bills on WhatsApp and get simple,
            actionable sales reports — all from a single app built for busy kitchens.
          </motion.p>

          <div className="flex flex-wrap gap-4">
            <a
              href={APK_LINK}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold shadow hover:scale-[1.02] transition-transform"
              aria-label="Download Petoba APK"
            >
              Download APK
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 11l4 4 4-4" />
              </svg>
            </a>

            <button
              onClick={() => {
                document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" });
                setShowDemo(true);
              }}
              className="px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              aria-label="Show demo credentials"
            >
              Try Demo
            </button>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#25D366] font-semibold text-black shadow"
              aria-label="Contact via WhatsApp"
            >
              Contact on WhatsApp
            </a>
          </div>

          <div className="mt-2 text-sm text-gray-500">
            <strong>Note:</strong> Clicking “Download APK” downloads the installer 
          </div>
        </div>

        {/* Right - Device Mockup */}
        <div className="flex justify-center md:justify-end">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <div className="">
              <img
                src="https://avenirya.com/wp-content/uploads/2025/10/Blue-Modern-Money-Managing-Mobile-App-Promotion-Facebook-Ad-700-x-1120-px-700-x-900-px-1.png"
                alt="App preview"
                className="w-full h-full object-contain rounded-2xl"
                style={{width: "400px"}}
              />
            </div>
          </motion.div>
        </div>
      </section>

<section className="relative  py-6">
  {/* Background Blobs */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-orange-300 to-pink-400 rounded-full blur-3xl opacity-20 -z-10"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20 -z-10"></div>


  {/* Single Feature Card */}
  <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-4">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {/* Feature Item */}
      {[
        { icon: "🧾", title: "Instant KOT Printing", desc: "Generate kitchen order tickets immediately for faster service." },
        { icon: "💳", title: "Print Bills Quickly", desc: "Create and print customer bills in just a few clicks." },
        { icon: "📲", title: "Send Bills via WhatsApp", desc: "Share bills directly with customers instantly." },
        { icon: "📡", title: "Real-Time Order Updates", desc: "Track all orders live across multiple devices." },
        { icon: "📊", title: "Smart Dashboard & Analytics", desc: "Monitor sales, performance, and order stats easily." },
        { icon: "🗂️", title: "Daily/Weekly/Monthly Reports", desc: "Access organized sales reports anytime for better decision making." },
        { icon: "📱", title: "Multi-Device Support", desc: "Use the app seamlessly across multiple devices." },
        { icon: "🔔", title: "Instant Alerts for New Orders", desc: "Receive immediate notifications whenever a new order comes in." },
        { icon: "🔗", title: "Easy Integration with Petoba Menu", desc: "Connect your digital menu directly for smooth billing." },
      ].map((feature, index) => (
        <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="text-2xl">{feature.icon}</div>
          <div>
            <h3 className="font-semibold text-gray-800">{feature.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* FEATURES - alternating layout */}
      <section className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Core Features</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          We focused on the features restaurants need most: fast service, accurate orders, and easy billing for customers.
        </p>

        <div className="space-y-10 mt-6">
          {FEATURES.map((f, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className={`grid grid-cols-1 md:grid-cols-12 gap-6 items-center`}
              >
                {/* Text */}
                <div
                  className={`md:col-span-6 ${isEven ? "md:order-1" : "md:order-2"} px-4`}
                >
                  <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{f.title}</h3>
                    <p className="text-gray-600 mb-4">{f.desc}</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Fast & reliable</li>
                      <li>• Minimal learning curve</li>
                      <li>• Works on low-end devices</li>
                    </ul>
                  </div>
                </div>

                {/* Image */}
                <div className={`md:col-span-6 ${isEven ? "md:order-2" : "md:order-1"} flex justify-center`}>
                  <div className="w-[320px] md:w-[360px]  rounded-2xl ">
                    <img
                      src={f.img}
                      alt={`${f.title} screenshot`}
                      className="w-full  object-cover rounded-xl"
                      loading="lazy"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Screenshots Carousel (compact) */}
      <section className="max-w-7xl mx-auto px-6 py-10 bg-gray-50">
        <h3 className="text-2xl text-gray-900 font-semibold text-center mb-6">More Screenshots</h3>
        <div className="flex gap-4 overflow-x-auto py-2 px-2 scrollbar-hide">
          {screenshots.map((s, i) => (
            <div key={i} className="flex-shrink-0 w-[210px] ">
              <img src={s} alt={`screenshot-${i}`} className="w-full h-[460px] object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
{/* Demo Credentials - Interactive */}
<section id="demo-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-lg"
  >
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Left: Credentials */}
      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-gray-900">Try Demo Credentials</h3>
        <p className="text-gray-600 mt-2 max-w-xl">
          Scan the QR code to place an order, then login using these credentials to try printing KOT, sending bills on WhatsApp, and more.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {/* Email */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-sm text-gray-500 w-24">Email</span>
            <div className="flex-1 bg-white border border-gray-300 rounded-xl p-3 flex items-center justify-between">
              <div className="truncate text-gray-900">{showDemo ? demoEmail : "•••••••••••"}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDemo((s) => !s)}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-100"
                  aria-pressed={showDemo}
                  aria-label="Toggle show email"
                >
                  {showDemo ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => copyToClipboard(demoEmail)}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-100"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-sm text-gray-500 w-24">Password</span>
            <div className="flex-1 bg-white border border-gray-300 rounded-xl p-3 flex items-center justify-between">
              <div className="truncate text-gray-900">{showDemo ? demoPassword : "•••••••••"}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDemo((s) => !s)}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-100"
                  aria-pressed={showDemo}
                  aria-label="Toggle show password"
                >
                  {showDemo ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => copyToClipboard(demoPassword)}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-100"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <a
              href={APK_LINK}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold shadow text-center"
              aria-label="Open Demo - download APK"
            >
              Open Demo (Download APK)
            </a>
            <button
              onClick={() => {
                const creds = `Email: ${demoEmail}\nPassword: ${demoPassword}`;
                copyToClipboard(creds);
              }}
              className="px-5 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              Copy Both
            </button>
          </div>
        </div>
      </div>

      {/* Right: Screenshots + QR */}
      <div className="flex flex-col gap-4 w-full md:w-1/3">
        
        {/* QR Code */}
        <div className="rounded-2xl p-3 bg-white shadow flex justify-center">
          <img
            src="https://avenirya.com/wp-content/uploads/2025/10/menu_qr_67efa0c23fd058e3339011df_pro-template2-scaled.jpg" // Replace with your QR code path
            alt="Demo QR code"
            className="width={100px} height={200px} object-contain"
          />
        </div>
      </div>
    </div>
  </motion.div>
</section>


{/* Pricing Section */}
<section id="pricing" className="max-w-7xl mx-auto px-6 py-12 bg-white">
  <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Pricing</h2>
  <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
    Simple plans designed for small restaurants and growing chains. No hidden fees.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Monthly Plan */}
    <div className="border border-gray-200 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Monthly</h3>
      <p className="text-gray-500 mb-4">For restaurants starting small</p>
      <div className="text-3xl font-bold text-gray-900 mb-2">₹250</div>
      <div className="text-sm text-gray-500 mb-6">/month</div>
      <ul className="text-gray-700 mb-6 space-y-4 text-left">
        <li>🧾 Instant KOT Printing</li>
        <li>💳 Print Bills Quickly</li>
        <li>📲 Send Bills via WhatsApp</li>
        <li>📡 Real-Time Order Updates</li>
        <li>📊 Smart Dashboard & Analytics</li>
        <li>🗂️ Daily/Weekly/Monthly Reports</li>
         <li>📱 Multi-Device Support</li>
        <li>🔔 Instant Alerts for New Orders</li>
        <li>🔗 Easy Integration with Petoba Menu</li>
      </ul>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 rounded-full bg-orange-500 text-gray-900 font-semibold hover:brightness-105 transition"
      >
        Subscribe via WhatsApp
      </a>
    </div>

    {/* Half-Yearly Plan */}
    <div className="border-2 border-yellow-500 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Half-Yearly</h3>
      <p className="text-gray-500 mb-4">Save by subscribing for 6 months</p>
      <div className="text-3xl font-bold text-gray-900 mb-2">₹850</div>
      <div className="text-sm text-gray-500 mb-6">/6 months</div>
      <ul className="text-gray-700 mb-6 space-y-4 text-left">
                <li>🧾 Instant KOT Printing</li>
        <li>💳 Print Bills Quickly</li>
        <li>📲 Send Bills via WhatsApp</li>
        <li>📡 Real-Time Order Updates</li>
        <li>📊 Smart Dashboard & Analytics</li>
        <li>🗂️ Daily/Weekly/Monthly Reports</li>
         <li>📱 Multi-Device Support</li>
        <li>🔔 Instant Alerts for New Orders</li>
        <li>🔗 Easy Integration with Petoba Menu</li>
      </ul>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 rounded-full bg-yellow-500 text-gray-900 font-semibold hover:brightness-105 transition"
      >
        Subscribe via WhatsApp
      </a>
    </div>

    {/* Yearly Plan */}
    <div className="border-2 border-green-500 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Yearly</h3>
      <p className="text-gray-500 mb-4">Best value for growing restaurants</p>
      <div className="text-3xl font-bold text-gray-900 mb-2">₹1500</div>
      <div className="text-sm text-gray-500 mb-6">/year</div>
      <ul className="text-gray-700 mb-6 space-y-4 text-left">
                <li>🧾 Instant KOT Printing</li>
        <li>💳 Print Bills Quickly</li>
        <li>📲 Send Bills via WhatsApp</li>
        <li>📡 Real-Time Order Updates</li>
        <li>📊 Smart Dashboard & Analytics</li>
        <li>🗂️ Daily/Weekly/Monthly Reports</li>
         <li>📱 Multi-Device Support</li>
        <li>🔔 Instant Alerts for New Orders</li>
        <li>🔗 Easy Integration with Petoba Menu</li>
      </ul>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 rounded-full bg-green-500 text-white font-semibold hover:brightness-105 transition"
      >
        Subscribe via WhatsApp
      </a>
    </div>
  </div>
</section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-6 py-6 bg-gray-50">
        <h2 className="text-3xl text-gray-900 font-bold text-center mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "Do I need to change my QR menu?",
              a: "No — your existing Petoba Digital Menu QR will continue to work. Just log in to the Billing app using the same credentials.",
            },
            {
              q: "Which printers are supported?",
              a: "Most Bluetooth mobile printers (ESC/POS compatible) work. We recommend testing with your printer model using the demo credentials.",
            },
            {
              q: "Can I use the app without internet?",
              a: "No — an active internet connection is required to sync orders and print KOTs/bills.",
            },
            {
              q: "How do I subscribe for multiple outlets?",
              a: "Contact us on WhatsApp for multi-outlet pricing and setup assistance.",
            },
          ].map((f, i) => (
            <details
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <summary className="font-semibold text-gray-900 cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      
    </div>
  );
}