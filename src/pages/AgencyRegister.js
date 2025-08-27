import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import CouponBox from "../components/CouponBox"; // ✅ import coupon box

const AgencyRegister = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "Start-Up";

  // Map plan name to numeric membership level
  const getMembershipLevel = (plan) => {
    switch (plan.toLowerCase()) {
      case "start-up":
        return 1;
      case "business":
        return 2;
      case "agency":
        return 3;
      default:
        return 1;
    }
  };

  const getPlanAmount = (plan) => {
    switch (plan.toLowerCase()) {
      case "business":
        return 4999;
      case "agency":
        return 9999;
      default:
        return 2999; // Start-Up default
    }
  };

  const [formData, setFormData] = useState({
    agencyName: "",
    email: "",
    contactNumber: "",
    address: "",
    password: "",
    retypePassword: "",
    plan: selectedPlan,
    agencyLevel: getMembershipLevel(selectedPlan),
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ coupon/discount states
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");

  // Update agencyLevel if plan changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      plan: selectedPlan,
      agencyLevel: getMembershipLevel(selectedPlan),
    }));
  }, [selectedPlan]);

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

  const checkEmailExists = async () => {
    if (!formData.email) return;
    try {
      const res = await axios.get(
        `/api/admin/agency/check-email?email=${formData.email}`
      );
      if (res.data.exists) setErrors({ email: "Email already exists" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const newErrors = {};

    // Validations
    if (!formData.agencyName.trim())
      newErrors.agencyName = "Agency Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact No is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (formData.password !== formData.retypePassword)
      newErrors.retypePassword = "Passwords do not match.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      let amount = getPlanAmount(selectedPlan);

      // ✅ apply discount if available
      if (discount > 0) {
        amount = amount - discount;
        if (amount < 1) amount = 1; // avoid free or negative payment
      }

      // Create Razorpay order
      const orderRes = await axios.post("/api/create-order", {
        amount,
        currency: "INR",
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Replace with your actual key
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "Agency Registration",
        description: `${selectedPlan} Plan Payment`,
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            // Register agency with payment details
            await axios.post("/api/admin/register-agency", {
              agencyName: formData.agencyName,
              email: formData.email,
              contactNumber: formData.contactNumber,
              address: formData.address,
              password: formData.password,
              plan: selectedPlan,
              agencyLevel: formData.agencyLevel,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              couponCode: coupon || null,
              discountApplied: discount || 0,
            });

            setMessage("✅ Registered successfully!");
            setTimeout(() => navigate("/agency-login"), 1000);
          } catch (err) {
            console.error(err);
            setErrors({ general: "Registration failed after payment" });
          }
        },
        prefill: {
          name: formData.agencyName,
          email: formData.email,
          contact: formData.contactNumber,
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setErrors({ general: "❌ Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  const actualPrice = getPlanAmount(selectedPlan);
  const payablePrice = Math.max(actualPrice - discount, 1);

  return (
    <div className="relative bg-white py-16">
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-blue-300 to-green-300 rounded-full filter blur-3xl opacity-30"></div>

      <h2 className="text-4xl font-bold text-center mb-4">
        Register Your Agency
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Sign up to manage menus, clients, and dashboards — get your agency
        started.
      </p>

      <div className="relative z-10 w-full max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-lg">
        {errors.general && (
          <p className="text-red-600 text-center">{errors.general}</p>
        )}
        {message && (
          <p className="text-green-600 text-center">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="agencyName"
            placeholder="Agency Name"
            value={formData.agencyName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          {errors.agencyName && (
            <p className="text-red-500 text-sm mt-1">{errors.agencyName}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={checkEmailExists}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}

          <input
            type="number"
            name="contactNumber"
            placeholder="Contact No"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
          )}

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}

          <input
            type="password"
            name="retypePassword"
            placeholder="Retype Password"
            value={formData.retypePassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          {errors.retypePassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.retypePassword}
            </p>
          )}

          {/* ✅ Coupon Box */}
          <CouponBox
            onApply={(couponData) => {
              if (couponData) {
                const { type, value, code } = couponData;
                let finalDiscount = 0;

                if (type === "flat") {
                  finalDiscount = value;
                } else if (type === "percent") {
                  finalDiscount = Math.floor((actualPrice * value) / 100);
                }

                setDiscount(finalDiscount);
                setCoupon(code);
              } else {
                setDiscount(0);
                setCoupon("");
              }
            }}
          />

          {/* ✅ Price breakdown */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 shadow-sm">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Actual Price</span>
              <span className="line-through text-red-400">
                ₹{actualPrice}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 mt-1">
                <span>Discount Applied</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between mt-2 pt-2 border-t text-gray-800">
              <span className="text-base">Payable Price</span>
              <span className="text-lg font-semibold text-orange-600">
                ₹{payablePrice}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
            disabled={loading}
          >
            {loading ? "Processing..." : `Register & Pay ₹${payablePrice}`}
          </button>
        </form>
      </div>

      {/* WhatsApp Help Button */}
      <a
        href="https://wa.me/917499835687?text=Hello%2C%20I%20need%20help%20with%20agency%20registration."
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

export default AgencyRegister;
