import { Linkedin, Twitter, Instagram } from "lucide-react";
import { motion } from "motion/react";

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
  onSetView?: (view: string) => void;
}

// Component 1: LogoIcon
function LogoIcon() {
  return (
    <div className="w-8 h-8 bg-[#31A8FF] rounded-[8px] flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 20C4 20 4 14 10 10C16 6 20 4 20 4C20 4 18 8 14 14C10 20 4 20 4 20Z" fill="white" />
        <path d="M4 20L10 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Component 2: FooterCard
function FooterCard({ onNavigate, onSetView }: FooterProps) {
  const socialIcons = [
    { icon: Linkedin, url: "https://linkedin.com" },
    { icon: Twitter, url: "https://twitter.com" },
    { icon: Instagram, url: "https://instagram.com" },
  ];

  const handleLinkClick = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Outer Gray Body */}
      <div className="bg-[#E9EBEE] rounded-[48px] border border-slate-200 shadow-sm overflow-hidden">
        {/* Inner White Box */}
        <div className="bg-white rounded-[40px] m-2 shadow-sm">
          {/* Content Grid Space */}
          <div className="p-8 md:p-10 lg:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            
            {/* Brand Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-2.5">
                <LogoIcon />
                <span className="text-[26px] font-bold tracking-tight text-[#0F172A]">dazeen</span>
              </div>
              <p className="text-[#64748B] leading-relaxed text-[16px] font-normal max-w-[320px]">
                Premium coffee solutions designed to elevate your coffee ritual through advanced organic single-origin specialty brewing.
              </p>
              
              {/* Socials Group */}
              <div className="flex gap-3">
                {socialIcons.map((soc, idx) => {
                  const IconComponent = soc.icon;
                  return (
                    <a
                      key={idx}
                      href={soc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-[44px] h-[44px] flex items-center justify-center rounded-xl border border-slate-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-slate-50 transition-all active:scale-95 group cursor-pointer"
                    >
                      <IconComponent className="w-5 h-5 text-slate-800 transition-colors group-hover:text-[#31A8FF]" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Product Column */}
            <div className="space-y-6">
              <h4 className="text-[14px] font-medium text-[#94A3B8] uppercase tracking-wider">Product</h4>
              <ul className="space-y-4">
                <li>
                  <button onClick={() => handleLinkClick("blends")} className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors cursor-pointer text-left">
                    Coffee Blends
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("brew-simulator")} className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors cursor-pointer text-left">
                    Brew Guides
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("savings-calc")} className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors cursor-pointer text-left">
                    Pricing
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("about-us")} className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors cursor-pointer text-left">
                    Updates
                  </button>
                </li>
              </ul>
            </div>

            {/* Science Column */}
            <div className="space-y-6">
              <h4 className="text-[14px] font-medium text-[#94A3B8] uppercase tracking-wider">Science</h4>
              <ul className="space-y-4">
                <li>
                  <button onClick={() => handleLinkClick("why-dazeen")} className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors cursor-pointer text-left">
                    CO2 Extraction
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("why-dazeen")} className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors cursor-pointer text-left">
                    Sleep Identity
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("why-dazeen")} className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors cursor-pointer text-left">
                    Anxiety Research
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("savings-calc")} className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors cursor-pointer text-left">
                    Sleep Metrics
                  </button>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-6">
              <h4 className="text-[14px] font-medium text-[#94A3B8] uppercase tracking-wider">Company</h4>
              <ul className="space-y-4">
                <li>
                  <button onClick={() => handleLinkClick("about-us")} className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors cursor-pointer text-left">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("about-us")} className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors cursor-pointer text-left">
                    Partners
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick("about-us")} className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors cursor-pointer text-left">
                    Careers
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="px-6 sm:px-12 md:px-16 lg:px-20 py-5 flex flex-col md:flex-row justify-between items-center gap-6 text-[15px]">
          <p className="text-[#64748B] font-medium">© 2026 Dazeen. All rights reserved.</p>
          <div className="flex flex-row gap-8 text-[#64748B] font-medium items-center">
            <button 
              onClick={() => onSetView?.("terms")} 
              className="hover:text-[#1E293B] transition-colors cursor-pointer"
            >
              Legal Center
            </button>
            <div className="w-[1px] h-4 bg-slate-300" />
            <button 
              onClick={() => onSetView?.("terms")} 
              className="hover:text-[#1E293B] transition-colors cursor-pointer"
            >
              User Agreement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component 3: GlassText
function GlassText() {
  return (
    <div className="relative w-full flex items-center justify-center select-none pt-0 overflow-hidden">
      <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" result="outer-shadow"/>
            <feComponentTransfer in="SourceAlpha" result="alpha"><feFuncA type="linear" slope="1" /></feComponentTransfer>
            <feOffset in="alpha" dx="0" dy="4" result="offset-white" />
            <feGaussianBlur in="offset-white" stdDeviation="4" result="blur-white" />
            <feComposite in="alpha" in2="blur-white" operator="out" result="inner-white-mask" />
            <feFlood floodColor="#ffffff" floodOpacity="0.25" result="white-fill" />
            <feComposite in="white-fill" in2="inner-white-mask" operator="in" result="inner-white-final" />
            <feGaussianBlur in="alpha" stdDeviation="6" result="blur-black" />
            <feComposite in="alpha" in2="blur-black" operator="out" result="inner-black-mask" />
            <feFlood floodColor="#000000" floodOpacity="0.25" result="black-fill" />
            <feComposite in="black-fill" in2="inner-black-mask" operator="in" result="inner-black-final" />
            <feMerge>
              <feMergeNode in="outer-shadow" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="inner-white-final" />
              <feMergeNode in="inner-black-final" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <h1
          className="text-[min(25vw,360px)] font-bold tracking-normal leading-none select-none text-white px-4 uppercase text-center"
          style={{ filter: "url(#glass-effect)" }}
        >
          dazeen
        </h1>
      </motion.div>
    </div>
  );
}

// Final Default Export
export default function Footer({ onNavigate, onSetView }: FooterProps) {
  return (
    <footer className="w-full flex flex-col items-center gap-0 pt-16 bg-[#F9F9FB]" id="dazeen_vize_footer">
      <FooterCard onNavigate={onNavigate} onSetView={onSetView} />
      <GlassText />
    </footer>
  );
}
