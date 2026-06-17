import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smile, Moon, ShieldAlert, Sparkles, TrendingUp, HelpCircle } from "lucide-react";

type CoffeeStrength = "instant" | "filter" | "espresso" | "doubleRoast";

export default function CoffeeCalculator() {
  const [cups, setCups] = useState<number>(3);
  const [strength, setStrength] = useState<CoffeeStrength>("filter");

  // Calculated stats
  const stats = useMemo(() => {
    // Estimations of caffeine content per cup in mg
    const caffeineMap: Record<CoffeeStrength, number> = {
      instant: 85,
      filter: 120,
      espresso: 145,
      doubleRoast: 210,
    };

    const cafePriceMap: Record<CoffeeStrength, number> = {
      instant: 30,
      filter: 90,
      espresso: 220,
      doubleRoast: 260,
    };

    const caffeinePerCup = caffeineMap[strength];
    const dailyCaffeine = caffeinePerCup * cups;
    
    // Switch to Dazeen craft process saves 99.9% of that caffeine
    const monthlyCaffeineSavedGrams = ((dailyCaffeine * 30) / 1000).toFixed(1);
    const annualCaffeineSavedGrams = ((dailyCaffeine * 365) / 1000).toFixed(1);

    // Sleep index calculation (hypothetical wellness formula based on adenosine blockages)
    const sleepImprovement = Math.min(15 + cups * 12, 85);
    
    // Heart flutters and adrenaline spike indices (decaying exponential)
    const jitterReductionIndex = Math.min(20 + cups * 15, 95);

    // Annual financial savings vs. gourmet cafe bills in India
    const costPerCupAtm = cafePriceMap[strength];
    const moneySavedAnnual = Math.round((costPerCupAtm - 18) * cups * 365); // 18 rupees estimated cost of 1 cup premium Dazeen at home

    return {
      dailyCaffeine,
      monthlyCaffeineSavedGrams,
      annualCaffeineSavedGrams,
      sleepImprovement,
      jitterReductionIndex,
      moneySavedAnnual,
    };
  }, [cups, strength]);

  const strengthLabels: Record<CoffeeStrength, { name: string; desc: string; mg: number }> = {
    instant: { name: "Instant Powder Coffee", desc: "Standard household instant sachet", mg: 85 },
    filter: { name: "South Indian Filter", desc: "Decoction with milk and sugar", mg: 120 },
    espresso: { name: "Cafe Latte / Cappuccino", desc: "Commercial cafe single shot espresso", mg: 145 },
    doubleRoast: { name: "Double Shot Espresso", desc: "Dark roasted robust espresso double", mg: 210 },
  };

  return (
    <section id="savings-calc" className="py-20 bg-[#F4EDE2] border-y border-coffee-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase font-mono tracking-widest text-accent-darkgold font-bold">
            Interactive Wellness Metric
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-coffee-950">
            Apna Caffeine Intake Aur Sleep Score Check Karein! ⚡
          </h2>
          <p className="text-coffee-700 text-sm sm:text-base leading-relaxed">
            Did you know caffeine blocks adenosine (nature's sleep compound) in your brain for up to 10 hours? 
            Adjust the values to see how switching to Dazeen Caffeine-Free Coffee upgrades your body.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-coffee-100 flex flex-col justify-between space-y-8">
            <div>
              <h3 className="font-serif text-xl font-bold text-coffee-900 border-b border-coffee-100 pb-3 mb-6">
                Current Daily Habit
              </h3>

              {/* Slider Input for Cups */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-coffee-800">
                    How many cups per day?
                  </label>
                  <span className="px-3 py-1 font-mono text-xs font-bold bg-coffee-900 text-accent-gold rounded-full">
                    {cups} {cups === 1 ? "Cup" : "Cups"}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={cups}
                  onChange={(e) => setCups(Number(e.target.value))}
                  className="w-full h-2 bg-coffee-100 rounded-lg appearance-none cursor-pointer accent-coffee-900"
                />
                
                <div className="flex justify-between text-[11px] font-mono text-coffee-500">
                  <span>1 Cup (Casual)</span>
                  <span>5 Cups (Intense)</span>
                  <span>10 Cups (Maximum)</span>
                </div>
              </div>

              {/* Selection Input for Coffee Strength */}
              <div className="space-y-4 mt-8">
                <label className="text-sm font-semibold text-coffee-800 block">
                  What kind of coffee do you usually drink?
                </label>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {Object.entries(strengthLabels).map(([key, item]) => {
                    const isSelected = strength === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setStrength(key as CoffeeStrength)}
                        className={`p-4 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-coffee-900 text-coffee-50 border-coffee-900 shadow-md"
                            : "bg-coffee-50/70 text-coffee-700 border-coffee-200 hover:bg-coffee-100/55"
                        }`}
                      >
                        <div className="space-y-1">
                          <p className={`text-xs font-bold ${isSelected ? "text-accent-gold" : "text-coffee-900"}`}>
                            {item.name}
                          </p>
                          <p className="text-[11px] opacity-80 leading-none">{item.desc}</p>
                        </div>
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-coffee-100/10 border border-coffee-200/20">
                          ~{item.mg}mg per cup
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Note */}
            <div className="p-3 bg-coffee-50 rounded-xl border border-coffee-100 text-[11px] text-coffee-600 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-accent-darkgold flex-shrink-0 mt-0.5" />
              <p>
                Dazeen Caffeine-Free Coffee has <strong>less than 0.5mg</strong> of caffeine per mug, essentially 0%! Sourced naturally using clean chemical-free filters.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Output Dashboard */}
          <div className="lg:col-span-7 bg-coffee-900 text-coffee-50 p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-radial from-accent-gold/15 to-transparent rounded-full pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-gold" />
                <span className="font-mono text-xs uppercase tracking-widest text-accent-gold font-bold">
                  Wellness Impact Results
                </span>
              </div>

              {/* Big Stat Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Caffeine Saved card */}
                <div className="bg-coffee-800 p-5 rounded-2xl border border-coffee-700 space-y-1">
                  <p className="text-xs text-coffee-300 font-medium">Annual Caffeine Skipped</p>
                  <p className="text-3xl font-mono font-bold text-accent-gold">
                    {stats.annualCaffeineSavedGrams} <span className="text-base font-sans">grams</span>
                  </p>
                  <p className="text-[11px] text-coffee-400">
                    Saves your heart from processing heavy stimulants.
                  </p>
                </div>

                {/* Money saved card */}
                <div className="bg-coffee-800 p-5 rounded-2xl border border-coffee-700 space-y-1">
                  <p className="text-xs text-coffee-300 font-medium">Estimated Annual Savings</p>
                  <p className="text-3xl font-mono font-bold text-emerald-400">
                    ₹{stats.moneySavedAnnual.toLocaleString()}+
                  </p>
                  <p className="text-[11px] text-coffee-400">
                    Switching local cafe trips to boutique Dazeen at home.
                  </p>
                </div>

              </div>

              {/* Graphical Progress Meters */}
              <div className="space-y-5 pt-4">
                
                {/* Sleep score improvement */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-coffee-100 font-semibold flex items-center gap-1.5ClassName">
                      <Moon className="w-4 h-4 text-indigo-400 inline" /> Deep Sleep Restfulness Growth
                    </span>
                    <span className="font-mono text-accent-gold font-bold text-sm">
                      +{stats.sleepImprovement}% Better Sleep
                    </span>
                  </div>
                  <div className="w-full bg-coffee-800 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.sleepImprovement}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-coffee-400">
                    Ensures your brain safely completes the essential Stage-4 delta sleep cycles without mid-night awakening.
                  </p>
                </div>

                {/* Jitter Reduction progress block */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-coffee-100 font-semibold flex items-center gap-1.5">
                      <Smile className="w-4 h-4 text-emerald-400 inline" /> Jitter &amp; Anxiety Cut Indicator
                    </span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      {stats.jitterReductionIndex}% Less Heart Racing
                    </span>
                  </div>
                  <div className="w-full bg-coffee-800 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.jitterReductionIndex}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                      className="bg-gradient-to-r from-emerald-500 to-sky-400 h-full rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-coffee-400">
                    Keeps cortisol (stress) hormone stable. Enjoy the serene warmth of coffee without clammy palms or racing heart rate.
                  </p>
                </div>

              </div>
            </div>

            {/* Micro-pitch block */}
            <div className="mt-8 pt-6 border-t border-coffee-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">☕</span>
                <div className="text-left">
                  <p className="text-xs font-bold text-coffee-100">Dainik Dazeen Coffee Recipe</p>
                  <p className="text-[11px] text-coffee-400">
                    Switch to healthy mornings and stress-free evenings today.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const target = document.getElementById("blends");
                  if (target) target.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full md:w-auto px-5 py-2.5 bg-accent-gold text-coffee-950 hover:bg-accent-gold/90 font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                Choose Swaad &amp; Shanti
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
