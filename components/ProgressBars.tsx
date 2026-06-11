"use client";

interface ProgressBarsProps {
  count: number;
  activeIndex: number;
  /** Fill fraction (0–1) of the currently active segment. */
  progress: number;
}

/**
 * Instagram-style segmented progress indicator at the top of the viewer.
 * Segments before the active one are full; after are empty.
 */
export default function ProgressBars({
  count,
  activeIndex,
  progress,
}: ProgressBarsProps) {
  return (
    <div className="flex w-full gap-1">
      {Array.from({ length: count }).map((_, i) => {
        const fill =
          i < activeIndex ? 1 : i === activeIndex ? progress : 0;
        return (
          <div
            key={i}
            className="h-0.5 flex-1 overflow-hidden rounded-full bg-ink/30"
          >
            <div
              className="h-full rounded-full bg-ink"
              style={{
                transform: `scaleX(${fill})`,
                transformOrigin: "left",
                // No CSS transition: progress is driven per-frame for smoothness.
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
