import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Sparkles, User, ShieldCheck, Package, Home } from "lucide-react";
import { CartItem } from "../types";

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  currentUser: any;
  isAdmin: boolean;
  onOpenLogin: () => void;
  currentView: "main" | "login" | "tracking" | "admin" | "cart";
  onSetView: (v: "main" | "login" | "tracking" | "admin" | "cart") => void;
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
}: NavbarProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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
            <div className="flex items-center gap-2 sm:gap-3 z-50">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-stone-800/5 text-stone-600 border border-stone-800/15 shadow-xs uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#5E0ED7] animate-pulse" />
                <span>₹ INR Store</span>
              </span>
            </div>

          </div>
        </div>
      </motion.header>

      {/* Floating Bottom Pill-shaped Navigation Bar - Glassy Pure White Design */}
      <motion.div
        initial={{ y: 0, opacity: 1, x: "-50%" }}
        animate={{ y: isNavbarVisible ? 0 : 120, opacity: isNavbarVisible ? 1 : 0, x: "-50%" }}
        transition={{ type: "spring", stiffness: 220, damping: 25 }}
        className="fixed bottom-6 left-1/2 z-50 select-none max-w-[calc(100vw-32px)]"
      >
        <div
          style={{ width: "380px" }}
          className="bg-white/75 backdrop-blur-xl border border-white/40 shadow-2xl shadow-stone-950/5 rounded-[100px] overflow-hidden p-1.5 max-w-full"
        >
          <nav className="flex items-center justify-around">
            
            {/* Home Option */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetView("main");
                onNavigate("hero");
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-full transition-all cursor-pointer ${
                currentView === "main"
                  ? "bg-white text-stone-950 font-extrabold shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Home className="w-4 h-4 text-inherit" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Home</span>
            </button>
            
            {/* Order Option */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetView("tracking");
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-full transition-all cursor-pointer ${
                currentView === "tracking"
                  ? "bg-white text-stone-950 font-extrabold shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Package className="w-4 h-4 text-inherit" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Order</span>
            </button>

            {/* Cart Option */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetView("cart");
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-full transition-all cursor-pointer relative ${
                currentView === "cart"
                  ? "bg-white text-stone-950 font-extrabold shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-inherit" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Cart</span>
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-3 bg-red-500 text-white text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center font-mono ring-1 ring-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Profile Option */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetView("login");
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-full transition-all cursor-pointer ${
                currentView === "login"
                  ? "bg-white text-stone-950 font-extrabold shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <User className="w-4 h-4 text-inherit" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-bold max-w-[60px] truncate block">
                {currentUser ? currentUser.displayName?.split(" ")[0] || "Profile" : "Profile"}
              </span>
            </button>

            {/* Admin Console (Only visible if isAdmin is true) */}
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSetView("admin");
                }}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-full transition-all cursor-pointer ${
                  currentView === "admin"
                    ? "bg-amber-400 text-stone-950 font-extrabold shadow-sm"
                    : "text-stone-500 hover:text-stone-900 font-extrabold"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-inherit" />
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Admin</span>
              </button>
            )}

          </nav>
        </div>
      </motion.div>
    </>
  );
}
