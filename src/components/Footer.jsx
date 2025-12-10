import React from "react";

const Footer = () => {
  return (
    <footer className="bg-transparent py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-lg p-10">
          
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
            
            {/* Logo + About */}
            <div>
              <img
                src="https://petoba.avenirya.com/wp-content/uploads/2022/07/Untitled-design-6.png"
                alt="Petoba Logo"
                className="h-14 w-auto mb-4 mx-auto md:mx-0"
              />
              <p className="text-gray-600 text-sm leading-relaxed">
                Petoba KOT & Billing — a smart kitchen order ticket and billing solution by{" "}
                <span className="font-semibold">Avenirya Solutions OPC Pvt. Ltd.</span>.
              </p>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">Company</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>Avenirya Solutions OPC Pvt. Ltd.</li>
                <li>109, Kohinoor Emerald</li>
                <li>Sus - Pashan Road, Pune</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">Contact</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>📞 +91 9270361329</li>
                <li>📧 admin@avenirya.com</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">Quick Links</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="/" className="hover:text-blue-600 transition">Home</a></li>
                <li><a href="/portfolio" className="hover:text-blue-600 transition">Portfolio</a></li>
                <li><a href="/agency" className="hover:text-blue-600 transition">Agency</a></li>
                <li><a href="/membership" className="hover:text-blue-600 transition">Pricing</a></li>
                <li><a href="/contact" className="hover:text-blue-600 transition">Contact</a></li>
              </ul>
            </div>
          </div>
          {/* Divider */}
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2025 Petoba KOT & Billing · Avenirya Solutions OPC Pvt. Ltd. · All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
