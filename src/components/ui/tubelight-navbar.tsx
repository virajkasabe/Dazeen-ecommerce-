"use client"

import * as React from "react"
import { motion } from "motion/react"
import { LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
  onClick?: (e: React.MouseEvent) => void
  badge?: React.ReactNode
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  activeTab?: string
  onTabChange?: (name: string) => void
}

export function NavBar({ items, className, activeTab: customActiveTab, onTabChange }: NavBarProps) {
  const [localActiveTab, setLocalActiveTab] = React.useState(items[0]?.name || "")
  const activeTab = customActiveTab !== undefined ? customActiveTab : localActiveTab

  const handleTabClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.onClick) {
      item.onClick(e)
    }
    if (onTabChange) {
      onTabChange(item.name)
    } else {
      setLocalActiveTab(item.name)
    }
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 mb-0 w-full max-w-[420px] px-4",
        className
      )}
    >
      <div className="flex items-center justify-around gap-1 bg-white/85 border border-stone-200/80 backdrop-blur-xl py-2 px-2 rounded-full shadow-2xl relative select-none">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <button
              key={item.name}
              onClick={(e) => handleTabClick(item, e)}
              className={cn(
                "relative cursor-pointer text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 flex flex-col sm:flex-row items-center gap-1.5 focus:outline-none",
                isActive 
                  ? "text-stone-900 font-extrabold" 
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50/60"
              )}
            >
              <span className="relative flex items-center justify-center">
                <Icon size={16} strokeWidth={2.5} />
                {item.badge}
              </span>
              <span className="hidden sm:inline text-[10px] tracking-widest uppercase font-mono">{item.name}</span>
              
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-stone-100 rounded-full -z-10 border border-stone-200/50"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-500 rounded-t-full shadow-[0_-2px_10px_rgba(245,158,11,0.6)]">
                    <div className="absolute w-12 h-6 bg-amber-500/15 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-amber-500/15 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-amber-500/15 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
