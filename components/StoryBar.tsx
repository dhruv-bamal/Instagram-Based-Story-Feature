"use client";

import { useState } from "react";
import { useStories } from "@/hooks/useStories";
import AddStoryButton from "./AddStoryButton";
import StoryThumbnail from "./StoryThumbnail";
import StoryViewer from "./StoryViewer";

export default function StoryBar() {
  const { stories, ready, addStory, deleteStory, markSeen } = useStories();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const list = stories ?? [];

  return (
    <section className="w-full">
      {/* Story strip — a surface-1 panel lifted off the canvas */}
      <div className="border-b border-hairline bg-surface-1 edge-highlight">
        <div className="mx-auto max-w-[640px] px-4 py-4">
          <div className="no-scrollbar flex items-start gap-4 overflow-x-auto">
            <AddStoryButton onAdd={addStory} />
            {list.map((story, i) => (
              <StoryThumbnail
                key={story.id}
                story={story}
                onOpen={() => setViewerIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {ready && list.length === 0 && (
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-2 px-4 py-24 text-center">
          <p className="text-[16px] text-ink-subtle">No stories yet</p>
          <p className="max-w-[280px] text-[14px] text-ink-tertiary">
            Tap the + button to add a photo. Stories disappear automatically
            after 24 hours.
          </p>
        </div>
      )}

      {viewerIndex !== null && list[viewerIndex] && (
        <StoryViewer
          stories={list}
          startIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onDelete={deleteStory}
          onSeen={markSeen}
        />
      )}
    </section>
  );
}
