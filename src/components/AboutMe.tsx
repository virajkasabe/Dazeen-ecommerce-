import React, { useRef, ElementType, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: ElementType;
}

const FadeIn = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = "",
  style = {},
  as = "div"
}: FadeInProps) => {
  const Component = motion.create(as);

  const variants = {
    hidden: { opacity: 0, x, y },
    visible: { opacity: 1, x: 0, y: 0 }
  };

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "50px", amount: 0 }}
      variants={variants}
      style={style}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </Component>
  );
};

interface CharacterProps {
  key?: number;
  char: string;
  index: number;
  totalChars: number;
  progress: MotionValue<number>;
}

function Character({ char, index, totalChars, progress }: CharacterProps) {
  const charProgress = index / totalChars;
  const start = Math.max(0, charProgress - 0.1);
  const end = Math.min(1, charProgress + 0.05);

  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block">
      {/* Invisible duplicate holding space */}
      <span className="opacity-0 select-none">{char === " " ? "\u00A0" : char}</span>
      {/* Absolute positioned animated character */}
      <motion.span style={{ opacity }} className="absolute inset-0 select-none">
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </span>
  );
}

interface AboutMeProps {
  onContactClick?: () => void;
}

export default function AboutMe({ onContactClick }: AboutMeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking: target container, reveal text from bottom-start area
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.25"]
  });

  const aboutText = 
    "With more than five years of experience in coffee craft, we focus on sourcing high-altitude beans, organic roasting, and caffeine free coffee powder. We truly enjoy serving coffee lovers who aim to stand out and enjoy their favorite blend without compromise. Let's brew something incredible together!";

  const chars = Array.from(aboutText);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] sm:min-h-screen w-full bg-[#0C0C0C] flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden font-kanit font-light select-none text-white"
    >
      {/* 4 decorative corner images (absolute positioned, z-0) */}
      
      {/* 1. Top-left -- Moon icon */}
      <FadeIn
        delay={0.1}
        duration={0.9}
        x={-80}
        y={0}
        className="absolute z-0 top-[4%] left-[1%] sm:left-[2%] md:left-[4%]"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="Moon ornament"
          referrerPolicy="no-referrer"
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto opacity-70 pointer-events-none select-none"
        />
      </FadeIn>

      {/* 2. Bottom-left -- 3D object */}
      <FadeIn
        delay={0.25}
        duration={0.9}
        x={-80}
        y={0}
        className="absolute z-0 bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="Geometric 3D ornament"
          referrerPolicy="no-referrer"
          className="w-[100px] sm:w-[140px] md:w-[180px] h-auto opacity-70 pointer-events-none select-none"
        />
      </FadeIn>

      {/* 3. Top-right -- Lego icon */}
      <FadeIn
        delay={0.15}
        duration={0.9}
        x={80}
        y={0}
        className="absolute z-0 top-[4%] right-[1%] sm:right-[2%] md:right-[4%]"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="Lego ornament"
          referrerPolicy="no-referrer"
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto opacity-70 pointer-events-none select-none"
        />
      </FadeIn>

      {/* 4. Bottom-right -- 3D group */}
      <FadeIn
        delay={0.3}
        duration={0.9}
        x={80}
        y={0}
        className="absolute z-0 bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="3D object group"
          referrerPolicy="no-referrer"
          className="w-[130px] sm:w-[170px] md:w-[220px] h-auto opacity-70 pointer-events-none select-none"
        />
      </FadeIn>

      {/* Center content */}
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center justify-center gap-16 sm:gap-20 md:gap-24 text-center">
        
        {/* Group 1 -- Heading + Animated Text */}
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 w-full">
          
          {/* Heading */}
          <FadeIn delay={0} y={40}>
            <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center font-kanit text-[64px] sm:text-[96px] md:text-[140px] lg:text-[160px]">
              About me
            </h2>
          </FadeIn>

          {/* Animated Scroll Reveal Paragraph */}
          <div className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px] text-lg sm:text-xl md:text-2xl font-kanit">
            {chars.map((char, index) => (
              <Character
                key={index}
                char={char}
                index={index}
                totalChars={chars.length}
                progress={scrollYProgress}
              />
            ))}
          </div>

        </div>

        {/* Group 2 -- Contact Button */}
        <FadeIn delay={0.3} y={20}>
          <button
            onClick={() => {
              if (onContactClick) {
                onContactClick();
              } else {
                // Smooth scroll to footer/contact areas
                const foot = document.getElementById("footer") || document.querySelector("footer");
                if (foot) {
                  foot.scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
            style={{
              background: "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
              boxShadow: "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
              outline: "2px solid #E3E3E3",
              outlineOffset: "-3px"
            }}
            className="rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-white font-medium uppercase tracking-widest text-xs sm:text-sm md:text-base hover:opacity-90 active:opacity-75 transition-all duration-200 cursor-pointer shadow-lg font-kanit"
          >
            Contact Me
          </button>
        </FadeIn>

      </div>
    </section>
  );
}
