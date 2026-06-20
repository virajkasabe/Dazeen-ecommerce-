"use client";

import * as React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "../../lib/utils";

export interface OrderTrackingProps
  extends React.HTMLAttributes<HTMLDivElement> {
  steps: {
    name: string;
    timestamp: string;
    isCompleted: boolean;
    description?: string;
  }[];
}

const OrderTracking = React.forwardRef<HTMLDivElement, OrderTrackingProps>(
  ({ steps = [], className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full max-w-md text-left", className)} {...props}>
        {steps.length > 0 ? (
          <div className="space-y-0">
            {steps.map((step, index) => (
              <div key={index} className="flex min-h-[70px]">
                {/* Vertical Step Nodes and Connector lines */}
                <div className="flex flex-col items-center">
                  {step.isCompleted ? (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-5 h-5 bg-amber-500/20 rounded-full animate-ping pointer-events-none" />
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-amber-500 z-10 bg-white dark:bg-stone-900 rounded-full" />
                    </div>
                  ) : (
                    <Circle className="h-6 w-6 shrink-0 text-stone-300 dark:text-stone-700 bg-white dark:bg-stone-900 z-10" />
                  )}
                  {index < steps.length - 1 && (
                    <div
                      className={cn("w-[2px] grow -my-1", {
                        "bg-gradient-to-b from-amber-500 to-amber-500/30": steps[index].isCompleted && steps[index + 1].isCompleted,
                        "bg-amber-300/30": steps[index].isCompleted && !steps[index + 1].isCompleted,
                        "bg-stone-200 dark:bg-stone-800": !steps[index].isCompleted,
                      })}
                    />
                  )}
                </div>

                {/* Info Text Column */}
                <div className="ml-4 pb-6">
                  <p className={cn(
                    "text-xs font-mono font-bold uppercase tracking-wider leading-none",
                    step.isCompleted ? "text-stone-900 dark:text-stone-100" : "text-stone-400 dark:text-stone-600"
                  )}>
                    {step.name}
                  </p>
                  {step.description && (
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                  <p className={cn(
                    "text-[10px] font-mono mt-1",
                    step.isCompleted ? "text-amber-500/80 font-semibold" : "text-stone-400/60"
                  )}>
                    {step.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            This order has no tracking information.
          </p>
        )}
      </div>
    );
  }
);
OrderTracking.displayName = "OrderTracking";

export { OrderTracking };
