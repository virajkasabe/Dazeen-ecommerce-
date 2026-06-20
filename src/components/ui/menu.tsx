"use client";

// 1. Import Dependencies
import * as React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// 2. Define Prop Types
interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isSeparator?: boolean; // Optional separator for grouping items
  onClick?: () => void;  // Support click handlers
}

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

interface UserProfileSidebarProps {
  user: UserProfile;
  navItems: NavItem[];
  logoutItem: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  };
  className?: string;
}

// 3. Define Animation Variants
const sidebarVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// 4. Create the Component
export const UserProfileSidebar = React.forwardRef<HTMLDivElement, UserProfileSidebarProps>(
  ({ user, navItems, logoutItem, className }, ref) => {
    return (
      <motion.aside
        ref={ref}
        className={cn(
          'flex h-full w-full max-w-full flex-col rounded-xl border border-stone-200/60 bg-white p-4 text-stone-900 shadow-xs sm:max-w-xs',
          className
        )}
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        aria-label="User Profile Menu"
      >
        {/* User Info Header */}
        <motion.div variants={itemVariants} className="flex items-center space-x-4 p-2 text-left">
          <img
            src={user.avatarUrl}
            alt={`${user.name}'s avatar`}
            className="h-12 w-12 rounded-full object-cover border border-stone-200 shadow-sm bg-amber-50"
          />
          <div className="flex flex-col truncate">
            <span className="font-extrabold text-base tracking-tight text-stone-900 leading-tight">
              {user.name}
            </span>
            <span className="text-xs font-mono font-bold text-[#B4942B] truncate mt-0.5">
              {user.email || 'Premium Member ☕'}
            </span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="my-3 border-t border-stone-100" />

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 text-left" role="navigation">
          {navItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.isSeparator && <motion.div variants={itemVariants} className="h-4" />}
              {item.onClick ? (
                <motion.button
                  type="button"
                  onClick={item.onClick}
                  variants={itemVariants}
                  className="group flex w-full items-center rounded-lg px-3 py-2 text-xs font-bold text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900 cursor-pointer"
                >
                  <span className="mr-3 h-4 w-4 text-stone-400 group-hover:text-amber-500">{item.icon}</span>
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 text-[#B4942B]" />
                </motion.button>
              ) : (
                <motion.a
                  href={item.href}
                  variants={itemVariants}
                  className="group flex items-center rounded-lg px-3 py-2 text-xs font-bold text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                >
                  <span className="mr-3 h-4 w-4 text-stone-400 group-hover:text-amber-500">{item.icon}</span>
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 text-[#B4942B]" />
                </motion.a>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Logout Button */}
        <motion.div variants={itemVariants} className="mt-4 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={logoutItem.onClick}
            className="group flex w-full items-center rounded-lg px-3 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer"
          >
            <span className="mr-3 h-4 w-4 text-rose-400 group-hover:text-rose-600">{logoutItem.icon}</span>
            <span>{logoutItem.label}</span>
          </button>
        </motion.div>
      </motion.aside>
    );
  }
);

UserProfileSidebar.displayName = 'UserProfileSidebar';
export default UserProfileSidebar;
