import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight, ArrowLeft, KeyRound, CheckCircle, Hash } from "lucide-react";

function Loginfree() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState("login"); // 'login' -> 'forgot_email' -> 'forgot_otp' -> 'forgot_new_pass'
  
  // Form Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Reset Flow Data
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 🆕 Added Confirm Password
  const [tempToken, setTempToken] = useState(""); 

  // Feedback
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- PAGE TITLE MANAGEMENT ---
  useEffect(() => {
    document.title = "Login | Petoba Admin";
  }, []);

  // --- API HANDLERS (Real Backend) ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("restaurantId", data.restaurant._id);
        navigate("/dashboard");
      } else { 
        setError(data.message || "Invalid credentials"); 
      }
    } catch (err) { 
      setError("Unable to connect to the server."); 
    } finally { 
      setLoading(false); 
    }
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);
    try {
      const res = await fetch("/api/admin/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setView("forgot_otp"); 
      } else { 
        setError(data.message || "Failed to send OTP"); 
      }
    } catch (err) { 
      setError("Network error occurred."); 
    } finally { 
      setLoading(false); 
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setTempToken(data.tempToken); 
        setView("forgot_new_pass"); 
      } else { 
        setError(data.message || "Invalid OTP"); 
      }
    } catch (err) { 
      setError("Verification failed."); 
    } finally { 
      setLoading(false); 
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError(""); 
    
    // 🆕 Check Passwords Match
    if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password-final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tempToken, newPassword }),
      });
      if (res.ok) {
        alert("Password updated successfully! Please login.");
        window.location.reload();
      } else { 
        const data = await res.json();
        setError(data.message || "Failed to update password"); 
      }
    } catch (err) { 
      setError("Error updating password."); 
    } finally { 
      setLoading(false); 
    }
  };

  // --- RENDER HELPERS ---
  const Loader = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 font-sans  text-slate-800">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle Grid */}
        <div className="absolute top-0 left-0 w-full h-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
        {/* Gradient Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      {/* --- MAIN CARD --- */}
      <div className="relative z-10 w-full max-w-[450px] bg-white/90 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] p-8 md:p-10 animate-fade-in-up">
        
        {/* --- VIEW 1: LOGIN --- */}
        {view === "login" && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200 mb-4">
                <LogIn size={20} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
              <p className="text-gray-500 text-sm mt-2">Manage menu, orders, and everything in one place.</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 text-red-600 text-sm py-3 px-4 rounded-xl flex items-center gap-2 border border-red-100 animate-shake">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    className="input-field pl-11" 
                    value={email} 
                    onChange={e => setEmail(e.target.value.trim())} 
                    placeholder="name@restaurant.com"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                    <button type="button" onClick={() => { setError(""); setView("forgot_email"); }} className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors">
                        Forgot?
                    </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input 
                    type="password" 
                    className="input-field pl-11" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    required 
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary mt-2">
                {loading ? <Loader /> : "Sign In"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
               <Link to="/agency-login" className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-800 transition-colors group">
                  Login as Agency <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform"/>
               </Link>
            </div>
          </div>
        )}

        {/* --- VIEW 2: REQUEST OTP --- */}
        {view === "forgot_email" && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button onClick={() => { setError(""); setView("login"); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                <ArrowLeft size={16}/> Back
            </button>
            
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
                <KeyRound size={28}/>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
              <p className="text-sm text-gray-500 mt-2">Enter your email to receive a verification code.</p>
            </div>

            {error && <div className="mb-6 bg-red-50 text-red-600 text-sm py-3 px-4 rounded-xl border border-red-100">{error}</div>}
            
            <form onSubmit={requestOtp} className="space-y-6">
              <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="input-field pl-11" 
                    value={email} 
                    onChange={e => setEmail(e.target.value.toLowerCase())} 
                    required 
                  />
              </div>
              <button type="submit" disabled={loading} className="btn-primary">{loading ? <Loader /> : "Send OTP"}</button>
            </form>
          </div>
        )}

        {/* --- VIEW 3: VERIFY OTP --- */}
        {view === "forgot_otp" && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button onClick={() => { setError(""); setView("forgot_email"); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                <ArrowLeft size={16}/> Back
            </button>

            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <Hash size={28}/>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Enter OTP</h2>
              <p className="text-sm text-gray-500 mt-2">We sent a 6-digit code to <br/><span className="font-medium text-gray-800">{email}</span></p>
            </div>

            {error && <div className="mb-6 bg-red-50 text-red-600 text-sm py-3 px-4 rounded-xl border border-red-100">{error}</div>}
            
            <form onSubmit={verifyOtp} className="space-y-6">
              <input 
                type="text" 
                placeholder="0 0 0 0 0 0" 
                className="input-field text-center text-2xl font-bold tracking-[0.5em] py-4" 
                value={otp} 
                onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0,6))} 
                maxLength={6} 
                required 
              />
              <button type="submit" disabled={loading} className="btn-primary">{loading ? <Loader /> : "Verify Code"}</button>
            </form>
          </div>
        )}

        {/* --- VIEW 4: NEW PASSWORD --- */}
        {view === "forgot_new_pass" && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-8 pt-4">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100">
                <CheckCircle size={28}/>
              </div>
              <h2 className="text-xl font-bold text-gray-900">New Password</h2>
              <p className="text-sm text-gray-500 mt-2">Your identity has been verified. Create a strong new password.</p>
            </div>

            {error && <div className="mb-6 bg-red-50 text-red-600 text-sm py-3 px-4 rounded-xl border border-red-100">{error}</div>}
            
            <form onSubmit={resetPassword} className="space-y-4">
              <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={18} />
                  <input 
                    type="password" 
                    placeholder="New Password" 
                    className="input-field focus:border-green-500 focus:ring-green-100" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    required 
                  />
              </div>
              
              {/* 🆕 Confirm Password Field */}
              <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={18} />
                  <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    className="input-field focus:border-green-500 focus:ring-green-100" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                  />
              </div>

              <button type="submit" disabled={loading} className="btn-primary bg-green-600 hover:bg-green-700 hover:shadow-green-200 mt-2">
                {loading ? <Loader /> : "Reset Password"}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* --- WhatsApp Help Button --- */}
      <a
        href="https://wa.me/919270361329?text=Hello%2C%20I%20need%20help%20logging%20into%20my%20Petoba%20dashboard."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-bold group animate-in fade-in zoom-in duration-300"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-5 h-5 brightness-0 invert group-hover:scale-110 transition-transform"
        />
        <span>Need Help?</span>
      </a>
      
      {/* --- CSS INJECTION --- */}
      <style>{`
        /* Input Styling */
        .input-field { 
            width: 100%; 
            padding: 0.875rem 1rem 0.875rem 3rem; /* 🆕 Fixed Padding for Icon */
            border: 1px solid #e5e7eb; 
            border-radius: 0.75rem; 
            background: #f9fafb; 
            color: #1f2937; 
            font-size: 0.95rem; 
            outline: none; 
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .input-field:focus { 
            background: #ffffff; 
            border-color: #f97316; 
            box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1); 
        }
        .input-field::placeholder { color: #9ca3af; }

        /* Centered Text for OTP */
        .input-field.text-center {
            padding-left: 1rem; /* Reset padding for OTP input */
        }

        /* Button Styling */
        .btn-primary { 
            width: 100%; 
            padding: 0.875rem; 
            background: #111827; /* Dark button for contrast */
            color: white; 
            border-radius: 0.75rem; 
            font-weight: 600; 
            font-size: 1rem;
            display: flex; 
            justify-content: center; 
            align-items: center; 
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .btn-primary:hover { 
            background: #000000; 
            transform: translateY(-1px); 
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { 
            opacity: 0.7; 
            cursor: not-allowed; 
            transform: none; 
        }

        /* Animations */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-in.fade-in { animation: fadeIn 0.4s ease-out forwards; }
        
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .slide-in-from-right-8 { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes pulseSlow {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-pulse-slow { animation: pulseSlow 6s infinite ease-in-out; }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}

// Simple Alert Icon Component
const AlertCircle = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);

export default Loginfree;