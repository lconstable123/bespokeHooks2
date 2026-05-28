import { useEffect, useState } from "react";
// import { bgLookup } from "../data";

const DEFAULT_CYCLE_INTERVAL_MS = 4000;
const REGION_DEBOUNCE_MS = 50;

export function useBackgroundImage(
  region: number | null,
  cycleIntervalMs: number = DEFAULT_CYCLE_INTERVAL_MS,
) {
  const entries = Object.entries(bgLookup) as [string, string][];
  const cycleKeys = entries
    .map(([k]) => Number(k))
    .filter((n) => n >= 0)
    .sort((a, b) => a - b);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [debouncedRegion, setDebouncedRegion] = useState<number | null>(region);

  // Preload all background images once on mount so first selection is instant.
  useEffect(() => {
    const preloaded: HTMLImageElement[] = [];
    entries.forEach(([, src]) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
      preloaded.push(img);
    });
    return () => {
      // Drop refs so GC can reclaim if component ever unmounts.
      preloaded.length = 0;
    };
    // entries derived from a constant module import — only run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When no region is selected, auto-cycle through backgrounds.
  useEffect(() => {
    if (region !== null) return;
    if (cycleKeys.length === 0) return;
    const interval = setInterval(() => {
      setCycleIndex((i) => (i + 1) % cycleKeys.length);
    }, cycleIntervalMs);
    return () => clearInterval(interval);
  }, [region, cycleKeys.length, cycleIntervalMs]);

  // Effective region: explicit selection takes priority; otherwise the cycler.
  const effectiveRegion =
    region !== null ? region : cycleKeys[cycleIndex] ?? null;

  // Debounce region changes so rapid taps don't trigger a queue of background swaps.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedRegion(effectiveRegion);
    }, REGION_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [effectiveRegion]);

  const currentSrc = null;
  // debouncedRegion !== null ? bgLookup[debouncedRegion] : null;

  return { currentSrc, debouncedRegion };
}
