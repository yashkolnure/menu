import React from "react";

const Footer = () => {
  return (
    <footer className="bg-transparent py-6 mt-10">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-lg p-6">
          {/* Brand Name */}
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
            Petoba KOT & Billing
          </h2>
          <p className="text-center text-gray-600 mb-6">
            A smart kitchen order ticket and billing solution by{" "}
            <span className="font-semibold">Avenirya Solutions OPC Pvt Ltd</span>.
          </p>

          {/* Company & Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Company */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Company</h3>
              <p className="text-gray-600">Avenirya Solutions OPC Pvt Ltd</p>
              <p className="text-gray-600">109, Kohinoor Emerald,</p>
              <p className="text-gray-600">Sus - Pashan Road, Pune</p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
              <p className="text-gray-600">📞 +91 7499835687</p>
              <p className="text-gray-600">📧 admin@avenirya.com</p>
              {/* <p className="text-gray-600">📧 yashkolnure58@gmail.com</p> */}
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Quick Links</h3>
              <ul className="space-y-1">
                <li>
                  <a href="/" className="text-gray-600 hover:text-blue-600 transition">Home</a>
                </li>
                <li>
                  <a href="/membership" className="text-gray-600 hover:text-blue-600 transition">Pricing</a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-600 hover:text-blue-600 transition">Contact Us</a>
                </li>
                <li>
                  <a href="/login" className="text-gray-600 hover:text-blue-600 transition">Login</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
            © 2025 Petoba KOT & Billing · Avenirya Solutions OPC Pvt Ltd · All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
