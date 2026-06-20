import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm shadow-black/5 transition-shadow placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100",
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
  },
);
Input.displayName = "Input";

export { Input };
