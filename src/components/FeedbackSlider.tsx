import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Star, Quote } from "lucide-react";
import { motion } from "motion/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Aman Deshmukh",
    role: "Software Architect, Pune",
    rating: 5,
    text: "I was highly skeptical about caffeine-free coffee powder. But Dazeen hazelnut and classic velvet taste exactly like freshly brewed traditional premium roasted Indian filter coffee. Zero nighttime sleeplessness, absolute peace of mind!",
    gradient: "linear-gradient(137deg, #FF3D77 0%, #FFB1CE 45%, #FF9D3C 100%)",
    delay: 0.1
  },
  {
    name: "Priya Nair",
    role: "Yogini & Wellness Coach, Kochi",
    rating: 5,
    text: "Pure aroma, zero acidity, and 100% natural water extracted without chemical solvents. I drink it past 9 PM and enjoy deep, restful sleep. Truly a blessing for clean living in India!",
    gradient: "linear-gradient(137deg, #FFFFFF 0%, #7DD3FC 45%, #06B6D4 100%)",
    delay: 0.2
  },
  {
    name: "Rahul Verma",
    role: "Creative Director, New Delhi",
    rating: 5,
    text: "Dazeen has completely changed my daily routine. The rich roasted body, smooth crema, and non-jitter sensation are top-tier. My stress and evening palpitations are totally gone.",
    gradient: "linear-gradient(137deg, #4361EE 0%, #E0AEFF 45%, #F72585 100%)",
    delay: 0.3
  },
  {
    name: "Dr. Sanchita Sen",
    role: "Cardiologist, Mumbai",
    rating: 5,
    text: "Many people don't realize how much chemical residue is left in ordinary processed beans. Dazeen's process uses only water, preserving the raw coffee flavonoids. Deliciously healthy!",
    gradient: "linear-gradient(137deg, #FF9D3C 0%, #FFE27C 45%, #FF3D77 100%)",
    delay: 0.4
  }
];

export default function FeedbackSlider() {
  return (
    <section id="feedback" className="py-24 bg-[#0A0A0B] overflow-hidden relative border-t border-white/5">
      {/* Subtle organic background lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#B600A8]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Localization & Subtitle block */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase font-mono tracking-widest text-[#C5A880] font-bold block">
            Loved By Coffee Purists
          </span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Humare Grahak Kya Kehte Hain? ❤️🇮🇳
          </h3>
          <p className="text-white/60 text-xs sm:text-sm font-light">
            Loved by over 12,000+ health-conscious coffee aficionados across India who refuse to compromise on taste or sleep.
          </p>
        </div>
        
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={32}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 }
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-16"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i} className="h-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: t.delay }}
                className="relative flex flex-col justify-start items-start w-full group mx-auto h-full min-h-[320px]"
              >
                {/* Glow Background (Crucial) behind the card content */}
                <div 
                  className="absolute inset-0 w-full h-full opacity-60 rounded-[40px] pointer-events-none transition-transform duration-500 group-hover:scale-105"
                  style={{
                    background: t.gradient,
                    filter: "blur(45px)"
                  }}
                />

                {/* Foreground Card with Gradient Border (Crucial) */}
                <div 
                  className="relative self-stretch w-full h-full min-h-[320px] rounded-[40px] z-10 overflow-hidden flex flex-col justify-between"
                  style={{
                    border: "8.5px solid transparent",
                    background: `linear-gradient(#1A1A1C, #1A1A1C) padding-box, ${t.gradient} border-box`
                  }}
                >
                  <div className="w-full h-full p-7 flex flex-col justify-between">
                    {/* Decorative Quote Icon on Top Right */}
                    <div className="absolute top-6 right-6 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none z-20">
                      <Quote className="w-12 h-12 stroke-[1.5]" />
                    </div>

                    <div className="text-left relative z-20">
                      {/* Rating indicator */}
                      <div className="flex gap-1 mb-5">
                        {[...Array(t.rating)].map((_, starIdx) => (
                          <Star key={starIdx} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>

                      {/* Testimonial Quote */}
                      <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed mb-6 font-normal selection:bg-white/20 italic">
                        "{t.text}"
                      </p>
                    </div>

                    {/* Consumer Metadata Footer */}
                    <div className="text-left border-t border-white/5 pt-4 flex items-center gap-3 relative z-20">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{
                          background: t.gradient
                        }}
                      >
                        {t.name[0]}
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm sm:text-base leading-tight">
                          {t.name}
                        </h4>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
