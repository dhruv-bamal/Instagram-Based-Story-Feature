"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STORY_TTL_MS, type Story } from "@/types/story";
import { loadStories, saveStories } from "@/lib/storage";
import { processImageFile } from "@/lib/image";

/** How often to sweep expired stories so they vanish without a reload. */
const SWEEP_INTERVAL_MS = 30_000;

function dropExpired(stories: Story[], now: number): Story[] {
  return stories.filter((s) => s.expiresAt > now);
}

export interface UseStories {
  /** Active (non-expired) stories, newest first. `null` until hydrated. */
  stories: Story[] | null;
  ready: boolean;
  addStory: (file: File) => Promise<void>;
  deleteStory: (id: string) => void;
  markSeen: (id: string) => void;
}

export function useStories(): UseStories {
  const [stories, setStories] = useState<Story[] | null>(null);
  // Mirror of state for use inside callbacks/intervals without stale closures.
  const ref = useRef<Story[]>([]);

  const commit = useCallback((next: Story[]) => {
    ref.current = next;
    setStories(next);
    saveStories(next);
  }, []);

  // Hydrate from localStorage on mount, immediately pruning expired entries.
  useEffect(() => {
    const cleaned = dropExpired(loadStories(), Date.now());
    commit(cleaned);

    const interval = window.setInterval(() => {
      const swept = dropExpired(ref.current, Date.now());
      if (swept.length !== ref.current.length) {
        commit(swept);
      }
    }, SWEEP_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [commit]);

  const addStory = useCallback(
    async (file: File) => {
      const image = await processImageFile(file);
      const createdAt = Date.now();
      const story: Story = {
        id: crypto.randomUUID(),
        image,
        createdAt,
        expiresAt: createdAt + STORY_TTL_MS,
        seen: false,
      };
      // Newest first. saveStories may throw StorageQuotaError; let it bubble.
      commit([story, ...ref.current]);
    },
    [commit],
  );

  const deleteStory = useCallback(
    (id: string) => {
      commit(ref.current.filter((s) => s.id !== id));
    },
    [commit],
  );

  const markSeen = useCallback(
    (id: string) => {
      const target = ref.current.find((s) => s.id === id);
      if (!target || target.seen) return;
      commit(ref.current.map((s) => (s.id === id ? { ...s, seen: true } : s)));
    },
    [commit],
  );

  return { stories, ready: stories !== null, addStory, deleteStory, markSeen };
}
