"use client"

import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  type JSX,
} from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion"
import { Check, Loader2, SendHorizontal, X } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button, ButtonProps } from "./button"

const DRAG_CONSTRAINTS = { left: 0, right: 155 }
const DRAG_THRESHOLD = 0.9

const BUTTON_STATES = {
  initial: { width: "12rem" },
  completed: { width: "8rem" },
}

const ANIMATION_CONFIG = {
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 40,
    mass: 0.8,
  },
}

type StatusIconProps = {
  status: string
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const iconMap: Record<StatusIconProps["status"], JSX.Element> = useMemo(
    () => ({
      loading: <Loader2 className="animate-spin text-white" size={20} />,
      success: <Check className="text-white" size={20} />,
      error: <X className="text-white" size={20} />,
    }),
    []
  )

  if (!iconMap[status]) return null

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {iconMap[status]}
    </motion.div>
  )
}

const useButtonStatus = (resolveTo: "success" | "error") => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")

  const handleSubmit = useCallback(() => {
    setStatus("loading")
    setTimeout(() => {
      setStatus(resolveTo)
    }, 2000)
  }, [resolveTo])

  return { status, setStatus, handleSubmit }
}

export interface SlideButtonProps extends ButtonProps {
  labelText?: string
  onDragComplete?: () => void
  externalStatus?: "idle" | "loading" | "success" | "error"
  resolveTo?: "success" | "error"
}

const SlideButton = forwardRef<HTMLButtonElement, SlideButtonProps>(
  ({ className, labelText, onDragComplete, externalStatus, resolveTo = "success", ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const [completed, setCompleted] = useState(false)
    const dragHandleRef = useRef<HTMLDivElement | null>(null)
    const { status: localStatus, setStatus: setLocalStatus, handleSubmit } = useButtonStatus((resolveTo || "success") as "success" | "error")

    // Sync external vs local status
    const status = externalStatus !== undefined ? externalStatus : localStatus

    useEffect(() => {
      if (externalStatus === "success" || externalStatus === "error") {
        setCompleted(true)
      } else if (externalStatus === "idle") {
        setCompleted(false)
        dragX.set(0)
      }
    }, [externalStatus])

    const dragX = useMotionValue(0)
    const springX = useSpring(dragX, ANIMATION_CONFIG.spring)
    const dragProgress = useTransform(
      springX,
      [0, DRAG_CONSTRAINTS.right],
      [0, 1]
    )

    const handleDragStart = useCallback(() => {
      if (completed) return
      setIsDragging(true)
    }, [completed])

    const handleDragEnd = () => {
      if (completed) return
      setIsDragging(false)

      const progress = dragProgress.get()
      if (progress >= DRAG_THRESHOLD) {
        setCompleted(true)
        if (onDragComplete) {
          onDragComplete()
        } else {
          handleSubmit()
        }
      } else {
        dragX.set(0)
      }
    }

    const handleDrag = (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      if (completed) return
      const newX = Math.max(0, Math.min(info.offset.x, DRAG_CONSTRAINTS.right))
      dragX.set(newX)
    }

    const adjustedWidth = useTransform(springX, (x) => x + 10)

    return (
      <motion.div
        animate={completed ? BUTTON_STATES.completed : BUTTON_STATES.initial}
        transition={ANIMATION_CONFIG.spring}
        className="shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] relative flex h-11 items-center justify-center rounded-full bg-stone-100"
      >
        {!completed && (
          <motion.div
            style={{
              width: adjustedWidth,
            }}
            className="absolute inset-y-0 left-0 z-0 rounded-full bg-amber-500/10"
          />
        )}
        
        {!completed && (
          <span className="absolute pointer-events-none select-none text-[9px] font-bold text-stone-500 font-mono tracking-widest uppercase">
            {labelText || "SLIDE TO LOGOUT →"}
          </span>
        )}

        <AnimatePresence mode="popLayout">
          {!completed && (
            <motion.div
              ref={dragHandleRef}
              drag="x"
              dragConstraints={DRAG_CONSTRAINTS}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              style={{ x: springX }}
              className="absolute -left-1 z-10 flex cursor-grab items-center justify-start active:cursor-grabbing"
            >
              <Button
                ref={ref}
                disabled={status === "loading"}
                type="button"
                {...props}
                size="icon"
                className={cn(
                  "shadow-md rounded-full bg-stone-900 border border-stone-800 hover:bg-stone-800 text-white w-9 h-9 flex items-center justify-center transition-all",
                  isDragging && "scale-105",
                  className
                )}
              >
                <SendHorizontal className="size-4 text-white" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {completed && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                ref={ref}
                disabled={status === "loading"}
                type="button"
                {...props}
                className={cn(
                  "size-full rounded-full bg-emerald-600 hover:bg-emerald-600 border border-emerald-700 transition-all duration-300",
                  className
                )}
              >
                <AnimatePresence mode="wait">
                  <StatusIcon status={status} />
                </AnimatePresence>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
)

SlideButton.displayName = "SlideButton"

const SlideButtonDemo = () => {
  return (
    <div className="flex justify-center p-4">
      <SlideButton />
    </div>
  )
}

export { SlideButton, SlideButtonDemo }
export default SlideButtonDemo
