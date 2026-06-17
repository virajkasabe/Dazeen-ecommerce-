import { useState, useEffect, useMemo, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ShieldAlert, Heart, HelpCircle, Mail, Send, CheckCircle, Sparkles, MapPin, Moon, Award } from "lucide-react";

import { Product, CartItem } from "./types";
import { PRODUCTS, REVIEWS } from "./data";

import Navbar from "./components/Navbar";
import PortfolioHero from "./components/PortfolioHero";
import ProductCard from "./components/ProductCard";
import BrewSimulator from "./components/BrewSimulator";
import BenefitsSection from "./components/BenefitsSection";
import AboutMe from "./components/AboutMe";
import FeedbackSlider from "./components/FeedbackSlider";
import Footer from "./components/Footer";

// Local storage-backed offline user and products state
import LoginPage from "./components/LoginPage";
import OrderTrackingPage from "./components/OrderTrackingPage";
import AdminPanel from "./components/AdminPanel";
import CartPage from "./components/CartPage";

export default function App() {
  // Authentication & View Routing State
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem("dazeen_current_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const savedAdmin = localStorage.getItem("dazeen_user_is_admin");
    return savedAdmin ? JSON.parse(savedAdmin) : false;
  });
  const [currentView, setCurrentView] = useState<"main" | "login" | "tracking" | "admin" | "cart">("main");
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProds = localStorage.getItem("dazeen_products_cache_v1");
    return savedProds ? JSON.parse(savedProds) : PRODUCTS;
  });

  const [heroImages, setHeroImages] = useState<any[]>(() => {
    const saved = localStorage.getItem("dazeen_hero_images_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { src: "https://kommodo.ai/i/jLktjgtoIAYIfU0kG88j", bg: "#F4845F", panel: "#F79B7F" },
      { src: "https://kommodo.ai/i/VJoWZ2NV2Ot6pkP0uheV", bg: "#6BBF7A", panel: "#85CC92" },
      { src: "https://kommodo.ai/i/jLktjgtoIAYIfU0kG88j", bg: "#F4845F", panel: "#F79B7F" },
      { src: "https://kommodo.ai/i/VJoWZ2NV2Ot6pkP0uheV", bg: "#6BBF7A", panel: "#85CC92" },
    ];
  });

  // Cart State connected to LocalStorage for offline persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("dazeen_cart_cache_v1");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [roastFilter, setRoastFilter] = useState<string>("All");

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState<boolean>(false);

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem("dazeen_cart_cache_v1", JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Safe smooth navigate & section intersection setup
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Monitor screen scrolling to update active Navbar highlight
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "blends", "savings-calc", "brew-simulator", "why-decaf"];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter Products based on chosen tab
  const filteredProducts = useMemo(() => {
    if (roastFilter === "All") return products;
    if (roastFilter === "Medium") return products.filter((p) => p.roastLevel === "Medium");
    if (roastFilter === "Dark") return products.filter((p) => p.roastLevel === "Dark");
    if (roastFilter === "Gourmet") return products.filter((p) => p.id.includes("hazelnut") || p.id.includes("irish"));
    return products;
  }, [roastFilter, products]);

  // Handle Newsletter Subscribe
  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsNewsletterSubmitted(true);
    setNewsletterEmail("");
    setTimeout(() => setIsNewsletterSubmitted(false), 5000);
  };

  const lazyLoadCartDrawer = async () => {
    // Dynamically imported when opened or predefined
    const { default: CartDrawer } = await import("./components/CartDrawer");
    return CartDrawer;
  };

  // Pre-load component at state level
  const [CartDrawerComp, setCartDrawerComp] = useState<any>(null);
  useEffect(() => {
    lazyLoadCartDrawer().then((comp) => setCartDrawerComp(() => comp));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] selection:bg-[#C5A880]/30 selection:text-coffee-950 antialiased overflow-x-hidden">
      
      {/* Standard Header Navigation (Rendered everywhere for a seamless sticky top header and bottom pill-shaped bar!) */}
      <Navbar
        cart={cart}
        onOpenCart={() => setCurrentView("cart")}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onOpenLogin={() => setCurrentView("login")}
        currentView={currentView}
        onSetView={setCurrentView}
      />

      {/* Main Core Content Sections */}
      <main className="flex-grow">
        
        {currentView === "main" && (
          <>
            {/* Fully Immersive Video Portfolio Hero Section */}
            <PortfolioHero 
              onScrollToSection={handleNavigate} 
              onSetView={setCurrentView} 
              currentUser={currentUser} 
              onOpenLogin={() => setCurrentView("login")} 
            />

        {/* Dynamic Decaf Products Area */}
        <section id="blends" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 border-b border-coffee-200/60 pb-8 mb-12">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-accent-darkgold font-bold">
                Boutique Coffee Inventory
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-coffee-950 mt-1">
                Explore Dazeen Premium Blends ☕🫙
              </h2>
              <p className="text-coffee-600 text-xs mt-1">
                Shade-grown, hand-harvested beans, clean water-decaffeinated without hazardous chemistry.
              </p>
            </div>

            {/* Premium Filtering Buttons */}
            <div className="flex flex-wrap gap-2 pt-4 md:pt-0">
              {["All", "Medium", "Dark", "Gourmet"].map((tab) => {
                const active = roastFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setRoastFilter(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                      active
                        ? "bg-coffee-900 text-[#FAF6F0] shadow-md border-coffee-900"
                        : "bg-white text-coffee-700 border border-coffee-250 hover:bg-coffee-100/50"
                    }`}
                  >
                    {tab === "All" ? "All Blends" : tab === "Gourmet" ? "Gourmet Flavoured" : `${tab} Roast`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Grid Cards Showcase */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

        </section>

        {/* Barista Virtual Brewing Guide and Timer */}
        <BrewSimulator />

        {/* Scientific Comparison & Caffeine-Free benefits section */}
        <div id="why-decaf">
          <BenefitsSection />
        </div>

        {/* About Me Section - Focuses on Dazeen's values & progressive scroll reveal */}
        <div id="about-us">
          <AboutMe />
        </div>

        {/* Customer Testimonials Carousel section */}
        <FeedbackSlider />
      </>
    )}

        {currentView === "login" && (
          <LoginPage
            onBackToHome={() => setCurrentView("main")}
            onLoginSuccess={(user, isUserAdmin) => {
              setCurrentUser(user);
              setIsAdmin(isUserAdmin);
              if (isUserAdmin) {
                setCurrentView("admin");
              } else {
                setCurrentView("main");
              }
            }}
            currentUser={currentUser}
            isAdmin={isAdmin}
          />
        )}

        {currentView === "tracking" && (
          <OrderTrackingPage
            currentUser={currentUser}
            onOpenLogin={() => setCurrentView("login")}
          />
        )}

        {currentView === "admin" && (
          <AdminPanel
            currentUser={currentUser}
            onProductsUpdated={(newProds) => setProducts(newProds)}
            heroImages={heroImages}
            onHeroImagesUpdated={(updated) => setHeroImages(updated)}
          />
        )}

        {currentView === "cart" && (
          <CartPage
            cart={cart}
            currentUser={currentUser}
            onOpenLogin={() => setCurrentView("login")}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onSetView={setCurrentView}
          />
        )}

      </main>

      {/* Brand Footer - Shown only on Home screen */}
      {currentView === "main" && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Dynamic Slide-in Shopping Cart Drawer */}
      {CartDrawerComp && (
        <CartDrawerComp
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          currentUser={currentUser}
          onOpenLogin={() => setCurrentView("login")}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />
      )}

    </div>
  );
}

