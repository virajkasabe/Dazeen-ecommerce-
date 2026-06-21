"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { AnimatePresence, motion, useAnimationControls } from "framer-motion"

interface CheckIconProps {
  size?: number | string;
  strokeWidth?: number | string;
  [key: string]: any;
}

const CheckIcon = ({ size = 16, strokeWidth = 3, ...props }: CheckIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const OTPSuccess = () => {
  return (
    <div className="flex items-center justify-center gap-4 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 30 }}
        className="w-16 h-16 bg-green-500 ring-4 ring-green-100 dark:ring-green-900 text-white flex items-center justify-center rounded-full"
      >
        <CheckIcon size={32} strokeWidth={3} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-green-600 dark:text-green-400 font-semibold text-lg"
      >
        OTP Verified!
      </motion.p>
    </div>
  )
}

const OTPError = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="text-center text-red-500 dark:text-red-400 font-medium mt-2 absolute -bottom-8 w-full"
    >
      Invalid OTP. Please try again.
    </motion.div>
  )
}

interface OTPInputBoxProps {
  key?: React.Key;
  index: number;
  verifyOTP: () => any;
  state: string;
}

const OTPInputBox = ({ index, verifyOTP, state }: OTPInputBoxProps) => {
  const animationControls = useAnimationControls()
  const springTransition = {
    type: "spring" as any,
    stiffness: 700,
    damping: 20,
    delay: index * 0.05,
  }
  const noDelaySpringTransition = {
    type: "spring" as any,
    stiffness: 700,
    damping: 20,
  }
  const slowSuccessTransition = {
    type: "spring" as any,
    stiffness: 300,
    damping: 30,
    delay: index * 0.06,
  }

  useEffect(() => {
    animationControls.start({
      opacity: 1,
      y: 0,
      transition: springTransition,
    })
    return () => animationControls.stop()
  }, [])

  useEffect(() => {
    if (state === "success") {
      const transitionX = index * 68 // Adjusted for 4 inputs with gap
      animationControls.start({
        x: -transitionX,
        transition: slowSuccessTransition,
      })
    }
  }, [state, index, animationControls])

  const onFocus = () => {
    animationControls.start({ y: -5, transition: noDelaySpringTransition })
  }

  const onBlur = () => {
    animationControls.start({ y: 0, transition: noDelaySpringTransition })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const { value } = target;
    if (e.key === "Backspace" && !value && index > 0) {
      const prevInput = document.getElementById(`input-${index - 1}`) as HTMLInputElement | null;
      prevInput?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.getElementById(`input-${index - 1}`) as HTMLInputElement | null;
      prevInput?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      const nextInput = document.getElementById(`input-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  }

  const onInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const { value } = target;
    if (value.match(/^[0-9]$/)) {
      target.value = value
      if (index < 3) {
        const nextInput = document.getElementById(`input-${index + 1}`) as HTMLInputElement | null;
        nextInput?.focus();
      }
    } else {
      target.value = ""
    }
    verifyOTP()
  }

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 4)
    const digits = pastedData.split("").filter((char) => /^[0-9]$/.test(char))

    digits.forEach((digit, i) => {
      const targetIndex = index + i
      if (targetIndex < 4) {
        const input = document.getElementById(`input-${targetIndex}`) as HTMLInputElement | null;
        if (input) {
          input.value = digit
        }
      }
    })

    const nextFocusIndex = Math.min(index + digits.length, 3)
    const nextInput = document.getElementById(`input-${nextFocusIndex}`) as HTMLInputElement | null;
    nextInput?.focus();

    setTimeout(verifyOTP, 0)
  }

  return (
    <motion.div
      className={`w-14 h-16 rounded-lg ring-2 ring-transparent focus-within:shadow-inner overflow-hidden transition-all duration-300 ${
        state === "error"
          ? "ring-red-400 dark:ring-red-500"
          : state === "success"
            ? "ring-green-500"
            : "focus-within:ring-gray-400 dark:focus-within:ring-gray-500 ring-gray-200 dark:ring-gray-700"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={animationControls}
    >
      <input
        id={`input-${index}`}
        type="text"
        inputMode="numeric"
        maxLength={1}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full h-full text-center text-3xl font-semibold outline-none caret-amber-500 dark:caret-amber-400 bg-[#FAF9F6] text-[#12100E] dark:bg-stone-900 dark:text-white"
        disabled={state === "success"}
      />
    </motion.div>
  )
}

// --- Main Verification Component ---

interface OTPVerificationProps {
  emailOrPhone?: string;
  expectedCode?: string | null;
  onVerifySuccess?: (enteredCode: string) => void;
  onResendCode?: () => void;
  onBackToEntry?: () => void;
}

export function OTPVerification({
  emailOrPhone = "yourname@example.com",
  expectedCode = "1234",
  onVerifySuccess,
  onResendCode,
  onBackToEntry
}: OTPVerificationProps) {
  const [state, setState] = useState("idle")
  const [countdown, setCountdown] = useState(60)
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const animationControls = useAnimationControls()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isResendDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer)
            setIsResendDisabled(false)
            return 0
          }
          return prevCountdown - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isResendDisabled])

  const getCode = () => {
    let code = ""
    for (let i = 0; i < 4; i++) {
      const input = document.getElementById(`input-${i}`) as HTMLInputElement | null;
      if (input) code += input.value
    }
    return code
  }

  const verifyOTP = () => {
    const code = getCode()
    if (code.length < 4) {
      setState("idle")
      return null
    }

    console.log("Verifying code:", code)
    
    // Check against expectedCode if supplied, otherwise fallback to "1234"
    const targetCode = expectedCode || "1234"
    if (code === targetCode) {
      setState("success")
      if (onVerifySuccess) {
        // Delay callback slightly to allow animations to run fluidly
        setTimeout(() => {
          onVerifySuccess(code)
        }, 1200)
      }
      return true
    } else {
      errorAnimation()
      return false
    }
  }

  const errorAnimation = async () => {
    setState("error")
    await animationControls.start({
      x: [0, 5, -5, 5, -5, 0],
      transition: { duration: 0.3 },
    })
    setTimeout(() => {
      if (getCode().length < 4) setState("idle")
    }, 500)
  }

  const handleResend = () => {
    console.log("Resending code...")
    setCountdown(60)
    setIsResendDisabled(true)
    if (onResendCode) {
      onResendCode()
    }
  }

  return (
    <div
      className="rounded-3xl p-8 w-full max-w-sm shadow-xl relative overflow-hidden mx-auto border border-white/5 bg-stone-950/80 backdrop-blur-md"
      style={{
        backgroundImage: "radial-gradient(circle at top right, rgba(180, 148, 43, 0.15), transparent)",
      }}
    >
      <div className="relative z-10">
        {/* Brand Logo Header */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-stone-950 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-[#FAF6F0] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2.5 h-2.5 bg-stone-900 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>

        {/* Dynamic Header Titles */}
        <h1 className="text-xl font-serif font-black text-center text-white mb-2 tracking-tight">
          {state === "success" ? "Verification Successful!" : "Enter Verification Code"}
        </h1>

        <AnimatePresence mode="wait">
          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
              style={{ height: "232px" }}
            >
              <OTPSuccess />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Send Details Info */}
              <p className="text-center text-xs text-stone-300 mt-2 mb-8 leading-relaxed font-sans">
                We've simulated a 4-digit secret code to
                <br /> <span className="font-mono font-bold text-amber-400 tracking-wide text-sm">{emailOrPhone}</span>
              </p>

              {/* OTP Number Fields Grid */}
              <div className="flex flex-col items-center justify-center gap-2 mb-10 relative h-20">
                <motion.div animate={animationControls} className="flex items-center justify-center gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <OTPInputBox key={`input-${index}`} index={index} verifyOTP={verifyOTP} state={state} />
                  ))}
                </motion.div>
                <AnimatePresence>{state === "error" && <OTPError />}</AnimatePresence>
              </div>

              {/* Bottom Controllers with Action Triggers */}
              <div className="space-y-4 text-center">
                <div className="text-xs">
                  <span className="text-stone-400">Didn't get a code? </span>
                  {isResendDisabled ? (
                    <span className="text-amber-400 font-mono font-medium">Resend in {countdown}s</span>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="font-bold text-amber-400 hover:underline hover:text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1 cursor-pointer transition-colors"
                    >
                      Click to resend
                    </button>
                  )}
                </div>

                {onBackToEntry && (
                  <button
                    type="button"
                    onClick={onBackToEntry}
                    className="text-[11px] font-mono font-medium text-stone-400 hover:text-white hover:underline cursor-pointer transition-colors block mx-auto"
                  >
                    ← Back to Phone entry
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
