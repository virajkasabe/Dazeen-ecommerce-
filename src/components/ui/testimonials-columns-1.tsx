"use client";
import * as React from "react";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { cn } from "../../lib/utils";

export interface TestimonialItem {
  text: string;
  image?: string;
  name: string;
  role: string;
  rating?: number;
}

interface TestimonialsColumnProps {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}

export const TestimonialsColumn = ({
  className,
  testimonials,
  duration = 10,
}: TestimonialsColumnProps) => {
  return (
    <div className={cn("overflow-hidden select-none", className)}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {testimonials.map(({ text, image, name, role, rating = 5 }, i) => (
                <div 
                  className="p-8 rounded-3xl border border-stone-200/80 bg-white/95 shadow-lg shadow-stone-200/20 max-w-xs w-full flex flex-col justify-between hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 relative group overflow-hidden" 
                  key={`${index}-${i}`}
                >
                  <div className="absolute top-4 right-4 text-stone-100 group-hover:text-amber-100 transition-colors pointer-events-none -z-10">
                    <Quote className="w-10 h-10 stroke-[1.5] rotate-180" />
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-3.5">
                      {[...Array(rating)].map((_, starIdx) => (
                        <Star key={starIdx} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-stone-700 text-sm italic font-serif leading-relaxed">
                      "{text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <div className="flex flex-col">
                      <div className="font-extrabold text-stone-900 tracking-tight leading-4 text-xs">{name}</div>
                      <div className="text-[10px] text-stone-400 font-mono tracking-wider uppercase mt-1 leading-3">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
