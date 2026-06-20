"use client";

import React, {
  ComponentPropsWithoutRef,
  Dispatch,
  ReactNode,
  SetStateAction,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";

type SelectOptionProps = {
  value: string;
  children: string;
  setValue?: Dispatch<SetStateAction<string>>;
  handleSelection?: (text: string) => void;
  closeDropdown?: () => void;
};

export function Select({
  children,
  className,
  placeholder,
  value,
  setValue,
  ...props
}: {
  children: ReactNode;
  placeholder: string;
  className?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
} & Omit<ComponentPropsWithoutRef<"button">, "value">) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const selectRef = useRef<HTMLDivElement>(null);

  const childrenArray = React.Children.toArray(children);

  // Synchronize state with incoming parent value
  useEffect(() => {
    const matchedIndex = childrenArray.findIndex((child) => {
      if (isValidElement<SelectOptionProps>(child)) {
        return child.props.value === value;
      }
      return false;
    });

    if (matchedIndex >= 0) {
      const child = childrenArray[matchedIndex];
      if (isValidElement<SelectOptionProps>(child)) {
        setDisplayText(child.props.children);
        setSelectedIndex(matchedIndex);
      }
    } else {
      setDisplayText("");
      setSelectedIndex(-1);
    }
  }, [value, childrenArray]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeDropdown = () => setIsOpened(false);

  // Handler for selection that updates both text and index
  const handleSelection = (text: string, index: number) => {
    setDisplayText(text);
    setSelectedIndex(index);
  };

  const childrenWithProps = childrenArray.map((child, index) => {
    if (isValidElement<SelectOptionProps>(child)) {
      return cloneElement(child, {
        setValue,
        handleSelection: (text: string) => handleSelection(text, index),
        closeDropdown,
        key: child.props.value || index,
      });
    }
    return child;
  });

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpened(!isOpened)}
        className={cn(
          "h-[2.8rem] flex items-center gap-2 rounded-xl py-3 px-4 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 outline-none hover:bg-stone-50 dark:hover:bg-stone-850 transition ease-in-out duration-200 cursor-pointer min-w-[14rem] justify-between ring-0 focus:ring-2 ring-amber-500/20 focus:border-amber-500 overflow-hidden",
          className
        )}
        {...props}
      >
        <div className="relative overflow-hidden flex-1 h-full flex items-center">
          <div
            className={cn(
              "absolute left-0 right-0 flex items-center justify-start transition-opacity duration-200 text-stone-500 font-medium",
              displayText ? "opacity-0" : "opacity-100"
            )}
          >
            {placeholder}
          </div>

          <div
            className="absolute left-0 right-0 h-full flex flex-col justify-start transition-all duration-300 ease-in-out"
            style={{
              transform: selectedIndex >= 0 
                ? `translateY(calc(${selectedIndex * -100}%))` 
                : "translateY(100%)",
              opacity: selectedIndex >= 0 ? 1 : 0,
            }}
          >
            {childrenArray.map((child, index) => {
              if (isValidElement<SelectOptionProps>(child)) {
                return (
                  <div
                    key={index}
                    className={cn(
                      "h-full flex items-center justify-start font-medium text-stone-800 dark:text-stone-100",
                      selectedIndex === index && "text-amber-600 dark:text-amber-500"
                    )}
                  >
                    {child.props.children}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        <CaretDown
          className={cn(
            "w-4 h-4 text-stone-500 transition-transform duration-200",
            isOpened && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-1.5 left-0 right-0 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 rounded-xl p-1 bg-white dark:bg-stone-900 shadow-xl z-50 max-h-60 overflow-y-auto"
          >
            {childrenWithProps}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SelectOption({
  children,
  value,
  setValue,
  handleSelection,
  closeDropdown,
}: SelectOptionProps) {
  return (
    <div
      className="hover:bg-amber-50 dark:hover:bg-stone-800/80 hover:text-amber-600 p-2.5 px-4 rounded-lg cursor-pointer transition ease-in-out duration-150 font-medium text-stone-700 dark:text-stone-200 text-sm"
      onClick={() => {
        setValue?.(value);
        if (handleSelection) {
          handleSelection(children);
        }
        closeDropdown?.();
      }}
    >
      {children}
    </div>
  );
}
