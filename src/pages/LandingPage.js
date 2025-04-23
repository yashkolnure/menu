import React from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';

// Feature, Why, Testimonial, Plan data (unchanged)...
const features = [
  'Table-wise Order Management',
  'Digital QR Menus',
  'Bluetooth KOT & Billing',
  'Real-Time Order Notifications',
  'Sales Tracking & Analytics'
];


const testimonials = [
  { text: 'Petoba transformed our order flow—no more paper menus or lost tickets!', author: 'Ritu Singh, Café Blossom' },
  { text: 'Real-time alerts keep our kitchen efficient and customers happy.', author: 'Raj Patel, Spice Corner' }
];

const plans = [
  { name: 'Basic Plan', price: '$499/mo', features: ['Social Media Management', 'Basic SEO Optimization', 'Monthly Report'] },
  { name: 'Standard Plan', price: '$999/mo', features: ['Advanced SEO Optimization', 'Bi-weekly Blog Posts', 'Email Campaigns'], recommended: true },
  { name: 'Premium Plan', price: '$1499/mo', features: ['Comprehensive SEO', 'Weekly Blog & Newsletter', 'PPC Management'] }
];

// Hero animation variants
const heroVariants = {
  panel: {
    hidden: { x: '-100vw', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 50, damping: 20, delay: 2 } }
  },
  phone: {
    hidden: { y: '-100vh', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 12, delay: 2.3 } }
  },
  textContainer: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2, delayChildren: 2.6 } }
  },
  textLine: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  },
  button: {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: 'spring', stiffness: 120, damping: 10, delay: 3 } }
  }
};

const LandingPage = () => {
  // scroll-based zoom for panel
  const { scrollYProgress } = useViewportScroll();
  const panelScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <div className="relative overflow-hidden bg-gray-900 text-white">
      {/* Gradient Blobs */}
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-tr from-purple-900 to-blue-700 opacity-60 rounded-full filter blur-3xl" />
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-gradient-to-br from-green-800 to-teal-700 opacity-50 rounded-full filter blur-3xl" />

      {/* Header */}
      <header className="z-20 relative">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Petoba</h2>
          <nav>
            <ul className="flex space-x-6 text-gray-300">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#why" className="hover:text-white">Why Petoba</a></li>
              <li><a href="#screenshots" className="hover:text-white">Screenshots</a></li>
              <li><a href="#how" className="hover:text-white">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Animation Section */}
      <motion.section className="relative min-h-screen flex items-center justify-center px-6 py-16 text-center overflow-hidden">
        {/* Animated Admin Panel */}
        <motion.img
          variants={heroVariants.panel}
          initial="hidden"
          animate="visible"
          style={{ scale: panelScale }}
          src="https://panel.avenirya.com/wp-content/uploads/2025/04/Purple-and-White-Gradient-Business-Marketing-Presentation-Device-Mockup-Instagram-Post-Website.webp"
          alt="Admin Dashboard"
          className="relative mx-auto w-full md:w-3/4 rounded-xl shadow-2xl z-10"
        />

        {/* Animated Mobile UI coming down */}
        <motion.img
          variants={heroVariants.phone}
          initial="hidden"
          animate="visible"
          src="https://panel.avenirya.com/wp-content/uploads/2025/04/Untitled-design-1.webp"
          alt="Mobile Menu"
          className="absolute top-1/4 right-40 w-50 md:w-44 rounded-2xl shadow-xl z-20"
        />
      </motion.section>

      {/* Hero Text & CTA below animations */}
      <motion.section
        className="pb-16 bg-gray-900 text-center"
        variants={heroVariants.textContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={heroVariants.textLine} className="text-4xl md:text-6xl font-bold text-white mb-4">
          Smart Restaurant Management Made Easy
        </motion.h1>
        <motion.p variants={heroVariants.textLine} className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Manage orders, print bills, and give your customers a seamless digital menu experience — all in one place.
        </motion.p>
        <motion.a
          variants={heroVariants.button}
          href="#contact"
          className="inline-block bg-green-600 hover:bg-green-500 text-white text-lg px-8 py-3 rounded-xl"
        >
          Get Started
        </motion.a>
      </motion.section>

            {/* Features Section */}
      <motion.section
        id="features"
        className="py-16 bg-gray-800 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                className="p-6 bg-gray-700 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="font-semibold text-xl">{feat}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>


      {/* ... other sections (Features, Why, Screenshots, etc.) ... */}
    </div>
  );
};

export default LandingPage;