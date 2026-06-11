"use client";

import { useRef, useState } from "react";

interface AddStoryButtonProps {
  onAdd: (file: File) => Promise<void>;
}

/**
 * The "+" tile that opens a file picker and hands the chosen image to the
 * parent. Shows a pending state while the image is processed and stored.
 */
export default function AddStoryButton({ onAdd }: AddStoryButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset the input so picking the same file again still fires onChange.
    e.target.value = "";
    if (!file) return;

    setError(null);
    setBusy(true);
    try {
      await onAdd(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex w-[72px] shrink-0 flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label="Add a story"
        className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-primary text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus disabled:opacity-60"
      >
        {busy ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-on-primary/40 border-t-on-primary" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        )}
      </button>
      <span className="text-[12px] leading-tight text-ink-subtle">
        {busy ? "Adding…" : "Add"}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {error && (
        <div
          role="alert"
          className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit max-w-[90vw] rounded-md border border-hairline bg-surface-2 px-4 py-2 text-[14px] text-ink-muted shadow-lg edge-highlight"
          onClick={() => setError(null)}
        >
          {error}
        </div>
      )}
    </div>
  );
}
