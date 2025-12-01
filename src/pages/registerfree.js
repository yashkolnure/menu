import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  CheckCircle, AlertCircle, User, Mail, Phone, 
  MapPin, Lock, UploadCloud, CreditCard, ShieldCheck, Zap, Receipt
} from "lucide-react";

const RegisterFreePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // ✅ Get Plan Details from URL
  const selectedPlan = (searchParams.get("plan") || "trial").toLowerCase();
  const selectedCycle = (searchParams.get("cycle") || "monthly").toLowerCase();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    logo: "",
    password: "",
    retypePassword: "",
    membership_level: 3, 
    currency: "INR",
    planType: selectedPlan,
    billingCycle: selectedCycle
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [payableAmount, setPayableAmount] = useState(0);

  // --- CONFIGURATION ---
  const WP_USERNAME = "yashkolnure58@gmail.com";
  const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc"; 
  const WP_SITE_URL = "https://website.avenirya.com";

  const pricingMap = {
    qr: { monthly: 199, yearly: 899, name: "QR Menu Plan" },
    billing: { monthly: 199, yearly: 899, name: "Billing App Plan" },
    combo: { monthly: 299, yearly: 1499, name: "Power Combo Plan" },
    trial: { monthly: 0, yearly: 0, name: "7-Day Free Trial" }
  };

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
    
    if (selectedPlan === 'trial') {
      setPayableAmount(0);
    } else if (pricingMap[selectedPlan]) {
      setPayableAmount(pricingMap[selectedPlan][selectedCycle]);
    }
  }, [selectedPlan, selectedCycle]);

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

    if (!formData.name.trim()) newErrors.name = "Restaurant name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.contact.trim()) newErrors.contact = "Contact number is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (formData.password !== formData.retypePassword) newErrors.retypePassword = "Passwords do not match.";
    if (!formData.logo) newErrors.logo = "Please upload a logo.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      // 1. Check Email
      const checkRes = await axios.get(`/api/admin/restaurants/check-email?email=${formData.email}`);
      if (checkRes.data.exists) {
        setErrors({ email: "An account with this email already exists." });
        return;
      }

      // 2. Expiry
      const expiryDate = new Date();
      if (formData.planType === "trial") expiryDate.setDate(expiryDate.getDate() + 7);
      else if (formData.billingCycle === "monthly") expiryDate.setMonth(expiryDate.getMonth() + 1);
      else expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      
      const payload = { ...formData, expiresAt: expiryDate.toISOString() };

      // 3. Free/Trial Flow
      if (formData.planType === "trial" || payableAmount === 0) {
        await axios.post("/api/admin/restaurants", payload);
        setMessage("✅ Registered successfully!");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      // 4. Paid Flow
      const { data } = await axios.post("/api/create-order", {
        amount: payableAmount,
        currency: "INR",
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, 
        amount: data.amount,
        currency: "INR",
        name: "Petoba Solutions",
        description: `${pricingMap[formData.planType]?.name} (${formData.billingCycle})`,
        order_id: data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post("/api/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              await axios.post("/api/admin/restaurants", { ...payload, paymentStatus: 'paid', transactionId: response.razorpay_payment_id });
              setMessage("✅ Payment Successful! Account Created.");
              setTimeout(() => navigate("/login"), 1500);
            } else {
              setErrors({ general: "❌ Payment verification failed!" });
            }
          } catch (err) {
            setErrors({ general: "❌ Error verifying payment." });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
        },
        theme: { color: "#ea580c" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) {
      setErrors({ general: err.response?.data?.message || "❌ Registration failed." });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Helmet>
        <title>Register - Petoba</title>
      </Helmet>

      {/* Decorative Background Elements */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-200 rounded-full opacity-30 filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 w-96 h-96 bg-red-200 rounded-full opacity-30 filter blur-3xl animate-blob animation-delay-4000"></div>
     

      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-xl flex flex-col lg:flex-row relative z-10 border border-gray-100">
        
        {/* --- LEFT: REGISTRATION FORM --- */}
        <div className="lg:w-[60%] p-8 lg:p-14 order-2 lg:order-1">
          
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h2>
            <p className="mt-2 text-gray-500">Enter your details below to setup your digital restaurant.</p>
          </div>

          {errors.general && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3"><AlertCircle size={20}/> {errors.general}</div>}
          {message && <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl flex items-center gap-3"><CheckCircle size={20}/> {message}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name & Email */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2 ml-1">Restaurant Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input type="text" name="name" placeholder="e.g. Pizza Paradise" value={formData.name} onChange={handleChange} 
                    className="pl-12 w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent block p-3.5 transition-all outline-none" />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500 ml-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input type="email" name="email" placeholder="owner@example.com" value={formData.email} onChange={handleChange} 
                    className="pl-12 w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent block p-3.5 transition-all outline-none" />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500 ml-1">{errors.email}</p>}
              </div>
            </div>

            {/* Contact & Address */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2 ml-1">Contact Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input type="text" name="contact" placeholder="9876543210" maxLength={10} 
                    value={formData.contact.replace(/^91/, "")} 
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setFormData({ ...formData, contact: digits ? `91${digits}` : "" });
                    }}
                    className="pl-12 w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent block p-3.5 transition-all outline-none" 
                  />
                </div>
                {errors.contact && <p className="mt-1 text-xs text-red-500 ml-1">{errors.contact}</p>}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2 ml-1">Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input type="text" name="address" placeholder="City, Area..." value={formData.address} onChange={handleChange} 
                    className="pl-12 w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent block p-3.5 transition-all outline-none" />
                </div>
                {errors.address && <p className="mt-1 text-xs text-red-500 ml-1">{errors.address}</p>}
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
               <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} 
                      className="pl-12 w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent block p-3.5 transition-all outline-none" />
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500 ml-1">{errors.password}</p>}
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input type="password" name="retypePassword" value={formData.retypePassword} onChange={handleChange} 
                      className="pl-12 w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent block p-3.5 transition-all outline-none" />
                  </div>
                  {errors.retypePassword && <p className="mt-1 text-xs text-red-500 ml-1">{errors.retypePassword}</p>}
               </div>
            </div>

            {/* Logo Upload - Clean Style */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2 ml-1">Restaurant Logo</label>
              <div className="group border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer relative bg-gray-50">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="space-y-2">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo Preview" className="h-16 w-16 object-contain mx-auto rounded-lg shadow-sm" />
                  ) : (
                    <div className="mx-auto h-12 w-12 text-gray-300 group-hover:text-orange-500 transition-colors flex items-center justify-center">
                      <UploadCloud size={32} />
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    {formData.logo ? <span className="text-green-600 font-bold">Logo Uploaded!</span> : <span><span className="font-bold text-orange-600">Click to upload</span> or drag and drop</span>}
                  </div>
                </div>
                {uploading && <div className="absolute inset-0 bg-white/90 flex items-center justify-center text-sm font-bold text-orange-600 rounded-xl">Uploading...</div>}
              </div>
              {errors.logo && <p className="text-xs text-red-500 ml-1 mt-1">{errors.logo}</p>}
            </div>

            <button type="submit" disabled={uploading} 
              className="w-full flex items-center justify-center gap-2 py-4 px-6 mt-6 rounded-xl shadow-lg shadow-orange-200 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all">
              {payableAmount > 0 ? (
                <> Pay ₹{payableAmount} & Register </>
              ) : (
                <> Start Free Trial <span aria-hidden="true">→</span> </>
              )}
            </button>
            
            <p className="text-center text-sm text-gray-500">
              Already have an account? <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">Log in</Link>
            </p>

          </form>
        </div>

        {/* --- RIGHT: SUMMARY (Light & Clean) --- */}
        <div className="lg:w-[40%] bg-orange-50 border-l border-orange-100 p-8 lg:p-14 flex flex-col relative order-1 lg:order-2">
          
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-xs font-bold text-orange-800 uppercase tracking-widest mb-6">Order Summary</h3>
            
            {/* Receipt Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 mb-8 relative overflow-hidden">
               {/* Decorative top border */}
               <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-red-500"></div>

               <div className="flex justify-between items-start mb-4 mt-2">
                 <div>
                   <h4 className="text-xl font-bold text-gray-900">{pricingMap[selectedPlan]?.name || "Plan"}</h4>
                   <p className="text-gray-500 text-sm capitalize">{selectedCycle} Subscription</p>
                 </div>
                 <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold self-start">
                   {selectedPlan === 'trial' ? 'FREE' : 'PRO'}
                 </div>
               </div>

               <div className="space-y-3 py-4 border-t border-dashed border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                     <span>Subtotal</span>
                     <span>₹{payableAmount}</span>
                  </div>
                  {selectedPlan !== 'trial' && (
                  <div className="flex justify-between text-sm text-green-600">
                     <span>Discount</span>
                     <span>Applied</span>
                  </div>
                  )}
               </div>

               <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                 <span className="font-bold text-gray-800">Total</span>
                 <span className="text-3xl font-extrabold text-gray-900">₹{payableAmount}</span>
               </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-5 mt-2">
               <div className="flex items-start gap-4">
                 <div className="p-2 bg-white rounded-full text-green-600 shadow-sm"><ShieldCheck size={20} /></div>
                 <div>
                   <h5 className="font-bold text-gray-900 text-sm">Secure Payment</h5>
                   <p className="text-xs text-gray-500 mt-0.5">256-bit SSL encrypted. We never store your card details.</p>
                 </div>
               </div>
               
               <div className="flex items-start gap-4">
                 <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm"><Zap size={20} /></div>
                 <div>
                   <h5 className="font-bold text-gray-900 text-sm">Instant Access</h5>
                   <p className="text-xs text-gray-500 mt-0.5">Your digital menu and dashboard will be ready immediately.</p>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="p-2 bg-white rounded-full text-orange-600 shadow-sm"><Receipt size={20} /></div>
                 <div>
                   <h5 className="font-bold text-gray-900 text-sm">GST Invoice</h5>
                   <p className="text-xs text-gray-500 mt-0.5">Automated tax invoice sent to your email after payment.</p>
                 </div>
               </div>
            </div>

            <div className="mt-auto pt-10 text-center">
              <p className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Petoba Solutions. <br/> By continuing, you agree to our Terms & Privacy Policy.
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default RegisterFreePage;