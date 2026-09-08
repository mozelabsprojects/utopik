"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  format?: "currency" | "number" | "percentage" | "compact";
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedNumber({ value, format = "number", prefix = "", suffix = "", className = "" }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      }
    });
    return () => controls.stop();
  }, [value]);

  let formatted = displayValue.toLocaleString();
  
  if (format === "currency") {
    formatted = `$${displayValue.toLocaleString()}`;
  } else if (format === "percentage") {
    formatted = `${displayValue}%`;
  } else if (format === "compact") {
    formatted = Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(displayValue);
  }

  if (format !== "currency" && prefix) {
    formatted = prefix + formatted;
  }

  return (
    <span className={className}>
      {formatted}{suffix}
    </span>
  );
}
