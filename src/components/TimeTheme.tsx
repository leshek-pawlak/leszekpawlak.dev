"use client";

import { useEffect } from "react";

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 18) return "day";
  if (h >= 18 && h < 22) return "evening";
  return "night";
}

export function TimeTheme() {
  useEffect(() => {
    const time = getTimeOfDay();
    document.documentElement.setAttribute("data-time", time);
  });

  return null;
}
