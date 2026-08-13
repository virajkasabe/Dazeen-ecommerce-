import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Leaf,
  Sparkles,
  ArrowLeft,
  Check,
  Minus,
  Plus,
  Droplets,
  Sun,
  Snowflake,
  ShieldCheck,
  Flower2,
  Timer,
  Ban,
} from "lucide-react";
import { Product } from "../types";

interface BlueTeaPageProps {
  onBackToHome: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onGoToCart: () => void;
}

// ---- Pack size data (placeholder pricing — update once finalised) ----
interface PackOption {
  id: string;
  size: string;
  weight: string;
  price: number;
  mrp?: number;
  badge?: string;
}

const PACK_OPTIONS: PackOption[] = [
  { id: "blue-tea-25g", size: "25g", weight: "Approx. 40–50 cups", price: 149, mrp: 179 },
  { id: "blue-tea-50g", size: "50g", weight: "Approx. 80–100 cups", price: 249, mrp: 299, badge: "Most Popular" },
  { id: "blue-tea-100g", size: "100g", weight: "Approx. 160–200 cups", price: 399, mrp: 499, badge: "Best Value" },
];

const KEY_BENEFITS: { icon: any; title: string }[] = [
  { icon: Ban, title: "Naturally caffeine-free" },
  { icon: ShieldCheck, title: "Rich in natural antioxidants" },
  { icon: Droplets, title: "Refreshing & soothing herbal beverage" },
  { icon: Sparkles, title: "Naturally vibrant blue colour" },
  { icon: Sun, title: "Enjoy hot or iced" },
  { icon: Flower2, title: "No artificial colour added" },
];

const PRODUCT_HIGHLIGHTS: string[] = [
  "100% Natural Butterfly Pea Flowers",
  "Caffeine-Free",
  "No Artificial Colours",
  "No Added Preservatives",
  "Premium Quality",
  "Suitable for Hot & Cold Brewing",
];

const PREP_STEPS: { title: string; content: string }[] = [
  { title: "Add powder", content: "Add ½–1 teaspoon of Blue Tea Powder to 150–200 ml of hot water." },
  { title: "Mix well", content: "Mix well until the powder is completely blended." },
  { title: "Steep", content: "Let it steep for 2–3 minutes." },
  { title: "Enjoy", content: "Enjoy it hot or chilled." },
  { title: "Customise", content: "Add lemon or honey as per your taste." },
];

export default function BlueTeaPage({ onBackToHome, onAddToCart, onGoToCart }: BlueTeaPageProps) {
  const [selectedPack, setSelectedPack] = useState<PackOption>(PACK_OPTIONS[1]);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const handleBuyNow = (goToCart: boolean) => {
    const blueTeaProduct: Product = {
      id: selectedPack.id,
      name: `Blue Tea — ${selectedPack.size} Pack`,
      tagline: "Natural Blue Pea Flower Tea, caffeine-free and refreshing.",
      description:
        "Our Blue Tea is made from naturally sourced Butterfly Pea Flowers, known for their beautiful natural blue colour and refreshing taste. A simple, caffeine-free herbal tea that can be enjoyed hot or cold.",
      price: selectedPack.price,
      rating: 4.8,
      reviewsCount: 96,
      image:
        "https://images.unsplash.com/photo-1708455398647-9f79425512fa?auto=format&fit=crop&q=80&w=600",
      roastLevel: "Light",
      aromaProfile: ["Delicate Floral", "Fresh Herbal", "Earthy Sweetness"],
      benefits: ["Caffeine-Free", "Rich in Antioxidants", "Soothing Herbal Sip", "No Artificial Colour"],
      origin: "Naturally Sourced Butterfly Pea Farms",
      process: "Sun-Dried Whole Butterfly Pea Flowers",
      caffeineCount: "0.0% Caffeine",
    };

    onAddToCart(blueTeaProduct, quantity);

    if (goToCart) {
      onGoToCart();
      return;
    }

    setAddedMessage(`Added ${quantity} × Blue Tea (${selectedPack.size}) to your cart!`);
    setTimeout(() => setAddedMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-coffee-50 selection:bg-[#1D5FD1]/10 text-coffee-950 pb-24 md:pb-32 pt-28 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-2 text-xs font-mono font-black uppercase text-coffee-500 hover:text-coffee-950 transition-colors bg-coffee-100 hover:bg-coffee-200/80 px-4 py-2 rounded-full cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Retail Store</span>
          </button>
        </div>

        {/* Added-to-cart banner */}
        <AnimatePresence>
          {addedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-sans font-bold rounded-2xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{addedMessage}</span>
              </div>
              <button
                onClick={onGoToCart}
                className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 hover:text-emerald-950 px-2.5 py-1 bg-white/60 rounded-lg font-black"
              >
                View Cart
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO: banner image + product info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">

          {/* Product banner image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-coffee-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.04)] aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] bg-coffee-100">
              <img
                src="https://images.unsplash.com/photo-1708455398647-9f79425512fa?auto=format&fit=crop&q=80&w=900"
                alt="Blue Tea — Butterfly Pea Flower Tea"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                <Leaf className="w-3.5 h-3.5 text-[#1D5FD1]" />
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-coffee-900">
                  100% Natural
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-coffee-950/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider">
                  Caffeine-Free
                </span>
              </div>
            </div>
          </div>

          {/* Product info + purchase panel */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 text-[#1D5FD1] mb-1 font-mono text-[10px] font-extrabold uppercase tracking-widest">
              <Flower2 className="w-4 h-4" />
              <span>Natural Herbal Wellness Tea</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-coffee-950 mt-1">
              Blue Tea
            </h1>
            <p className="text-sm sm:text-base font-sans font-bold text-[#1D5FD1] mt-1">
              Natural Blue Pea Flower Tea
            </p>
            <p className="text-coffee-600 text-sm sm:text-base mt-3 leading-relaxed">
              Our Blue Tea is made from naturally sourced Butterfly Pea Flowers, known for their
              beautiful natural blue colour and refreshing taste. A simple, caffeine-free herbal tea
              that can be enjoyed hot or cold.
            </p>

            {/* Quick benefit chips */}
            <div className="flex flex-wrap gap-2 mt-5">
              {["Caffeine-Free", "Antioxidant Rich", "Hot or Iced", "No Artificial Colour"].map((chip) => (
                <span
                  key={chip}
                  className="text-[10px] font-mono font-bold uppercase tracking-wide text-[#1D5FD1] bg-[#1D5FD1]/[0.07] border border-[#1D5FD1]/15 px-3 py-1.5 rounded-full"
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* Pack size selector */}
            <div className="mt-8 bg-white border border-coffee-200/80 rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-sans font-extrabold uppercase tracking-wide text-coffee-800 mb-4">
                Available Packs
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {PACK_OPTIONS.map((pack) => {
                  const isSelected = selectedPack.id === pack.id;
                  return (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedPack(pack)}
                      className={`relative text-center p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#1D5FD1] bg-[#1D5FD1]/[0.04] ring-2 ring-[#1D5FD1]/20"
                          : "border-coffee-200/70 hover:border-coffee-300 bg-white"
                      }`}
                    >
                      {pack.badge && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-mono font-black uppercase tracking-wide bg-coffee-950 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                          {pack.badge}
                        </span>
                      )}
                      <p className="text-sm sm:text-base font-black text-coffee-950 mt-1">{pack.size}</p>
                      <p className="text-[9px] text-coffee-500 mt-0.5 leading-tight">{pack.weight}</p>
                      <div className="mt-2 flex items-baseline justify-center gap-1">
                        <span className="font-mono text-sm font-black text-coffee-950">₹{pack.price}</span>
                        {pack.mrp && (
                          <span className="font-mono text-[10px] text-coffee-400 line-through">₹{pack.mrp}</span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#1D5FD1] flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5 stroke-[4]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-[9px] text-coffee-400 font-mono mt-3">
                * Final pricing &amp; pack sizes may be updated.
              </p>

              {/* Quantity + price row */}
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-coffee-100">
                <div>
                  <span className="block text-[9px] font-mono text-coffee-400 uppercase tracking-widest font-black">
                    Quantity
                  </span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg border border-coffee-250 flex items-center justify-center hover:bg-coffee-50 hover:border-coffee-400 transition-colors cursor-pointer active:scale-95 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5 text-coffee-700" />
                    </button>
                    <span className="w-6 text-center font-mono font-black text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="w-8 h-8 rounded-lg border border-coffee-250 flex items-center justify-center hover:bg-coffee-50 hover:border-coffee-400 transition-colors cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-coffee-700" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[9px] font-mono text-coffee-400 uppercase tracking-widest font-black">
                    Total
                  </span>
                  <span className="font-mono text-2xl font-black text-coffee-950">
                    ₹{selectedPack.price * quantity}
                  </span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => handleBuyNow(true)}
                  className="w-full py-4 px-4 text-xs sm:text-sm font-sans font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 bg-[#1D5FD1] hover:bg-[#1849A8] text-white active:scale-[0.98] shadow-lg shadow-[#1D5FD1]/20 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
                <button
                  onClick={() => handleBuyNow(false)}
                  className="w-full py-4 px-4 text-xs sm:text-sm font-sans font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 bg-white border border-coffee-950 text-coffee-950 hover:bg-coffee-950 hover:text-white active:scale-[0.98] cursor-pointer"
                >
                  <Leaf className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KEY BENEFITS */}
        <div className="mb-16">
          <div className="mb-6">
            <span className="text-xs uppercase font-mono tracking-widest text-[#1D5FD1] font-bold">
              ✨ Why You'll Love It
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-coffee-950 mt-1">
              Key Benefits
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {KEY_BENEFITS.map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="p-4 sm:p-5 bg-white border border-coffee-200/70 rounded-2xl flex flex-col items-start gap-3 hover:border-[#1D5FD1]/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#1D5FD1]/[0.08] flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-[#1D5FD1]" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-coffee-900 leading-snug">{title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HOW TO PREPARE */}
        <div className="mb-16">
          <div className="bg-white border border-coffee-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-6 border-b border-coffee-100 pb-4">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-[#1D5FD1]" />
                <h3 className="text-sm font-sans font-extrabold uppercase tracking-wide text-coffee-850">
                  🍵 How to Prepare
                </h3>
              </div>
              <span className="text-[10px] font-mono text-coffee-400">2–3 min steep</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {PREP_STEPS.map((step, idx) => (
                <div key={step.title} className="flex flex-col gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1D5FD1] text-white font-mono text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="text-xs font-extrabold text-coffee-950">{step.title}</h4>
                  <p className="text-[11px] text-coffee-500 leading-relaxed">{step.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3.5 rounded-2xl bg-[#1D5FD1]/[0.05] border border-[#1D5FD1]/15 text-[11px] leading-relaxed text-coffee-700 flex items-start gap-2.5">
              <span className="shrink-0 mt-0.5">💡</span>
              <p>
                <strong>Tip:</strong> Add a few drops of lemon for a refreshing flavour and a natural colour change.
              </p>
            </div>
          </div>
        </div>

        {/* PRODUCT HIGHLIGHTS */}
        <div className="mb-16">
          <div className="mb-6">
            <span className="text-xs uppercase font-mono tracking-widest text-[#1D5FD1] font-bold">
              🌿 Product Highlights
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRODUCT_HIGHLIGHTS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-3.5 bg-coffee-50 border border-coffee-200/60 rounded-xl"
              >
                <div className="w-5 h-5 rounded-full bg-[#1D5FD1] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-coffee-900">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-coffee-950 text-white p-8 sm:p-12 text-center">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#1D5FD1] rounded-full blur-3xl opacity-20 select-none pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#1D5FD1] rounded-full blur-3xl opacity-10 select-none pointer-events-none" />

          <Flower2 className="w-8 h-8 text-[#5B8FF0] mx-auto mb-4" />
          <h3 className="text-2xl sm:text-3xl font-serif font-black">Experience the Natural Blue!</h3>
          <p className="text-coffee-300 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Order your Blue Tea today and enjoy a refreshing herbal tea experience.
          </p>

          <button
            onClick={() => handleBuyNow(true)}
            className="mt-6 inline-flex items-center gap-2 bg-[#1D5FD1] hover:bg-[#1849A8] text-white text-xs sm:text-sm font-sans font-black uppercase tracking-wider px-8 py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-[#1D5FD1]/30 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Buy Now
          </button>
        </div>

      </div>
    </div>
  );
}
