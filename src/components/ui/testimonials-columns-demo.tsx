"use client";
import * as React from "react";
import { motion } from "motion/react";
import { TestimonialsColumn, TestimonialItem } from "./testimonials-columns-1";
import { Sparkles, Heart } from "lucide-react";

const premiumTestimonials: TestimonialItem[] = [
  {
    text: "This 0.00% Caffeine classic velvet is a total life changer! I drink premium Mysore filter coffee past 9 PM, sleep beautifully, and wake up with zero fatigue.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    name: "Anjali Sharma",
    role: "Lead Engineer, Pune",
    rating: 5,
  },
  {
    text: "As a cardiologist, raw purity is extremely important to me. Dazeen's organic coconut decaf process leaves zero chemical solvents behind. Truly pristine science!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    name: "Dr. Kabir Roy",
    role: "Cardiologist, Bangalore",
    rating: 5,
  },
  {
    text: "I had completely stopped enjoying coffee due to severe acid reflux. But Shanti Brew's stomach-safe organic formula is amazingly light and gentle on the gut.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    name: "Priya Nair",
    role: "Yoga & Wellness Coach, Kochi",
    rating: 5,
  },
  {
    text: "The Premium Hazelnut flavor profile is incredibly rich with an epic crema. Best of all, I get zero late-afternoon jitters or racing heart rate.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    name: "Aman Deshmukh",
    role: "Product Architect, Pune",
    rating: 5,
  },
  {
    text: "Uncompromising body and authentic taste. My grandmother couldn't even tell it was decaf—she said it tastes better than traditional estate grown beans!",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
    name: "Aditi Rao",
    role: "Culinary Expert, Chennai",
    rating: 5,
  },
  {
    text: "Monsoon Malabar's rich notes of spiced wood and raw cacao are spectacular. Tea drinkers and coffee lovers in India finally have a decaf they can serve with pride.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
    name: "Rahul Verma",
    role: "Creative Director, Delhi",
    rating: 5,
  },
];

const firstColumn = premiumTestimonials.slice(0, 2);
const secondColumn = premiumTestimonials.slice(2, 4);
const thirdColumn = premiumTestimonials.slice(4, 6);

export function TestimonialsDemo() {
  return (
    <section id="feedback" className="bg-[#FAF9F5] py-24 border-t border-stone-200/50 relative overflow-hidden select-none">
      {/* Background Soft Coffee Ambiance Gradient */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-stone-200/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="container px-4 z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[640px] mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 text-amber-800 text-[10px] font-black tracking-widest uppercase rounded-full shadow-sm mb-4">
            <Sparkles className="size-3 text-amber-500 animate-spin-slow" />
            Loved By Coffee Purists
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-stone-900 tracking-tight leading-none">
            What Our Family Says ❤️🇮🇳
          </h2>
          <p className="mt-4 text-stone-500 text-sm sm:text-base leading-relaxed">
            Join over 12,000+ health-conscious coffee lovers across India who refuse to compromise on premium roasted aroma, rich full-bodied flavor, or deep nocturnal rest.
          </p>
        </motion.div>

        {/* Triple Infinite Scrolling Column Testimonials with custom fade masking */}
        <div className="flex justify-center gap-6 mt-10 relative max-h-[580px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={14} className="w-full sm:w-1/3" />
          <TestimonialsColumn testimonials={secondColumn} duration={18} className="hidden sm:block w-full sm:w-1/3" />
          <TestimonialsColumn testimonials={thirdColumn} duration={15} className="hidden md:block w-full sm:w-1/3" />
        </div>
      </div>
    </section>
  );
}

export default { TestimonialsDemo };
