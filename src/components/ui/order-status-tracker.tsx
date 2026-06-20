import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

// Define TypeScript types for the component props for type safety and reusability
export interface OrderItemProps {
  imageUrl: string;
  name: string;
  details: string;
  price?: number;
}

export interface OrderSummaryItemProps {
  label: string;
  value: string;
}

export interface OrderStatusProps {
  illustrationUrl: string;
  statusTitle: string;
  statusDescription: string;
  item: OrderItemProps;
  summary: OrderSummaryItemProps[];
  trackingStatus: string;
  onTrackOrder?: () => void;
  className?: string;
}

// Reusable Card component for consistent styling
const InfoCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-stone-200/60 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 p-5 shadow-sm text-stone-900 dark:text-stone-100",
        className
      )}
      {...props}
    />
  )
);
InfoCard.displayName = "InfoCard";

export const OrderStatus: React.FC<OrderStatusProps> = ({
  illustrationUrl,
  statusTitle,
  statusDescription,
  item,
  summary,
  trackingStatus,
  onTrackOrder,
  className,
}) => {
  // Animation variants for motion/react
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className={cn("max-w-md w-full mx-auto p-2 font-sans text-left", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header section with illustration and status */}
      <motion.div variants={itemVariants} className="text-center space-y-3 mb-6">
        <div className="relative inline-block">
          <div className="absolute inset-x-0 bottom-1 h-3 bg-amber-500/10 blur-md rounded-full" />
          <img
            src={illustrationUrl}
            alt="Order Status Illustration"
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto object-contain relative z-10"
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-serif font-black text-stone-900 dark:text-stone-100">
            {statusTitle}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            {statusDescription}
          </p>
        </div>
      </motion.div>

      {/* Ordered item details card */}
      <motion.div variants={itemVariants} className="mb-5">
        <InfoCard>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-stone-800 object-cover border border-stone-100 dark:border-stone-800"
              />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[9px] font-bold text-stone-950 font-mono">
                ✓
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm truncate">
                {item.name}
              </p>
              <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                {item.details}
              </p>
            </div>
            <p className="font-extrabold text-[#B4942B] text-sm sm:text-base font-mono">
              ₹{typeof item?.price === "number" ? item.price.toFixed(2) : (Number(item?.price || 0)).toFixed(2)}
            </p>
          </div>
        </InfoCard>
      </motion.div>
      
      {/* Order summary card */}
      <motion.div variants={itemVariants} className="mb-6">
        <InfoCard className="space-y-3.5">
          <h2 className="font-serif font-extrabold text-xs sm:text-sm text-stone-900 dark:text-stone-100 border-b border-stone-100 dark:border-stone-800/80 pb-2">
            Order Information
          </h2>
          <div className="space-y-2.5">
            {summary.map((line, index) => (
              <div key={index} className="flex justify-between items-start text-xs">
                <p className="text-stone-500 dark:text-stone-400 font-medium">{line.label}</p>
                <p className="text-stone-950 dark:text-stone-100 font-semibold font-mono text-right max-w-[200px] break-words">
                  {line.value}
                </p>
              </div>
            ))}
          </div>
        </InfoCard>
      </motion.div>

      {/* Action button and final status text */}
      <motion.div variants={itemVariants} className="text-center space-y-3 bg-stone-50/50 dark:bg-stone-900/30 p-4 rounded-2xl border border-stone-100 dark:border-stone-800/50">
        <Button 
          onClick={onTrackOrder} 
          className="w-full h-10 rounded-xl bg-stone-900 hover:bg-stone-850 dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-950 text-white text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-98 transition-all"
        >
          Track Step-by-Step Delivery
        </Button>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-500 font-bold font-mono tracking-wide leading-relaxed">
          ● {trackingStatus}
        </p>
      </motion.div>
    </motion.div>
  );
};

OrderStatus.displayName = "OrderStatus";
