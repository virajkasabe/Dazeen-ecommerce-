import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface HeroProps {
  onScrollToSection?: (sectionId: string) => void;
  images?: { src: string; bg: string; panel: string }[];
}

const DEFAULT_IMAGES = [
  { src: "https://kommodo.ai/i/jLktjgtoIAYIfU0kG88j", bg: "#F4845F", panel: "#F79B7F" },
  { src: "https://kommodo.ai/i/VJoWZ2NV2Ot6pkP0uheV", bg: "#6BBF7A", panel: "#85CC92" },
  { src: "https://kommodo.ai/i/jLktjgtoIAYIfU0kG88j", bg: "#F4845F", panel: "#F79B7F" },
  { src: "https://kommodo.ai/i/VJoWZ2NV2Ot6pkP0uheV", bg: "#6BBF7A", panel: "#85CC92" },
];

export default function Hero({ onScrollToSection, images }: HeroProps) {
  const activeImages = images && images.length === 4 ? images : DEFAULT_IMAGES;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile status on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Preload images
    activeImages.forEach((item) => {
      if (item && item.src) {
        const img = new Image();
        img.src = item.src;
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeImages]);

  const navigate = (direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (direction === "next") {
      setActiveIndex((prev) => (prev + 1) % 4);
    } else {
      setActiveIndex((prev) => (prev + 3) % 4);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  // Derive roles based on activeIndex
  const getRole = (index: number) => {
    if (index === activeIndex) return "center";
    if (index === (activeIndex + 3) % 4) return "left";
    if (index === (activeIndex + 1) % 4) return "right";
    return "back";
  };

  // Generate roles styling
  const getItemStyle = (index: number) => {
    const role = getRole(index);

    if (role === "center") {
      return {
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: "blur(0px)",
        opacity: 1,
        zIndex: 20,
        left: "50%",
        height: isMobile ? "60%" : "92%",
        bottom: isMobile ? "22%" : "0",
      };
    }
    if (role === "left") {
      return {
        transform: "translateX(-50%) scale(1)",
        filter: "blur(2px)",
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? "20%" : "30%",
        height: isMobile ? "16%" : "28%",
        bottom: isMobile ? "32%" : "12%",
      };
    }
    if (role === "right") {
      return {
        transform: "translateX(-50%) scale(1)",
        filter: "blur(2px)",
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? "80%" : "70%",
        height: isMobile ? "16%" : "28%",
        bottom: isMobile ? "32%" : "12%",
      };
    }
    // "back"
    return {
      transform: "translateX(-50%) scale(1)",
      filter: "blur(4px)",
      opacity: 1,
      zIndex: 5,
      left: "50%",
      height: isMobile ? "13%" : "22%",
      bottom: isMobile ? "32%" : "12%",
    };
  };

  const currentBG = activeImages[activeIndex]?.bg || "#F4845F";

  return (
    <div
      style={{
        backgroundColor: currentBG,
        transition: "background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "'Inter', sans-serif"
      }}
      className="relative w-full overflow-hidden"
    >
      <div className="relative w-full h-[100vh] overflow-hidden">
        
        {/* 1. Grain overlay */}
        <div
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
            opacity: 0.4,
          }}
          className="absolute inset-0 pointer-events-none z-55"
        />

        {/* 2. Giant ghost text "3D SHAPE" */}
        <div
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(90px, 28vw, 380px)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            top: "18%"
          }}
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-2 text-white opacity-100 uppercase white-space-nowrap font-black"
        >
          3D SHAPE
        </div>

        {/* 3. Top-left brand label "DAZEEN" */}
        <div className="absolute top-6 left-4 sm:left-8 z-60 text-xs font-semibold uppercase text-white opacity-90 tracking-[0.18em]">
          DAZEEN
        </div>

        {/* 4. Carousel */}
        <div className="absolute inset-0 z-3">
          {activeImages.map((item, idx) => (
            <div
              key={idx}
              style={{
                position: "absolute",
                aspectRatio: "0.6 / 1",
                willChange: "transform, filter, opacity",
                transition: "transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1)",
                ...getItemStyle(idx)
              }}
            >
              <img
                src={item.src}
                alt={`Dazeen custom item ${idx + 1}`}
                draggable={false}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain object-bottom select-none"
              />
            </div>
          ))}
        </div>

        {/* 5. Bottom-left text + nav buttons */}
        <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 z-60 max-w-[320px] text-left">
          <p className="bold uppercase tracking-[0.02em] mb-2 sm:mb-3 text-base sm:text-[22px] font-extrabold text-white opacity-95 text-balance">
            DAZEEN PREMIUM ART
          </p>
          <p className="hidden sm:block text-xs sm:text-sm text-white opacity-85 leading-[1.6] mb-4 sm:mb-5">
            The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("prev")}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white text-white flex items-center justify-center bg-transparent transition-all hover:scale-108 hover:bg-white/12 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-[26px] h-[26px]" strokeWidth={2.25} />
            </button>
            <button
              onClick={() => navigate("next")}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white text-white flex items-center justify-center bg-transparent transition-all hover:scale-108 hover:bg-white/12 active:scale-95 cursor-pointer"
            >
              <ArrowRight className="w-[26px] h-[26px]" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right link "DISCOVER IT" */}
        <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 z-60">
          <button
            onClick={() => {
              if (onScrollToSection) {
                onScrollToSection("blends");
              } else {
                const blendsSec = document.getElementById("blends");
                if (blendsSec) {
                  blendsSec.scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
            style={{
              fontFamily: "'Anton', sans-serif"
            }}
            className="flex items-center gap-2 text-white opacity-95 hover:opacity-100 transition-opacity duration-200 uppercase tracking-[-0.02em] leading-none cursor-pointer bg-transparent border-none outline-none"
          >
            <span style={{ fontSize: "clamp(20px, 4vw, 56px)" }} className="font-normal">
              DISCOVER IT
            </span>
            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
          </button>
        </div>

      </div>
    </div>
  );
}

