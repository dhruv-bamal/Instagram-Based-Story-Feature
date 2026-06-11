import { STORY_TTL_MS } from "@/types/story";

/**
 * Short "time since upload" label, e.g. "now", "5m", "3h".
 * Capped at hours since stories never exceed 24h.
 */
export function timeAgo(createdAt: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - createdAt);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

/**
 * "Time left" until the story expires, e.g. "23h left", "12m left".
 * Returns "expiring" when under a minute remains.
 */
export function timeLeft(expiresAt: number, now: number = Date.now()): string {
  const diff = expiresAt - now;
  if (diff <= 0) return "expired";
  const minutes = Math.ceil(diff / 60_000);
  if (minutes < 1) return "expiring";
  if (minutes < 60) return `${minutes}m left`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h left`;
}

/** Fraction (0–1) of the story's lifetime that has elapsed. */
export function lifetimeProgress(
  createdAt: number,
  expiresAt: number,
  now: number = Date.now(),
): number {
  const total = expiresAt - createdAt || STORY_TTL_MS;
  return Math.min(1, Math.max(0, (now - createdAt) / total));
}
