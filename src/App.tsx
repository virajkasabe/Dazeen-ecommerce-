import { useState, useEffect, useMemo, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ShieldAlert, Heart, HelpCircle, Mail, Send, CheckCircle, Sparkles, MapPin, Moon, Award, Bell, X, Coffee } from "lucide-react";

import { Product, CartItem } from "./types";
import { PRODUCTS, REVIEWS } from "./data";

import Navbar from "./components/Navbar";
import PortfolioHero from "./components/PortfolioHero";
import ProductSlider from "./components/ProductSlider";
import ProductDetailsModal from "./components/ProductDetailsModal";
import BrewSimulator from "./components/BrewSimulator";
import { DisplayCardsDemo } from "./components/ui/display-cards-demo";
import { RadialOrbitalTimelineDemo } from "./components/ui/radial-orbital-timeline-demo";
import { TestimonialsDemo } from "./components/ui/testimonials-columns-demo";
import BenefitsSection from "./components/BenefitsSection";
import AboutMe from "./components/AboutMe";
import Footer from "./components/Footer";


// Local storage-backed offline user and products state
import LoginPage from "./components/LoginPage";
import OrderTrackingPage from "./components/OrderTrackingPage";
import AdminPanel from "./components/AdminPanel";
import CartPage from "./components/CartPage";
import TermsPage from "./components/TermsPage";
import ContactModal from "./components/ContactModal";
import { Select, SelectOption } from "./components/ui/animated-select-1";

import { notificationService } from "./utils/notifications";

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
  const [currentView, setCurrentView] = useState<"main" | "login" | "tracking" | "admin" | "cart" | "terms">("main");
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProds = localStorage.getItem("dazeen_products_cache_v1");
    return savedProds ? JSON.parse(savedProds) : PRODUCTS;
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  // Marketing Notification Permission State
  const [notifPermission, setNotifPermission] = useState<any>(() => {
    if (typeof window !== "undefined") {
      return "Notification" in window ? Notification.permission : "denied";
    }
    return "default";
  });
  const [showPermissionBanner, setShowPermissionBanner] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already made a decision, else prompt with a pretty banner
    const hasPrompted = localStorage.getItem("dazeen_prompted_push");
    if (!hasPrompted && notifPermission !== "granted") {
      const timer = setTimeout(() => {
        setShowPermissionBanner(true);
      }, 4000); // show a graceful prompt banner after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [notifPermission]);

  // Automatically start the witty marketing intervals
  useEffect(() => {
    notificationService.startMarketingEngine();

    return () => {
      notificationService.stopMarketingEngine();
    };
  }, []);

  const handleRequestPush = async () => {
    localStorage.setItem("dazeen_prompted_push", "true");
    setShowPermissionBanner(false);
    
    const granted = await notificationService.requestPermission();
    if (granted) {
      setNotifPermission("granted");
      notificationService.send("Push Registered Successfully! 📦💖", "You are subscribed to Dazeen updates & our special 1m spicy alerts!");
    } else {
      setNotifPermission("denied");
    }
  };

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

  // Handle live global updates: sync cart item product objects with currently active stateful products
  useEffect(() => {
    let changed = false;
    const syncedCart = cart.map((item) => {
      const match = products.find((p) => p.id === item.product.id);
      if (match) {
        if (
          match.price !== item.product.price ||
          match.name !== item.product.name ||
          match.image !== item.product.image ||
          match.tagline !== item.product.tagline
        ) {
          changed = true;
          return { ...item, product: match };
        }
      }
      return item;
    }).filter((item) => {
      const exists = products.some((p) => p.id === item.product.id);
      if (!exists) {
        changed = true;
      }
      return exists;
    });

    if (changed) {
      setCart(syncedCart);
    }
  }, [products]);

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
      const sections = ["hero", "blends", "savings-calc", "brew-simulator", "why-dazeen"];
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
        onOpenContact={() => setShowContactModal(true)}
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

        {/* Dynamic Craft Products Area */}
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
                Shade-grown, hand-harvested beans, clean pure-water purified without hazardous chemistry.
              </p>
            </div>

            {/* Premium Filtering Select Dropdown */}
            <div className="pt-4 md:pt-0 z-10 relative">
              <Select value={roastFilter} setValue={setRoastFilter} placeholder="Filter Coffee Blends">
                <SelectOption value="All">All Blends</SelectOption>
                <SelectOption value="Medium">Medium Roast</SelectOption>
                <SelectOption value="Dark">Dark Roast</SelectOption>
                <SelectOption value="Gourmet">Gourmet Flavoured</SelectOption>
              </Select>
            </div>
          </div>

          {/* Core Grid Cards Showcase with Interactive Sliding Layout */}
          <ProductSlider
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onShowDetails={(p) => {
              setSelectedProduct(p);
              setIsDetailsModalOpen(true);
            }}
          />

        </section>

        {/* Interactive Feature Philosophy Display Cards */}
        <DisplayCardsDemo />

        {/* Barista Virtual Brewing Guide and Timer */}
        <BrewSimulator />

        {/* Radial Orbital Timeline depicting Dazeen's journey, milestones, and active update */}
        <RadialOrbitalTimelineDemo />

        {/* Scientific Comparison & Caffeine-Free benefits section */}
        <div id="why-dazeen">
          <BenefitsSection />
        </div>

        {/* About Me Section - Focuses on Dazeen's values & progressive scroll reveal */}
        <div id="about-us">
          <AboutMe onContactClick={() => setShowContactModal(true)} />
        </div>

        {/* Customer Testimonials Column section */}
        <TestimonialsDemo />
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

        {currentView === "terms" && (
          <TermsPage
            onBackToHome={() => setCurrentView("main")}
          />
        )}

      </main>

      {/* Global Contact Us Overlay Modal */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />

      {/* Brand Footer - Shown only on Home screen */}
      {currentView === "main" && (
        <Footer onNavigate={handleNavigate} onSetView={setCurrentView} />
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



      {/* Product Details Modal (Inform Page) */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Floating Permission Bar - Pure minimal look */}
      <AnimatePresence>
        {showPermissionBanner && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="fixed bottom-24 left-4 right-4 z-[9999] max-w-md mx-auto bg-white border border-stone-200 shadow-2xl rounded-2xl p-5 text-left flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <Bell className="w-5 h-5 animate-swing" />
              </div>
              <div>
                <h4 className="text-sm font-black text-stone-900">Enable Special Alerts?</h4>
                <p className="text-[11px] text-stone-500">Get order tracking milestones & crazy 1-minute updates!</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-1">
              <button
                onClick={() => {
                  localStorage.setItem("dazeen_prompted_push", "true");
                  setShowPermissionBanner(false);
                }}
                className="px-3.5 py-1.5 text-xs text-stone-500 hover:text-stone-850 font-bold bg-stone-50 rounded-lg cursor-pointer"
              >
                Not Now
              </button>
              <button
                onClick={handleRequestPush}
                className="px-4 py-1.5 text-xs text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer font-black"
              >
                Allow Updates
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

