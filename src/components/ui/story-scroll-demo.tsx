import * as React from "react";
import FlowArt, { FlowSection } from "./story-scroll";
import { ArrowLeft, Sparkles, Sliders, ShieldCheck, HeartPulse } from "lucide-react";

interface StoryScrollDemoProps {
  onBackToHome: () => void;
}

export default function FlowArtDefaultDemo({ onBackToHome }: StoryScrollDemoProps) {
  return (
    <div className="relative w-full min-h-screen bg-stone-950 text-white selection:bg-amber-400/35 selection:text-white">
      {/* Immersive Cinematic Floating Top Bar */}
      <div className="fixed top-6 left-6 right-6 z-[9999] flex justify-between items-center pointer-events-none">
        <button
          onClick={onBackToHome}
          className="pointer-events-auto flex items-center gap-2.5 px-4.5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white rounded-full text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-xl active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Exit Journey</span>
        </button>
        <span className="pointer-events-auto hidden md:inline-flex items-center gap-2 px-4 py-2 bg-stone-900/80 backdrop-blur-md border border-stone-800 rounded-full text-[10px] font-mono tracking-widest uppercase text-amber-400 font-black">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Cinematic GSAP Experience</span>
        </span>
      </div>

      <FlowArt aria-label="Dazeen Estate Cinematic Journey">
        {/* Section 1: Philosophy */}
        <FlowSection aria-label="Dazeen Philosophy" style={{ backgroundColor: '#2E1A17', color: '#FFFDF9' }}>
          <p className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-amber-400">01 — The Philosophy</p>
          <hr className="my-[2vw] border-none border-t border-white/10" />
          <div>
            <h1 className="text-[clamp(3.5rem,11vw,12rem)] font-extrabold leading-[0.82] uppercase tracking-tighter">
              Pure
              <br />
              Bold
              <br />
              Craft
            </h1>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/10" />
          <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.2vw,1.85rem)] font-light leading-relaxed text-stone-200">
            We believe you deserve an exquisite morning brew without the synthetic crash. No mold toxins, no harsh acids — just pure shade-grown single-origin bliss.
          </p>
        </FlowSection>

        {/* Section 2: Chikmagalur Sourcing Legacy */}
        <FlowSection aria-label="Sourcing Journey" style={{ backgroundColor: '#100807', color: '#FFFDF9' }}>
          <p className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-amber-400">02 — Sourcing Legacy</p>
          <hr className="my-[2vw] border-none border-t border-white/10" />
          <div>
            <h2 className="text-[clamp(3.5rem,11vw,12rem)] font-extrabold leading-[0.82] uppercase tracking-tighter">
              Shade
              <br />
              Grown
              <br />
              Purity
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/10" />
          <p className="max-w-[55ch] text-[clamp(1rem,2.1vw,1.75rem)] font-light leading-relaxed text-stone-300">
            Grown in Chikmagalur under natural canopies of fruit, cardamom, and spice. Decaffeinated naturally without hazardous chemical solvents.
          </p>
          <hr className="my-[2vw] border-none border-t border-white/10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800">
              <p className="mb-2 text-xs font-mono font-black uppercase text-amber-400 tracking-wider">01. Direct Trade</p>
              <p className="text-[12px] leading-relaxed text-stone-400">
                Double the fair-trade baseline paid directly to our multi-generation partner families.
              </p>
            </div>
            <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800">
              <p className="mb-2 text-xs font-mono font-black uppercase text-amber-400 tracking-wider">02. Swiss Water Purified</p>
              <p className="text-[12px] leading-relaxed text-stone-400">
                Certified pure water mountain filtration. Absolutely no methylene chloride or toxic chemicals.
              </p>
            </div>
            <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800">
              <p className="mb-2 text-xs font-mono font-black uppercase text-amber-400 tracking-wider">03. Artisan Roasts</p>
              <p className="text-[12px] leading-relaxed text-stone-400">
                Roasted in state-of-the-art drum heaters in drum-micro lots, instantly packaged to prevent oxidation.
              </p>
            </div>
          </div>
          
          <p className="mt-8 ml-auto max-w-[45ch] text-right text-xs font-mono text-stone-400 italic">
            "Sip slowly. Your adrenal system will thank you." – Dazeen roasters
          </p>
        </FlowSection>

        {/* Section 3: How it heals */}
        <FlowSection aria-label="Why Decaf" style={{ backgroundColor: '#FAF6F0', color: '#100807' }}>
          <p className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-amber-800">03 — Sourcing Pillars</p>
          <hr className="my-[2vw] border-none border-t border-stone-300" />
          <div>
            <h2 className="text-[clamp(3.5rem,11vw,12rem)] font-extrabold leading-[0.82] uppercase tracking-tighter text-stone-900">
              Zero
              <br />
              Acid.
              <br />
              Pure
              <br />
              Peace.
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-stone-300" />
          <p className="max-w-[50ch] text-[clamp(1rem,2.2vw,1.85rem)] font-normal leading-relaxed text-stone-700">
            Three simple rules. Premium beans. Clean processes. Peak sensory experience without toxic reactions.
          </p>
          <hr className="my-[2vw] border-none border-t border-stone-300" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-stone-100 p-5 rounded-2xl border border-stone-200">
              <p className="mb-2 text-xs font-mono font-black uppercase text-stone-800 tracking-wider">01 — Source Raw</p>
              <p className="text-[12px] leading-relaxed text-stone-600">
                Pesticide-free shade beans with high alkaline balance to ensure zero digestive distress.
              </p>
            </div>
            <div className="bg-stone-100 p-5 rounded-2xl border border-stone-200">
              <p className="mb-2 text-xs font-mono font-black uppercase text-stone-800 tracking-wider">02 — Pure Roast</p>
              <p className="text-[12px] leading-relaxed text-stone-600">
                Caramelization at precise thermal points to keep low-acid chocolate & nutty notes pronounced.
              </p>
            </div>
            <div className="bg-stone-100 p-5 rounded-2xl border border-stone-200">
              <p className="mb-2 text-xs font-mono font-black uppercase text-stone-800 tracking-wider">03 — Ship Fresh</p>
              <p className="text-[12px] leading-relaxed text-stone-600">
                Fulfillment within 24 hours of roasting from our central warehouse directly to BlueDart hubs.
              </p>
            </div>
          </div>
        </FlowSection>

        {/* Section 4: Scale and Sourcing Mission */}
        <FlowSection aria-label="The Vision" style={{ backgroundColor: '#422824', color: '#FFFDF9' }}>
          <p className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-amber-400">04 — The Vision</p>
          <hr className="my-[2vw] border-none border-t border-white/10" />
          <div>
            <h2 className="text-[clamp(3.5rem,11vw,12rem)] font-extrabold leading-[0.82] uppercase tracking-tighter">
              Future
              <br />
              Of
              <br />
              Coffee
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
            <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5">
              <span className="text-4xl font-extrabold text-amber-400 block mb-2">10K+</span>
              <p className="text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">Healed Coffee Lovers</p>
              <p className="text-[11px] text-stone-400 mt-2">
                Delighted users across Pune, Bengaluru, and Mumbai enjoying healthy, heart-safe energy.
              </p>
            </div>
            <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5">
              <span className="text-4xl font-extrabold text-emerald-400 block mb-2">Zero</span>
              <p className="text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">Harsh Toxins</p>
              <p className="text-[11px] text-stone-400 mt-2">
                Every micro-bag certified free of pesticide residues, heavy metals, and mold toxins.
              </p>
            </div>
            <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5">
              <span className="text-4xl font-extrabold text-amber-400 block mb-2">100%</span>
              <p className="text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">Specialty Estates</p>
              <p className="text-[11px] text-stone-400 mt-2">
                Single-origin botanical sourcing from shade-grown valleys of Chikmagalur.
              </p>
            </div>
          </div>
          
          <p className="max-w-[50ch] text-[clamp(1rem,2.1vw,1.75rem)] font-light leading-relaxed text-stone-300 mt-4">
            Industrial commercial coffee is heavily sprayed and chemical-decaffeinated. We are building a movement to rewrite the metrics of coffee wellness.
          </p>
        </FlowSection>

        {/* Section 5: Call to Action */}
        <FlowSection aria-label="Exit Story" style={{ backgroundColor: '#1F110F', color: '#FFFDF9' }}>
          <p className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-amber-400">05 — Join Us</p>
          <hr className="my-[2vw] border-none border-t border-white/10" />
          <div>
            <h2 className="text-[clamp(3.5rem,11vw,12rem)] font-extrabold leading-[0.82] uppercase tracking-tighter">
              Start
              <br />
              Your
              <br />
              Ritual
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/10" />
          <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.2vw,1.85rem)] font-light leading-relaxed text-stone-300 pb-12">
            Ready to explore an entirely clean, caffeine-free coffee lifestyle? Exit the cinematic tour to return to the active boutique shop and place your order.
          </p>

          <div className="mt-auto flex justify-start">
            <button
              onClick={onBackToHome}
              className="px-8 py-4.5 bg-amber-400 text-stone-950 rounded-2xl text-xs font-mono font-black tracking-widest uppercase hover:bg-amber-300 active:scale-95 transition-all shadow-xl shadow-amber-400/15 cursor-pointer flex items-center gap-3"
            >
              <span>Return to Boutique Shop</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </FlowSection>
      </FlowArt>
    </div>
  );
}
