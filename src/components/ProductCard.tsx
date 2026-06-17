import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ShieldAlert, ShoppingBag, Eye, X, BookOpenCheck } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (p: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [addedPop, setAddedPop] = useState<boolean>(false);

  const roastColorMap: Record<Product["roastLevel"], string> = {
    Light: "bg-amber-100 text-amber-900 border-amber-200",
    Medium: "bg-orange-100 text-orange-900 border-orange-200",
    "Medium-Dark": "bg-amber-950/20 text-coffee-950 border-amber-950/30",
    Dark: "bg-coffee-900 text-[#FAF6F0] border-coffee-950",
  };

  const handleAddClick = () => {
    onAddToCart(product);
    setAddedPop(true);
    setTimeout(() => {
      setAddedPop(false);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl border border-coffee-100/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group relative h-full"
    >
      
      {/* Dynamic Caffeine Banner Pill */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[9px] font-bold uppercase tracking-widest bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        {product.caffeineCount}
      </div>

      {/* Main interactive Image Container */}
      <div className="relative aspect-square overflow-hidden bg-coffee-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        
        {/* Hover inspect glass overlay */}
        <div className="absolute inset-0 bg-coffee-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={() => setShowDetails(true)}
            className="p-3 bg-white text-coffee-950 hover:bg-accent-gold rounded-full transition-colors cursor-pointer shadow-lg flex items-center gap-1.5 font-bold text-xs"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          
          {/* Roast level and Rating strip */}
          <div className="flex items-center justify-between">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${roastColorMap[product.roastLevel]}`}>
              {product.roastLevel} Roast
            </span>
            
            <div className="flex items-center gap-1 text-xs font-semibold text-coffee-800">
              <Star className="w-3.5 h-3.5 text-accent-gold fill-current" />
              <span>{product.rating}</span>
              <span className="text-coffee-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-serif text-lg font-bold text-coffee-950 leading-snug">
            {product.name}
          </h3>
          
          <p className="text-xs text-coffee-600 leading-relaxed text-balance line-clamp-2">
            {product.tagline}
          </p>

          {/* Flavor/Aroma profile badges */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {product.aromaProfile.map((aroma, index) => (
              <span
                key={index}
                className="text-[10px] bg-coffee-50 text-coffee-700 border border-coffee-200/50 px-2 py-0.5 rounded-md font-mono"
              >
                🍫 {aroma}
              </span>
            ))}
          </div>

        </div>

        {/* Origin / Processing Specifications */}
        <div className="border-t border-coffee-100/80 pt-3 flex items-center justify-between text-[11px] text-coffee-600">
          <div>
            <p className="font-semibold text-coffee-900">Provenance</p>
            <p>{product.origin}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-coffee-900">Crafting</p>
            <p className="italic">Caffeine-Free Water Process</p>
          </div>
        </div>

        {/* Pricing and Action trigger */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[10px] text-coffee-400 font-medium uppercase font-mono">
              250 Grams Pack
            </span>
            <span className="text-xl font-mono font-bold text-coffee-950">
              ₹{product.price}
            </span>
          </div>

          <div className="flex gap-1.5 flex-row">
            <button
              onClick={() => setShowDetails(true)}
              className="p-3 bg-coffee-100 text-coffee-800 hover:bg-coffee-200 rounded-xl transition-colors cursor-pointer"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleAddClick}
              className="px-4 py-3 bg-coffee-900 hover:bg-coffee-800 text-[#FAF6F0] rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all relative overflow-hidden shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cup</span>
              
              <AnimatePresence>
                {addedPop && (
                  <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -25, opacity: 0 }}
                    className="absolute inset-0 bg-emerald-600 font-bold text-white flex items-center justify-center text-[11px]"
                  >
                    Cup Added !
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

      </div>

      {/* Dynamic Pop-up Details Modal (Overlay) */}
      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Dark glass backdrop backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="fixed inset-0 bg-coffee-950/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#FAF6F0] text-coffee-950 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-coffee-200/50 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 p-2 bg-coffee-900 text-coffee-50 hover:bg-coffee-800 rounded-full transition-colors z-20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid md:grid-cols-2">
                {/* Left col - Photo */}
                <div className="h-64 md:h-auto relative bg-coffee-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Right col - Specs details */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-accent-darkgold font-bold">
                      Gourmet Decaf Reserve
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-coffee-950 mt-1">
                      {product.name}
                    </h2>
                    <p className="text-xl font-mono font-bold text-coffee-900 mt-2">
                      ₹{product.price}
                    </p>
                  </div>

                  <p className="text-xs text-coffee-700 leading-relaxed text-balance">
                    {product.description}
                  </p>

                  {/* Highlight Benefits List */}
                  <div className="space-y-2">
                    <p className="font-bold text-xs uppercase tracking-wider text-coffee-800">
                      Health Benefits &amp; Purity Guard
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {product.benefits.map((benefit, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-1.5 text-xs text-coffee-700">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Processing profile details */}
                  <div className="p-4 bg-coffee-100/60 rounded-2xl border border-coffee-200/50 space-y-2 text-xs text-coffee-800">
                    <p><strong>Decaffeination:</strong> {product.process}</p>
                    <p><strong>Harvest Origin:</strong> {product.origin}</p>
                    <p><strong>Caffeine Concentration:</strong> Less than 0.05% mg</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleAddClick();
                        setShowDetails(false);
                      }}
                      className="flex-grow py-3.5 bg-coffee-900 hover:bg-coffee-800 text-white rounded-xl text-xs font-bold font-mono transition-colors shadow-lg cursor-pointer"
                    >
                      🚀 Add 250g Jar To Basket
                    </button>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-6 py-3.5 bg-coffee-200 hover:bg-coffee-300 text-coffee-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
