import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("https://petoba.avenirya.com/wp-json/contact-form/v1/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("✅ Thanks for your submission! Please check your email.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("❌ Error connecting to the server.");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen py-16 px-6 lg:px-20 ">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Page Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">
          Contact <span className="text-blue-600">Us</span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Got questions about Petoba KOT & Billing? We’re here to help.  
          Fill out the form below or reach out directly using the provided contact details.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form Card */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="5"
                required
                className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
            </form>
          </div>

          {/* Contact Info Card */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Get in Touch
            </h2>

            {/* Address */}
            <div className="flex items-start space-x-4">
                <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                  <FaMapMarkerAlt size={20} />
                </div>
                <p className="text-gray-700">
                109, Kohinoor Emerald, Sus - Pashan Road,<br />Pune, Maharashtra - 411021, India
                </p>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-4">
                <div className="p-4 bg-green-100 rounded-full text-green-600">
                  <FaPhoneAlt size={20} />
                </div>
                <p className="text-gray-700">+91 7499835687</p>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center space-x-4">
                <div className="p-4 bg-green-100 rounded-full text-green-600">
                  <FaWhatsapp size={20} />
                </div>
                <a
                  href="https://wa.me/917499835687"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  Chat on WhatsApp
                </a>
            </div>

            {/* Emails */}
            <div className="flex items-center space-x-4">
                <div className="p-4 bg-purple-100 rounded-full text-purple-600">
                  <FaEnvelope size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-gray-700">admin@avenirya.com</p>
                  <p className="text-gray-700">yashkolnure58@gmail.com</p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
