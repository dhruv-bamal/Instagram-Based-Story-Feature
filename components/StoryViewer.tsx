"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Story } from "@/types/story";
import { timeAgo, timeLeft } from "@/lib/time";
import ProgressBars from "./ProgressBars";

interface StoryViewerProps {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSeen: (id: string) => void;
}

/** Auto-advance duration per story. */
const STORY_DURATION_MS = 5000;
/** Pointer thresholds for distinguishing tap / hold / swipe. */
const TAP_MAX_MS = 250;
const SWIPE_MIN_PX = 50;

export default function StoryViewer({
  stories,
  startIndex,
  onClose,
  onDelete,
  onSeen,
}: StoryViewerProps) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  // Two independent pause sources: an explicit toggle, and press-and-hold.
  const [manualPaused, setManualPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const paused = manualPaused || held;

  // rAF / timing refs.
  const elapsedRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Pointer-gesture refs.
  const downXRef = useRef(0);
  const downTimeRef = useRef(0);

  pausedRef.current = paused;

  const current = stories[index];

  const goTo = useCallback((next: number) => {
    elapsedRef.current = 0;
    lastTsRef.current = null;
    setProgress(0);
    setIndex(next);
  }, []);

  const goNext = useCallback(() => {
    if (index >= stories.length - 1) {
      onClose();
    } else {
      goTo(index + 1);
    }
  }, [index, stories.length, onClose, goTo]);

  const goPrev = useCallback(() => {
    if (index > 0) goTo(index - 1);
    else {
      // Restart the first story from the beginning.
      elapsedRef.current = 0;
      lastTsRef.current = null;
      setProgress(0);
    }
  }, [index, goTo]);

  // Clamp / close if the list shrinks (e.g. after delete) out from under us.
  useEffect(() => {
    if (stories.length === 0) {
      onClose();
    } else if (index > stories.length - 1) {
      goTo(stories.length - 1);
    }
  }, [stories.length, index, onClose, goTo]);

  // Mark the active story as seen.
  useEffect(() => {
    if (current) onSeen(current.id);
  }, [current, onSeen]);

  // Drive the progress bar + auto-advance with requestAnimationFrame.
  useEffect(() => {
    const tick = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const delta = ts - lastTsRef.current;
      lastTsRef.current = ts;

      if (!pausedRef.current) {
        elapsedRef.current += delta;
        const p = elapsedRef.current / STORY_DURATION_MS;
        if (p >= 1) {
          setProgress(1);
          goNext();
          return; // effect re-runs on index change
        }
        setProgress(p);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [index, goNext]);

  // Keyboard controls + body scroll lock.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === " ") {
        e.preventDefault();
        setManualPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, goNext, goPrev]);

  const handlePointerDown = (e: React.PointerEvent) => {
    downXRef.current = e.clientX;
    downTimeRef.current = performance.now();
    setHeld(true); // press-and-hold pauses
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const dx = e.clientX - downXRef.current;
    const dt = performance.now() - downTimeRef.current;
    setHeld(false);

    if (Math.abs(dx) > SWIPE_MIN_PX) {
      if (dx < 0) goNext();
      else goPrev();
      return;
    }
    if (dt < TAP_MAX_MS) {
      // Tap: left third = previous, otherwise next.
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      if (ratio < 0.33) goPrev();
      else goNext();
    }
    // Otherwise it was a hold — just resume (handled by setHeld(false)).
  };

  const handleDelete = () => {
    if (current) onDelete(current.id);
  };

  if (!current) return null;

  const iconBtn =
    "pointer-events-auto flex items-center justify-center rounded-md text-ink/90 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Gesture surface (tap / swipe / hold) — sits behind the controls. */}
      <div
        className="absolute inset-0 touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setHeld(false)}
      />

      {/* Story image */}
      <div className="relative mx-auto flex h-[100dvh] w-full max-w-[440px] items-center justify-center">
        <Image
          src={current.image}
          alt=""
          fill
          sizes="440px"
          className="pointer-events-none object-contain"
          priority
          unoptimized
        />
      </div>

      {/* Previous / Next navigation arrows */}
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous story"
        className={`${iconBtn} absolute left-2 top-1/2 z-10 h-11 w-11 -translate-y-1/2 bg-black/30 sm:left-4`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Next story"
        className={`${iconBtn} absolute right-2 top-1/2 z-10 h-11 w-11 -translate-y-1/2 bg-black/30 sm:right-4`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Top chrome: progress bars + meta + controls */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto w-full max-w-[440px] p-3">
        <ProgressBars
          count={stories.length}
          activeIndex={index}
          progress={progress}
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] text-ink-muted drop-shadow">
            {timeAgo(current.createdAt)} ago · {timeLeft(current.expiresAt)}
          </span>
          <div className="flex items-center gap-1">
            {/* Pause / resume */}
            <button
              type="button"
              onClick={() => setManualPaused((p) => !p)}
              aria-label={manualPaused ? "Resume story" : "Pause story"}
              aria-pressed={manualPaused}
              className={`${iconBtn} h-9 w-9`}
            >
              {manualPaused ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
                </svg>
              )}
            </button>
            {/* Delete */}
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete story"
              className={`${iconBtn} h-9 w-9`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
              </svg>
            </button>
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`${iconBtn} h-9 w-9`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
