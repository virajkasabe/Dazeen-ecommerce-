"use client";

import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { InteractiveProductCard } from "./ui/card-7";
import { Product } from "../types";

interface ProductSliderProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onShowDetails: (product: Product) => void;
}

export function ProductSlider({
  products,
  onAddToCart,
  onShowDetails,
}: ProductSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Monitor scrollability
  const checkScrollability = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    
    // Allow slight pixel discrepancy
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScrollability();
    el.addEventListener("scroll", checkScrollability);
    window.addEventListener("resize", checkScrollability);

    return () => {
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [products]);

  const slideLeft = () => {
    if (!containerRef.current) return;
    const { clientWidth } = containerRef.current;
    containerRef.current.scrollBy({
      left: -clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    if (!containerRef.current) return;
    const { clientWidth } = containerRef.current;
    containerRef.current.scrollBy({
      left: clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full py-4 group/slider select-none">
      {/* Slider Left Arrow button with glowing hover effect */}
      {canScrollLeft && (
        <button
          onClick={slideLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-20 p-3 bg-stone-900/95 border border-white/15 text-white hover:text-amber-400 hover:border-amber-400/50 rounded-full shadow-2xl transition-all cursor-pointer backdrop-blur-md active:scale-90 opacity-0 group-hover/slider:opacity-100 duration-300"
          aria-label="Slide Left"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* Slider Right Arrow button with glowing hover effect */}
      {canScrollRight && (
        <button
          onClick={slideRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-20 p-3 bg-stone-900/95 border border-white/15 text-white hover:text-amber-400 hover:border-amber-400/50 rounded-full shadow-2xl transition-all cursor-pointer backdrop-blur-md active:scale-90 opacity-0 group-hover/slider:opacity-100 duration-300"
          aria-label="Slide Right"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

      {/* Slide Container (Viewport) */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto overflow-y-visible px-4 sm:px-6 py-6 scrollbar-none scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {products.map((p, index) => (
          <div
            key={p.id}
            className="flex-shrink-0 snap-start flex justify-center py-2 min-w-[280px] w-full max-w-[310px] sm:w-auto"
          >
            <InteractiveProductCard
              product={p}
              onAddToCart={onAddToCart}
              onShowDetails={onShowDetails}
            />
          </div>
        ))}

        {products.length === 0 && (
          <div className="w-full py-16 text-center text-stone-400 flex flex-col items-center justify-center gap-2 border border-dashed border-white/10 rounded-3xl min-h-[300px] bg-stone-950/20 backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-stone-500 animate-pulse" />
            <p className="font-serif text-lg font-bold">No Premium Blends Available</p>
            <p className="text-xs max-w-xs">Our master curators are seeding this custom category configs shortly.</p>
          </div>
        )}
      </div>

      {/* Elegant scroll hint for mobile touch screen sliders */}
      {products.length > 0 && (
        <div className="mt-2 text-center sm:hidden text-[10px] text-stone-500 font-mono tracking-wider uppercase">
           swipe to explore reserves →
        </div>
      )}
    </div>
  );
}

export default ProductSlider;
