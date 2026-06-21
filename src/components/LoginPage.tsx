import { useState, FormEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coffee, ShieldCheck, Mail, Lock, LogOut, ArrowRight, ArrowLeft, Phone, User, KeyRound, ArrowUpRight, Truck, Star, Home, Eye, Heart, Settings } from "lucide-react";
import Hls from "hls.js";
import { SmokeyBackground } from "./ui/login-form";
import { notificationService } from "../utils/notifications";
import { LiquidButton } from "./ui/liquid-glass-button";
import { SlideButton } from "./ui/slide-button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { UserProfileSidebar } from "./ui/menu";
import { OTPVerification } from "./ui/otp-input";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "./ui/stepper";

interface LoginPageProps {
  onBackToHome: () => void;
  onLoginSuccess: (user: any, isAdminUser: boolean) => void;
  currentUser: any;
  isAdmin: boolean;
  onAddToCart?: (product: any) => void;
  onReorder?: (items: any[]) => void;
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
  onAddToCart,
  onReorder,
}: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [activeProfileTab, setActiveProfileTab] = useState("orders");
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
  const [profileGrind, setProfileGrind] = useState("Medium Ground");
  const [profileRoast, setProfileRoast] = useState("Dark Chocolate Roast");
  const [stepperValue, setStepperValue] = useState(1);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editGrind, setEditGrind] = useState("Medium Ground");
  const [editRoast, setEditRoast] = useState("Medium Roast");

  // Custom UserProfile states for layout and random cartoon avatars
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState<any[]>(() => {
    const saved = localStorage.getItem("dazeen_custom_user_reviews");
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Uncompromising body and authentic taste. Absolute world-class decaf formula!", rating: 5, date: "June 20, 2026" }
    ];
  });
  const [profileAvatar, setProfileAvatar] = useState("");

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
      const name = currentUser.displayName || "";
      const addr = currentUser.address || "";
      const ph = currentUser.phoneNumber || currentUser.phone || "";
      const grind = currentUser.profileGrind || "Medium Ground";
      const roast = currentUser.profileRoast || "Dark Chocolate Roast";

      setProfileName(name);
      setProfileAddress(addr);
      setProfilePhone(ph);
      setProfileGrind(grind);
      setProfileRoast(roast);

      // Pre-fill setup form triggers
      setFormNameValue(name);
      setFormAddressValue(addr);
      setFormPhoneValue(ph);

      // Pre-fill edit states
      setEditName(name);
      setEditAddress(addr);
      setEditPhone(ph);
      setEditGrind(grind);
      setEditRoast(roast);

      // Load or generate random cartoon avatar starting off!
      const savedAvatar = currentUser.avatarUrl || localStorage.getItem(`avatar_${currentUser.uid}`);
      let finalAvatarUrl = savedAvatar;
      if (!finalAvatarUrl) {
        // Pick a premium adventurer cartoon seed representing our brand theme!
        const randomSeed = Math.floor(Math.random() * 10000);
        finalAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=Dazeen_${randomSeed}`;
        
        // Save back updated info immediately to local storage so it persists!
        localStorage.setItem(`avatar_${currentUser.uid}`, finalAvatarUrl);
        const updatedUser = { ...currentUser, avatarUrl: finalAvatarUrl };
        localStorage.setItem("dazeen_current_user", JSON.stringify(updatedUser));
        
        // Update in list
        const savedUsers = localStorage.getItem("dazeen_local_users_v1");
        if (savedUsers) {
          try {
            const usersList = JSON.parse(savedUsers);
            const updatedList = usersList.map((u: any) => {
              if (u.uid === currentUser.uid) {
                return { ...u, avatarUrl: finalAvatarUrl };
              }
              return u;
            });
            localStorage.setItem("dazeen_local_users_v1", JSON.stringify(updatedList));
          } catch (e) {
            console.error("Error updating user list avatar", e);
          }
        }
      }
      setProfileAvatar(finalAvatarUrl);

      // Dynamically preselected Setup step
      if (!name) {
        setStepperValue(1);
      } else if (!addr) {
        setStepperValue(2);
      } else {
        setStepperValue(3);
      }
    }
  }, [currentUser]);

  // Handle saving personal details
  const saveProfileAttributes = (name: string, address: string, phone: string, grind: string, roast: string) => {
    if (!currentUser) return false;
    setIsSavingProfile(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const updatedUser = {
        ...currentUser,
        displayName: name.trim(),
        address: address.trim(),
        phoneNumber: phone.trim(),
        phone: phone.trim(),
        profileGrind: grind,
        profileRoast: roast,
      };

      // Sync local states
      setProfileName(name.trim());
      setProfileAddress(address.trim());
      setProfilePhone(phone.trim());
      setProfileGrind(grind);
      setProfileRoast(roast);

      // Update currently active session
      localStorage.setItem("dazeen_current_user", JSON.stringify(updatedUser));
      
      // Update in the registered list
      const savedUsers = localStorage.getItem("dazeen_local_users_v1");
      if (savedUsers) {
        const usersList: LocalUser[] = JSON.parse(savedUsers);
        const updatedList = usersList.map((u) => {
          if (u.uid === currentUser.uid) {
            return {
              ...u,
              displayName: name.trim(),
              address: address.trim(),
              phone: phone.trim(),
              phoneNumber: phone.trim(),
              profileGrind: grind,
              profileRoast: roast,
            };
          }
          return u;
        });
        localStorage.setItem("dazeen_local_users_v1", JSON.stringify(updatedList));
      }

      onLoginSuccess(updatedUser, isAdmin);
      return true;
    } catch (err: any) {
      setError("Unable to sync preference changes.");
      return false;
    } finally {
      setIsSavingProfile(false);
    }
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
          const randomSeed = Math.floor(Math.random() * 1000) + 1;
          const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=Dazeen-${randomSeed}`;
          
          const newUserPayload: LocalUser = {
            uid: `usr-${Date.now()}`,
            email: formattedEmail,
            displayName: displayName.trim(),
            password: password,
            photoURL: defaultAvatar,
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
      const response = await fetch('/api/send-otp?phone=' + phone + '&otpValue=' + code);
      const dataText = await response.text();
      
      console.log("SERVER_RESPONSE:", dataText);

      // Try parsing response as JSON to see if it succeeded
      let parsedData: any = {};
      try {
        parsedData = JSON.parse(dataText);
      } catch (jsonErr) {
        console.warn("Direct response was not valid JSON, but logged raw text above:", dataText);
      }

      // Fast2SMS return true if successfully accepted/queued
      if (parsedData.return === true || dataText.includes('"return":true') || dataText.includes("success")) {
        setGeneratedOtp(code);
        setOtpSent(true);
        setOtp("");
        setSuccessMsg(`OTP sent successfully!`);
      } else {
        setError(`Fast2SMS Response: ${dataText || "Unknown server transmission error."}`);
      }
    } catch (err: any) {
      console.error("Transmission Failed:", err);
      setError(`Transmission Error: ${err?.message || "Failed to reach backend OTP api."}`);
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

  const handleReorderLastOrder = () => {
    setError(null);
    try {
      const existingOrdersStr = localStorage.getItem("dazeen_placed_orders_v1");
      const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
      
      // Filter for current user's orders
      const userOrders = existingOrders.filter((order: any) => order.userId === currentUser.uid);
      
      if (userOrders.length > 0) {
        const lastOrder = userOrders[0]; // most recent order
        
        // Ensure standard cart items format: { product: Product, quantity: number }[]
        const cartItems = lastOrder.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity || 1
        }));
        
        // Save back into cart cache in localStorage
        localStorage.setItem("dazeen_cart_cache_v1", JSON.stringify(cartItems));
        
        if (onReorder) {
          onReorder(cartItems);
        } else {
          // Fallback if prop didn't map
          window.location.reload();
        }
      } else {
        // Fallback: If no past orders exist, recommend our best product and load it as the "last placement"!
        const fallbackCart = [{
          product: {
            id: "dazeen-classic",
            name: "Classic Velvet Premium Blend",
            tagline: "Rich aroma of roasted hazelnuts and sweet caramel, with absolute zero jitters.",
            description: "Signature decaf blend sourced from our shade-grown organic estates.",
            price: 449,
            rating: 4.9,
            reviewsCount: 382,
            image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600",
            roastLevel: "Medium",
            aromaProfile: ["Vanilla Pod", "Roasted Hazelnut"],
            benefits: ["Zero Sleep Disruption"],
            origin: "Western Ghats, Karnataka",
            process: "Chemical-Free Mountain Spring Extraction, 100% Arabica",
            caffeineCount: "0.0% Caffeine"
          },
          quantity: 1
        }];
        localStorage.setItem("dazeen_cart_cache_v1", JSON.stringify(fallbackCart));
        if (onReorder) {
          onReorder(fallbackCart);
        } else {
          window.location.reload();
        }
      }
    } catch (e) {
      console.error("Reorder failed", e);
      setError("Unable to process high-speed reordering. Savor manual checkouts!");
    }
  };

  // Custom review/feedback stats inside states
  const [userReviewRating, setUserReviewRating] = useState(5);
  const [userReviewText, setUserReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Roll new cartoon avatar seed
  const handleRollAvatar = () => {
    const randomSeed = Math.floor(Math.random() * 100000);
    const freshAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=Dazeen_${randomSeed}`;
    
    setProfileAvatar(freshAvatarUrl);
    localStorage.setItem(`avatar_${currentUser?.uid}`, freshAvatarUrl);
    
    const updatedUser = { ...currentUser, avatarUrl: freshAvatarUrl };
    localStorage.setItem("dazeen_current_user", JSON.stringify(updatedUser));
    
    const savedUsers = localStorage.getItem("dazeen_local_users_v1");
    if (savedUsers) {
      try {
        const usersList = JSON.parse(savedUsers);
        const updatedList = usersList.map((u: any) => {
          if (u.uid === currentUser?.uid) {
            return { ...u, avatarUrl: freshAvatarUrl };
          }
          return u;
        });
        localStorage.setItem("dazeen_local_users_v1", JSON.stringify(updatedList));
      } catch (e) {
        console.error("Avatar list synchronization failed", e);
      }
    }
    
    setSuccessMsg("Fresh cartoon avatar rolled! 🎲✨");
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Nav items configuration for UserProfileSidebar
  const profileNavItems = [
    {
      label: 'My orders',
      href: '#orders',
      icon: <Truck className="h-full w-full" />,
      onClick: () => setActiveProfileTab("orders")
    },
    {
      label: 'Reviews',
      href: '#reviews',
      icon: <Star className="h-full w-full" />,
      onClick: () => setActiveProfileTab("reviews")
    },
    {
      label: 'Delivery addresses',
      href: '#addresses',
      icon: <Home className="h-full w-full" />,
      onClick: () => setActiveProfileTab("addresses")
    },
    {
      label: 'Recently viewed',
      href: '#viewed',
      icon: <Eye className="h-full w-full" />,
      onClick: () => setActiveProfileTab("viewed")
    },
    {
      label: 'Favorite items',
      href: '#favorites',
      icon: <Heart className="h-full w-full" />,
      onClick: () => setActiveProfileTab("favorites")
    },
    {
      label: 'Settings',
      href: '#settings',
      icon: <Settings className="h-full w-full" />,
      isSeparator: true,
      onClick: () => setActiveProfileTab("settings")
    },
  ];

  // Helper renderers for dynamic content area on the right side
  const renderOrdersTab = () => {
    const existingOrdersStr = localStorage.getItem("dazeen_placed_orders_v1");
    const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    const userOrders = existingOrders.filter((order: any) => order.userId === currentUser?.uid);

    return (
      <div className="space-y-4">
        <div className="border-b border-stone-150 pb-3">
          <h3 className="text-xl font-serif font-black text-stone-900">Your Fresh Brew Placements 📦</h3>
          <p className="text-xs text-stone-500 mt-1">Status of your premium decaf packages and priority tracking.</p>
        </div>

        {/* Reorder Quick Pills */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/50 space-y-3">
          <span className="block text-[8px] font-mono tracking-widest text-[#B4942B] font-extrabold uppercase">
            ⚡ Quick Replay Placement
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReorderLastOrder}
              className="flex-1 py-2.5 bg-[#B4942B] text-stone-950 font-black hover:bg-[#A38324] text-[10px] rounded-full cursor-pointer shadow-xs active:scale-98 transition-all flex flex-col justify-center items-center px-3"
            >
              <span>Order Again</span>
              <span className="text-[6.5px] font-mono tracking-wider text-[#FAF600] font-black opacity-95">Instant checkout</span>
            </button>

            <button
              type="button"
              onClick={handleReorderLastOrder}
              className="flex-1 py-2.5 bg-stone-900 text-amber-250 font-black hover:bg-stone-850 text-[10px] rounded-full cursor-pointer shadow-xs active:scale-98 transition-all flex flex-col justify-center items-center px-3"
            >
              <span>Re-Order Now</span>
              <span className="text-[6.5px] font-mono tracking-wider text-amber-400 font-black opacity-95">Shift last placement</span>
            </button>
          </div>
        </div>

        {/* Real User Orders List */}
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
          {userOrders.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-stone-200 rounded-2xl bg-stone-50/30">
              <p className="text-xs text-stone-500 font-bold">No order placements found for your account.</p>
              <button
                type="button"
                onClick={() => {
                  const product = {
                    id: "dazeen-classic",
                    name: "Classic Velvet Premium Blend",
                    price: 449,
                    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600",
                    roastLevel: "Medium",
                    description: "Signature decaf blend sourced from our shade-grown organic estates."
                  };
                  if (onAddToCart) {
                    onAddToCart(product);
                  } else {
                    const currentCart = [{ product, quantity: 1 }];
                    localStorage.setItem("dazeen_cart_cache_v1", JSON.stringify(currentCart));
                    window.location.reload();
                  }
                }}
                className="mt-3 inline-flex items-center gap-1 bg-stone-900 text-white px-4 py-1.5 rounded-full text-[10px] font-mono font-black uppercase text-center cursor-pointer"
              >
                Order Best Blend
              </button>
            </div>
          ) : (
            userOrders.map((order: any, idx: number) => (
              <div key={idx} className="p-3 border border-stone-150 rounded-xl bg-white flex justify-between items-center text-xs">
                <div className="text-left">
                  <p className="font-extrabold text-stone-900">Order #{order.id?.slice(-6) || `DZ-${10237 + idx}`}</p>
                  <p className="text-[10px] font-mono text-stone-400 mt-0.5">{order.date || "Just now"}</p>
                  <div className="text-[10px] text-stone-600 font-bold mt-1 line-clamp-1 max-w-[200px]">
                    {order.items?.map((it: any) => `${it.product?.name} x${it.quantity}`).join(", ")}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-stone-900">₹{order.total || order.amount || 449}</p>
                  <span className="inline-block mt-1 text-[8.5px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {order.status || "Processing"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderReviewsTab = () => {
    return (
      <div className="space-y-4">
        <div className="border-b border-stone-150 pb-3">
          <h3 className="text-xl font-serif font-black text-stone-900">Product Feedback & Reviews ⭐</h3>
          <p className="text-xs text-stone-500 mt-1">Tell us your flavor experience or how well you rested after late cups.</p>
        </div>

        {reviewSubmitted ? (
          <div className="text-center py-8 bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 space-y-2 select-none">
            <span className="text-2xl">✨</span>
            <h4 className="font-serif font-black text-emerald-950 text-base">Feedback Submitted Successfully!</h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              Family standards reinforced. Your testimonial is shared with our roasters in the Western Ghats to preserve authentic decaf science.
            </p>
            <button
              type="button"
              onClick={() => {
                setReviewSubmitted(false);
                setUserReviewText("");
              }}
              className="mt-3 text-xs font-mono font-black text-[#B4942B] underline cursor-pointer"
            >
              Write another review
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!userReviewText.trim()) return;
              setReviewSubmitted(true);
            }}
            className="space-y-3 bg-stone-50/50 p-4 border border-stone-200/50 rounded-2xl text-left"
          >
            <div className="space-y-1">
              <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest font-black">Star Rating</label>
              <div className="flex gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserReviewRating(star)}
                    className="cursor-pointer transition-transform duration-250 active:scale-90"
                  >
                    <Star className={`w-5 h-5 ${star <= userReviewRating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest font-black">Write Review Message</label>
              <textarea
                required
                rows={3}
                value={userReviewText}
                onChange={(e) => setUserReviewText(e.target.value)}
                placeholder="How did you like our Classic Velvet or Monsoon Malabar? (e.g. Acid-free, perfect nocturnal sleep, stellar crema)"
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900 outline-none focus:border-amber-500 resize-none leading-relaxed placeholder-stone-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-850 text-amber-200 text-xs font-mono font-black uppercase rounded-xl shadow-xs transition-transform cursor-pointer"
            >
              Submit custom feedback
            </button>
          </form>
        )}
      </div>
    );
  };

  const renderAddressesTab = () => {
    return (
      <div className="space-y-4">
        <div className="border-b border-stone-150 pb-3">
          <h3 className="text-xl font-serif font-black text-stone-900">Shipping Delivery Coordinates 🏠</h3>
          <p className="text-xs text-stone-500 mt-1">Keep your credentials up to date to guarantee fast courier dispatch.</p>
        </div>

        {!isEditingAddress ? (
          <div className="space-y-4 bg-stone-50/50 border border-stone-200/50 p-4 rounded-2xl text-left">
            <div>
              <span className="block text-[8px] font-mono font-black text-stone-400 uppercase tracking-widest mb-1">Full Name</span>
              <p className="text-sm font-sans font-extrabold text-stone-900">
                {profileName || currentUser?.displayName || "Not Provided"}
              </p>
            </div>

            <div>
              <span className="block text-[8px] font-mono font-black text-stone-400 uppercase tracking-widest mb-1">Permanent Shipping Address</span>
              <p className="text-xs font-sans font-bold text-stone-700 leading-relaxed">
                {profileAddress || "No shipping address entered yet. Click edit below to add address."}
              </p>
            </div>

            {profilePhone && (
              <div>
                <span className="block text-[8px] font-mono font-black text-stone-400 uppercase tracking-widest mb-1">Mobile Number</span>
                <p className="text-xs font-mono font-bold text-stone-850">
                  +91 {profilePhone}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsEditingAddress(true)}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-[#B4942B] font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-xs active:scale-98 transition-all flex justify-center items-center gap-1"
            >
              Edit Shipping Details Form
            </button>
          </div>
        ) : (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!editAddress.trim()) {
                setError("Address cannot be empty!");
                return;
              }
              const success = saveProfileAttributes(editName, editAddress, editPhone, editGrind, editRoast);
              if (success) {
                setSuccessMsg("Details permanently saved! ☕");
                setIsEditingAddress(false);
                setTimeout(() => setSuccessMsg(null), 4000);
              }
            }}
            className="space-y-3 bg-stone-50 p-4 border border-stone-200/50 rounded-2xl text-left"
          >
            <p className="text-[10px] font-mono font-black text-[#B4942B] tracking-wide uppercase">
              Modify Profile & Delivery Coordinates
            </p>
            
            <div className="space-y-1">
              <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest font-black">Your Full Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-900 outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest font-black">Permanent Delivery Address</label>
              <textarea
                required
                rows={2}
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="e.g. Flat, building, colony, city, PIN code"
                className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-900 outline-none focus:border-amber-500 resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest font-black">Mobile Contact</label>
              <input
                type="tel"
                maxLength={10}
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono font-black text-stone-900 outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingAddress(false)}
                className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[9px] font-mono font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-stone-900 hover:bg-stone-850 text-amber-250 rounded-lg text-[9px] font-mono font-black uppercase cursor-pointer"
              >
                Confirm & Save
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  const renderRecentlyViewedTab = () => {
    const products = [
      {
        id: "dazeen-classic",
        name: "Classic Velvet Premium Blend",
        price: 449,
        tagline: "Silky-smooth hazelnut notes with absolute zero jitters.",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=300"
      },
      {
        id: "dazeen-monsoon",
        name: "Monsoon Malabar Coastal Roast",
        price: 489,
        tagline: "Notes of spiced cedar wood and rich raw cacao.",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300"
      }
    ];

    return (
      <div className="space-y-4 text-left">
        <div className="border-b border-stone-150 pb-3">
          <h3 className="text-xl font-serif font-black text-stone-900">Recently Sourced Views ☕</h3>
          <p className="text-xs text-stone-500 mt-1">Premium single-estate batches you viewed during past visits.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {products.map((prod) => (
            <div key={prod.id} className="p-3 border border-stone-200 rounded-xl bg-stone-50/50 flex flex-col justify-between">
              <div className="space-y-2">
                <img src={prod.image} className="w-full h-24 rounded-lg object-cover bg-stone-100" />
                <h4 className="text-xs font-extrabold text-stone-900 line-clamp-1">{prod.name}</h4>
                <p className="text-[10px] text-stone-500 leading-normal line-clamp-2">{prod.tagline}</p>
              </div>
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-150">
                <span className="text-[11px] font-mono font-black text-[#B4942B]">₹{prod.price}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onAddToCart) {
                      onAddToCart(prod);
                    } else {
                      const currentCart = [{ product: prod, quantity: 1 }];
                      localStorage.setItem("dazeen_cart_cache_v1", JSON.stringify(currentCart));
                      window.location.reload();
                    }
                  }}
                  className="bg-stone-900 text-white px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase font-black cursor-pointer"
                >
                  Buy Again
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFavoritesTab = () => {
    const favorites = [
      {
        id: "dazeen-hazelnut",
        name: "Cozy Premium Hazelnut Roast",
        price: 519,
        tagline: "Natural hazelnut aroma infusion, absolute thick body.",
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=300"
      }
    ];

    return (
      <div className="space-y-4 text-left">
        <div className="border-b border-stone-150 pb-3">
          <h3 className="text-xl font-serif font-black text-stone-900">Your Favorite Closet ❤️</h3>
          <p className="text-xs text-stone-500 mt-1">Slick shade-grown items flagged for rapid coffee-bag replenishment.</p>
        </div>

        {favorites.map((prod) => (
          <div key={prod.id} className="p-3.5 border border-amber-200/55 rounded-2xl bg-amber-50/20 flex gap-4 items-center">
            <img src={prod.image} className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-100" />
            <div className="flex-1 min-w-0">
              <span className="text-[7.5px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase font-black">
                ★ Highly Flagged Decaf
              </span>
              <h4 className="text-sm font-extrabold text-stone-900 truncate mt-1">{prod.name}</h4>
              <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{prod.tagline}</p>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100/50">
                <span className="text-xs font-mono font-black text-stone-900">₹{prod.price}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onAddToCart) {
                      onAddToCart(prod);
                    } else {
                      const currentCart = [{ product: prod, quantity: 1 }];
                      localStorage.setItem("dazeen_cart_cache_v1", JSON.stringify(currentCart));
                      window.location.reload();
                    }
                  }}
                  className="bg-stone-900 text-white px-3 py-1 rounded-lg text-[9px] font-mono uppercase font-black cursor-pointer"
                >
                  Add To Bag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSettingsTab = () => {
    return (
      <div className="space-y-4 text-left">
        <div className="border-b border-stone-150 pb-3">
          <h3 className="text-xl font-serif font-black text-stone-900">Custom Settings & Blend Preferences</h3>
          <p className="text-xs text-stone-500 mt-1">Fine-tune your coffee grinds, roast profiles, and interactive cartoon avatar profile card.</p>
        </div>

        {/* Change Cartoon Avatar Box */}
        <div className="p-3.5 border border-stone-200 rounded-2xl bg-stone-50/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={profileAvatar} className="w-12 h-12 rounded-full border border-stone-200 shadow-sm bg-amber-50" />
            <div>
              <h4 className="text-xs font-extrabold text-[#12100E]">Profile Cartoon Avatar</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Click to roll a brand new adventurer character.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRollAvatar}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all text-center"
          >
            🎲 Roll Avatar
          </button>
        </div>

        {/* Grind & Roast Preferences Form */}
        <div className="grid grid-cols-2 gap-3 p-3.5 border border-stone-200 rounded-2xl bg-stone-50/50">
          <div className="space-y-1">
            <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest font-black">Roast Profile Preference</label>
            <select
              value={profileRoast}
              onChange={(e) => {
                const val = e.target.value;
                setProfileRoast(val);
                saveProfileAttributes(profileName, profileAddress, profilePhone, profileGrind, val);
              }}
              className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] font-black text-stone-900 outline-none cursor-pointer"
            >
              <option value="Light Roast">Light Roast (Bright)</option>
              <option value="Medium Roast">Medium Roast (Balanced)</option>
              <option value="Dark Chocolate Roast">Dark Chocolate (Rich)</option>
              <option value="Premium Hazelnut">Hazelnut Infusion</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest font-black">Grind Sizing Preference</label>
            <select
              value={profileGrind}
              onChange={(e) => {
                const val = e.target.value;
                setProfileGrind(val);
                saveProfileAttributes(profileName, profileAddress, profilePhone, val, profileRoast);
              }}
              className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] font-black text-stone-900 outline-none cursor-pointer"
            >
              <option value="Whole Beans">Whole Coffee Beans</option>
              <option value="Fine Espresso Grind">Fine Espresso Powder</option>
              <option value="Medium Drip Filter">Medium Drip Filter</option>
              <option value="Coarse French Press">Coarse French Press</option>
            </select>
          </div>
        </div>

        {/* Swipe/Slider to Logout */}
        <div className="space-y-2 pt-2 border-t border-stone-150 select-none">
          <span className="block text-[8.5px] font-extrabold font-mono uppercase tracking-widest text-stone-400 text-left">
            Security Gesture (Swipe to Logout)
          </span>
          <SlideButton 
            labelText="Slide to end to Logout →"
            onDragComplete={handleSignOut}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#070604] text-[#FAF6F0] overflow-hidden">
      {/* Interactive WebGL smoke background for non-logged-in views */}
      {!currentUser && (
        <SmokeyBackground backdropBlurAmount="md" className="absolute inset-0 z-0" color="#B4942B" />
      )}

      {/* Main container content */}
      <div className="relative z-10 flex flex-col justify-start min-h-screen pt-12">
        
        {/* Centered Card */}
        <div className={`w-full mx-auto my-12 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300 ${
          currentUser 
            ? "max-w-4xl bg-[#FAF9F6] border border-stone-200 text-[#12100E] px-6 py-8" 
            : "max-w-md bg-stone-950/40 backdrop-blur-xl border border-white/10 text-white px-6 py-8"
        }`}>

          {currentUser ? (
            /* Background Ambience for profile */
            <>
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-coffee-100/50 rounded-full blur-xl pointer-events-none" />
            </>
          ) : null}

          <motion.div 
            className={`relative z-10 ${currentUser ? "text-left" : "text-center space-y-6"}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            
            {!currentUser && (
              <>
                {/* Brand Icon */}
                <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-stone-900/40 border border-white/10 text-amber-400">
                  <Coffee className="w-8 h-8 animate-pulse" />
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-2xl font-serif font-bold text-white">
                    Enter Dazeen Hub
                  </h2>
                  <p className="text-xs max-w-xs mx-auto text-stone-300">
                    Access your customizable coffee profile, trace order shipments, or seed master inventory configs.
                  </p>
                </div>
              </>
            )}

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
              /* DUAL PANEL LAYOUT FEATURING SIDEBAR & ACTIVE PANEL VIEW */
              <div className="flex flex-col md:flex-row gap-6 text-stone-900">
                {/* Left Drawer/Sidebar Panel */}
                <div className="w-full md:w-64 shrink-0">
                  <UserProfileSidebar 
                    user={{
                      name: profileName || currentUser.displayName || "Dazeen Member",
                      email: currentUser.email || (profilePhone ? `+91 ${profilePhone}` : "Verified Coffee Member"),
                      avatarUrl: profileAvatar
                    }}
                    navItems={profileNavItems}
                    logoutItem={{
                      icon: <LogOut className="h-4 w-4 text-stone-500" />,
                      label: "Log out",
                      onClick: handleSignOut
                    }}
                    className="w-full"
                  />
                  
                  {/* Subtle decorative credit */}
                  <div className="mt-4 px-2 hidden md:block select-none text-left">
                    <p className="text-[8px] font-mono font-black uppercase tracking-widest text-[#B4942B]">
                      ☕ Western Ghats Grown
                    </p>
                    <p className="text-[7.5px] font-mono text-stone-400 font-bold leading-normal mt-0.5">
                      Premium shade-grown decaffeinated standards.
                    </p>
                  </div>
                </div>

                {/* Right Tab Content View Panel */}
                <div className="flex-1 min-w-0 bg-white rounded-2xl border border-stone-200/50 p-6 flex flex-col justify-between">
                  <div className="relative min-h-[340px]">
                    {activeProfileTab === "orders" && renderOrdersTab()}
                    {activeProfileTab === "reviews" && renderReviewsTab()}
                    {activeProfileTab === "addresses" && renderAddressesTab()}
                    {activeProfileTab === "viewed" && renderRecentlyViewedTab()}
                    {activeProfileTab === "favorites" && renderFavoritesTab()}
                    {activeProfileTab === "settings" && renderSettingsTab()}
                  </div>

                  {/* Return CTA */}
                  <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
                    <button
                      type="button"
                      onClick={onBackToHome}
                      className="px-6 py-2.5 bg-stone-900 text-white hover:bg-stone-850 font-black text-[10px] rounded-xl shadow-xs transition-transform cursor-pointer uppercase font-mono flex items-center justify-center gap-1.5"
                    >
                      Close Profile <ArrowRight className="w-3" />
                    </button>
                  </div>
                </div>
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
                      {loading ? "sending otp..." : "Request OTP Code"}
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                ) : (
                  <OTPVerification
                    emailOrPhone={`+91 ${phone}`}
                    expectedCode={generatedOtp}
                    onVerifySuccess={() => {
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

                      const isUserAdmin = false;

                      localStorage.setItem("dazeen_current_user", JSON.stringify(found));
                      localStorage.setItem("dazeen_user_is_admin", JSON.stringify(isUserAdmin));

                      onLoginSuccess(found, isUserAdmin);
                      setSuccessMsg("Phone verification successful! 🎉☕");
                    }}
                    onResendCode={async () => {
                      const code = Math.floor(1000 + Math.random() * 9000).toString();
                      try {
                        const response = await fetch('/api/send-otp?phone=' + phone + '&otpValue=' + code);
                        const dataText = await response.text();
                        let parsedData: any = {};
                        try { parsedData = JSON.parse(dataText); } catch (e) {}

                        if (parsedData.return === true || dataText.includes('"return":true') || dataText.includes("success")) {
                          setGeneratedOtp(code);
                          setSuccessMsg(`New OTP sent successfully!`);
                        } else {
                          setError(`Resend response: ${dataText || "Unresolvable server transmission check."}`);
                        }
                      } catch (err: any) {
                        setError(`Failed to resend: ${err?.message || err}`);
                      }
                    }}
                    onBackToEntry={() => {
                      setOtpSent(false);
                      setGeneratedOtp(null);
                      setError(null);
                      setSuccessMsg(null);
                    }}
                  />
                )}
              </div>
            )}



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
