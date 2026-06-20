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
import { ContactCard } from "./ui/contact-card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { notificationService } from "../utils/notifications";

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
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Robust scrolling/navigation mapping for Dazeen sections
  const handleLinkClick = (id: string) => {
    const sectionMap: { [key: string]: string } = {
      Shop: "blends",
      Sleep: "why-dazeen",
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
            {/* Left Tagline representing high-fidelity coffee values */}
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
              <span>SHOP BLENDS NOW</span>
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
                PREMIUM CAFFEINE-FREE SHADE-GROWN FILTER COFFEE SOURCED FROM HIGH-ALTITUDE ESTATES OF WESTERN GHATS
              </p>
            </motion.div>

            {/* Right: Stacked grand heading: DAZEEN / PURE / CRAFT */}
            <div className="flex flex-col items-end text-right leading-[0.88] select-none">
              {["Dazeen", "Pure", "Craft"].map((word, wordIdx) => (
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
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-md z-60 flex items-center justify-center p-4 selection:bg-[#5E0ED7]/25 text-stone-900"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              className="bg-white border border-stone-200 p-6 sm:p-8 rounded-3xl max-w-lg w-full relative space-y-4 shadow-2xl shadow-stone-950/20 max-h-[85vh] overflow-y-auto text-left"
            >
              <button
                onClick={() => setShowTerms(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-all cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <FileText className="w-5 h-5 text-emerald-600 animate-pulse" />
                <h3 className="text-lg font-serif font-bold text-stone-900">Terms & Quality Assurance</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-sans mt-2">
                <div className="space-y-1">
                  <h4 className="text-stone-900 font-bold uppercase tracking-wider text-[11px] text-[#5E0ED7] font-mono">1. Pure Chemical-Free Sourcing</h4>
                  <p>
                    All Dazeen Coffee blends are 100% shade-grown filter coffee sourced directly from high-altitude estates. We utilize advanced water processed separation, certifying 0.00% chemical solvents.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-stone-900 font-bold uppercase tracking-wider text-[11px] text-[#5E0ED7] font-mono">2. Free India-Wide Dispatch & Packaging</h4>
                  <p>
                    Orders are processed within 24 hours. We offer free express delivery for cart values above ₹499 across all major Indian zipcodes. Ground coffee is packaged in flavor-ventilated metallic canisters to retain natural oils.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-stone-900 font-bold uppercase tracking-wider text-[11px] text-[#5E0ED7] font-mono">3. Non-Jitter Refund Guarantee</h4>
                  <p>
                    If our caffeine-free coffee triggers any stimulant jitters, or prevents you from enjoying healthy delta sleep, contact us within 7 days for a complete, hassle-free replacement or refund.
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-stone-100">
                  <p className="text-[10px] text-emerald-800 italic font-mono uppercase bg-emerald-50/80 p-2.5 rounded-xl text-center leading-normal">
                    Certified 100% natural, caffeine-removed, FSSAI quality compliant filter coffee.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTerms(false)}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer transition-all mt-4"
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
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-60 flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              className="relative max-w-4xl w-full shadow-3xl max-h-[90vh] overflow-y-auto rounded-3xl"
            >
              {/* Floating Close Button */}
              <button
                onClick={() => setShowContact(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-stone-900 border border-stone-800 hover:border-amber-500 hover:bg-stone-850 flex items-center justify-center text-stone-200 transition-all cursor-pointer z-50 shadow-md"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              <ContactCard
                title="Get in touch"
                description="If you have any questions regarding our Boutique Coffees, Custom Grind requests, or need bulk ordering support, fill out the form here. We do our best to respond within 1 business day."
                contactInfo={[
                  {
                    icon: Mail,
                    label: 'Email Support',
                    value: 'support@dazeen.in',
                  },
                  {
                    icon: Phone,
                    label: 'Call / WhatsApp',
                    value: '+91 98345 00977',
                  },
                  {
                    icon: MapPin,
                    label: 'Address HQ',
                    value: 'Pune, Maharashtra, India',
                    className: 'col-span-1 md:col-span-2 lg:col-span-1',
                  }
                ]}
              >
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
                      notificationService.send("⚠️ Incomplete Form", "Please fill in your Name, Email and Message first.");
                      return;
                    }
                    setIsSubmittingContact(true);
                    setTimeout(() => {
                      notificationService.send("Query Sent Successfully! ☕✨", `Thank you ${contactName}, we've received your request! Our representative will call or mail back soon.`);
                      setIsSubmittingContact(false);
                      setContactName("");
                      setContactEmail("");
                      setContactPhone("");
                      setContactMessage("");
                      setShowContact(false);
                    }, 1200);
                  }}
                  className="w-full space-y-4"
                >
                  <div className="flex flex-col gap-1.5 text-left">
                    <Label htmlFor="contact-name" className="text-stone-300 text-xs font-semibold font-mono tracking-wider">
                      Name *
                    </Label>
                    <Input 
                      id="contact-name"
                      type="text" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your Name" 
                      className="bg-stone-900 border-stone-800 focus:border-amber-500 rounded-xl"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5 text-left">
                    <Label htmlFor="contact-email" className="text-stone-300 text-xs font-semibold font-mono tracking-wider">
                      Email address *
                    </Label>
                    <Input 
                      id="contact-email"
                      type="email" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@domain.com" 
                      className="bg-stone-900 border-stone-800 focus:border-amber-500 rounded-xl"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <Label htmlFor="contact-phone" className="text-stone-300 text-xs font-semibold font-mono tracking-wider">
                      Phone Number (Optional)
                    </Label>
                    <Input 
                      id="contact-phone"
                      type="tel" 
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX" 
                      className="bg-stone-900 border-stone-800 focus:border-amber-500 rounded-xl"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <Label htmlFor="contact-message" className="text-stone-300 text-xs font-semibold font-mono tracking-wider">
                      Message / Request *
                    </Label>
                    <Textarea 
                      id="contact-message"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="How can we assist you with our Premium Coffees?" 
                      className="bg-stone-900 border-stone-800 focus:border-amber-500 min-h-[90px] rounded-xl"
                      required
                    />
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black tracking-widest uppercase py-3 rounded-xl cursor-pointer shadow-lg transition-transform hover:scale-[1.01]" 
                    type="submit"
                    disabled={isSubmittingContact}
                  >
                    {isSubmittingContact ? "Sending..." : "Submit Inquiry"}
                  </Button>
                </form>
              </ContactCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
