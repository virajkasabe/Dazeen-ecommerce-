import { useState, FormEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coffee, ShieldCheck, Mail, Lock, LogOut, ArrowRight, ArrowLeft, Phone, User, KeyRound, ArrowUpRight } from "lucide-react";
import Hls from "hls.js";

interface LoginPageProps {
  onBackToHome: () => void;
  onLoginSuccess: (user: any, isAdminUser: boolean) => void;
  currentUser: any;
  isAdmin: boolean;
}

interface LocalUser {
  uid: string;
  email?: string;
  phone?: string;
  password?: string;
  displayName: string;
  photoURL: string | null;
}

const DEFAULT_USERS: LocalUser[] = [
  {
    uid: "admin-shree",
    email: "shreedeshmukh166@gmail.com",
    displayName: "Shree Deshmukh",
    password: "Shree2006",
    photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
  },
  {
    uid: "client-rahul",
    email: "rahul@dazeen.com",
    displayName: "Rahul K.",
    password: "shree",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  }
];

export default function LoginPage({
  onBackToHome,
  onLoginSuccess,
  currentUser,
  isAdmin,
}: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  
  // Input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  // Visual states
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Profile Editable Fields
  const [profileName, setProfileName] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Sync profile edits with logged-in user state details
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.displayName || "");
      setProfileAddress(currentUser.address || "");
      setProfilePhone(currentUser.phoneNumber || currentUser.phone || "");
    }
  }, [currentUser]);

  // Handle saving personal details
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSavingProfile(true);
    setError(null);
    setSuccessMsg(null);

    setTimeout(() => {
      try {
        const updatedUser = {
          ...currentUser,
          displayName: profileName.trim(),
          address: profileAddress.trim(),
          phoneNumber: profilePhone.trim(),
        };

        // Update in the registered list
        const savedUsers = localStorage.getItem("dazeen_local_users_v1");
        if (savedUsers) {
          const usersList: LocalUser[] = JSON.parse(savedUsers);
          const updatedList = usersList.map((u) => {
            if (u.uid === currentUser.uid) {
              return {
                ...u,
                displayName: updatedUser.displayName,
                address: updatedUser.address,
                phone: updatedUser.phone || updatedUser.phoneNumber,
                phoneNumber: updatedUser.phoneNumber,
              };
            }
            return u;
          });
          localStorage.setItem("dazeen_local_users_v1", JSON.stringify(updatedList));
        }

        // Update currently active session
        localStorage.setItem("dazeen_current_user", JSON.stringify(updatedUser));
        onLoginSuccess(updatedUser, isAdmin);
        setSuccessMsg("Details and delivery address saved! ✨");
      } catch (err: any) {
        setError("Unable to save profile changes.");
      } finally {
        setIsSavingProfile(false);
      }
    }, 500);
  };

  // Load and initialize users from local storage
  const getRegisteredUsers = (): LocalUser[] => {
    const saved = localStorage.getItem("dazeen_local_users_v1");
    if (!saved) {
      localStorage.setItem("dazeen_local_users_v1", JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(saved);
  };

  const saveRegisteredUser = (newUser: LocalUser) => {
    const users = getRegisteredUsers();
    // Check if duplicate email
    if (newUser.email && users.some(u => u.email?.toLowerCase() === newUser.email?.toLowerCase())) {
      throw new Error("This email is already registered");
    }
    users.push(newUser);
    localStorage.setItem("dazeen_local_users_v1", JSON.stringify(users));
  };

  // Sign out helper
  const handleSignOut = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("dazeen_current_user");
      localStorage.removeItem("dazeen_user_is_admin");
      onLoginSuccess(null, false);
      setLoading(false);
      setSuccessMsg("Signed out successfully.");
    }, 400);
  };

  // Handle Email Sign In or Sign Up
  const handleEmailAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const formattedEmail = email.trim().toLowerCase();

    if (authMode === "signup") {
      if (!email || !password || !displayName) {
        setError("Please enter your name, email, and a secure password.");
        return;
      }
      setLoading(true);

      setTimeout(() => {
        try {
          const newUserPayload: LocalUser = {
            uid: `usr-${Date.now()}`,
            email: formattedEmail,
            displayName: displayName.trim(),
            password: password,
            photoURL: null,
          };

          saveRegisteredUser(newUserPayload);

          const isUserAdmin = formattedEmail === "shreedeshmukh166@gmail.com";
          
          localStorage.setItem("dazeen_current_user", JSON.stringify(newUserPayload));
          localStorage.setItem("dazeen_user_is_admin", JSON.stringify(isUserAdmin));
          
          onLoginSuccess(newUserPayload, isUserAdmin);
          setSuccessMsg("Registration successful! Welcome to Dazeen.");
        } catch (err: any) {
          setError(err.message || "An error occurred during registration.");
        } finally {
          setLoading(false);
        }
      }, 800);
    } else {
      // SIGN IN Mode
      if (!email || !password) {
        setError("Please enter both your email address and password.");
        return;
      }
      setLoading(true);

      setTimeout(() => {
        const users = getRegisteredUsers();
        const found = users.find(u => u.email?.toLowerCase() === formattedEmail);

        if (!found) {
          setError("No account found with this email address.");
          setLoading(false);
          return;
        }

        if (found.password !== password) {
          setError("Incorrect password. Please verify and try again.");
          setLoading(false);
          return;
        }

        const isUserAdmin = formattedEmail === "shreedeshmukh166@gmail.com" && password === "Shree2006";

        localStorage.setItem("dazeen_current_user", JSON.stringify(found));
        localStorage.setItem("dazeen_user_is_admin", JSON.stringify(isUserAdmin));

        onLoginSuccess(found, isUserAdmin);
        setSuccessMsg("Welcome back!");
        setLoading(false);
      }, 700);
    }
  };

  // Handle Phone auth code request
  const handleSendOtp = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!phone || phone.length < 10) {
      setError("Please key in a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      setLoading(false);
      
      // Auto fill or show on screen nicely to satisfy offline sandbox
      setOtp("");
      setSuccessMsg(`SMS Code sent. Enter simulated code: ${code}`);
    }, 600);
  };

  // Handle Phone Verify OTP
  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp) {
      setError("Please enter the verification OTP.");
      return;
    }

    if (otp !== generatedOtp) {
      setError("The code entered is incorrect. Double-check simulated SMS code.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Find if we have a user with this phone or create a guest profile
      const users = getRegisteredUsers();
      let found = users.find(u => u.phone === phone);

      if (!found) {
        found = {
          uid: `phone-${Date.now()}`,
          phone: phone,
          displayName: `User (${phone.slice(-4)})`,
          photoURL: null,
        };
      }

      // Check if it's admin (admin only logs in via email credentials as defined by shreedeshmukh166@gmail.com)
      const isUserAdmin = false;

      localStorage.setItem("dazeen_current_user", JSON.stringify(found));
      localStorage.setItem("dazeen_user_is_admin", JSON.stringify(isUserAdmin));

      onLoginSuccess(found, isUserAdmin);
      setSuccessMsg("Phone verification successful!");
      setLoading(false);
    }, 600);
  };

  // Switch tabs helper
  const switchTab = (tab: "email" | "phone") => {
    setActiveTab(tab);
    setError(null);
    setSuccessMsg(null);
    setOtpSent(false);
    setGeneratedOtp(null);
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, []);

  return (
    <div className="bg-black text-[#FAF6F0] min-h-screen pt-12">
      
      {/* Centered Login Card */}
      <div className="max-w-md mx-auto my-12 px-4 py-8 bg-white border border-coffee-200/60 rounded-3xl shadow-xl shadow-coffee-950/5 relative overflow-hidden text-coffee-900">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-coffee-100/50 rounded-full blur-xl pointer-events-none" />

      <motion.div 
        className="text-center space-y-6 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        {/* Brand Icon */}
        <div className="mx-auto w-16 h-16 bg-coffee-950 text-accent-amber rounded-2xl flex items-center justify-center shadow-lg">
          <Coffee className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl font-serif font-bold text-coffee-950">
            {currentUser ? `Welcome back, ${currentUser.displayName}` : "Enter Dazeen Hub"}
          </h2>
          <p className="text-xs text-coffee-600 max-w-xs mx-auto">
            {currentUser 
              ? "Track your direct coffee shipments, change custom grinds, or administer global accounts." 
              : "Access your customizable coffee profile, trace order shipments, or seed master inventory configs."}
          </p>
        </div>

        {/* Global Notifications */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-250 text-rose-800 text-xs rounded-xl font-medium text-left">
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs rounded-xl font-mono text-left">
            ✨ {successMsg}
          </div>
        )}

        {currentUser ? (
          /* LOGGED IN VIEW */
          <div className="space-y-6 pt-2">
            <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-coffee-150 flex items-center gap-3.5 text-left">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  referrerPolicy="no-referrer"
                  alt="Avatar" 
                  className="w-12 h-12 rounded-full border border-coffee-300 object-cover" 
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-coffee-800 text-[#FAF6F0] flex items-center justify-center font-bold text-lg border border-coffee-700 font-mono">
                  {currentUser.displayName?.charAt(0) || "U"}
                </div>
              )}
              <div className="flex-grow space-y-0.5">
                <p className="text-sm font-bold text-coffee-950">{currentUser.displayName}</p>
                <p className="text-[11px] font-mono text-coffee-500">
                  {currentUser.email ? currentUser.email : `Phone: ${currentUser.phone}`}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border ${
                    isAdmin 
                      ? "bg-amber-50 text-accent-darkgold border-amber-200" 
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}>
                    {isAdmin ? <ShieldCheck className="w-2.5 h-2.5" /> : null}
                    {isAdmin ? "Super Admin" : "Verified Customer"}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Name & Address details for faster checkouts */}
            <form onSubmit={handleSaveProfile} className="space-y-4 text-left pt-4 border-t border-coffee-150">
              <div>
                <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-coffee-600 mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full px-3 py-2.5 border border-coffee-200 rounded-xl text-xs bg-[#FAF6F0] focus:outline-none focus:border-coffee-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-coffee-600 mb-1">
                  Complete Delivery Address (with landmarks)
                </label>
                <textarea
                  required
                  rows={3}
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  placeholder="Apartment flat/house no., street colony, landmark, City, PIN Code"
                  className="w-full px-3 py-2.5 border border-coffee-200 rounded-xl text-xs bg-[#FAF6F0] focus:outline-none focus:border-coffee-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-coffee-600 mb-1">
                  Primary Delivery Call Number
                </label>
                <input
                  type="tel"
                  required
                  pattern="^[6-9]\d{9}$"
                  maxLength={10}
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2.5 border border-coffee-200 rounded-xl text-xs bg-[#FAF6F0] focus:outline-none focus:border-coffee-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-2.5 bg-coffee-100 hover:bg-coffee-200 text-coffee-950 font-bold text-xs uppercase tracking-wider font-mono rounded-xl transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSavingProfile ? "Saving Details..." : "Save Delivery Settings 💾"}
              </button>
            </form>

            <div className="space-y-2">
              <button
                onClick={onBackToHome}
                className="w-full py-4 bg-coffee-900 text-coffee-50 font-bold text-xs rounded-xl shadow-lg hover:bg-coffee-800 transition-colors uppercase font-mono cursor-pointer flex items-center justify-center gap-2"
              >
                Proceed to Shipments <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full py-3 bg-white text-coffee-700 border border-coffee-200 font-semibold text-xs rounded-xl hover:bg-coffee-50 transition-colors cursor-pointer flex items-center justify-center gap-2 uppercase font-mono"
              >
                <LogOut className="w-3.5 h-3.5" /> {loading ? "Signing out..." : "Sign Out Account"}
              </button>
            </div>
          </div>
        ) : (
          /* BRAND NEW FORMS (NO BYPASS BUTTONS!) */
          <div className="space-y-5 pt-2">
            
            {/* Custom Interactive Sign In Dual-Tabs */}
            <div className="flex bg-[#FAF6F0] p-1 rounded-xl border border-coffee-150">
              <button
                onClick={() => switchTab("email")}
                className={`flex-1 py-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg transition-transform ${
                  activeTab === "email" 
                    ? "bg-coffee-900 text-white shadow-sm" 
                    : "text-coffee-600 hover:text-coffee-950"
                }`}
              >
                📬 Email Account
              </button>
              <button
                onClick={() => switchTab("phone")}
                className={`flex-1 py-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg transition-transform ${
                  activeTab === "phone" 
                    ? "bg-coffee-900 text-white shadow-sm" 
                    : "text-coffee-600 hover:text-coffee-950"
                }`}
              >
                📱 Mobile Number
              </button>
            </div>

            {/* tab rendering */}
            {activeTab === "email" ? (
              <form onSubmit={handleEmailAuthSubmit} className="space-y-4 text-left">
                {authMode === "signup" && (
                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-coffee-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-coffee-400" />
                      <input
                        type="text"
                        required
                        placeholder="Rahul Kumar"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-coffee-200 rounded-xl text-sm focus:outline-none focus:border-coffee-500 transition-colors bg-[#FAF6F0]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-coffee-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-coffee-400" />
                    <input
                      type="email"
                      required
                      placeholder={authMode === "signup" ? "yourname@dazeen.com" : "shreedeshmukh166@gmail.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-coffee-200 rounded-xl text-sm focus:outline-none focus:border-coffee-500 transition-colors bg-[#FAF6F0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-coffee-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-coffee-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-coffee-200 rounded-xl text-sm focus:outline-none focus:border-coffee-500 transition-colors bg-[#FAF6F0]"
                    />
                  </div>
                </div>

                {/* Switcher details */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode(authMode === "signin" ? "signup" : "signin");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-accent-darkgold hover:underline font-semibold font-mono"
                  >
                    {authMode === "signin" ? "New customer? Register Account" : "Already registered? Sign In"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-coffee-900 border border-coffee-950 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-all hover:bg-coffee-800 hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? "Verifying Credentials..." : authMode === "signin" ? "Login Account" : "Complete Register"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              /* PHONE TAB FLOW */
              <div className="space-y-4 text-left">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-coffee-700 mb-1">
                        10-Digit Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-coffee-400" />
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          className="w-full pl-9 pr-4 py-2.5 border border-coffee-200 rounded-xl text-sm focus:outline-none focus:border-coffee-500 transition-colors bg-[#FAF6F0]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-coffee-900 border border-coffee-950 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-all hover:bg-coffee-800 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? "Generating SMS..." : "Request OTP Code"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-coffee-700 mb-1">
                        4-Digit verification code
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-coffee-400" />
                        <input
                          type="text"
                          required
                          maxLength={4}
                          placeholder="Enter 4 digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          className="w-full pl-9 pr-4 py-2.5 border border-coffee-200 rounded-xl text-sm focus:outline-none focus:border-coffee-500 transition-colors bg-[#FAF6F0] font-mono tracking-widest text-center text-lg"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1 font-mono">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setGeneratedOtp(null);
                          setError(null);
                          setSuccessMsg(null);
                        }}
                        className="text-coffee-500 hover:text-coffee-950 hover:underline"
                      >
                        ← Back to mobile entry
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? "Verifying Code..." : "Verify Mobile OTP"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onBackToHome}
                className="text-xs text-accent-darkgold hover:underline font-semibold font-mono inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Save Session & Back to Shop
              </button>
            </div>
          </div>
        )}

        {/* Benefits Cards Grid */}
        <div className="mt-8 pt-6 border-t border-coffee-100 grid grid-cols-2 gap-3 text-left">
          <div className="flex gap-2 items-start opacity-85">
            <div className="p-1 rounded-md bg-[#FAF6F0] text-coffee-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-coffee-900 leading-tight">Secure Customer Checkouts</h4>
              <p className="text-[9px] text-coffee-500">Industry standard safety for orders.</p>
            </div>
          </div>
          <div className="flex gap-2 items-start opacity-85">
            <div className="p-1 rounded-md bg-[#FAF6F0] text-coffee-800">
              <Lock className="w-3.5 h-3.5 text-accent-darkgold" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-coffee-900 leading-tight">Encrypted Device Vault</h4>
              <p className="text-[9px] text-coffee-500">Standalone client session storage.</p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>

    {/* Cinematic Full-Width CTA + Footer Section */}
    <section className="relative py-32 px-6 md:px-16 lg:px-24 text-center overflow-hidden bg-black text-white flex flex-col justify-center min-h-[600px] mt-16">
      {/* Background HLS Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
      />

      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 z-[1] pointer-events-none"
        style={{ height: '200px', background: 'linear-gradient(to bottom, black, transparent)' }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
        style={{ height: '200px', background: 'linear-gradient(to top, black, transparent)' }}
      />

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[1.1] max-w-3xl mx-auto mb-4">
            Try a caffeine free coffee now
          </h2>
          <p className="text-white/60 font-body font-light text-sm md:text-base max-w-xl mx-auto mb-8">
            Experience the premium high-altitude chemical-free shanti with Dazeen blends. Pure taste, zero caffeine crash.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex items-center justify-center gap-6"
        >
          <button 
            onClick={onBackToHome}
            className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium text-white flex items-center gap-2 hover:bg-white/10 transition-all font-body cursor-pointer"
          >
            Order Premium Coffee
            <ArrowUpRight className="h-5 w-5" />
          </button>
          <button 
            onClick={onBackToHome}
            className="bg-white text-black rounded-full px-6 py-3 text-sm font-medium flex items-center gap-2 hover:bg-white/90 transition-colors font-body cursor-pointer"
          >
            Explore Blends
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </motion.div>
        
        {/* Footer Bar inside the component */}
        <div className="mt-32 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 font-body font-light text-xs">
            &copy; 2026 Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a key={link} href="#" onClick={(e) => { e.preventDefault(); onBackToHome(); }} className="text-white/40 hover:text-white/70 font-body font-light text-xs transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>

  </div>
  );
}
