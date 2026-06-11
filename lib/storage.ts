import { STORAGE_KEY, type Story } from "@/types/story";

/**
 * SSR-safe localStorage access for the stories array.
 * All reads/writes are guarded so the module is import-safe on the server
 * (Next.js renders the component tree on the server first).
 */

const hasWindow = () => typeof window !== "undefined";

export function loadStories(): Story[] {
  if (!hasWindow()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Defensive filter: only keep well-formed records.
    return parsed.filter(
      (s): s is Story =>
        s &&
        typeof s.id === "string" &&
        typeof s.image === "string" &&
        typeof s.createdAt === "number" &&
        typeof s.expiresAt === "number" &&
        typeof s.seen === "boolean",
    );
  } catch {
    return [];
  }
}

export class StorageQuotaError extends Error {
  constructor() {
    super("Storage is full — delete a story and try again.");
    this.name = "StorageQuotaError";
  }
}

export function saveStories(stories: Story[]): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch (err) {
    // QuotaExceededError name varies across browsers.
    if (
      err instanceof DOMException &&
      (err.name === "QuotaExceededError" ||
        err.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      throw new StorageQuotaError();
    }
    throw err;
  }
}
