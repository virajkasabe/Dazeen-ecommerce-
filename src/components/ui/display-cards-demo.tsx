"use client";

import DisplayCards from "./display-cards";
import { Sparkles, Coffee, Moon, Heart, Leaf } from "lucide-react";

const dazeenCards = [
  {
    icon: <Moon className="size-4 text-amber-500 animate-pulse" />,
    title: "0.00% Caffeine",
    description: "Deep Restful Sleep Guaranteed",
    date: "Organic Active Coconut Water Process",
    iconClassName: "text-amber-500",
    titleClassName: "text-amber-800 font-serif",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/20 grayscale-[40%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 border-stone-200 shadow-sm bg-white/90",
  },
  {
    icon: <Coffee className="size-4 text-emerald-500" />,
    title: "Traditional Body",
    description: "Mysore Premium Filter Coffee",
    date: "100% High-Altitude Estate Grown",
    iconClassName: "text-emerald-500",
    titleClassName: "text-emerald-800 font-serif",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/20 grayscale-[40%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 border-emerald-100 shadow-md bg-stone-50/95",
  },
  {
    icon: <Heart className="size-4 text-rose-500" />,
    title: "Anxiety-Free Shanti",
    description: "Zero Evening Jitters or Crashes",
    date: "Stomach-Safe Volcanic Filtration",
    iconClassName: "text-rose-500",
    titleClassName: "text-rose-800 font-serif",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10 border-rose-100 shadow-lg bg-white/95",
  },
];

export function DisplayCardsDemo() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 max-w-4xl mx-auto overflow-visible">
      <div className="text-center mb-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-coffee-100 border border-coffee-200/40 text-coffee-800 text-xs font-semibold mb-3 tracking-wider uppercase">
          <Sparkles className="size-3 text-coffee-600 animate-spin-slow" />
          The Dazeen Philosophy
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-black text-stone-800 tracking-tight">
          Pure Shanti. Delicious Flavor.
        </h3>
        <p className="text-stone-500 mt-2 text-sm sm:text-base">
          Hover over each layer to reveal how our custom, chemical-free organic process transforms your daily coffee ritual.
        </p>
      </div>

      <div className="h-[280px] w-full flex items-center justify-center relative select-none">
        <DisplayCards cards={dazeenCards} />
      </div>
    </div>
  );
}
