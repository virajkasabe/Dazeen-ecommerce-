import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (val: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function Select({
  value,
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
  size,
  ...props
}: React.ComponentProps<"button"> & { size?: "sm" | "md" | "lg" }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used inside Select");
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:bg-stone-950 dark:ring-offset-stone-950 dark:focus:ring-stone-300",
        className
      )}
      onClick={() => context.setOpen(!context.open)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used inside Select");
  return <span>{context.value || placeholder}</span>;
}

export function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used inside Select");
  if (!context.open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 pointer-events-auto" onClick={() => context.setOpen(false)} />
      <div
        className={cn(
          "absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-stone-200 bg-white p-1 text-stone-950 shadow-md focus:outline-none dark:border-stone-850 dark:bg-stone-900 dark:text-stone-50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export function SelectItem({
  value,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used inside Select");

  const isSelected = context.value === value;

  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-stone-100 focus:bg-stone-100 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-stone-800 dark:focus:bg-stone-800",
        className
      )}
      onClick={() => {
        context.onValueChange?.(value);
        context.setOpen(false);
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span>{children}</span>
    </div>
  );
}
