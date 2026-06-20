"use client";

import { Leaf, Flame, Sparkles, Moon, Heart, CupSoda } from "lucide-react";
import RadialOrbitalTimeline from "./radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "High-Altitude Harvest",
    date: "Agrade Mysore Beans",
    content: "Hand-picked organic coffee-cherries grown under dense forest canopies in premium Mysore estates, giving Dazeen its signature velvety-smooth undertone.",
    category: "Origin",
    icon: Leaf,
    relatedIds: [2],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 2,
    title: "Volcanic Coconut Decaf",
    date: "0.00% Caffeine Process",
    content: "Our signature organic method cleanses and extracts caffeine using active coconut lipids and volcanic hot-spring water—completely chemical free.",
    category: "Crafting",
    icon: Moon,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 3,
    title: "Gentle Light Roasting",
    date: "Stomach-Safe Formula",
    content: "Roasted slow and low at controlled temperatures to prevent heavy caramelization, resulting in an ultra-low acid profile that is safe for sensitive stomachs.",
    category: "Perfecting",
    icon: Flame,
    relatedIds: [2, 4],
    status: "roasted" as const,
    energy: 85,
  },
  {
    id: 4,
    title: "Anxiety-Free Shanti",
    date: "Deep Mind Alignment",
    content: "Carefully balanced traditional brewing standard designed to satisfy coffee lovers without the dreaded evening crash, jitters, or racing heart rate.",
    category: "Wellness",
    icon: Heart,
    relatedIds: [3, 5],
    status: "roasted" as const,
    energy: 90,
  },
  {
    id: 5,
    title: "Live: Monsoon Malabar",
    date: "New Seasonal Batch",
    content: "Now active! Our newest batch incorporates seasoned monsoon-cured beans, offering rich notes of spiced sandalwood and rich cacao without a trace of caffeine.",
    category: "Live Update",
    icon: Sparkles,
    relatedIds: [4],
    status: "brewing" as const,
    energy: 80,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4 relative overflow-visible">
      {/* Title Header with Modern Layout */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 text-amber-400 text-[11px] font-bold tracking-widest uppercase rounded-full mb-4">
          <CupSoda className="size-3 text-amber-500 animate-bounce" />
          The Dazeen Cosmic Cycle
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 tracking-tight">
          How Shanti Brew is Perfected
        </h2>
        <p className="text-stone-500 mt-2.5 text-sm sm:text-base leading-relaxed">
          Click on any orbital node below to explore our clean origin, exclusive natural decaffeination, and the exciting new Monsoon Malabar seasonal batch updating right now in our roasters.
        </p>
      </div>

      {/* Orbit Timeline Component */}
      <div className="relative select-none overflow-visible">
        <RadialOrbitalTimeline timelineData={timelineData} />
      </div>
    </div>
  );
}

export default {
  RadialOrbitalTimelineDemo,
};
