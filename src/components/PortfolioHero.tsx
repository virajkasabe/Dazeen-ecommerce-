import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowUpRight, 
  X, 
  Coffee, 
  Sparkles, 
  ArrowRight, 
  Star, 
  User, 
  LogIn, 
  LogOut, 
  Package, 
  ShieldCheck, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Clock 
} from "lucide-react";

interface PortfolioHeroProps {
  onScrollToSection?: (sectionId: string) => void;
  onSetView?: (view: string) => void;
  currentUser?: any;
  onOpenLogin?: () => void;
}

const StaggeredWords = ({ text, delay = 0.15 }: { text: string; delay?: number }) => {
  const words = text.split(" ");
  return (
    <span className="inline-flex flex-wrap gap-x-1">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.04,
            ease: [0.215, 0.61, 0.355, 1]
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export default function PortfolioHero({ 
  onScrollToSection, 
  onSetView, 
  currentUser, 
  onOpenLogin 
}: PortfolioHeroProps) {
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Robust scrolling/navigation mapping for Dazeen sections
  const handleLinkClick = (id: string) => {
    const sectionMap: { [key: string]: string } = {
      Shop: "blends",
      Sleep: "why-decaf",
      Brew: "brew-simulator",
      Reviews: "feedback",
    };

    const targetSection = sectionMap[id] || id;

    if (onScrollToSection) {
      onScrollToSection(targetSection);
    } else {
      const element = document.getElementById(targetSection);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Nav animation variant
  const fadeDownVariant = {
    initial: { opacity: 0, y: -20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // Stats / content fadeup variant
  const fadeUpVariant = {
    initial: { opacity: 0, y: 32 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // Menu Animation Staggers
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 110, 
        damping: 15 
      } 
    },
  };

  return (
    <div className="relative min-h-[95vh] md:min-h-screen flex flex-col justify-between text-black overflow-hidden font-sans select-none bg-[#FAF6F0]">
      
      {/* 1. Full-screen loops premium coffee background video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover escala-102"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4"
            type="video/mp4"
          />
        </video>
        {/* Luxurious ambient overlay to ensure perfect legibility */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1.5px]" />
      </div>

      {/* Primary Content Grid Layer */}
      <div className="relative z-10 w-full min-h-[90vh] md:min-h-[calc(100vh-80px)] flex flex-col justify-between pt-6">

        {/* SECTION 2: Customized Dazeen Stats Row (middle section, right-aligned) */}
        <div className="flex-grow flex items-center justify-end px-5 sm:px-8 md:px-12 py-10 md:py-0">
          <div className="flex items-center gap-5 sm:gap-9 md:gap-14 text-right">
            
            {/* Stat Item 1: 20+ Happy Customers Tried */}
            <motion.div
              custom={2}
              variants={fadeUpVariant}
              initial="initial"
              animate="animate"
              className="flex flex-col items-end"
            >
              <div 
                className="font-semibold text-coffee-950 leading-none flex items-baseline justify-end"
                style={{ fontSize: "clamp(1.6rem, 5.5vw, 3.8rem)" }}
              >
                <span className="text-[#5E0ED7] opacity-90 text-[0.55em] mr-0.5 relative -top-[0.1em] font-bold">+</span>
                <span>20</span>
              </div>
              <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-widest uppercase text-coffee-900/90 whitespace-pre-line leading-tight mt-1.5 border-t border-coffee-900/10 pt-1.5">
                {"HAPPY\nCUSTOMERS"}
              </p>
            </motion.div>

            {/* Stat Item 2: 4.5 Stars App Rating */}
            <motion.div
              custom={3}
              variants={fadeUpVariant}
              initial="initial"
              animate="animate"
              className="flex flex-col items-end"
            >
              <div 
                className="font-semibold text-coffee-950 leading-none flex items-baseline justify-end"
                style={{ fontSize: "clamp(1.6rem, 5.5vw, 3.8rem)" }}
              >
                <span className="text-yellow-600 opacity-90 text-[0.55em] mr-0.5 relative -top-[0.1em] font-bold">★</span>
                <span>4.5</span>
              </div>
              <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-widest uppercase text-coffee-900/90 whitespace-pre-line leading-tight mt-1.5 border-t border-coffee-900/10 pt-1.5">
                {"VERIFIED\nRATINGS"}
              </p>
            </motion.div>

            {/* Stat Item 3: Fast Indian Delivery */}
            <motion.div
              custom={4}
              variants={fadeUpVariant}
              initial="initial"
              animate="animate"
              className="flex flex-col items-end"
            >
              <div 
                className="font-semibold text-coffee-950 leading-none flex items-baseline justify-end"
                style={{ fontSize: "clamp(1.6rem, 5.5vw, 3.8rem)" }}
              >
                <span className="text-[#5E0ED7] opacity-90 text-[0.55em] mr-0.5 relative -top-[0.1em] font-bold">⚡</span>
                <span className="tracking-tighter">FAST</span>
              </div>
              <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-widest uppercase text-coffee-900/90 whitespace-pre-line leading-tight mt-1.5 border-t border-coffee-900/10 pt-1.5">
                {"PAN-INDIA\nDELIVERY"}
              </p>
            </motion.div>

          </div>
        </div>

        {/* SECTION 3: Bottom Dazeen Branding Content (pinned to bottom with spacing) */}
        <footer className="w-full px-5 sm:px-8 md:px-12 pb-8 md:pb-12 flex flex-col gap-6 md:gap-10">
          
          {/* Row A (tagline + CTA link) */}
          <div className="flex items-center justify-between gap-4 border-b border-coffee-900/10 pb-5">
            {/* Left Tagline representing high-fidelity decaf values */}
            <motion.p
              custom={5}
              variants={fadeUpVariant}
              initial="initial"
              animate="animate"
              className="text-[10px] sm:text-[11px] md:text-xs font-semibold tracking-widest uppercase text-coffee-950 leading-relaxed max-w-[150px] sm:max-w-[220px]"
            >
              TASTE OF TRADITION <br />
              WITH ZERO JITTERS <br />
              FOR DEEP SLEEP
            </motion.p>

            {/* Right: CTA button directing to products section */}
            <motion.button
              custom={6}
              variants={fadeUpVariant}
              initial="initial"
              animate="animate"
              onClick={() => handleLinkClick("Shop")}
              className="group flex items-center gap-1.5 sm:gap-2.5 text-[#5E0ED7] font-semibold uppercase text-sm sm:text-[16px] md:text-[20px] tracking-widest hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>SHOP DECAF NOW</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform stroke-[2.5]" />
            </motion.button>
          </div>

          {/* Row B (detailed description + stacked bold word heading) */}
          <div className="flex items-end justify-between gap-4">
            {/* Left: detailed estate info paragraph */}
            <motion.div
              custom={7}
              variants={fadeUpVariant}
              initial="initial"
              animate="animate"
              className="w-[120px] sm:w-[190px] md:w-[320px] shrink-0 text-left"
            >
              <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-widest uppercase text-coffee-900/80 leading-relaxed">
                PREMIUM CAFFEINE-FREE SHADE-GROWN FILTER COFFEE SOURCED FROM HIGH-ALTITUDE ESTATES OF CHIKMAGALUR
              </p>
              <div className="flex items-center gap-3.5 mt-2.5 text-[10px] font-bold text-[#5E0ED7] tracking-widest leading-none">
                <button 
                  onClick={() => setShowTerms(true)} 
                  className="hover:underline hover:text-[#5E0ED7]/85 cursor-pointer uppercase py-1"
                >
                  Terms
                </button>
                <span className="text-coffee-300 font-normal select-none">•</span>
                <button 
                  onClick={() => setShowContact(true)} 
                  className="hover:underline hover:text-[#5E0ED7]/85 cursor-pointer uppercase py-1"
                >
                  Contact Us
                </button>
              </div>
            </motion.div>

            {/* Right: Stacked grand heading: DAZEEN / PURE / DECAF */}
            <div className="flex flex-col items-end text-right leading-[0.88] select-none">
              {["Dazeen", "Pure", "Decaf"].map((word, wordIdx) => (
                <div key={word} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 0.4 + wordIdx * 0.14,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="font-extrabold uppercase text-coffee-950 inline-block origin-bottom font-serif tracking-tight"
                    style={{ fontSize: "clamp(2rem, 9.2vw, 9.2rem)" }}
                  >
                    {word}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

        </footer>

      </div>



      {/* 1. TERMS & GUANTEES INLINE DIALOG OVERLAY */}
      <AnimatePresence>
        {showTerms && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/92 backdrop-blur-xl z-60 flex items-center justify-center p-4 selection:bg-[#5E0ED7]/25 text-[#FAF6F0]"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              className="bg-[#120E0A] border border-white/10 p-6 sm:p-8 rounded-3xl max-w-lg w-full relative space-y-4 shadow-2xl shadow-black/80 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowTerms(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <FileText className="w-5 h-5 text-yellow-500 animate-pulse" />
                <h3 className="text-lg font-serif font-bold text-white">Terms & Quality Assurance</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-white/80 leading-relaxed font-sans mt-2">
                <div className="space-y-1">
                  <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] text-yellow-500 font-mono">1. Pure Chemical-Free Sourcing</h4>
                  <p>
                    All Dazeen Coffee blends are 100% shade-grown filter coffee sourced directly from Chikmagalur estates. We utilize advanced water processed separation, certifying 0.00% chemical solvents.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] text-yellow-500 font-mono">2. Free India-Wide Dispatch & Packaging</h4>
                  <p>
                    Orders are processed within 24 hours. We offer free express delivery for cart values above ₹499 across all major Indian zipcodes. Ground coffee is packaged in flavor-ventilated metallic canisters to retain natural oils.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] text-yellow-500 font-mono">3. Non-Jitter Refund Guarantee</h4>
                  <p>
                    If our caffeine-free coffee triggers any stimulant jitters, or prevents you from enjoying healthy delta sleep, contact us within 7 days for a complete, hassle-free replacement or refund.
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-white/5">
                  <p className="text-[9px] text-[#C5A880] italic font-mono uppercase bg-white/5 p-2.5 rounded-xl text-center leading-normal">
                    Certified 100% natural, caffeine-removed, FSSAI quality compliant filter coffee.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTerms(false)}
                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-coffee-950 font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer transition-all mt-4"
              >
                I AGREE & CONFIRM
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CONTACT SUPPORT INLINE DIALOG OVERLAY */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/92 backdrop-blur-xl z-60 flex items-center justify-center p-4 selection:bg-[#5E0ED7]/25 text-[#FAF6F0]"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              className="bg-[#120E0A] border border-white/10 p-6 sm:p-8 rounded-3xl max-w-lg w-full relative space-y-4 shadow-2xl shadow-black/80 max-h-[85vh] overflow-y-auto text-left"
            >
              <button
                onClick={() => setShowContact(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Mail className="w-5 h-5 text-yellow-500 animate-pulse" />
                <h3 className="text-lg font-serif font-bold text-white">Chikmagalur Estates & Support</h3>
              </div>

              <p className="text-xs text-[#FAF6F0]/70">
                Have questions about custom grinds, retail packaging details, or need assistance? We are online 10 AM to 7 PM IST daily.
              </p>

              <div className="space-y-4 pt-1 text-xs sm:text-sm font-sans">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white/5 rounded-xl text-yellow-500 shrink-0 border border-white/5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white/50 font-semibold text-[10px] uppercase tracking-wider font-mono">Helpline Calls & WhatsApp</h4>
                    <p className="text-white font-mono mt-0.5 font-bold">+91 98765 43210</p>
                    <p className="text-[10px] text-white/40">Expected response: &lt; 5 minutes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white/5 rounded-xl text-yellow-500 shrink-0 border border-white/5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white/50 font-semibold text-[10px] uppercase tracking-wider font-mono">Support and Partnership Email</h4>
                    <p className="text-white font-mono mt-0.5 font-bold">peace@dazeen.com</p>
                    <p className="text-[10px] text-[#C5A880]">Inquire for custom bulk order guidelines</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white/5 rounded-xl text-yellow-500 shrink-0 border border-white/5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white/50 font-semibold text-[10px] uppercase tracking-wider font-mono">Chikmagalur Roastery Address</h4>
                    <p className="text-[#FAF6F0]/85 mt-0.5 text-xs">Baba Budangiri Estates No. 44, Sourcing Station, Chikmagalur, Karnataka - 577101</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="mailto:peace@dazeen.com"
                  className="w-full py-2.5 bg-[#5E0ED7] hover:bg-[#5E0ED7]/90 text-white font-bold rounded-xl text-xs uppercase tracking-widest block text-center cursor-pointer transition-all shadow-md mt-2"
                >
                  SEND DIRECT SUPPORT EMAIL
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
