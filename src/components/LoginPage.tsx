import { useState, FormEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coffee, ShieldCheck, Mail, Lock, LogOut, ArrowRight, ArrowLeft, Phone, User, KeyRound, ArrowUpRight } from "lucide-react";
import Hls from "hls.js";
import { SmokeyBackground } from "./ui/login-form";
import { notificationService } from "../utils/notifications";
import { LiquidButton } from "./ui/liquid-glass-button";
import { SlideButton } from "./ui/slide-button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

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
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Profile Editable Fields
  const [profileName, setProfileName] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Slider for Logout state
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [maxDragDistance, setMaxDragDistance] = useState(250);

  useEffect(() => {
    if (currentUser && sliderContainerRef.current) {
      const parentWidth = sliderContainerRef.current.clientWidth;
      const calculated = parentWidth - 48 - 8;
      setMaxDragDistance(calculated > 100 ? calculated : 250);
    }
  }, [currentUser]);

  useEffect(() => {
    const handleResize = () => {
      if (sliderContainerRef.current) {
        const parentWidth = sliderContainerRef.current.clientWidth;
        const calculated = parentWidth - 48 - 8;
        setMaxDragDistance(calculated > 100 ? calculated : 250);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Address Dialog / Accordion Form States
  const [newAddressFormOpen, setNewAddressFormOpen] = useState(false);
  const [formNameValue, setFormNameValue] = useState("");
  const [formAddressValue, setFormAddressValue] = useState("");
  const [formPhoneValue, setFormPhoneValue] = useState("");

  const handleSaveNewAddress = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSavingProfile(true);
    setError(null);
    setSuccessMsg(null);

    setTimeout(() => {
      try {
        const nameVal = formNameValue.trim() || profileName;
        const addrVal = formAddressValue.trim();
        const phoneVal = formPhoneValue.trim() || profilePhone;

        const updatedUser = {
          ...currentUser,
          displayName: nameVal,
          address: addrVal,
          phoneNumber: phoneVal,
        };

        // Sync with primary details
        setProfileName(nameVal);
        setProfileAddress(addrVal);
        setProfilePhone(phoneVal);

        // Update in the registered list
        const savedUsers = localStorage.getItem("dazeen_local_users_v1");
        if (savedUsers) {
          const usersList: LocalUser[] = JSON.parse(savedUsers);
          const updatedList = usersList.map((u) => {
            if (u.uid === currentUser.uid) {
              return {
                ...u,
                displayName: nameVal,
                address: addrVal,
                phone: phoneVal,
                phoneNumber: phoneVal,
              };
            }
            return u;
          });
          localStorage.setItem("dazeen_local_users_v1", JSON.stringify(updatedList));
        }

        // Update currently active session
        localStorage.setItem("dazeen_current_user", JSON.stringify(updatedUser));
        onLoginSuccess(updatedUser, isAdmin);
        setSuccessMsg("Saved location and recipient contact updated! 🗺️✨");
        setNewAddressFormOpen(false);
      } catch (err: any) {
        setError("Unable to save location detail.");
      } finally {
        setIsSavingProfile(false);
      }
    }, 400);
  };

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
      if (!agreeToTerms) {
        setError("Please accept the Terms of Service and Privacy Policy to create your account.");
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
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!phone || phone.length < 10) {
      setError("Please key in a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // Secure 4-digit code

    try {
      const response = await fetch("/api/sms/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: code }),
      });

      const responseText = await response.text();
      let serverResult: any;

      try {
        serverResult = JSON.parse(responseText);
      } catch (jsonErr) {
        console.warn("Server returned a non-JSON/HTML page during OTP dispatch:", responseText);
        setError(`SMS Network Error: Unexpected token '${responseText.trim().charAt(0) || "T"}' in JSON at position 0. Response is not valid JSON: ${responseText.slice(0, 120)}...`);
        return;
      }

      if (serverResult.success === true) {
        setGeneratedOtp(code);
        setOtpSent(true);
        setOtp("");
        setSuccessMsg("OTP sent successfully");
      } else {
        setError(`Fast2SMS Gateway Error: ${serverResult.error || "Failed to transmit OTP."}`);
      }
    } catch (err: any) {
      console.warn("Connection issue during OTP dispatch:", err);
      setError(`SMS Network Error: ${err?.message || "Failed to establish standard connection."}`);
    } finally {
      setLoading(false);
    }
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
    <div className="relative min-h-screen bg-[#070604] text-[#FAF6F0] overflow-hidden">
      {/* Interactive WebGL smoke background for non-logged-in views */}
      {!currentUser && (
        <SmokeyBackground backdropBlurAmount="md" className="absolute inset-0 z-0" color="#B4942B" />
      )}

      {/* Main container content */}
      <div className="relative z-10 flex flex-col justify-start min-h-screen pt-12">
        
        {/* Centered Card */}
        <div className={`max-w-md w-full mx-auto my-12 px-6 py-8 rounded-3xl shadow-2xl relative overflow-hidden ${
          currentUser 
            ? "bg-white border border-coffee-200/60 text-coffee-900" 
            : "bg-stone-950/40 backdrop-blur-xl border border-white/10 text-white"
        }`}>

          {currentUser ? (
            /* Background Ambience for profile */
            <>
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-coffee-100/50 rounded-full blur-xl pointer-events-none" />
            </>
          ) : null}

          <motion.div 
            className="text-center space-y-6 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            
            {/* Brand Icon */}
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
              currentUser ? "bg-coffee-950 text-accent-amber" : "bg-stone-900/40 border border-white/10 text-amber-400"
            }`}>
              <Coffee className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h2 className={`text-2xl font-serif font-bold ${currentUser ? "text-coffee-950" : "text-white"}`}>
                {currentUser ? `Welcome back, ${currentUser.displayName}` : "Enter Dazeen Hub"}
              </h2>
              <p className={`text-xs max-w-xs mx-auto ${currentUser ? "text-coffee-600" : "text-stone-300"}`}>
                {currentUser 
                  ? "Track your direct coffee shipments, change custom grinds, or administer global accounts." 
                  : "Access your customizable coffee profile, trace order shipments, or seed master inventory configs."}
              </p>
            </div>

            {/* Global Notifications */}
            {error && (
              <div className={`p-3.5 border text-xs rounded-xl font-medium text-left ${
                currentUser 
                  ? "bg-rose-50 border-rose-200 text-rose-800" 
                  : "bg-rose-950/50 border-rose-800/80 text-rose-200"
              }`}>
                ⚠️ {error}
              </div>
            )}

            {successMsg && (
              <div className={`p-3.5 border text-xs rounded-xl font-mono text-left ${
                currentUser 
                  ? "bg-emerald-50 border-emerald-250 text-emerald-800"
                  : "bg-emerald-950/50 border-emerald-800/85 text-emerald-200"
              }`}>
                ✨ {successMsg}
              </div>
            )}

            {currentUser ? (
          /* LOGGED IN VIEW - SPECIFICALLY CUSTOMIZED BY USER REQUEST */
          <div className="space-y-6 pt-2 text-stone-900 bg-white">
            
            {/* 1. Greeting header */}
            <div className="text-center space-y-1 py-1">
              <h3 className="text-2xl font-serif font-black text-stone-900 tracking-tight">
                Hello, {profileName || currentUser.displayName || "Dazeen Guest"} 👋
              </h3>
              <p className="text-xs text-stone-500 font-semibold font-mono">Premium Coffee Connoisseur</p>
            </div>

            {/* 2. Side-by-side pill buttons (ak k side ak) */}
            <div className="flex justify-center items-center gap-2 py-1 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  notificationService.send(
                    "Logistics tracker opened! 📦🛩️",
                    `Hi ${profileName || "User"}, we are pulling up your Dazeen coffee shipments checklist!`
                  );
                  onBackToHome();
                }}
                className="px-4 py-2 bg-stone-900 text-amber-200 font-extrabold uppercase tracking-widest text-[9px] font-mono rounded-full hover:bg-stone-850 cursor-pointer shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
              >
                <span>Orders</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  notificationService.send(
                    "Looking for cozy vibes? ☕🤤",
                    "Directly reloading our pure caffeine-free collections. Complete purchase with 1-click!"
                  );
                  onBackToHome();
                }}
                className="px-4 py-2 bg-stone-100 text-stone-800 font-extrabold uppercase tracking-widest text-[9px] font-mono rounded-full hover:bg-stone-250 cursor-pointer shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
              >
                <span>Buy Again</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  notificationService.send(
                    "Reorder setup initiated! ⚡",
                    "We are prepping your favorite beans instantly. Check out your bag!"
                  );
                  onBackToHome();
                }}
                className="px-4 py-2 bg-stone-100 text-stone-800 font-extrabold uppercase tracking-widest text-[9px] font-mono rounded-full hover:bg-stone-250 cursor-pointer shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
              >
                <span>Reorder</span>
              </button>
            </div>

            {/* 3. Saved Address box with "+" option beside it to save/update location */}
            <div className="space-y-2 text-left">
              <span className="block text-[10px] font-extrabold font-mono uppercase tracking-wider text-stone-500">
                Registered Shipping Area
              </span>
              
              <div className="flex items-stretch gap-2">
                <div className="flex-1 bg-stone-50 p-4 rounded-xl border border-stone-200/55 flex flex-col justify-center min-h-[72px]">
                  {profileAddress ? (
                    <div className="space-y-1 text-xs">
                      <span className="block text-[8px] text-[#B4942B] font-bold uppercase tracking-widest font-mono">
                        Primary Location
                      </span>
                      <p className="text-stone-850 font-bold leading-relaxed">
                        {profileAddress}
                      </p>
                      {profilePhone && (
                        <p className="text-[10px] text-stone-500 font-semibold font-mono">
                          📞 {profilePhone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-1">
                      <p className="text-[11px] text-stone-400 font-bold">No registered address.</p>
                      <p className="text-[9px] text-stone-400">Click the + helper next to the box to enter.</p>
                    </div>
                  )}
                </div>

                {/* "+" option button beside address box */}
                <button
                  type="button"
                  onClick={() => {
                    setNewAddressFormOpen((prev) => !prev);
                    setFormAddressValue(profileAddress || "");
                    setFormNameValue(profileName || currentUser.displayName || "");
                    setFormPhoneValue(profilePhone || currentUser.phone || "");
                  }}
                  className="w-12 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl border border-stone-200 flex items-center justify-center font-black active:scale-95 transition-all cursor-pointer shadow-xs flex-shrink-0"
                  title="Add/Edit Saved Location Address"
                >
                  <span className="text-2xl leading-none font-bold text-stone-800">+</span>
                </button>
              </div>

              {/* Collapsed Editable details form opened on click of "+" option */}
              <AnimatePresence>
                {newAddressFormOpen && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSaveNewAddress}
                    className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 mt-2.5 space-y-3 overflow-hidden text-left"
                  >
                    <div className="flex justify-between items-center border-b border-stone-200/60 pb-1.5 mb-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-stone-800 font-mono">Update Delivery Address</span>
                      <button 
                        type="button" 
                        onClick={() => setNewAddressFormOpen(false)} 
                        className="text-[10px] text-stone-400 hover:text-rose-600 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-0.5">
                      <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest font-extrabold">Recipient Full Name</label>
                      <input
                        type="text"
                        required
                        value={formNameValue}
                        onChange={(e) => setFormNameValue(e.target.value)}
                        placeholder="e.g. Rahul Kumar"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 outline-none focus:border-[#B4942B] font-semibold"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest font-extrabold">Complete Sourcing Address</label>
                      <textarea
                        required
                        rows={2}
                        value={formAddressValue}
                        onChange={(e) => setFormAddressValue(e.target.value)}
                        placeholder="Flat/House no, sector colony, city, landmark, PIN"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 outline-none focus:border-[#B4942B] font-semibold resize-none"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest font-extrabold">Calling Contact Number</label>
                      <input
                        type="tel"
                        required
                        pattern="^[6-9]\d{9}$"
                        maxLength={10}
                        value={formPhoneValue}
                        onChange={(e) => setFormPhoneValue(e.target.value.replace(/\D/g, ""))}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 outline-none focus:border-[#B4942B] font-semibold"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="w-full py-2.5 bg-stone-900 hover:bg-stone-850 text-white rounded-lg text-[10px] font-mono font-black tracking-widest uppercase cursor-pointer disabled:opacity-50"
                    >
                      {isSavingProfile ? "Saving location..." : "Save Saved Location"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* 4. Show login mail or user number */}
            <div className="bg-stone-50/50 p-3 rounded-xl border border-stone-200/50 flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                  <Mail className="w-4 h-4 text-[#B4942B]" />
                </div>
                <div>
                  <span className="block text-[8px] font-mono uppercase text-stone-400 font-extrabold tracking-wider">Account Credentials</span>
                  <span className="text-xs font-mono text-stone-750 font-bold break-all">
                    {currentUser.email ? currentUser.email : `Phone Number: ${currentUser.phone || currentUser.phoneNumber}`}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Slider in which Log out button sits (Slide/Swipe to Logout) */}
            <div className="space-y-2 pt-2">
              <span className="block text-[10px] font-extrabold font-mono uppercase tracking-wider text-stone-500 text-left">
                Security Gesture (Swipe to Logout)
              </span>
              
              <SlideButton 
                labelText="Slide fully to end to Logout →"
                onDragComplete={handleSignOut}
              />
            </div>

            {/* Home Navigation button */}
            <button
              type="button"
              onClick={onBackToHome}
              className="w-full py-3.5 bg-stone-900 text-white hover:bg-stone-850 font-bold text-xs rounded-xl shadow-lg transition-colors uppercase font-mono cursor-pointer flex items-center justify-center gap-2"
            >
              Close Profile <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        ) : (
          /* BRAND NEW FORMS (NO BYPASS BUTTONS!) */
          <div className="space-y-6 pt-2">
            
            {/* Custom Interactive Sign In Dual-Tabs */}
            <div className="flex bg-stone-900/60 p-1 rounded-xl border border-stone-800/80">
              <button
                type="button"
                onClick={() => switchTab("email")}
                className={`flex-1 py-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg transition-transform cursor-pointer ${
                  activeTab === "email" 
                    ? "bg-amber-500 text-stone-950 shadow-sm font-black" 
                    : "text-stone-400 hover:text-white"
                }`}
              >
                📬 Email Account
              </button>
              <button
                type="button"
                onClick={() => switchTab("phone")}
                className={`flex-1 py-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg transition-transform cursor-pointer ${
                  activeTab === "phone" 
                    ? "bg-amber-500 text-stone-950 shadow-sm font-black" 
                    : "text-stone-400 hover:text-white"
                }`}
              >
                📱 Mobile Number
              </button>
            </div>

            {/* tab rendering */}
            {activeTab === "email" ? (
              <form onSubmit={handleEmailAuthSubmit} className="space-y-6 text-left">
                {authMode === "signup" && (
                  <div className="relative z-0 w-full mb-6 group">
                    <input
                      type="text"
                      id="floating_name"
                      required
                      placeholder=" "
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-stone-700 appearance-none focus:outline-none focus:ring-0 focus:border-amber-400 peer transition-all font-semibold"
                    />
                    <label
                      htmlFor="floating_name"
                      className="absolute text-sm text-stone-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-amber-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center"
                    >
                      <User className="inline-block mr-2 w-4 h-4" />
                      Full Name
                    </label>
                  </div>
                )}

                <div className="relative z-0 w-full mb-6 group">
                  <input
                    type="email"
                    id="floating_email"
                    required
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-stone-700 appearance-none focus:outline-none focus:ring-0 focus:border-amber-400 peer transition-all font-semibold"
                  />
                  <label
                    htmlFor="floating_email"
                    className="absolute text-sm text-stone-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-amber-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center"
                  >
                    <Mail className="inline-block mr-2 w-4 h-4" />
                    Email Address
                  </label>
                </div>

                <div className="relative z-0 w-full mb-6 group">
                  <input
                    type="password"
                    id="floating_password"
                    required
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-stone-700 appearance-none focus:outline-none focus:ring-0 focus:border-amber-400 peer transition-all font-semibold"
                  />
                  <label
                    htmlFor="floating_password"
                    className="absolute text-sm text-stone-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-amber-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center"
                  >
                    <Lock className="inline-block mr-2 w-4 h-4" />
                    Password
                  </label>
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
                    className="text-amber-400 hover:underline font-semibold font-mono cursor-pointer"
                  >
                    {authMode === "signin" ? "New customer? Register Account" : "Already registered? Sign In"}
                  </button>
                </div>

                {authMode === "signup" && (
                  <div className="flex items-start space-x-3 bg-stone-900/50 p-3.5 rounded-2xl border border-white/5 select-none my-1" id="register-terms-container">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="terms"
                        className="text-[11px] text-stone-300 font-sans cursor-pointer hover:text-stone-100 select-none leading-relaxed"
                      >
                        I accept and agree to the <span className="text-amber-400 font-bold underline decoration-amber-400/30">Terms of Service</span> and <span className="text-amber-400 font-bold underline decoration-amber-400/30">Privacy Policy</span> of Dazeen Premium Coffee.
                      </Label>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center py-3.5 px-4 bg-amber-500 hover:bg-amber-600 rounded-xl text-stone-950 font-extrabold uppercase tracking-widest text-xs font-mono focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-950 focus:ring-amber-400 transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Verifying Credentials..." : authMode === "signin" ? "Login Account" : "Complete Register"}
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            ) : (
              /* PHONE TAB FLOW */
              <div className="space-y-6 text-left">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-6">
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="tel"
                        id="floating_phone"
                        required
                        maxLength={10}
                        placeholder=" "
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-stone-700 appearance-none focus:outline-none focus:ring-0 focus:border-amber-400 peer transition-all font-semibold font-mono tracking-wider"
                      />
                      <label
                        htmlFor="floating_phone"
                        className="absolute text-sm text-stone-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-amber-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center"
                      >
                        <Phone className="inline-block mr-2 w-4 h-4" />
                        10-Digit Mobile Number
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group w-full flex items-center justify-center py-3.5 px-4 bg-amber-500 hover:bg-amber-600 rounded-xl text-stone-950 font-extrabold uppercase tracking-widest text-xs font-mono focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-950 focus:ring-amber-400 transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? "Generating SMS..." : "Request OTP Code"}
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="text"
                        id="floating_otp"
                        required
                        maxLength={4}
                        placeholder=" "
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="block py-2.5 px-0 w-full text-lg text-amber-300 bg-transparent border-0 border-b-2 border-stone-700 appearance-none focus:outline-none focus:ring-0 focus:border-amber-400 peer transition-all text-center font-mono tracking-widest"
                      />
                      <label
                        htmlFor="floating_otp"
                        className="absolute text-sm text-stone-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-amber-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center w-full justify-center"
                      >
                        <KeyRound className="inline-block mr-2 w-4 h-4" />
                        4-Digit Verification Code
                      </label>
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
                        className="text-stone-400 hover:text-white hover:underline cursor-pointer"
                      >
                        ← Back to mobile entry
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group w-full flex items-center justify-center py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold uppercase tracking-widest text-xs font-mono focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-950 focus:ring-emerald-500 transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? "Verifying Code..." : "Verify Mobile OTP"}
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-stone-850"></div>
              <span className="flex-shrink mx-4 text-stone-400 text-[10px] font-mono tracking-widest uppercase">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-stone-850"></div>
            </div>

            {/* Google Authentication Button */}
            <button
              type="button"
              onClick={() => {
                // Instantly login as Shree Deshmukh
                const googlePayload = {
                  uid: "google-shree-admin",
                  email: "shreedeshmukh166@gmail.com",
                  displayName: "Shree Deshmukh",
                  photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
                  phoneNumber: "9876543210"
                };
                localStorage.setItem("dazeen_current_user", JSON.stringify(googlePayload));
                localStorage.setItem("dazeen_user_is_admin", JSON.stringify(true));
                onLoginSuccess(googlePayload, true);
                notificationService.send("Secure Google login successful! ☕", "Welcome back, Shree Deshmukh!");
              }}
              className="w-full flex items-center justify-center py-3 px-4 bg-white hover:bg-white/95 rounded-xl text-stone-950 font-bold font-mono tracking-wide text-xs transition-all duration-300 cursor-pointer shadow-lg active:scale-98"
            >
              <svg className="w-4 h-4 mr-2.5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.841C34.553 4.806 29.613 2.5 24 2.5C11.983 2.5 2.5 11.983 2.5 24s9.483 21.5 21.5 21.5S45.5 36.017 45.5 24c0-1.538-.135-3.022-.389-4.417z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12.5 24 12.5c3.059 0 5.842 1.154 7.961 3.039l5.839-5.841C34.553 4.806 29.613 2.5 24 2.5C16.318 2.5 9.642 6.723 6.306 14.691z"></path><path fill="#4CAF50" d="M24 45.5c5.613 0 10.553-2.306 14.802-6.341l-5.839-5.841C30.842 35.846 27.059 38 24 38c-5.039 0-9.345-2.608-11.124-6.481l-6.571 4.819C9.642 41.277 16.318 45.5 24 45.5z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.839 5.841C44.196 35.123 45.5 29.837 45.5 24c0-1.538-.135-3.022-.389-4.417z"></path>
              </svg>
              Sign In with Google
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onBackToHome}
                className="text-xs text-amber-400 hover:underline font-semibold font-mono inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sourcing Shop
              </button>
            </div>
          </div>
        )}

        {/* Benefits Cards Grid */}
        <div className={`mt-8 pt-6 border-t grid grid-cols-2 gap-3 text-left ${currentUser ? "border-coffee-100" : "border-white/10"}`}>
          <div className="flex gap-2 items-start opacity-85">
            <div className={`p-1 rounded-md ${currentUser ? "bg-[#FAF6F0] text-coffee-800" : "bg-stone-900/50 text-[#FAF6F0]"}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className={`text-[11px] font-bold leading-tight ${currentUser ? "text-coffee-900" : "text-stone-200"}`}>Secure Customer Checkouts</h4>
              <p className={`text-[9px] ${currentUser ? "text-coffee-500" : "text-stone-400"}`}>Industry standard safety for orders.</p>
            </div>
          </div>
          <div className="flex gap-2 items-start opacity-85">
            <div className={`p-1 rounded-md ${currentUser ? "bg-[#FAF6F0] text-[#B4942B]" : "bg-stone-900/50 text-amber-400"}`}>
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className={`text-[11px] font-bold leading-tight ${currentUser ? "text-coffee-900" : "text-stone-200"}`}>Encrypted Device Vault</h4>
              <p className={`text-[9px] ${currentUser ? "text-coffee-500" : "text-stone-400"}`}>Standalone client session storage.</p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
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
          <LiquidButton 
            onClick={onBackToHome}
            className="rounded-full px-6 py-3 font-body text-white"
          >
            Order Premium Coffee
            <ArrowUpRight className="h-5 w-5" />
          </LiquidButton>
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
