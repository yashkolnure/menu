import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  CheckCircle, AlertCircle, User, Mail, Phone, 
  MapPin, Lock, UploadCloud, ShieldCheck, Zap, Receipt, Calendar, Gift, Ticket, MessageCircle, PhoneCall
} from "lucide-react";

const RegisterFreePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // ✅ CONFIG: Support Number (Replace this with your actual number)
  const SUPPORT_NUMBER = "919270361329"; 

  // ✅ 1. Get Plan, Cycle & Coupon from URL
  const selectedPlan = (searchParams.get("plan") || "trial").toLowerCase();
  const selectedCycle = (searchParams.get("cycle") || "monthly").toLowerCase();
  const appliedCoupon = (searchParams.get("coupon") || "").toUpperCase();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    logo: "",
    password: "",
    retypePassword: "",
    membership_level: selectedPlan === 'trial' ? 1 : 2,
    currency: "INR",
    planType: selectedPlan,
    billingCycle: selectedCycle
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [payableAmount, setPayableAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  // --- CONFIGURATION ---
  const WP_USERNAME = "yashkolnure58@gmail.com";
  const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc"; 
  const WP_SITE_URL = "https://website.avenirya.com";

  // ✅ 2. Pricing Configuration
  const pricingMap = {
    qr: { monthly: 199, yearly: 899, name: "QR Menu Plan" },
    billing: { monthly: 199, yearly: 899, name: "Billing App Plan" },
    combo: { monthly: 299, yearly: 1499, name: "Power Combo Plan" },
    trial: { monthly: 0, yearly: 0, name: "7-Day Free Trial" }
  };

  useEffect(() => {
    // Load Razorpay
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
    
    // ✅ Calculate Amount with Coupon Logic
    if (selectedPlan === 'trial') {
      setPayableAmount(0);
      setDiscountAmount(0);
    } else if (pricingMap[selectedPlan]) {
      let basePrice = pricingMap[selectedPlan][selectedCycle];
      let discount = 0;

      // 🎅 APPLY CHRISTMAS OFFER LOGIC
      if (appliedCoupon === 'CHRISTMAS' && selectedPlan === 'qr' && selectedCycle === 'yearly') {
        const offerPrice = 559;
        discount = basePrice - offerPrice;
        basePrice = offerPrice;
      }

      setPayableAmount(basePrice);
      setDiscountAmount(discount);
    }
  }, [selectedPlan, selectedCycle, appliedCoupon]);

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
      setFormData((prev) => ({ ...prev, logo: res.data.source_url }));
      setMessage("✅ Logo uploaded successfully.");
    } catch (err) {
      setErrors({ logo: "❌ Logo upload failed." });
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const calculatePlanDetails = (planType, cycle) => {
    const now = new Date();
    let expiryDate = new Date();
    let isQrEnabled = false;
    let isBillingEnabled = false;

    if (planType === 'trial') {
      expiryDate.setDate(now.getDate() + 7);
    } else if (cycle === 'monthly') {
      expiryDate.setMonth(now.getMonth() + 1);
    } else if (cycle === 'yearly') {
      expiryDate.setFullYear(now.getFullYear() + 1);
    }

    if (planType === 'trial' || planType === 'combo') {
      isQrEnabled = true;
      isBillingEnabled = true;
    } else if (planType === 'qr') {
      isQrEnabled = true;
      isBillingEnabled = false;
    } else if (planType === 'billing') {
      isQrEnabled = false;
      isBillingEnabled = true;
    }

    return {
      expiresAt: expiryDate.toISOString(),
      qrAccess: isQrEnabled,
      qrExpiresAt: isQrEnabled ? expiryDate.toISOString() : null,
      billingAccess: isBillingEnabled,
      billingExpiresAt: isBillingEnabled ? expiryDate.toISOString() : null,
      enableOrdering: isQrEnabled ? "enabled" : "disabled",
      billing: isBillingEnabled
    };
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
      const checkRes = await axios.get(`/api/admin/restaurants/check-email?email=${formData.email}`);
      if (checkRes.data.exists) {
        setErrors({ email: "An account with this email already exists." });
        return;
      }

      const planDetails = calculatePlanDetails(formData.planType, formData.billingCycle);
      const payload = { 
        ...formData, 
        ...planDetails, 
        paymentStatus: 'pending',
        couponApplied: discountAmount > 0 ? appliedCoupon : null
      };

      if (formData.planType === "trial" || payableAmount === 0) {
        await axios.post("/api/admin/restaurant/register", { ...payload, paymentStatus: 'trial' });
        setMessage("✅ Registered! 7-Day Trial Activated.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

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
              await axios.post("/api/admin/restaurants/register", { 
                  ...payload, 
                  paymentStatus: 'paid', 
                  transactionId: response.razorpay_payment_id 
              });
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
      console.error(err);
      setErrors({ general: err.response?.data?.message || "❌ Registration failed." });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans bg-gray-50">
      <Helmet>
        <title>Register | {pricingMap[selectedPlan]?.name}</title>
      </Helmet>

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-orange-200/30 rounded-full blur-[100px]"></div>
          <div className="absolute top-[20%] right-[0%] w-[30%] h-[30%] bg-blue-200/30 rounded-full blur-[100px]"></div>
      </div>

      {/* ✅ FLOATING WHATSAPP BUTTON */}
      <a 
        href={`https://wa.me/${SUPPORT_NUMBER}?text=Hi, I need help with registration`} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white px-5 py-3 rounded-full font-bold shadow-2xl hover:scale-105 hover:shadow-[#25D366]/40 transition-all flex items-center gap-2 animate-bounce-slow"
      >
        <MessageCircle size={24} fill="white" className="text-[#25D366]"/> 
        <span>Need Help?</span>
      </a>

      <div className="max-w-6xl w-full bg-white rounded-[2rem] shadow-2xl flex flex-col lg:flex-row relative z-10 border border-gray-100 overflow-hidden">
        
        {/* --- LEFT: FORM --- */}
        <div className="lg:w-[60%] p-8 lg:p-12 order-2 lg:order-1">
          
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Get Started</h2>
            <p className="mt-2 text-gray-500">
               Registering for: <span className="font-bold text-orange-600">{pricingMap[selectedPlan]?.name}</span>
               {selectedPlan !== 'trial' && <span className="text-sm bg-gray-100 px-2 py-1 rounded-md ml-2 text-gray-600 uppercase">{selectedCycle}</span>}
            </p>
          </div>

          {errors.general && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3"><AlertCircle size={20}/> {errors.general}</div>}
          {message && <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl flex items-center gap-3"><CheckCircle size={20}/> {message}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Restaurant Name</label>
                <div className="relative mt-1">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="text" name="name" placeholder="Pizza Paradise" value={formData.name} onChange={handleChange} 
                        className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="email" name="email" placeholder="owner@gmail.com" value={formData.email} onChange={handleChange} 
                        className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mobile</label>
                <div className="relative mt-1">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="text" name="contact" placeholder="9876543210" maxLength={10} 
                        value={formData.contact.replace(/^91/, "")} 
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setFormData({ ...formData, contact: digits ? `91${digits}` : "" });
                        }}
                        className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                </div>
                {errors.contact && <p className="text-xs text-red-500 mt-1 ml-1">{errors.contact}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">City / Area</label>
                <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="text" name="address" placeholder="e.g. Pune, Kothrud" value={formData.address} onChange={handleChange} 
                        className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                </div>
                {errors.address && <p className="text-xs text-red-500 mt-1 ml-1">{errors.address}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                  <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input type="password" name="password" value={formData.password} onChange={handleChange} 
                          className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
               </div>
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm Password</label>
                  <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input type="password" name="retypePassword" value={formData.retypePassword} onChange={handleChange} 
                          className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                  </div>
                  {errors.retypePassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.retypePassword}</p>}
               </div>
            </div>

            {/* Logo Upload */}
            <div className="mt-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Restaurant Logo</label>
              <div className="mt-1 border-2 border-dashed border-gray-200 hover:border-orange-400 bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer relative transition-colors group">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {formData.logo ? (
                   <div className="flex items-center gap-3">
                      <img src={formData.logo} alt="Logo" className="h-12 w-12 object-contain rounded-md" />
                      <span className="text-green-600 font-bold text-sm">Logo Uploaded!</span>
                   </div>
                ) : (
                   <div className="flex flex-col items-center text-gray-400 group-hover:text-orange-500">
                      <UploadCloud size={24} className="mb-1"/>
                      <span className="text-xs">Click to upload logo</span>
                   </div>
                )}
                {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-xs font-bold text-orange-600">Uploading...</div>}
              </div>
              {errors.logo && <p className="text-xs text-red-500 mt-1 ml-1">{errors.logo}</p>}
            </div>

            <button type="submit" disabled={uploading} 
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl shadow-lg text-lg font-bold text-white transition-all mt-4 active:scale-[0.98] ${discountAmount > 0 ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-green-200" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-orange-200"}`}>
              {payableAmount > 0 ? (
                <> Pay ₹{payableAmount} & Register </>
              ) : (
                <> Start 7-Day Free Trial <span aria-hidden="true">→</span> </>
              )}
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account? <Link to="/login" className="font-bold text-orange-600 hover:underline">Log in</Link>
            </p>

          </form>
        </div>

        {/* --- RIGHT: SUMMARY & BENEFITS --- */}
        <div className="lg:w-[40%] bg-gradient-to-br from-orange-50 to-orange-100/50 p-8 lg:p-12 border-l border-gray-100 flex flex-col order-1 lg:order-2">
          
          <div className="sticky top-8">
            <h3 className="text-xs font-bold text-orange-800 uppercase tracking-widest mb-6">Plan Summary</h3>
            
            {/* Plan Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100/50 mb-8 relative overflow-hidden">
               {/* Decorative Coupon Ribbon if discount applied */}
               {discountAmount > 0 && (
                   <div className="absolute top-0 right-0">
                       <div className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">CHRISTMAS DEAL</div>
                   </div>
               )}

               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h4 className="text-xl font-extrabold text-gray-900">{pricingMap[selectedPlan]?.name}</h4>
                   <p className="text-gray-500 text-sm">{selectedPlan === 'trial' ? '7 Days Validity' : `${selectedCycle === 'monthly' ? '1 Month' : '1 Year'} Validity`}</p>
                 </div>
               </div>

               <div className="py-4 border-t border-dashed border-gray-200 space-y-2">
                 <div className="flex justify-between text-sm text-gray-600">
                   <span>Base Price</span>
                   <span>₹{selectedPlan === 'trial' ? 0 : pricingMap[selectedPlan][selectedCycle]}</span>
                 </div>
                 
                 {/* ✅ Discount Display */}
                 {discountAmount > 0 && (
                     <div className="flex justify-between text-sm text-green-600 font-bold bg-green-50 p-2 rounded-lg border border-green-100">
                       <span className="flex items-center gap-1"><Ticket size={14}/> Coupon: {appliedCoupon}</span>
                       <span>- ₹{discountAmount}</span>
                     </div>
                 )}

                 <div className="flex justify-between text-sm text-gray-600">
                   <span>Taxes</span>
                   <span>₹0</span>
                 </div>
               </div>

               <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                 <span className="font-bold text-gray-800">Total Payable</span>
                 <div className="text-right">
                    {discountAmount > 0 && (
                        <span className="block text-xs text-gray-400 line-through">₹{pricingMap[selectedPlan][selectedCycle]}</span>
                    )}
                    <span className={`text-3xl font-extrabold ${discountAmount > 0 ? "text-green-600" : "text-gray-900"}`}>₹{payableAmount}</span>
                 </div>
               </div>
            </div>

            {/* Feature List for Selected Plan */}
            <div className="space-y-4">
                <h4 className="font-bold text-gray-800 text-sm mb-2">What's included:</h4>
                
                {(selectedPlan === 'qr' || selectedPlan === 'combo' || selectedPlan === 'trial') && (
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                        <span>QR Menu & WhatsApp Ordering</span>
                    </div>
                )}
                
                {(selectedPlan === 'billing' || selectedPlan === 'combo' || selectedPlan === 'trial') && (
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                        <span>Billing POS & KOT Management</span>
                    </div>
                )}

                <div className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                    <span>Admin Dashboard Access</span>
                </div>
                
                <div className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                    <span>Free Setup Support</span>
                </div>

                {/* Christmas Bonus Feature display */}
                {discountAmount > 0 && (
                    <div className="flex items-start gap-3 text-sm text-red-600 font-bold animate-pulse">
                        <Gift size={18} className="shrink-0 mt-0.5" />
                        <span>Bonus: Priority Christmas Support 🎄</span>
                    </div>
                )}
            </div>

             {/* ✅ SIDEBAR HELP SECTION */}
             <div className="mt-6 bg-white p-4 rounded-xl border border-orange-200 flex items-center gap-3 shadow-sm">
               <div className="bg-orange-50 p-2 rounded-full text-orange-600"><PhoneCall size={20}/></div>
               <div>
                  <p className="text-xs font-bold text-orange-800 uppercase">Having trouble?</p>
                  <p className="text-sm font-semibold text-gray-700">Call or WhatsApp us at <a href={`https://wa.me/${SUPPORT_NUMBER}`} className="underline hover:text-orange-600">92703 61329</a></p>
               </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-2 gap-4">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-gray-400"/>
                  <span className="text-xs text-gray-500 font-medium">Secure Payment</span>
               </div>
               <div className="flex items-center gap-2">
                  <Zap size={18} className="text-gray-400"/>
                  <span className="text-xs text-gray-500 font-medium">Instant Activation</span>
               </div>
               <div className="flex items-center gap-2">
                  <Receipt size={18} className="text-gray-400"/>
                  <span className="text-xs text-gray-500 font-medium">GST Invoice</span>
               </div>
               <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400"/>
                  <span className="text-xs text-gray-500 font-medium">Cancel Anytime</span>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterFreePage;