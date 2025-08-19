import React, { useState } from "react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent py-4">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Main pill container */}
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-lg rounded-full px-6 py-2 border border-gray-200 shadow-lg">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="/">
            <img
              src="https://petoba.avenirya.com/wp-content/uploads/2022/07/Untitled-design-6.png"
              alt="Logo"
              className="h-20 w-auto"
            /></a>
          </div>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-10">
            <a href="/" className="text-black font-medium  text-xl hover:text-blue-600 transition">
              Home
            </a>
            <a href="/features" className="text-black text-xl  font-medium hover:text-blue-600 transition">
              Features
            </a>
            <a href="/agency" className="text-black text-xl  font-medium hover:text-blue-600 transition">
              Agency
            </a>
            <a href="/membership" className="text-black text-xl font-medium hover:text-blue-600 transition">
              Pricing
            </a>
            <a href="/contact" className="text-black  text-xl font-medium hover:text-blue-600 transition">
              Contact Us
            </a>
          </nav>

          {/* Login Button (desktop) */}
          <a
            href="/login"
            className="hidden md:flex px-5 py-2 rounded-full text-xl bg-gradient-to-r from-orange-500 via-black to-blue-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
          >
            Login →
          </a>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md"
          >
            {menuOpen ? (
              <span className="text-2xl font-bold">×</span> // Close icon
            ) : (
              <span className="text-2xl font-bold">☰</span> // Hamburger icon
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-6 gap-4 text-black font-medium">
          <a href="/" onClick={closeMenu} className="hover:text-blue-600">Home</a>
          <a href="/features" onClick={closeMenu} className="hover:text-blue-600">Features</a>
          <a href="/membership" onClick={closeMenu} className="hover:text-blue-600">Pricing</a>
          <a href="/agency" onClick={closeMenu} className="hover:text-blue-600">Agency</a>
          <a href="/contact" onClick={closeMenu} className="hover:text-blue-600">Contact Us</a>
          <a
            href="/login"
            onClick={closeMenu}
            className="mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 via-black to-blue-600 text-white text-center shadow-md hover:scale-105 transition-transform"
          >
            Login →
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
