import * as React from "react";
import { cn } from "../../lib/utils";

interface WoodenCartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  className?: string;
}

export const WoodenCartButton = React.forwardRef<HTMLButtonElement, WoodenCartButtonProps>(
  ({ label = "Add to cart", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center px-5 py-2 border-none bg-gradient-to-b from-[#f5deb3] to-[#deb887] rounded-full shadow-[inset_0_3px_6px_rgba(255,255,255,0.5),inset_0_-3px_6px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.3)] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] transform perspective-[500px] rotate-x-[5deg] before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(45deg,rgba(139,90,43,0.1)_25%,transparent_25%,transparent_75%,rgba(139,90,43,0.1)_75%)] before:bg-[length:10px_10px] before:opacity-50 before:rounded-full before:transition-all before:duration-400 before:ease-in before:-translate-z-1 hover:transform hover:perspective-[500px] hover:rotate-x-[0deg] hover:-translate-y-[2px] hover:shadow-[inset_0_4px_8px_rgba(255,255,255,0.6),inset_0_-4px_8px_rgba(0,0,0,0.25),0_6px_14px_rgba(0,0,0,0.35)] hover:bg-gradient-to-b hover:from-[#f5e0c0] hover:to-[#e0c49c] active:transform active:perspective-[500px] active:rotate-x-[2deg] active:translate-y-1 active:shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.15),0_1px_5px_rgba(0,0,0,0.2)] active:bg-gradient-to-b active:from-[#e0c49c] active:to-[#c19a6b] select-none group/wood",
          className
        )}
        {...props}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 mr-1.5 fill-[#5c4033] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] transform translate-z-5 group-hover/wood:transform group-hover/wood:translate-z-10 group-hover/wood:scale-110 group-hover/wood:rotate-6 group-hover/wood:drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] group-active/wood:transform group-active/wood:translate-z-2 group-active/wood:scale-95 group-active/wood:-rotate-3"
        >
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.996.996 0 0 0 21.42 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
        <span className="relative z-10 text-[#5c4033] font-sans font-extrabold text-[10px] uppercase tracking-wider transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] transform translate-z-5 group-hover/wood:transform group-hover/wood:translate-z-8 group-hover/wood:translate-x-0.5 group-hover/wood:drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] group-active/wood:transform group-active/wood:translate-z-1 group-active/wood:translate-y-px">
          {label}
        </span>
      </button>
    );
  }
);

WoodenCartButton.displayName = "WoodenCartButton";

export default WoodenCartButton;
