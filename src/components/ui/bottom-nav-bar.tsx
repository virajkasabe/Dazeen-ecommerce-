"use client";

import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Home,
  LineChart,
  CreditCard,
  MessageCircle,
  Trophy,
  User,
  LucideIcon
} from "lucide-react";
import { cn } from "../../lib/utils";

const defaultNavItems = [
  { label: "Home", icon: Home },
  { label: "Portfolio", icon: LineChart },
  { label: "Transactions", icon: CreditCard },
  { label: "Messages", icon: MessageCircle },
  { label: "Rewards", icon: Trophy },
  { label: "Profile", icon: User },
];

const MOBILE_LABEL_WIDTH = 72;

export interface NavItemConfig {
  label?: string;
  name?: string;
  icon: LucideIcon;
  onClick?: (e: React.MouseEvent) => void;
  badge?: React.ReactNode;
}

export interface BottomNavBarProps {
  className?: string;
  defaultIndex?: number;
  stickyBottom?: boolean;
  items?: NavItemConfig[];
  activeTab?: string;
  onTabChange?: (name: string) => void;
}

export function BottomNavBar({
  className,
  defaultIndex = 0,
  stickyBottom = false,
  items,
  activeTab,
  onTabChange,
}: BottomNavBarProps) {
  const resolvedItems = items || defaultNavItems;
  const [localActiveIndex, setLocalActiveIndex] = useState(defaultIndex);

  // If dynamic activeTab is provided, find its index. Else, fallback to local indexing.
  const activeIndex = activeTab !== undefined 
    ? resolvedItems.findIndex(item => (item.label || item.name) === activeTab)
    : localActiveIndex;

  const handleTabClick = (idx: number, item: NavItemConfig, e: React.MouseEvent) => {
    if (item.onClick) {
      item.onClick(e);
    }
    if (onTabChange) {
      onTabChange(item.label || item.name || "");
    } else {
      setLocalActiveIndex(idx);
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 mb-0 w-full max-w-[95vw] sm:max-w-max flex justify-center px-4 pointer-events-none",
        stickyBottom && "pointer-events-auto"
      )}
    >
      <motion.nav
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        role="navigation"
        aria-label="Bottom Navigation"
        className={cn(
          "bg-stone-950/70 border border-white/10 backdrop-blur-xl rounded-full flex items-center p-2 shadow-2xl space-x-1 min-w-[320px] max-w-full h-[52px] select-none pointer-events-auto transition-all duration-300",
          "shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),_inset_0_-1px_3px_rgba(0,0,0,0.5),_0_10px_35px_rgba(0,0,0,0.4)]",
          className
        )}
      >
        {resolvedItems.map((item, idx) => {
          const Icon = item.icon;
          const label = item.label || item.name || "";
          const isActive = idx === activeIndex;

          return (
            <motion.button
              key={label}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleTabClick(idx, item, e)}
              className={cn(
                "flex items-center gap-0 px-3.5 py-2 rounded-full transition-all duration-300 relative h-10 min-w-[44px] min-h-[40px] max-h-[44px] cursor-pointer",
                isActive
                  ? "text-amber-350 gap-2 font-black"
                  : "bg-transparent text-stone-400 hover:text-white hover:bg-white/5",
                "focus:outline-none focus-visible:ring-0"
              )}
              aria-label={label}
              type="button"
            >
              {/* Premium Glass Glider Background Animation */}
              {isActive && (
                <motion.div
                  layoutId="glassy-nav-glider"
                  className="absolute inset-0 rounded-full z-0 pointer-events-none"
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  style={{
                    background: "linear-gradient(135deg, rgba(180, 148, 43, 0.4) 0%, rgba(234, 179, 8, 0.6) 100%)",
                    boxShadow: "0 0 16px rgba(234, 179, 8, 0.35), inset 0 0 8px rgba(255, 255, 255, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                  }}
                />
              )}

              <span className="relative z-10 flex items-center justify-center">
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  aria-hidden
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-amber-380" : "text-stone-400"
                  )}
                />
                {item.badge}
              </span>

              <motion.div
                initial={false}
                animate={{
                  width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                  opacity: isActive ? 1 : 0,
                  marginLeft: isActive ? "6px" : "0px",
                }}
                transition={{
                  width: { type: "spring", stiffness: 350, damping: 32 },
                  opacity: { duration: 0.19 },
                  marginLeft: { duration: 0.19 },
                }}
                className={cn("overflow-hidden flex items-center max-w-[72px] relative z-10")}
              >
                <span
                  className={cn(
                    "font-extrabold text-[10px] tracking-widest uppercase font-mono whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis text-[clamp(0.625rem,0.5263rem+0.5263vw,1rem)] leading-[1.9]",
                    isActive ? "text-amber-300" : "opacity-0"
                  )}
                  title={label}
                >
                  {label}
                </span>
              </motion.div>
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
}

export default BottomNavBar;
