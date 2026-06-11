"use client";

import Image from "next/image";
import type { Story } from "@/types/story";
import { timeAgo } from "@/lib/time";

interface StoryThumbnailProps {
  story: Story;
  onOpen: () => void;
}

/**
 * Circular story avatar. Unseen stories get a lavender gradient ring;
 * once seen the ring collapses to a flat hairline. A short "time ago"
 * label sits underneath.
 */
export default function StoryThumbnail({ story, onOpen }: StoryThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5 outline-none"
      aria-label={`Open story from ${timeAgo(story.createdAt)} ago`}
    >
      <span
        className={
          "rounded-full p-[2px] transition-transform group-active:scale-95 " +
          (story.seen
            ? "bg-hairline-strong"
            : "bg-gradient-to-tr from-primary to-primary-hover")
        }
      >
        <span className="block rounded-full bg-canvas p-[2px]">
          <span className="relative block h-14 w-14 overflow-hidden rounded-full">
            <Image
              src={story.image}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
              unoptimized
            />
          </span>
        </span>
      </span>
      <span className="text-[12px] leading-tight text-ink-subtle">
        {timeAgo(story.createdAt)}
      </span>
    </button>
  );
}
