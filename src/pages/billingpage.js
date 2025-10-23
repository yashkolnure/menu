import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
const WHATSAPP_LINK =
  "https://wa.me/917499835687?text=Hello%20Petoba%20Team%2C%20I%20want%20to%20subscribe%20to%20Petoba%20Billing%20App.";


function BillingApp() {
  return (
    <div className="relative min-h-screen">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Petoba Billing App | Restaurant Billing Made Easy</title>
        <meta
          name="description"
          content="Manage restaurant orders, print KOTs, and generate invoices seamlessly using the Petoba Billing App. Simple, fast, and reliable billing for your restaurant."
        />
        <link
          rel="icon"
          href="https://petoba.avenirya.com/wp-content/uploads/2025/09/download-1.png"
          type="image/png"
        />
        <meta
          property="og:image"
          content="https://petoba.avenirya.com/wp-content/uploads/2025/09/Untitled-design-6.png"
        />
        <meta property="og:title" content="Petoba Billing App" />
        <meta
          property="og:description"
          content="A complete restaurant billing system with KOT printing, order tracking, and instant reporting."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yash.avenirya.com/petoba-billing" />
      </Helmet>
      <section className="relative py-6 ">
  {/* Background Blobs */}
  <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>

  {/* Main Container */}
  <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
    {/* Left Side - Text & Buttons */}
    <div className="text-left">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Petoba Billing App
      </h1>
      <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-md">
        Streamline your restaurant operations with Petoba Billing App.
        Manage orders, print KOTs, and generate invoices — all in one
        powerful and user-friendly app designed for restaurant owners.
      </p>

      <div className="flex flex-wrap gap-4">
        <a
          href="https://avenirya.com/wp-content/uploads/2025/10/Petoba-Billing.apk" // replace with your APK link
          className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white text-lg font-semibold shadow-md hover:scale-105 transition-transform"
        >
          Download App
        </a>
        <a
          href="https://wa.me/7499835687?text=Hello%20Petoba%20Team%2C%20I%20am%20interested%20in%20subscribing%20to%20the%20Petoba%20Billing%20App.%20Could%20you%20please%20share%20the%20process%20and%20pricing%20details%3F%20Thank%20you!"
          className="px-8 py-4 rounded-full bg-gray-100 text-gray-800 text-lg font-semibold shadow hover:bg-gray-200 transition"
        >
         Subscribe App
        </a>
      </div>
    </div>

    {/* Right Side - Image */}
    <div className="flex justify-center md:justify-end">
      <img
        src="https://avenirya.com/wp-content/uploads/2025/10/Blue-Modern-Money-Managing-Mobile-App-Promotion-Facebook-Ad-700-x-1120-px-700-x-900-px-1.png" // replace with your app preview
        alt="Petoba Billing App Preview"
        className="rounded-3xl shadow-lg w-[90%] max-w-md object-contain"
      />
    </div>
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
<section className="relative py-6">
  {/* Background Blobs */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-orange-300 to-pink-400 rounded-full blur-3xl opacity-20 -z-10"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20 -z-10"></div>


  {/* Process Steps */}
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-4 px-4 text-center">
    {/* Step 1 */}
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-5xl mb-4">📱</div>
      <h3 className="text-xl font-semibold mb-2">1. Download the App</h3>
      <p className="text-gray-600">
        Install the Petoba Billing App from Play Store or our website.
      </p>
    </div>

    {/* Step 2 */}
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-5xl mb-4">🔑</div>
      <h3 className="text-xl font-semibold mb-2">2. Login Securely</h3>
      <p className="text-gray-600">
        Use your Petoba digital menu credentials to access your dashboard.
      </p>
    </div>

    {/* Step 3 */}
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-5xl mb-4">🧾</div>
      <h3 className="text-xl font-semibold mb-2">3. Manage Orders</h3>
      <p className="text-gray-600">
        View incoming orders in real-time and print KOTs instantly.
      </p>
    </div>

    {/* Step 4 */}
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-5xl mb-4">💰</div>
      <h3 className="text-xl font-semibold mb-2">4. Print Bills</h3>
      <p className="text-gray-600">
        Generate and print bills directly from your mobile device.
      </p>
    </div>

    {/* Step 5 */}
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-5xl mb-4">📊</div>
      <h3 className="text-xl font-semibold mb-2">5. Track Reports</h3>
      <p className="text-gray-600">
        Monitor your daily, weekly, and monthly sales effortlessly.
      </p>
    </div>
  </div>
</section>
<section className="relative py-6 ">
  {/* Background Blobs */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-orange-300 to-pink-400 rounded-full blur-3xl opacity-20 -z-10"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20 -z-10"></div>


  {/* Carousel */}
  <div className="relative max-w-6xl mx-auto px-4">
    <div className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
      {[
        "https://avenirya.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-23-at-2.52.00-AM-1.jpeg ",
        "https://avenirya.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-23-at-2.52.00-AM.jpeg ",    
        "https://avenirya.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-23-at-2.52.01-AM.jpeg ",
        "https://avenirya.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-23-at-2.52.01-AM-3.jpeg ",
        "https://avenirya.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-23-at-2.52.01-AM-1.jpeg ",
        "https://avenirya.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-23-at-2.52.01-AM-2.jpeg  ",
        "https://avenirya.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-23-at-2.52.02-AM.jpeg ",
        "https://avenirya.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-23-at-2.52.02-AM-1.jpeg ",
      ].map((img, i) => (
        <div
          key={i}
          className="flex-shrink-0 snap-center bg-orange-600 rounded-2xl shadow-md p-2 border border-gray-200"
        >
          <img
            src={img}
            alt={`App Screenshot ${i + 1}`}
            className="w-[260px] object-cover rounded-xl"
          />
        </div>
      ))}
    </div>

    {/* Optional hint text */}
    <p className="text-center text-gray-500 text-sm mt-6">
      Swipe to explore →
    </p>
  </div>
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
<section class="py-6">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-3xl font-bold text-gray-800 text-center mb-10">Frequently Asked Questions</h2>

    <div class="space-y-2">
      <details class="bg-white rounded-2xl shadow p-3 cursor-pointer transition-all duration-300 hover:shadow-md">
        <summary class="text-lg font-semibold text-gray-800">Do I need to add orders manually?</summary>
        <p class="mt-2 text-gray-600 leading-relaxed">
          No, customers can simply scan the QR code placed on their table and place orders themselves. All orders will automatically appear in your Billing App.
        </p>
      </details>

      <details class="bg-white rounded-2xl shadow p-3 cursor-pointer transition-all duration-300 hover:shadow-md">
        <summary class="text-lg font-semibold text-gray-800">How do I connect my Digital Menu to the Billing App?</summary>
        <p class="mt-2 text-gray-600 leading-relaxed">
          No manual connection is required. Just log in to the Billing App using your Digital Menu credentials, and it will sync automatically.
        </p>
      </details>

      <details class="bg-white rounded-2xl shadow p-3 cursor-pointer transition-all duration-300 hover:shadow-md">
        <summary class="text-lg font-semibold text-gray-800">Can I print KOT orders for the kitchen?</summary>
        <p class="mt-2 text-gray-600 leading-relaxed">
          Yes, you can print KOT orders instantly using any Bluetooth-compatible mobile printer.
        </p>
      </details>

      <details class="bg-white rounded-2xl shadow p-3 cursor-pointer transition-all duration-300 hover:shadow-md">
        <summary class="text-lg font-semibold text-gray-800">Can I print bills for customers?</summary>
        <p class="mt-2 text-gray-600 leading-relaxed">
          Yes, you can easily print customer bills through a Bluetooth mobile printer directly from the app.
        </p>
      </details>

      <details class="bg-white rounded-2xl shadow p-3 cursor-pointer transition-all duration-300 hover:shadow-md">
        <summary class="text-lg font-semibold text-gray-800">Can I send bills directly on WhatsApp to customers?</summary>
        <p class="mt-2 text-gray-600 leading-relaxed">
          Yes, in the Billing tab, each bill includes a WhatsApp button — just tap it to instantly send the bill to your customer.
        </p>
      </details>

      <details class="bg-white rounded-2xl shadow p-3 cursor-pointer transition-all duration-300 hover:shadow-md">
        <summary class="text-lg font-semibold text-gray-800">Can I get daily, weekly, or monthly sales reports?</summary>
        <p class="mt-2 text-gray-600 leading-relaxed">
          Yes, you can view detailed sales analytics for daily, weekly, and monthly performance directly in the app.
        </p>
      </details>

      <details class="bg-white rounded-2xl shadow p-3 cursor-pointer transition-all duration-300 hover:shadow-md">
        <summary class="text-lg font-semibold text-gray-800">Can I also place orders from the app, or only customers can?</summary>
        <p class="mt-2 text-gray-600 leading-relaxed">
          You can also place orders manually from the Billing App if needed, along with customer self-orders.
        </p>
      </details>

      <details class="bg-white rounded-2xl shadow p-3 cursor-pointer transition-all duration-300 hover:shadow-md">
        <summary class="text-lg font-semibold text-gray-800">If I take the Billing App subscription, do I need to change my QR menu?</summary>
        <p class="mt-2 text-gray-600 leading-relaxed">
          No, there’s no need to change your QR code. The same Digital Menu QR created earlier will continue to work perfectly.
        </p>
      </details>

      <details class="bg-white rounded-2xl shadow p-3 cursor-pointer transition-all duration-300 hover:shadow-md">
        <summary class="text-lg font-semibold text-gray-800">How can I edit my menu?</summary>
        <p class="mt-2 text-gray-600 leading-relaxed">
          You can manage and edit your menu anytime by visiting 
          <a href="https://yash.avenirya.com/login" class="text-yellow-600 font-medium hover:underline" target="_blank">yash.avenirya.com/login</a>.
        </p>
      </details>
    </div>
  </div>
</section>


      {/* WhatsApp Help Floating Button */}
      <a
        href="https://wa.me/917499835687?text=Hello%2C%20I%20want%20to%20know%20more%20about%20Petoba%20Billing%20App."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      >
        <img
          src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
          alt="WhatsApp"
          className="w-5 h-5"
        />
        Help
      </a>
    </div>
  );
}

export default BillingApp;
