"use client";

import { useEffect } from "react";
import { getTimeOfDay, timeThemeScript } from "@/lib/timeTheme";

export function TimeTheme() {
  useEffect(() => {
    const updateTheme = () => {
      document.documentElement.setAttribute(
        "data-time",
        getTimeOfDay(new Date().getHours()),
      );
    };
    const updateWhenVisible = () => {
      if (!document.hidden) updateTheme();
    };

    updateTheme();
    const interval = window.setInterval(updateTheme, 60_000);
    document.addEventListener("visibilitychange", updateWhenVisible);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", updateWhenVisible);
    };
  }, []);

  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: timeThemeScript }}
    />
  );
}
