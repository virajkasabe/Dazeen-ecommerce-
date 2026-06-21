import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Sparkles, User, ShieldCheck, Package, Home, FileText, Mail, Compass, HelpCircle, PhoneCall, Coffee } from "lucide-react";
import { CartItem } from "../types";
import { LiquidButton } from "./ui/liquid-glass-button";
import { BottomNavBar } from "./ui/bottom-nav-bar";
import { MenuToggleIcon } from "./ui/menu-toggle-icon";
import Switch from "./ui/switch";

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  currentUser: any;
  isAdmin: boolean;
  onOpenLogin: () => void;
  currentView: "main" | "login" | "tracking" | "admin" | "cart" | "terms" | "wholesale";
  onSetView: (v: "main" | "login" | "tracking" | "admin" | "cart" | "terms" | "wholesale") => void;
  onOpenContact?: () => void;
}

export default function Navbar({
  cart,
  onOpenCart,
  activeSection,
  onNavigate,
  currentUser,
  isAdmin,
  currentView,
  onSetView,
  onOpenContact,
}: NavbarProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  // Cool Auto-Hide & Show-on-Scroll-Stop Animation logic
  const [isNavbarVisible, setIsNavbarVisible] = useState<boolean>(true);
  const scrollTimeoutRef = useRef<any>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If we did scroll or are actively scrolling, hide it
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        setIsNavbarVisible(false);
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Show the bar back with animation once scroll stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsNavbarVisible(true);
      }, 400); // 400ms after the user stops scrolling, it gracefully animates back in

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Elegantly Polished Top Header - Made 100% pure white glassy & transparent */}
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: isNavbarVisible ? 0 : -100, opacity: isNavbarVisible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 25 }}
        className="sticky top-0 z-50 bg-transparent transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Top Logo */}
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer z-50" 
              onClick={() => {
                onSetView("main");
                onNavigate("hero");
              }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-stone-800/30 flex items-center justify-center shadow-lg shadow-stone-800/5 bg-white/40">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-800 animate-pulse" />
              </div>
              <span className="ml-2.5 font-serif font-black text-stone-700 text-sm tracking-wide hidden sm:inline-block">Dazeen Coffee</span>
            </div>

            {/* Middle Switch Container - always visible in the header */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/75 backdrop-blur-md border border-stone-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] z-50 select-none">
              <span className={`text-[10px] font-mono uppercase tracking-wider font-extrabold transition-colors ${currentView !== "wholesale" ? "text-stone-900" : "text-stone-400"}`}>
                Retail
              </span>
              <Switch 
                checked={currentView === "wholesale"}
                onChange={(checked) => {
                  if (checked) {
                    onSetView("wholesale");
                  } else {
                    onSetView("main");
                  }
                }}
              />
              <span className={`text-[10px] font-mono uppercase tracking-wider font-black transition-colors flex items-center gap-1.5 ${currentView === "wholesale" ? "text-emerald-650" : "text-stone-500"}`}>
                Wholesale <span className="bg-emerald-50 text-[8px] px-1.5 py-0.5 rounded text-emerald-700 font-extrabold hidden md:inline-block">Min 10 pkt / 1kg</span>
              </span>
            </div>

            {/* Desktop Navigation Links in the Center (Scroll anchors) */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9 z-50">
              {[
                { label: "Shop Our Blends", id: "blends" },
                { label: "Key Benefits", id: "why-dazeen" },
                { label: "Brew Assist", id: "brew-simulator" },
                { label: "Sleep & Savings", id: "savings-calc" },
              ].map((link) => {
                const active = activeSection === link.id && currentView === "main";
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      onSetView("main");
                      setTimeout(() => {
                        onNavigate(link.id);
                      }, 50);
                    }}
                    className={`text-[12px] font-bold tracking-widest uppercase transition-colors cursor-pointer ${
                      active
                        ? "text-stone-900 underline underline-offset-4 decoration-2 decoration-stone-800 font-extrabold"
                        : "text-stone-500/80 hover:text-stone-900"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Quick trust metrics on the right side */}
            <div className="flex items-center gap-2 sm:gap-4 z-50">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-stone-800/5 text-stone-600 border border-stone-800/15 shadow-xs uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#5E0ED7] animate-pulse" />
                <span>₹ INR Store</span>
              </span>
              
              {/* Animated Hamburger Toggle Button */}
              <button
                id="hamburger-menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-xl bg-white/80 border border-stone-200 hover:border-stone-400 flex items-center justify-center text-stone-800 hover:text-stone-950 transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Toggle navigation menu"
              >
                <MenuToggleIcon open={menuOpen} className="w-5 h-5" duration={400} />
              </button>
            </div>

          </div>
        </div>
      </motion.header>

      {/* Premium Apple-style sliding down navigation drawer menu (half page height, white background, black text) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Smooth Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-stone-950/30 z-40 backdrop-blur-xs cursor-pointer"
            />

            {/* Top-down sliding White Panel (approx half page height) */}
            <motion.div
              id="top-sliding-apple-drawer"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 right-0 h-[52vh] min-h-[460px] max-h-[580px] bg-white border-b border-stone-200/80 shadow-[0_15px_40px_rgba(0,0,0,0.06)] z-50 pt-24 pb-6 overflow-y-auto"
            >
              <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full h-full flex flex-col justify-between">
                
                {/* Visual Header / Brand Label */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4 select-none">
                  <div className="flex items-center text-stone-400">
                    <div className="w-4 h-4 rounded-full border border-stone-200/50 flex items-center justify-center bg-stone-50 mr-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-600" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] font-extrabold text-stone-500">Boutique Directory</span>
                  </div>
                  
                  {/* Quick close button in panel */}
                  <button 
                    onClick={() => setMenuOpen(false)}
                    className="text-[10px] font-mono font-black uppercase tracking-wider text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-1 cursor-pointer bg-stone-50 px-3 py-1 rounded-full border border-stone-100"
                  >
                    <span>✕ Close</span>
                  </button>
                </div>

                {/* Primary Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-6">
                  {/* Left Column: Core Navigation Links */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono font-black tracking-widest text-[#5E0ED7] uppercase block">
                      Explore Dazeen Space
                    </span>
                    <div className="flex flex-col gap-1">
                      {[
                        {
                          label: "Home",
                          desc: "Return to central estate presentation",
                          icon: Home,
                          action: () => {
                            setMenuOpen(false);
                            onSetView("main");
                            onNavigate("hero");
                          },
                        },
                        {
                          label: "Shop Dazeen Blends",
                          desc: "Browse certified pure filter roasts",
                          icon: Coffee,
                          action: () => {
                            setMenuOpen(false);
                            onSetView("main");
                            setTimeout(() => onNavigate("blends"), 60);
                          },
                        },
                        {
                          label: "Our Story",
                          desc: "Learn about our Western Ghats shade-grown family estates",
                          icon: Compass,
                          action: () => {
                            setMenuOpen(false);
                            localStorage.setItem("dazeen_terms_active_tab", "privacy");
                            onSetView("terms");
                          },
                        },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={item.action}
                          className="flex items-start gap-4 p-2.5 rounded-2xl hover:bg-stone-50 transition-all text-left group cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-stone-50 text-stone-800 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all duration-300">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-sans font-extrabold text-stone-900 group-hover:text-[#5E0ED7] transition-colors">
                              {item.label}
                            </h4>
                            <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Policies & Assistance */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono font-black tracking-widest text-emerald-700 uppercase block">
                      Policy & Sourcing Terms
                    </span>
                    <div className="flex flex-col gap-1">
                      {[
                        {
                          label: "Terms & Sourcing Policy",
                          desc: "Official boutique quality specifications and criteria",
                          icon: FileText,
                          action: () => {
                            setMenuOpen(false);
                            localStorage.setItem("dazeen_terms_active_tab", "terms");
                            onSetView("terms");
                          },
                        },
                        {
                          label: "Refund Policy Safeguard",
                          desc: "100% replacement / refund for wrong or spoiled packs",
                          icon: ShieldCheck,
                          action: () => {
                            setMenuOpen(false);
                            localStorage.setItem("dazeen_terms_active_tab", "refund");
                            onSetView("terms");
                          },
                        },
                        {
                          label: "Contact Support Desk",
                          desc: "Connect instantly with our Pune dispatchers or live support",
                          icon: Mail,
                          action: () => {
                            setMenuOpen(false);
                            if (onOpenContact) {
                              onOpenContact();
                            }
                          },
                        },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={item.action}
                          className="flex items-start gap-4 p-2.5 rounded-2xl hover:bg-stone-50 transition-all text-left group cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-stone-50 text-stone-800 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all duration-300">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-sans font-extrabold text-stone-900 group-hover:text-emerald-700 transition-colors">
                              {item.label}
                            </h4>
                            <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer block of sliding panel */}
                <div className="border-t border-stone-100 pt-3 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase font-mono tracking-wider text-stone-400 gap-2">
                  <span className="font-semibold text-center sm:text-left select-none">
                    © 2026 Dazeen Specialty Filter Roasters • Pune, MH
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-extrabold select-none">
                    <Sparkles className="w-3.5 h-3.5" /> Handcrafted Purity
                  </span>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Bottom Pill-shaped Navigation Bar - Glassy Expandable Design */}
      {isNavbarVisible && (
        <BottomNavBar
          items={[
            {
              name: "Home",
              icon: Home,
              onClick: (e) => {
                e.stopPropagation();
                onSetView("main");
                onNavigate("hero");
              },
            },
            {
              name: "Order",
              icon: Package,
              onClick: (e) => {
                e.stopPropagation();
                onSetView("tracking");
              },
            },
            {
              name: "Cart",
              icon: ShoppingCart,
              onClick: (e) => {
                e.stopPropagation();
                onSetView("cart");
              },
              badge: totalItems > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-stone-950 text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center font-mono ring-1 ring-white leading-none shadow-sm">
                  {totalItems}
                </span>
              ) : null,
            },
            {
              name: currentUser ? currentUser.displayName?.split(" ")[0] || "Profile" : "Profile",
              icon: User,
              onClick: (e) => {
                e.stopPropagation();
                onSetView("login");
              },
            },
            ...(isAdmin
              ? [
                  {
                    name: "Admin",
                    icon: ShieldCheck,
                    onClick: (e: React.MouseEvent) => {
                      e.stopPropagation();
                      onSetView("admin");
                    },
                  },
                ]
              : []),
          ]}
          activeTab={
            currentView === "main"
              ? "Home"
              : currentView === "tracking"
              ? "Order"
              : currentView === "cart"
              ? "Cart"
              : currentView === "login"
              ? (currentUser ? currentUser.displayName?.split(" ")[0] || "Profile" : "Profile")
              : currentView === "admin"
              ? "Admin"
              : "Home"
          }
        />
      )}
    </>
  );
}
