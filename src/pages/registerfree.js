import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

const RegisterFreePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "Free";

  const getMembershipLevel = (plan) => {
    if (plan.toLowerCase() === "premium") return 2;
    if (plan.toLowerCase() === "pro") return 3;
    return 1;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    logo: "",
    password: "",
    retypePassword: "",
    membership_level: getMembershipLevel(selectedPlan),
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const WP_USERNAME = "yashkolnure58@gmail.com";
  const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
  const WP_SITE_URL = "https://website.avenirya.com";

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const uploadImageToWordPress = async (file) => {
    const imageData = new FormData();
    imageData.append("file", file);

    setUploading(true);
    setMessage("");
    setErrors({});

    try {
      const res = await axios.post(`${WP_SITE_URL}/wp-json/wp/v2/media`, imageData, {
        headers: {
          Authorization: "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`),
          "Content-Disposition": `attachment; filename="${file.name}"`,
        },
      });
      const imageUrl = res.data.source_url;
      setFormData((prev) => ({ ...prev, logo: imageUrl }));
      setMessage("✅ Logo uploaded successfully.");
    } catch (err) {
      setErrors({ logo: "❌ Logo upload failed." });
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadImageToWordPress(file);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  const newErrors = {};

  // Field validations
  if (!formData.name.trim()) newErrors.name = "Restaurant name is required.";
  if (!formData.email.trim()) newErrors.email = "Email is required.";
  if (!formData.contact.trim()) newErrors.contact = "Contact number is required.";
  if (!formData.address.trim()) newErrors.address = "Address is required.";
  if (!formData.logo.trim()) newErrors.logo = "Logo is required.";
  if (!formData.password.trim()) newErrors.password = "Password is required.";
  if (formData.password !== formData.retypePassword)
    newErrors.retypePassword = "Passwords do not match.";

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    // ✅ Check if email exists first
    const checkRes = await axios.get(
      `http://localhost:5000/api/admin/restaurants/check-email?email=${formData.email}`
    );

    if (checkRes.data.exists) {
      setErrors({ email: "An account with this email already exists." });
      return; // stop submission
    }

    // ✅ Proceed with free plan or payment
    if (formData.membership_level === 1) {
      await axios.post("http://localhost:5000/api/admin/restaurants", formData);
      setMessage("✅ Registered successfully with Free Plan!");
      setTimeout(() => navigate("/login"), 1000);
    } else {
      // Paid plan → Razorpay flow (same as before)
      const amount = formData.membership_level === 2 ? 399 : 599;

      const { data } = await axios.post("http://localhost:5000/api/create-order", {
        amount,
        currency: "INR",
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Digital Menu",
        description:
          formData.membership_level === 2 ? "Premium Plan Payment" : "Pro Plan Payment",
        order_id: data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post("http://localhost:5000/api/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              await axios.post("http://localhost:5000/api/admin/restaurants", formData);
              setMessage("✅ Registered successfully with Paid Plan!");
              setTimeout(() => navigate("/login"), 1000);
            } else {
              setErrors({ general: "❌ Payment verification failed!" });
            }
          } catch (err) {
            setErrors({ general: "❌ Payment error!" });
            console.error(err);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
        },
        theme: { color: "#F37254" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    }
  } catch (err) {
    setErrors({ general: err.response?.data?.message || "❌ Registration failed." });
  }
};

  return (
    <div className="relative bg-white py-16">
      {/* Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>
      
      <h2 className="text-4xl font-bold text-center mb-4">Register Your Restaurant</h2>
      <p className="text-center text-gray-600 mb-12">
        Create your digital menu account — manage dishes, update offers, and connect with customers.
      </p>

      <div className="relative z-10 w-full max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-lg">
        {errors.general && <p className="text-red-600 text-center">{errors.general}</p>}
        {message && <p className="text-green-600 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/** Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Restaurant / Cafe Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/** Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Owner Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/** Contact */}
          <div>
            <input
              type="number"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
          </div>

          {/** Address */}
          <div>
            <input
              type="text"
              name="address"
              placeholder="Restaurant Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/** Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/** Retype Password */}
          <div>
            <input
              type="password"
              name="retypePassword"
              placeholder="Retype Password"
              value={formData.retypePassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
            {errors.retypePassword && <p className="text-red-500 text-sm mt-1">{errors.retypePassword}</p>}
          </div>

          {/** Logo Upload */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Upload Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
            {formData.logo && <img src={formData.logo} alt="Logo" className="mt-2 h-20 rounded" />}
            {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
          </div>

          <input type="hidden" name="membership_level" value={formData.membership_level} />

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
          >
            Register & Continue
          </button>

          <p className="text-gray-600 text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      {/** WhatsApp Help Button */}
      <a
        href="https://wa.me/917499835687?text=Hello%2C%20I%20need%20help%20with%20Petoba%20menu%20registration."
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
};

export default RegisterFreePage;
