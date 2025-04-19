import React from 'react';
import { FaArrowRight, FaCheckCircle, FaRocket, FaHandshake } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to [Your Brand]</h1>
          <p className="hero-subtitle">Your solution to better and more efficient [industry]</p>
          <button className="cta-button">
            Get Started <FaArrowRight />
          </button>
        </div>
      </div>

      {/* About Us Section */}
      <section className="about-section">
        <h2 className="section-title">About Us</h2>
        <p>We are a dedicated team passionate about creating innovative solutions in [industry]. Our mission is to provide top-notch services to our clients.</p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Our Features</h2>
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon-box">
              <FaCheckCircle />
            </div>
            <h3>Feature One</h3>
            <p>Description of Feature One</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-box">
              <FaRocket />
            </div>
            <h3>Feature Two</h3>
            <p>Description of Feature Two</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-box">
              <FaHandshake />
            </div>
            <h3>Feature Three</h3>
            <p>Description of Feature Three</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Clients Say</h2>
        <div className="testimonial-item">
          <p>"This is the best service I've ever used! Highly recommend."</p>
          <span>- John Doe</span>
        </div>
        <div className="testimonial-item">
          <p>"Amazing experience. The product is excellent!"</p>
          <span>- Jane Smith</span>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2 className="section-title">Contact Us</h2>
        <form className="contact-form">
          <input className="contact-input" type="text" placeholder="Your Name" />
          <input className="contact-input" type="email" placeholder="Your Email" />
          <textarea className="contact-input" placeholder="Your Message"></textarea>
          <button className="contact-button" type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
};

export default LandingPage;
