import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, Flame, CupSoda, GlassWater, Snowflake, Sparkles, CheckCircle2 } from "lucide-react";
import { BREW_GUIDES } from "../data";
import { BrewGuide } from "../types";
import CounterLoading from "./ui/counter-loader";

export default function BrewSimulator() {
  const [selectedGuideId, setSelectedGuideId] = useState<string>("guide-south-filter");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(10);
  const [totalSeconds, setTotalSeconds] = useState<number>(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const guide = BREW_GUIDES.find((g) => g.id === selectedGuideId) || BREW_GUIDES[0];

  // Map icon names to Lucide icons
  const renderIcon = (id: string, className: string) => {
    switch (id) {
      case "guide-french":
        return <Flame className={className} />;
      case "guide-south-filter":
        return <CupSoda className={className} />;
      case "guide-pour-over":
        return <GlassWater className={className} />;
      case "guide-cold-brew":
        return <Snowflake className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // Reset timer whenever guide changes
  useEffect(() => {
    stopTimer();
    const demoSec = 10;
    setSecondsLeft(demoSec);
    setTotalSeconds(demoSec);
    setActiveStep(0);
  }, [selectedGuideId]);

  // Timer simulation loop
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            stopTimer();
            // Automatically advance to completed or next step
            if (activeStep < guide.steps.length - 1) {
              setActiveStep((s) => s + 1);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, activeStep, guide]);

  const startTimer = () => setTimerRunning(true);
  const stopTimer = () => setTimerRunning(false);
  
  const resetTimer = () => {
    stopTimer();
    const demoSec = 10;
    setSecondsLeft(demoSec);
    setTotalSeconds(demoSec);
    setActiveStep(0);
  };

  // Calculate dynamic aroma & steam scaling based on timer progress
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  
  const aromaIntensity = Math.min(Math.round(progressPercent), 100);

  const getAromaStageLabel = (intensity: number) => {
    if (intensity === 0) return "Add Water to Begin Bloom";
    if (intensity < 25) return "Blooming (Releasing hazelnut oils)... 🌱";
    if (intensity < 60) return "Active Extracting (Rich aroma spreading)... ☕";
    if (intensity < 99) return "Final infusion (Warm and calming notes)... ✨";
    return "Perfect Caffeine-Free Extraction! Enjoy with Peace of Mind 🏆";
  };

  return (
    <section id="brew-simulator" className="py-20 bg-coffee-50 border-b border-coffee-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase font-mono tracking-widest text-accent-darkgold font-bold">
            Virtual Barista Center
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-coffee-950">
            Dazeen Shanti Brew Simulator ☕✨
          </h2>
          <p className="text-coffee-600 text-sm">
            Choose your signature brewing method below and start your virtual extraction. 
            Enjoy watching the aroma parameters mature in real-time.
          </p>
        </div>

        {/* Main Grid Wrapper */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Brew selector tabs */}
          <div className="lg:col-span-4 flex flex-col justify-start space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-coffee-500 font-bold mb-2">
              Select Brew Method
            </h4>
            {BREW_GUIDES.map((item) => {
              const active = selectedGuideId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedGuideId(item.id)}
                  className={`p-4 rounded-2xl text-left border transition-all flex items-center gap-4 cursor-pointer relative overflow-hidden ${
                    active
                      ? "bg-coffee-900 text-coffee-50 border-coffee-900 shadow-xl"
                      : "bg-white text-coffee-700 border-coffee-200/70 hover:bg-coffee-100/50"
                  }`}
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 ${active ? "bg-accent-gold text-coffee-950" : "bg-coffee-100 text-coffee-800"}`}>
                    {renderIcon(item.id, "w-5 h-5")}
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-[14px]">
                      {item.name}
                    </h5>
                    <p className={`text-[11px] ${active ? "text-coffee-200" : "text-coffee-500"}`}>
                      Grind: {item.grind}
                    </p>
                  </div>
                  {active && (
                    <motion.div
                      layoutId="activeGuideBackdrop"
                      className="absolute right-3 top-3 w-1.5 h-1.5 rounded-full bg-accent-gold"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Brewing Stage / Live Timer */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-coffee-100 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Top details rail */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-coffee-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-coffee-50 rounded-xl text-coffee-900">
                    {renderIcon(guide.id, "w-6 h-6")}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-coffee-950">
                      {guide.name} Recipe
                    </h3>
                    <p className="text-xs text-coffee-600 font-medium">
                      Origin recommendation: <span className="text-coffee-900">{guide.ratio}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 text-xs font-mono">
                  <span className="px-3 py-1 bg-coffee-100 text-coffee-800 rounded-lg">
                    🌡️ {guide.temp}
                  </span>
                  <span className="px-3 py-1 bg-coffee-100 text-coffee-800 rounded-lg">
                    ⚙️ {guide.grind}
                  </span>
                </div>
              </div>

              {/* Steps checklist with interactive highlight */}
              <div className="space-y-3">
                <h4 className="font-mono text-[11px] uppercase tracking-widest text-coffee-500 font-bold">
                  Step-by-Step Guide
                </h4>
                <div className="space-y-2.5">
                  {guide.steps.map((step, idx) => {
                    const isUpcoming = idx > activeStep;
                    const isCurrent = idx === activeStep;
                    const isPassed = idx < activeStep;

                    return (
                      <motion.div
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                          isCurrent
                            ? "bg-[#FAF6F0] border-accent-amber/60 shadow-sm"
                            : isPassed
                            ? "bg-emerald-50/40 border-emerald-100 opacity-60"
                            : "bg-white border-transparent opacity-40"
                        }`}
                        onClick={() => setActiveStep(idx)}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <div className={`w-5 h-5 text-[10px] font-mono font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isCurrent ? "bg-coffee-900 text-accent-gold" : "bg-coffee-200 text-coffee-600"
                          }`}>
                            {idx + 1}
                          </div>
                        )}
                        <p className={`text-xs leading-relaxed text-left ${isCurrent ? "text-coffee-900 font-medium" : "text-coffee-700"}`}>
                          {step}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Simulated extraction display (The interactive core) */}
            <div className="bg-[#FAF6F0] border border-coffee-100/75 p-5 rounded-2xl relative overflow-hidden space-y-6">
              
              {/* Animated Floating Steam particles when timer is running */}
              {timerRunning && (
                <div className="absolute top-2 right-12 flex gap-1 pointer-events-none">
                  {[1, 2, 3].map((particle) => (
                    <motion.div
                      key={particle}
                      animate={{
                        y: [-10, -50],
                        opacity: [0, 0.6, 0],
                        x: [0, (particle - 2) * 8, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5 + particle * 0.3,
                        ease: "easeOut",
                      }}
                      className="w-1 bg-[#C5A880]/40 rounded-full"
                      style={{ height: `${20 + particle * 10}px` }}
                    />
                  ))}
                </div>
              )}

              {/* Timer Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="text-center md:text-left">
                    <p className="text-[10px] uppercase tracking-widest font-mono text-coffee-500 font-bold">
                      Extraction Timer
                    </p>
                    <p className="text-3xl font-mono font-bold text-coffee-950">
                      {Math.floor(secondsLeft / 60)}:
                      {(secondsLeft % 60).toString().padStart(2, "0")}
                      <span className="text-xs text-coffee-500 font-sans font-normal ml-1">
                        (10s Step Loop)
                      </span>
                    </p>
                  </div>

                  {/* High-fidelity 15-Grid Counter Loader */}
                  {timerRunning && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="pl-5 border-l border-coffee-200"
                    >
                      <CounterLoading color="#d97706" height="3.5rem" className="w-[85px]" />
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-2">
                  {timerRunning ? (
                    <button
                      onClick={stopTimer}
                      className="px-5 py-2.5 bg-amber-600 text-[#FAF6F0] rounded-xl flex items-center gap-2 font-bold text-xs hover:bg-amber-700 transition"
                    >
                      <Pause className="w-3.5 h-3.5" /> Pause Brew
                    </button>
                  ) : (
                    <button
                      onClick={startTimer}
                      disabled={secondsLeft === 0}
                      className="px-5 py-2.5 bg-coffee-900 text-[#FAF6F0] hover:bg-coffee-800 disabled:opacity-40 rounded-xl flex items-center gap-2 font-bold text-xs transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Start Simulated Brew
                    </button>
                  )}
                  
                  <button
                    onClick={resetTimer}
                    className="p-2.5 bg-coffee-100 text-coffee-800 hover:bg-coffee-200 rounded-xl transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Aroma Meter Gauge */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-coffee-700 font-semibold flex items-center gap-1.5">
                    ♨️ Aroma Strengths Meter:
                  </span>
                  <span className="font-mono text-xs font-bold text-coffee-900">
                    {aromaIntensity}%
                  </span>
                </div>
                
                <div className="w-full bg-coffee-200 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${aromaIntensity}%` }}
                    transition={{ ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-accent-amber via-amber-600 to-coffee-900 rounded-full"
                  />
                </div>
                
                <p className="text-[11px] italic font-medium text-coffee-700">
                  {getAromaStageLabel(aromaIntensity)}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
