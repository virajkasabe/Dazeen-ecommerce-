import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Sparkles, User, ShieldCheck, Package, Home, FileText, Mail, Compass, HelpCircle, PhoneCall, Coffee } from "lucide-react";
import { CartItem } from "../types";
import { LiquidButton } from "./ui/liquid-glass-button";
import { BottomNavBar } from "./ui/bottom-nav-bar";
import { MenuToggleIcon } from "./ui/menu-toggle-icon";

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  currentUser: any;
  isAdmin: boolean;
  onOpenLogin: () => void;
  currentView: "main" | "login" | "tracking" | "admin" | "cart" | "terms";
  onSetView: (v: "main" | "login" | "tracking" | "admin" | "cart" | "terms") => void;
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

      {/* 40% height Sliding Down Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-stone-950/25 z-30 pointer-events-auto backdrop-blur-xs"
            />
            
            {/* Sliding Panel */}
            <motion.div
              id="sliding-hamburger-drawer"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 180 }}
              className="fixed top-0 left-0 right-0 h-[42vh] min-h-[350px] bg-[#FAF6F0] border-b border-coffee-200/80 shadow-2xl z-40 pt-24 pb-6 px-6 sm:px-12 flex flex-col justify-between overflow-y-auto"
            >
              {/* Grid content */}
              <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Left side column: Primary navigational items */}
                <div className="space-y-4">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#5E0ED7] uppercase block">
                    Boutique Menu & Support
                  </span>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onSetView("main");
                        setTimeout(() => onNavigate("blends"), 100);
                      }}
                      className="flex items-center gap-2.5 text-stone-800 hover:text-[#5E0ED7] font-serif font-black text-lg tracking-tight text-left transition-colors cursor-pointer"
                    >
                      <Coffee className="w-4 h-4 text-[#5E0ED7]" />
                      Explore Specialty Blends
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onSetView("terms");
                      }}
                      className="flex items-center gap-2.5 text-stone-800 hover:text-[#5E0ED7] font-serif font-black text-lg tracking-tight text-left transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Terms & Sourcing Specifications
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        if (onOpenContact) {
                          onOpenContact();
                        }
                      }}
                      className="flex items-center gap-2.5 text-stone-800 hover:text-[#5E0ED7] font-serif font-black text-lg tracking-tight text-left transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-amber-500" />
                      Contact Us / Live Inquiry Support
                    </button>
                  </div>
                </div>

                {/* Right side column: Brand statements or instant trust factors */}
                <div className="p-5 bg-white/60 border border-coffee-200/40 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5E0ED7] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
                      Quality Standards
                    </span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-coffee-950">
                    100% Sourced Organic Guarantee
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Our Western Ghats estates shade-grow each coffee berry naturally. Filter processing is fully pure-water purified, with 0% chemical trace residues on test labs.
                  </p>
                  <p className="text-[10px] font-mono text-zinc-400">
                    Pune, MH • Call: +91 98345 00977
                  </p>
                </div>
              </div>

              {/* Minimalist lower edge bar */}
              <div className="max-w-7xl mx-auto w-full border-t border-coffee-200/50 pt-4 flex justify-between items-center text-[10px] uppercase font-mono tracking-widest text-stone-400">
                <span>© 2026 Dazeen Specialty Filter Roasters</span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> Handcrafted Purity
                </span>
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
