import { useState, useEffect } from "react";
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

  // Scroll Shrinking State for the bottom Navigation bar ("agr navigation bar 10 size ka h scroll down krne pr 4 ho jaye aur touch pr vapas 10 ho jaye")
  const [isShrunk, setIsShrunk] = useState<boolean>(false);
  const [userExpanded, setUserExpanded] = useState<boolean>(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 120 && currentScrollY > lastScrollY) {
        // Scrolling down - shrink bottom bar
        setIsShrunk(true);
      } else if (currentScrollY === 0 || currentScrollY < lastScrollY - 10) {
        // Scrolling up or at top - restore bottom bar
        setIsShrunk(false);
        setUserExpanded(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shouldCollapse = isShrunk && !userExpanded;

  return (
    <>
      {/* Elegantly Polished Top Header for Branding, Navigation & Utilities */}
      <header className="sticky top-0 z-50 bg-coffee-50/85 backdrop-blur-md border-b border-coffee-100">
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
              <div className="w-8 h-8 rounded-full border-2 border-[#5E0ED7] flex items-center justify-center shadow-lg shadow-[#5E0ED7]/15">
                <div className="w-2.5 h-2.5 rounded-full bg-[#5E0ED7]" />
              </div>
              <span className="ml-2.5 font-serif font-bold text-coffee-950 text-sm tracking-wide hidden sm:inline-block">Dazeen Coffee</span>
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
                        ? "text-[#5E0ED7]"
                        : "text-coffee-900 hover:text-[#5E0ED7]"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Quick trust metrics on the right side */}
            <div className="flex items-center gap-2 sm:gap-3 z-50">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-coffee-100 text-coffee-800 border border-coffee-200 shadow-xs uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#5E0ED7] animate-pulse" />
                <span>₹ INR Store</span>
              </span>
            </div>

          </div>
        </div>
      </header>      {/* Floating Bottom Pill-shaped Navigation Bar - Normal, static size with zero animations */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none max-w-[calc(100vw-32px)]">
        <div
          style={{ width: "380px" }}
          className="bg-coffee-950/92 backdrop-blur-xl border border-coffee-800 shadow-2xl shadow-coffee-950/50 rounded-[100px] overflow-hidden p-1.5 max-w-full"
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
                  ? "bg-[#FAF6F0] text-coffee-950 font-extrabold shadow-sm"
                  : "text-coffee-300 hover:text-white"
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
                  ? "bg-accent-gold text-coffee-950 font-extrabold shadow-sm"
                  : "text-coffee-300 hover:text-white"
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
                  ? "bg-purple-600 text-white font-extrabold shadow-sm"
                  : "text-coffee-300 hover:text-white"
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-inherit" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Cart</span>
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-3 bg-red-500 text-white text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center font-mono ring-1 ring-coffee-950">
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
                  ? "bg-[#FAF6F0] text-coffee-950 font-extrabold shadow-sm"
                  : "text-coffee-300 hover:text-white"
              }`}
            >
              <User className="w-4 h-4 text-inherit" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-bold max-w-[60px] truncate">
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
                    ? "bg-amber-500 text-coffee-950 font-extrabold shadow-sm"
                    : "text-amber-400 hover:text-amber-350"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-inherit" />
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Admin</span>
              </button>
            )}

          </nav>
        </div>
      </div>
    </>
  );
}
