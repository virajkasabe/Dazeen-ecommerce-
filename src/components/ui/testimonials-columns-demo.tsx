"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { ScrollReelTestimonials } from "./scroll-reel-testimonials";

const premiumTestimonials = [
  {
    quote: "This 0.00% Caffeine classic velvet is a total life changer! I drink premium Mysore filter coffee past 9 PM, sleep beautifully, and wake up with zero fatigue.",
    author: "Anjali Sharma",
    image: "", // Resolved to name monogram dynamically
  },
  {
    quote: "As a cardiologist, raw purity is extremely important to me. Dazeen's organic coconut decaf process leaves zero chemical solvents behind. Truly pristine science!",
    author: "Dr. Kabir Roy",
    image: "", // Resolved to name monogram dynamically
  },
  {
    quote: "I had completely stopped enjoying coffee due to severe acid reflux. But Shanti Brew's stomach-safe organic formula is amazingly light and gentle on the gut.",
    author: "Priya Nair",
    image: "", // Resolved to name monogram dynamically
  },
  {
    quote: "The Premium Hazelnut flavor profile is incredibly rich with an epic crema. Best of all, I get zero late-afternoon jitters or racing heart rate.",
    author: "Aman Deshmukh",
    image: "", // Resolved to name monogram dynamically
  },
  {
    quote: "Uncompromising body and authentic taste. My grandmother couldn't even tell it was decaf—she said it tastes better than traditional estate grown beans!",
    author: "Aditi Rao",
    image: "", // Resolved to name monogram dynamically
  },
  {
    quote: "Monsoon Malabar's rich notes of spiced wood and raw cacao are spectacular. Tea drinkers and coffee lovers in India finally have a decaf they can serve with pride.",
    author: "Rahul Verma",
    image: "", // Resolved to name monogram dynamically
  },
];

export function TestimonialsDemo() {
  return (
    <section id="feedback" className="bg-[#070604] py-24 border-t border-stone-900 relative overflow-hidden select-none">
      {/* Background Soft Coffee Ambiance Gradient */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-stone-900/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="container px-4 z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[640px] mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#12100E] border border-white/5 text-amber-500 text-[10px] font-black tracking-widest uppercase rounded-full shadow-sm mb-4">
            <Sparkles className="size-3 text-amber-500" />
            Loved By Coffee Purists
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#FAF6F0] tracking-tight leading-none">
            What Our Family Says ❤️🇮🇳
          </h2>
          <p className="mt-4 text-stone-400 text-sm sm:text-base leading-relaxed">
            Join over 12,000+ health-conscious coffee lovers across India who refuse to compromise on premium roasted aroma, rich full-bodied flavor, or deep nocturnal rest.
          </p>
        </motion.div>

        {/* Scroll Reel Testimonials Component with premium theme settings */}
        <div className="flex justify-center mt-10">
          <ScrollReelTestimonials testimonials={premiumTestimonials} />
        </div>
      </div>
    </section>
  );
}

export default { TestimonialsDemo };
