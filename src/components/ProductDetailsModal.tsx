"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Calendar, MessageSquare, ClipboardCheck, ArrowRight } from "lucide-react";
import { Product } from "../types";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) {
  if (!product) return null;

  const handleAddClick = () => {
    onAddToCart(product);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 overflow-y-auto pt-6 pb-6 select-none">
          {/* Dark glass backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="bg-[#0c0a09] border border-white/10 text-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-50 max-h-[90vh] flex flex-col md:flex-row"
          >
            {/* Close trigger button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 rounded-full transition-all z-50 border border-white/10 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Photo & Badges */}
            <div className="md:w-1/2 h-64 md:h-auto relative bg-stone-900 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
              
              {/* Origin badge on top of image */}
              <div className="absolute bottom-4 left-4 bg-black/60 border border-white/10 backdrop-blur-md rounded-xl p-2 px-3 text-left">
                <span className="text-[9px] uppercase font-mono tracking-wider text-amber-400 font-bold">Provenance Origin</span>
                <p className="text-xs font-semibold text-white">{product.origin}</p>
              </div>
            </div>

            {/* Right Column: Spec Sheet Details */}
            <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] uppercase tracking-wider font-mono font-bold leading-none">
                    ⭐ Pure Gourmet Reserve
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-white mt-2 leading-tight">
                    {product.name}
                  </h2>
                  <p className="text-stone-400 text-xs italic mt-1 font-mono tracking-tight text-balance">
                    "{product.tagline}"
                  </p>
                </div>

                <div className="flex items-center gap-4 py-1.5 border-y border-white/5">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-black">{product.rating}</span>
                  </div>
                  <span className="text-stone-600">|</span>
                  <span className="text-[11px] text-stone-300 font-mono">
                    {product.reviewsCount} Active Reviews
                  </span>
                  <span className="text-stone-600">|</span>
                  <span className="text-[11px] text-stone-300 font-mono">
                    ⚡ {product.caffeineCount}
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed text-left">
                  {product.description}
                </p>

                {/* Benefits List */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                    Health Benefits &amp; Organic Purity
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    {product.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-stone-300">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processing profile */}
                <div className="p-3 bg-stone-900/60 rounded-xl border border-white/5 space-y-1.5 text-[11px] text-stone-300 text-left">
                  <p className="font-mono">
                    <strong className="text-white">Roast Profile:</strong> {product.roastLevel} Roast
                  </p>
                  <p className="font-mono">
                    <strong className="text-white">Solvent Method:</strong> {product.process}
                  </p>
                  <p className="font-mono">
                    <strong className="text-white">Aromas:</strong> {product.aromaProfile.join(", ")}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/5">
                <div className="flex flex-col items-start leading-none pl-1">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-stone-400">250g Pack price</span>
                  <span className="text-xl font-mono font-black text-amber-400 mt-1">₹{product.price}</span>
                </div>

                <div className="flex gap-2 flex-grow max-w-[280px]">
                  <button
                    onClick={() => {
                      handleAddClick();
                      onClose();
                    }}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black font-mono text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Add To Cup</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ProductDetailsModal;
