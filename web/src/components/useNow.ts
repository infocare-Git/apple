"use client";

import { useEffect, useState } from "react";

/** Current time, refreshed every `ms` so time-based demo statuses move on screen. */
export function useNow(ms = 30000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const h = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(h);
  }, [ms]);
  return now;
}
