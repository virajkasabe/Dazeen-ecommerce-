import * as React from "react";
import { cn } from "@/src/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-stone-100 dark:bg-stone-800", className)}
      {...props}
    />
  );
}
