import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  leftIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "default";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, size, ...props }, ref) => {
    const inputEl = (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm shadow-black/5 transition-shadow placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100",
          size === "lg" ? "h-11 text-base px-4" : size === "sm" ? "h-8 text-xs px-2" : "h-9",
          leftIcon && "pl-10",
          type === "search" &&
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
          type === "file" &&
            "p-0 pr-3 italic text-stone-500 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-stone-200 file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-stone-905",
          className,
        )}
        ref={ref}
        {...props}
      />
    );

    if (leftIcon) {
      return (
        <div className="relative flex items-center w-full">
          <div className="absolute left-3 text-stone-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
          {inputEl}
        </div>
      );
    }

    return inputEl;
  },
);
Input.displayName = "Input";

export { Input };
