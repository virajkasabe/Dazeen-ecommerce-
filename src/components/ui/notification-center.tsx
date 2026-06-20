"use client";

import { motion, Variants } from "motion/react";
import React, { useState } from "react";
import { AiFillSpotify } from "react-icons/ai";
import { FaHeadphones, FaXTwitter } from "react-icons/fa6";
import { FaPhoneAlt, FaPinterest, FaSnapchatGhost } from "react-icons/fa";
import { MdMarkunread } from "react-icons/md";
import { RiNetflixFill } from "react-icons/ri";
import { cn } from "../../lib/utils";

type NotificationCardProps = {
  cardTitle?: string;
  cardDescription?: string;
  notificationTitle?: string;
  notificationDescription?: string;
  notificationTime?: string;
};

const NotificationCenter = ({
  cardTitle = "Real-time payment alerts",
  cardDescription = "Get instant updates for every successful Stripe transaction processed through your app.",
  notificationTitle = "Stripe",
  notificationDescription = "You received a payment of $99.00 USD",
  notificationTime = "2h ago",
}: NotificationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const phoneVariant: Variants = {
    open: {
      transform: "translateY(-36px)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    close: {
      transform: "translateY(0px)",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const notificationVariant: Variants = {
    open: {
      transform: "translateY(48px) scale(1)",
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        delay: 0.1,
      },
    },
    close: {
      transform: "translateY(-72px) scale(0.75)",
      filter: "blur(10px)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const lockVariant: Variants = {
    open: {
      backgroundColor: "#22d3ee",
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
    close: {
      backgroundColor: "#262626",
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
  };

  const lockLightVariant: Variants = {
    open: {
      backgroundColor: "#22d3ee",
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
    close: {
      backgroundColor: "#a3a3a3",
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
  };

  const parentvariant: Variants = {
    open: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
    close: {
      transition: {
        staggerChildren: 0.075,
        delayChildren: 0.15,
      },
    },
  };

  return (
    <motion.div
      onClick={() => setIsHovered((prev) => !prev)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="close"
      animate={isHovered ? "open" : "close"}
      variants={parentvariant}
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:shadow-lg",
        "flex max-w-[350px] items-center justify-center mx-auto",
        "rounded-3xl border border-stone-200 bg-stone-50 p-6 dark:bg-stone-900 dark:border-stone-800",
      )}
    >
      <motion.div
        variants={phoneVariant}
        className="relative mx-auto h-[270px] w-[264px] rounded-[44px] bg-neutral-300 p-1.5 dark:bg-neutral-800"
      >
        <div className="relative h-[258px] overflow-hidden rounded-[38px] bg-neutral-200 dark:bg-neutral-950/50">
          <div className="absolute left-8 top-3.5 text-[9px] text-neutral-500">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </div>
          <motion.div
            variants={lockVariant}
            className="absolute left-[112px] top-2 hidden h-6 w-6 items-center justify-center rounded-full dark:flex"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4">
              <g fill="#545454">
                <path d="M3 8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z"></path>
                <path d="M8 3a2.5 2.5 0 0 0-2.5 2.5V9h-1V5.5a3.5 3.5 0 1 1 7 0V9h-1V5.5A2.5 2.5 0 0 0 8 3Z"></path>
              </g>
            </svg>
          </motion.div>
          <motion.div
            variants={lockLightVariant}
            className="absolute left-[112px] top-2 flex h-6 w-6 items-center justify-center rounded-full dark:hidden"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4">
              <g fill="#404040">
                <path d="M3 8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z"></path>
                <path d="M8 3a2.5 2.5 0 0 0-2.5 2.5V9h-1V5.5a3.5 3.5 0 1 1 7 0V9h-1V5.5A2.5 2.5 0 0 0 8 3Z"></path>
              </g>
            </svg>
          </motion.div>
          <motion.div
            variants={notificationVariant}
            className="absolute left-3.5 z-10 h-12 w-[90%] overflow-hidden rounded-md bg-stone-900 shadow-lg dark:bg-neutral-800"
          >
            <div className="flex h-full items-center gap-3 px-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-stone-850 shadow-lg dark:bg-neutral-700">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.274 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"
                    fill="#F59E0B"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex w-full flex-col overflow-hidden">
                  <div className="flex w-full items-center justify-between gap-1">
                    <p className="truncate text-[10px] font-extrabold font-mono tracking-wider text-amber-500 uppercase">
                      {notificationTitle}
                    </p>
                    <span className="text-[8px] font-mono text-stone-400">
                      {notificationTime}
                    </span>
                  </div>
                  <p className="w-[95%] truncate text-start text-[9px] font-sans font-medium text-white/90">
                    {notificationDescription}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="absolute top-10 flex h-full w-full flex-col items-center gap-3 px-4 pt-4 select-none">
            <div className="flex w-full items-center gap-5 justify-center">
              <IconWrapper>
                <FaPhoneAlt size={16} />
              </IconWrapper>
              <IconWrapper>
                <FaPinterest size={16} />
              </IconWrapper>
              <IconWrapper>
                <AiFillSpotify size={16} />
              </IconWrapper>
              <IconWrapper>
                <FaHeadphones size={16} />
              </IconWrapper>
            </div>
            <div className="flex w-full items-center gap-5 justify-center">
              <IconWrapper>
                <RiNetflixFill size={16} />
              </IconWrapper>
              <IconWrapper>
                <MdMarkunread size={16} />
                <motion.div
                  variants={lockVariant}
                  className="absolute -left-1 -top-1 hidden h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] text-[#22D3EE] dark:flex font-black"
                >
                  1
                </motion.div>
                <motion.div
                  variants={lockLightVariant}
                  className="absolute -left-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] text-stone-700 dark:hidden font-black"
                >
                  1
                </motion.div>
              </IconWrapper>
              <IconWrapper>
                <FaXTwitter size={16} />
              </IconWrapper>
              <IconWrapper>
                <FaSnapchatGhost size={16} />
              </IconWrapper>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 hidden h-[140px] w-full rounded-b-3xl [background-image:linear-gradient(to_top,#0c0a09_50%,transparent_100%)] dark:block" />
      <div className="absolute bottom-0 left-0 block h-[140px] w-full rounded-b-3xl [background-image:linear-gradient(to_top,#fcfaf8_50%,transparent_100%)] dark:hidden" />
      <div className="absolute bottom-5 left-0 w-full px-6 text-center">
        <h3 className="text-xs font-bold font-serif text-stone-900 dark:text-white">{cardTitle}</h3>
        <p className="mt-1 text-[10px] sm:text-xs text-stone-500 leading-normal max-w-[280px] mx-auto">{cardDescription}</p>
      </div>
    </motion.div>
  );
};

export default NotificationCenter;

const IconWrapper = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-neutral-300 to-neutral-200 dark:from-neutral-700 dark:to-neutral-900 shadow-3xs text-stone-550 dark:text-stone-400">
      {children}
    </div>
  );
};
