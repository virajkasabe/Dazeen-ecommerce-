"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Eye, Star, Coffee } from "lucide-react";
import { cn } from "../../lib/utils";
import { Product } from "../../types";
import { WoodenCartButton } from "./wooden-cart-button";

interface InteractiveProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  onAddToCart: (product: Product) => void;
  onShowDetails: (product: Product) => void;
  className?: string;
}

export function InteractiveProductCard({
  className,
  product,
  onAddToCart,
  onShowDetails,
  ...props
}: InteractiveProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [addedPop, setAddedPop] = useState<boolean>(false);

  // --- MOUSE MOVE HANDLER FOR 3D TILT ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Calculate rotation with max 8deg
    const rotateX = ((y - height / 2) / (height / 2)) * -8;
    const rotateY = ((x - width / 2) / (width / 2)) * 8;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: "transform 0.1s ease-out",
    });
  };

  // --- MOUSE LEAVE HANDLER ---
  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.4s ease-in-out",
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering openDetails from the background touch
    onAddToCart(product);
    setAddedPop(true);
    setTimeout(() => {
      setAddedPop(false);
    }, 1200);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={cn(
        "relative w-full max-w-[320px] aspect-[9/12] rounded-3xl bg-stone-900 shadow-2xl overflow-hidden group border border-white/5 cursor-pointer touch-none select-none",
        "transform-style-3d", // Enables 3D transformations for children
        className
      )}
      onClick={() => onShowDetails(product)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      {...props}
    >
      {/* Background Image - scales slightly to avoid showing edges on tilt */}
      <img
        src={product.image}
        alt={product.name}
        className="absolute inset-0 h-full w-full object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105 pointer-events-none"
        style={{ transform: "translateZ(-20px) scale(1.1)", referrerPolicy: "no-referrer" } as React.CSSProperties}
      />
      
      {/* Dark Ambient Gradients for optimal high-contrast text rendering */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30 rounded-3xl pointer-events-none" />

      {/* Main Content with 3D effect */}
      <div
        className="absolute inset-0 p-4 flex flex-col justify-between"
        style={{ transform: "translateZ(30px)" }}
      >
        {/* Glassmorphism Header */}
        <div className="rounded-2xl border border-white/10 bg-black/45 p-3.5 backdrop-blur-md flex items-start justify-between">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-mono font-bold tracking-widest text-amber-400 uppercase">
              {product.roastLevel} Roast
            </span>
            <h3 className="text-sm font-bold text-white font-serif line-clamp-1">{product.name}</h3>
            <p className="text-[10px] text-stone-300 font-sans line-clamp-1">{product.tagline}</p>
          </div>
          
          <div className="flex items-center gap-0.5 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/5 text-[10px] font-bold text-amber-400">
            <Star className="w-2.5 h-2.5 fill-current text-amber-400" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Floating Custom Elements for quick center indicators */}
        <div className="flex-grow flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-xl">
            <Eye className="w-5 h-5 text-white/90" />
          </div>
        </div>

        {/* Footer Actions Strip */}
        <div className="space-y-2.5">
          {/* Price Tag & Buy Button Container */}
          <div className="flex items-center justify-between bg-black/40 rounded-2xl p-2 backdrop-blur-md border border-white/5">
            <div className="pl-2.5 flex flex-col items-start leading-none text-left">
              <span className="text-[8px] font-mono tracking-wider text-stone-400 uppercase">250g Jar</span>
              <span className="text-base font-mono font-black text-amber-400 mt-0.5">₹{product.price}</span>
            </div>

            {/* Quick Buy button on top of card details */}
            <div className="relative overflow-hidden rounded-full">
              <WoodenCartButton
                onClick={handleBuyNow}
                label="Buy Now"
                className="px-4.5 py-1.5 h-9"
              />

              <AnimatePresence>
                {addedPop && (
                  <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -25, opacity: 0 }}
                    className="absolute inset-0 bg-emerald-600 font-extrabold text-white flex items-center justify-center text-[9px] tracking-normal rounded-full z-20"
                  >
                    Cup Added!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Pagination dots corresponding with design style */}
          <div className="flex justify-center gap-1.5 pb-0.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 w-1 rounded-full transition-all duration-300",
                  index === 0 ? "bg-amber-400 w-2.5" : "bg-white/20"
                )}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default InteractiveProductCard;
